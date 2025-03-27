import { createClient } from 'next-sanity';

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder-project-id';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-02-05';

export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false, // if you're using ISR or on-demand revalidation
}); 