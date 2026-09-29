import type { Metadata } from 'next';

/**
 * Generates SEO metadata (title, description, Open Graph, Twitter Cards)
 * for a given page. Use in each page.tsx to export the `metadata` const.
 */
export function seoMetadata({
  title,
  description,
  image = '/icon-light.svg',
  url = typeof window !== 'undefined' ? window.location.href : '',
}: {
  title: string;
  description: string;
  image?: string;
  url?: string;
}): Metadata {
  const baseUrl = 'https://praxialabs.com';

  return {
    title: `${title} | Praxia Labs`,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}${url}`,
      siteName: 'Praxia Labs',
      locale: 'es_ES', // default; can be overridden per locale if needed
      type: 'website',
      images: [
        {
          url: `${baseUrl}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}${image}`],
    },
  };
}