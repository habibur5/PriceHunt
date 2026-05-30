import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'PriceHunt',
  description: 'Bangladesh electronics price comparison platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
