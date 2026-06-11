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