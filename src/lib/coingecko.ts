const API_KEY = import.meta.env.VITE_GECKO_API;
const BASE_URL = "https://api.coingecko.com/api/v3";

const HEADERS = {
    "accept": "application/json",
    "x-cg-demo-api-key": API_KEY || ""
};

// Map symbols to brand colors for the "Neon" aesthetic
const BRAND_COLORS: Record<string, string> = {
    "btc": "#F7931A",
    "eth": "#627EEA",
    "sol": "#14F195",
    "usdt": "#26A17B",
    "xrp": "#23292F", // Dark grey/blue
    "ada": "#0033AD",
    "dot": "#E6007A",
    "matic": "#8247E5",
    "link": "#2A5ADA",
    "doge": "#C2A633",
    "avax": "#E84142",
    "shib": "#FFA409"
};

export const coingecko = {
    // Get Top Coins with Market Data
    getMarkets: async (vs_currency = "usd", per_page = 20, page = 1) => {
        try {
            const response = await fetch(
                `${BASE_URL}/coins/markets?vs_currency=${vs_currency}&order=market_cap_desc&per_page=${per_page}&page=${page}&sparkline=false&price_change_percentage=24h`,
                { headers: HEADERS }
            );
            if (!response.ok) throw new Error("Failed to fetch markets");
            return await response.json();
        } catch (error) {
            console.error("CoinGecko API Error:", error);
            return []; // Return empty on fail (graceful degradation)
        }
    },

    // Get Chart Data
    getMarketChart: async (id: string, days: string) => {
        try {
            const response = await fetch(
                `${BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
                { headers: HEADERS }
            );
            if (!response.ok) throw new Error("Failed to fetch chart");
            const data = await response.json();
            return data.prices.map((item: [number, number]) => ({
                time: new Date(item[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                price: item[1]
            }));
        } catch (error) {
            console.error("CoinGecko Chart Error:", error);
            return [];
        }
    },

    // Helper to get color
    getColor: (symbol: string) => {
        return BRAND_COLORS[symbol.toLowerCase()] || "#FFFFFF"; // Default to white if unknown
    }
};
