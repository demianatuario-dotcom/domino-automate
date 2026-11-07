import type { MetadataRoute } from 'next';

const BASE_URL = 'https://domino-automate.com.br';

const VERTICAL_PATHS = [
  '/Atuaria',
  '/Estudios',
  '/Saloes',
  '/Barbearias',
  '/Advocacia',
  '/Contabilidade',
  '/Farmacias',
  '/Oticas',
  '/Odontologia',
  '/Varejo',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...VERTICAL_PATHS.map((path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
  ];
}

