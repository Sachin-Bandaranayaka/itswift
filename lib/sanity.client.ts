import { createClient } from 'next-sanity';

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder-project-id';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-02-05';
export const token = process.env.SANITY_API_TOKEN;

export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false, // Use CDN in production for better performance
    token, // Add the token for write operations
    perspective: 'published', // Only fetch published content
    stega: false, // Disable stega for production
});

// Validate configuration in development
if (process.env.NODE_ENV === 'development') {
    if (!projectId || projectId === 'placeholder-project-id') {
        console.warn('⚠️ Sanity project ID is not configured');
    }
    if (!token) {
        console.warn('⚠️ Sanity API token is not configured');
    }
}