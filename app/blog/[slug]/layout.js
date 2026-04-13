export const metadata = {
  title: 'Blog Post | The Technocrat',
  description: 'Read our latest blog posts about web development, programming, and technology.',
  openGraph: {
    title: 'Blog Post | The Technocrat',
    description: 'Read our latest blog posts about web development, programming, and technology.',
    type: 'article',
    locale: 'en_US',
    siteName: 'The Technocrat',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Post | The Technocrat',
    description: 'Read our latest blog posts about web development, programming, and technology.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BlogPostLayout({ children }) {
  return children;
}