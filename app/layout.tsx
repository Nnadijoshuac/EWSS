import type { Metadata } from 'next';
import './globals.css';
import MobileBottomNav from '@/components/MobileBottomNav';

export const metadata: Metadata = {
  title: 'Vale - Find Water. Request Water. Help Enugu See Where Water Is Needed.',
  description:
    'Digital water access and distribution platform connecting Enugu residents to verified water tankers, boreholes, and public water points.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="%23005e97"/><text x="50" y="62" text-anchor="middle" font-size="32" font-family="Arial" font-weight="700" fill="white">VA</text></svg>',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f7f9fb]">
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}
