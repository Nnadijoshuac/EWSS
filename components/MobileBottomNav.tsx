'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/', label: 'Home' },
  { href: '/orders', label: 'Orders' },
  { href: '/report', label: 'Report' },
  { href: '/settings', label: 'Settings' },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-2 md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1 sm:gap-2">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href)) ||
            (item.href === '/orders' && pathname === '/request');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-12 min-w-0 items-center justify-center rounded-lg px-1 text-xs font-medium transition sm:text-sm ${
                active ? 'bg-[#0891B2] text-white' : 'text-white hover:bg-[#333333]'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
