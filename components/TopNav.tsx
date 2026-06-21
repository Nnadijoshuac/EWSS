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
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:fixed md:left-0 md:right-0 md:top-0 md:z-50 md:flex md:items-center md:justify-center px-4 pt-3 md:px-4 md:pt-3 lg:px-8">
        <div className="flex w-full items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center transition hover:opacity-80">
            <BrandLogo className="text-2xl text-black sm:text-3xl" />
          </Link>

          {/* Centered Navigation Island */}
          <div className="flex flex-1 items-center justify-center">
            <div className="rounded-full border border-white/10 bg-black/80 backdrop-blur-md px-2 py-2.5">
              <div className="flex items-center gap-1">
                {navItems.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== '/' && pathname.startsWith(item.href)) ||
                    (item.href === '/orders' && pathname === '/request');

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                        active
                          ? 'bg-white text-black'
                          : 'text-white/70 hover:text-white'
                      }`}
                      title={item.label}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            {onAreaChange && areas && (
              <select
                value={selectedArea || ''}
                onChange={(event) => onAreaChange(event.target.value)}
                className="h-10 rounded-full border border-white/10 bg-black/80 backdrop-blur-sm px-4 text-sm font-normal text-white outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
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
      </nav>

      {/* Mobile nav island - Fixed at bottom */}
      <nav className="fixed bottom-4 left-0 right-0 z-50 flex md:hidden items-center justify-center px-4">
        <div className="rounded-full border border-white/10 bg-black/80 backdrop-blur-md px-3 py-2.5">
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href)) ||
                (item.href === '/orders' && pathname === '/request');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3 py-2 text-xs font-medium transition-all ${
                    active
                      ? 'bg-white text-black'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
