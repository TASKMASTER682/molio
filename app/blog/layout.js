export const metadata = {
  title: 'Blog | The Technocrat',
  description: 'Blog by The Technocrat - full-stack developer from Kashmir. Web development, programming, and technology insights.',
  keywords: ['blog', 'web development', 'programming', 'tech', 'developer', 'Next.js', 'Kashmir'],
  openGraph: {
    title: 'Blog | The Technocrat',
    description: 'Blog by The Technocrat - full-stack developer from Kashmir. Web development, programming, and technology insights.',
    type: 'website',
    locale: 'en_US',
    siteName: 'The Technocrat',
    url: '/blog',
    canonical: 'https://thetechnocrat.com/blog',
  },
  twitter: {
    card: 'summary',
    title: 'Blog | The Technocrat',
    description: 'Explore the latest blog posts by The Technocrat.',
  },
  robots: {
    index: true,
    follow: true,
    sitemap: '/sitemap.xml',
    archive: '/',
  },
  alternates: {
    canonical: 'https://thetechnocrat.com/blog',
  },
};

export default function BlogLayout({ children }) {
  return children;
}