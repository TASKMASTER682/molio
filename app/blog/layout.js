export const metadata = {
  title: 'Blog | The Technocrat',
  description: 'Explore the latest blog posts by The Technocrat - Full stack developer & UPSC aspirant from Kashmir. Read about web development, programming, and technology insights.',
  keywords: ['blog', 'web development', 'programming', 'tech', 'developer', 'UPSC', 'Kashmir'],
  openGraph: {
    title: 'Blog | The Technocrat',
    description: 'Explore the latest blog posts by The Technocrat - Full stack developer & UPSC aspirant from Kashmir.',
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