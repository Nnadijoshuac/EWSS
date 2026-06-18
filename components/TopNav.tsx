'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserRole } from '@/lib/types';
import RoleSwitcher from './RoleSwitcher';
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
  { href: '/', label: 'Home', desktop: 'md:inline-flex' },
  { href: '/demo', label: 'Map', desktop: 'md:inline-flex' },
  { href: '/request', label: 'Order', desktop: 'md:inline-flex' },
  { href: '/bulk', label: 'Bulk', desktop: 'lg:inline-flex' },
  { href: '/report', label: 'Report', desktop: 'lg:inline-flex' },
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
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-[#c0c7d2]/30 bg-[#f7f9fb]/95 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-3 transition hover:opacity-80">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#005e97] text-sm font-black text-white shadow-sm">
              VA
            </span>
            <div>
              <p className="text-sm font-black leading-none text-[#191c1e]">Vale</p>
              <p className="text-xs font-semibold text-[#404751]">Water access</p>
            </div>
          </Link>

          <div className="flex min-w-0 items-center gap-2">
            {onAreaChange && areas && (
              <select
                value={selectedArea || ''}
                onChange={(event) => onAreaChange(event.target.value)}
                className="hidden h-10 max-w-44 rounded-lg border border-[#c0c7d2]/40 bg-white px-3 text-sm font-bold text-[#404751] outline-none focus:border-[#005e97] sm:block"
              >
                <option value="">All areas</option>
                {areas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            )}

            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`hidden rounded-lg px-3 py-2 text-sm font-bold transition ${item.desktop} ${
                    active ? 'bg-[#005e97] text-white shadow-sm' : 'text-[#404751] hover:bg-[#eceef0] hover:text-[#191c1e]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {showRoleSwitcher && <RoleSwitcher currentRole={currentRole} onRoleChange={onRoleChange} />}
          </div>
        </div>
      </div>
    </nav>
  );
}
