import { BetaAnalyticsDataClient } from '@google-analytics/data';

function getAnalyticsClient() {
    const keyBase64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64;
    if (!keyBase64) {
        throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY_BASE64 no configurada");
    }
    const keyJson = Buffer.from(keyBase64, 'base64').toString('utf8');
    const credentials = JSON.parse(keyJson);
    return new BetaAnalyticsDataClient({ credentials });
}

export async function getGAMetrics() {
    const propertyId = process.env.GA_PROPERTY_ID;
    if (!propertyId) {
        throw new Error("GA_PROPERTY_ID no configurada");
    }

    try {
        const client = getAnalyticsClient();
        const [response] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '2024-01-01', endDate: 'today' }],
            metrics: [
                { name: 'activeUsers' },
                { name: 'screenPageViews' },
            ],
            dimensions: [
                { name: 'date' },
                { name: 'deviceCategory' },
                { name: 'operatingSystem' },
            ],
        });

        console.log("✅ GA4 devolvió", response.rows?.length ?? 0, "rows");
        return response;
    } catch (error) {
        console.error("❌ Error en getGAMetrics:", error);
        throw error;
    }
}

export interface GAAggregateStats {
    avgSessionDuration: number; // segundos
    bounceRate: number;         // 0–100
    visitorsWeek: number;
    visitorsToday: number;
    trafficByCountry: { country: string; visitors: number }[];
}

/**
 * Segunda llamada GA4 sin dimensiones → devuelve métricas agregadas exactas.
 * También incluye visitantes últimos 7 días y por país (top 5).
 */
export async function getGAAggregateStats(): Promise<GAAggregateStats> {
    const propertyId = process.env.GA_PROPERTY_ID;
    if (!propertyId) throw new Error("GA_PROPERTY_ID no configurada");

    const client = getAnalyticsClient();

    // ── Llamada 1: métricas globales (30 días) ─────────────────────────────
    const [aggResponse] = await client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        metrics: [
            { name: 'averageSessionDuration' },
            { name: 'bounceRate' },
        ],
    });

    const avgSessionDuration = Math.round(
        parseFloat(aggResponse.rows?.[0]?.metricValues?.[0]?.value ?? '0')
    );
    // GA4 devuelve bounceRate como 0–1 en algunas versiones, 0–100 en otras
    const rawBounce = parseFloat(aggResponse.rows?.[0]?.metricValues?.[1]?.value ?? '0');
    const bounceRate = rawBounce <= 1 ? Math.round(rawBounce * 100) : Math.round(rawBounce);

    // ── Llamada 2: visitantes últimos 7 días y de hoy ──────────────────────
    const [weekResponse] = await client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [
            { startDate: '7daysAgo', endDate: 'today' },
            { startDate: 'today',    endDate: 'today'  },
        ],
        metrics: [{ name: 'activeUsers' }],
    });

    const visitorsWeek = parseInt(
        weekResponse.rows?.[0]?.metricValues?.[0]?.value ?? '0', 10
    );
    const visitorsToday = parseInt(
        weekResponse.rows?.[0]?.metricValues?.[1]?.value ?? '0', 10
    );

    // ── Llamada 3: tráfico por país (top 5) ────────────────────────────────
    const [countryResponse] = await client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        metrics: [{ name: 'activeUsers' }],
        dimensions: [{ name: 'country' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 5,
    });

    const trafficByCountry = (countryResponse.rows ?? []).map(row => ({
        country: row.dimensionValues?.[0]?.value ?? 'Desconocido',
        visitors: parseInt(row.metricValues?.[0]?.value ?? '0', 10),
    }));

    console.log("✅ GA4 aggregate: avgSession=%ds bounce=%d% week=%d today=%d countries=%d",
        avgSessionDuration, bounceRate, visitorsWeek, visitorsToday, trafficByCountry.length);

    return { avgSessionDuration, bounceRate, visitorsWeek, visitorsToday, trafficByCountry };
}

export interface RealtimeVisitor {
    id: string;
    device: "mobile" | "tablet" | "desktop";
    country: string;
    city: string;
    page: string;
    activeUsers: number;
}

/**
 * Visitantes en tiempo real (GA4 Realtime API). Devuelve grupos de usuarios
 * activos por dispositivo/país/ciudad/página. La API realtime NO expone
 * sistema operativo, origen ni duración de sesión, así que la tabla del
 * dashboard solo muestra lo que GA sí da en vivo.
 */
export async function getRealtimeVisitors(): Promise<RealtimeVisitor[]> {
    const propertyId = process.env.GA_PROPERTY_ID;
    if (!propertyId) throw new Error("GA_PROPERTY_ID no configurada");

    const client = getAnalyticsClient();
    const [response] = await client.runRealtimeReport({
        property: `properties/${propertyId}`,
        dimensions: [
            { name: 'deviceCategory' },
            { name: 'country' },
            { name: 'city' },
            { name: 'unifiedScreenName' },
        ],
        metrics: [{ name: 'activeUsers' }],
        limit: 50,
    });

    const rows = response.rows ?? [];
    const visitors = rows.map((row, i) => {
        const dims = row.dimensionValues ?? [];
        const raw = (dims[0]?.value ?? '').toLowerCase();
        const device: RealtimeVisitor["device"] =
            raw === 'mobile' ? 'mobile' : raw === 'tablet' ? 'tablet' : 'desktop';
        return {
            id: `rt-${i}`,
            device,
            country: dims[1]?.value || '—',
            city: dims[2]?.value || '—',
            page: dims[3]?.value || '—',
            activeUsers: parseInt(row.metricValues?.[0]?.value ?? '0', 10),
        };
    });

    console.log("✅ GA4 realtime:", visitors.length, "grupos activos");
    return visitors;
}