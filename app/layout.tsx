import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MindCheck AI — Understand yourself a little better',
  description:
    'A calm, private space for emotional check-ins, mindful self-reflection, and compassionate wellness habit tracking.',
  keywords: ['mental wellness', 'emotional check-in', 'journaling', 'mindfulness', 'reflection'],
  authors: [{ name: 'MindCheck AI' }],
};

export const viewport: Viewport = {
  themeColor: '#F8F6F1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-ivory text-charcoal antialiased selection:bg-lavender-200 selection:text-forest">
        {children}
      </body>
    </html>
  );
}
