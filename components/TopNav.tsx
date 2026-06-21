'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserRole } from '@/lib/types';
import RoleSwitcher from './RoleSwitcher';
import BrandLogo from './BrandLogo';
import { useEffect, useState } from 'react';

interface TopNavProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  showRoleSwitcher?: boolean;
  selectedArea?: string;
  onAreaChange?: (area: string) => void;
  areas?: string[];
}

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/orders', label: 'Orders' },
  { href: '/report', label: 'Report' },
  { href: '/settings', label: 'Settings' },
];

export default function TopNav({
  currentRole,
  onRoleChange,
  showRoleSwitcher = true,
  selectedArea,
  onAreaChange,
  areas,
}: TopNavProps) {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <nav className="fixed left-0 right-0 top-0 z-50">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2 transition hover:opacity-80">
            <BrandLogo className="text-lg text-white sm:text-xl" />
            <div className="hidden sm:block">
              <p className="text-xs font-normal text-[#afafaf]">Vale</p>
            </div>
          </Link>

          {/* Centered Navigation Island */}
          <div className="hidden flex-1 items-center justify-center md:flex">
            <div className="flex items-center gap-2">
              {navItems.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== '/' && pathname.startsWith(item.href)) ||
                  (item.href === '/orders' && pathname === '/request');

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      active
                        ? 'bg-black text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                    title={item.label}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-3 ml-auto">
            {onAreaChange && areas && (
              <select
                value={selectedArea || ''}
                onChange={(event) => onAreaChange(event.target.value)}
                className="hidden h-10 rounded-lg border border-white/20 px-4 text-sm font-normal text-white outline-none focus:border-white focus:ring-1 focus:ring-white lg:block transition-colors"
              >
                <option value="">All areas</option>
                {areas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            )}

            {showRoleSwitcher && <RoleSwitcher currentRole={currentRole} onRoleChange={onRoleChange} />}
          </div>
        </div>

        {/* Mobile nav items */}
        <div className="flex md:hidden justify-center gap-2 pb-3">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href)) ||
              (item.href === '/orders' && pathname === '/request');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  active
                    ? 'bg-black text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
