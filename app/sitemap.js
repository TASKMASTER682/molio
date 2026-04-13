export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thetechnocrat.com';
  
  const blogRoutes = [
    { url: '/blog', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...blogRoutes,
  ];
}