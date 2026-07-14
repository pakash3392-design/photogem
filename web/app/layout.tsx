import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Darkroom',
  description: 'Turn any photo into the signature look of your favorite photographers.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body bg-charcoal text-cream antialiased">{children}</body>
    </html>
  );
}
