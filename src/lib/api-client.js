import axios from 'axios';

// Helper to normalize data (handle Alpha Vantage / Time Series objects)
function normalizeData(data) {
    if (!data || typeof data !== 'object') return data;

    // Check for Alpha Vantage style "Time Series" keys
    const timeSeriesKey = Object.keys(data).find(k => k.includes('Time Series') || k.includes('Adjusted Series'));

    if (timeSeriesKey && data[timeSeriesKey]) {
        // Convert { "2023-01-01": { "open": 100 } } to [ { date: "2023-01-01", open: 100 } ]
        const series = data[timeSeriesKey];
        return Object.entries(series).map(([date, values]) => ({
            date, // Inject key as date/timestamp
            ...values
        }));
    }

    // Generic: if data is just an object of objects where keys are dates?
    // (Optimization for later if needed, strictly targeting Alpha Vantage for now as per request)

    return data;
}

export async function fetchApiData(url) {
    try {
        // Use local proxy to bypass CORS
        // Encoding the URL is important to handle special characters in query params
        const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
        const response = await axios.get(proxyUrl);
        return normalizeData(response.data);
    } catch (error) {
        console.error('API Fetch Error:', error);
        throw error;
    }
}

// Helper to flatten JSON object to specific paths
// Modified to handle Arrays better for the Field Select UI
export function flattenObject(obj, prefix = '') {
    // If it's an array, just flatten the first item to show available structure
    if (Array.isArray(obj)) {
        if (obj.length > 0) {
            return flattenObject(obj[0], prefix);
        }
        return {};
    }

    return Object.keys(obj).reduce((acc, k) => {
        const pre = prefix.length ? prefix + '.' : '';
        if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
            Object.assign(acc, flattenObject(obj[k], pre + k));
        } else {
            acc[pre + k] = obj[k];
        }
        return acc;
    }, {});
}
