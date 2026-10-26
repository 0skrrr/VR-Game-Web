// src/utils/api.ts
const API_BASE = import.meta.env.VITE_API_URL || '';

export function getApiUrl(endpoint: string): string {
    // Ensure leading slash consistency
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${API_BASE}${cleanEndpoint}`;
}