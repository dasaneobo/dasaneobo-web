import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/constants/siteConfig';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/login', '/signup'],
    },
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
  };
}
