import createImageUrlBuilder from '@sanity/image-url';
import { dataset, projectId } from './sanity.client';

// Create Sanity image builder if credentials exist
const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
});

type ChainableImageBuilder = {
  width: (w: number) => ChainableImageBuilder;
  height: (h: number) => ChainableImageBuilder;
  fit: (mode: string) => ChainableImageBuilder;
  auto: (mode: string) => ChainableImageBuilder;
  url: () => string;
};

// Minimal shim for non-Sanity images that keeps the same chained API used in components
function createUrlShim(baseUrl: string): ChainableImageBuilder {
  // We'll accumulate URLSearchParams for width/height and other hints
  const url = new URL(baseUrl, typeof window === 'undefined' ? 'http://localhost' : window.location.origin);
  const params = url.searchParams;

  const api: ChainableImageBuilder = {
    width(w: number) {
      // Common CDNs: use w param when available; otherwise just append as hint
      params.set('w', String(w));
      return api;
    },
    height(h: number) {
      params.set('h', String(h));
      return api;
    },
    fit(mode: string) {
      // Keep for compatibility; many CDNs use `fit`
      params.set('fit', mode);
      return api;
    },
    auto(mode: string) {
      // E.g., `auto=format` used by Sanity/imgix; safe as hint for others
      params.set('auto', mode);
      return api;
    },
    url() {
      // Reconstruct without the fake base when needed
      const href = url.toString();
      // If baseUrl was absolute, href already okay; if relative, remove origin
      if (baseUrl.startsWith('http://') || baseUrl.startsWith('https://')) return href;
      // Remove the origin we added for URL parsing
      const origin = typeof window === 'undefined' ? 'http://localhost' : window.location.origin;
      return href.replace(origin, '');
    },
  };

  return api;
}

export const urlForImage = (source: any): ChainableImageBuilder | null => {
  if (!source) return null;

  // If this looks like a Sanity image source, use Sanity builder
  const isSanityRef = !!(source?.asset?._ref || source?._type === 'sanity.imageAsset');
  const hasSanityBuilder = !!imageBuilder?.image;
  if (isSanityRef && hasSanityBuilder) {
    return imageBuilder.image(source).auto('format').fit('max') as unknown as ChainableImageBuilder;
  }

  // If it's an object with a direct URL (e.g., { asset: { url } } or { url })
  const directUrl = source?.asset?.url || source?.url || (typeof source === 'string' ? source : null);
  if (directUrl) {
    return createUrlShim(directUrl).auto('format').fit('max');
  }

  // Fallback: cannot resolve
  return null;
};