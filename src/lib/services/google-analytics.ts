export async function getGAMetrics() {
    const propertyId = process.env.GA_PROPERTY_ID;
    const apiKey = process.env.GA_API_KEY;

    if (!propertyId || !apiKey) {
        throw new Error("GA_PROPERTY_ID o GA_API_KEY no configuradas");
    }

    try {
        const response = await fetch(
            `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
                    metrics: [
                        { name: "activeUsers" },
                        { name: "screenPageViews" },
                        { name: "engagementRate" },
                    ],
                    dimensions: [
                        { name: "date" },
                        { name: "deviceCategory" },
                        { name: "country" },
                    ],
                }),
            }
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("GA Error:", error);
        throw error;
    }
}