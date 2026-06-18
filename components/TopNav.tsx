'use client';

import Link from 'next/link';
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

export default function TopNav({
  currentRole,
  onRoleChange,
  showRoleSwitcher = true,
  selectedArea,
  onAreaChange,
  areas,
}: TopNavProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-black/10 bg-[#f5f6f2]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 transition hover:opacity-75">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-950 text-sm font-black text-white">
              KW
            </span>
            <div>
              <p className="text-sm font-black leading-none text-neutral-950">Kwnch</p>
              <p className="text-xs font-semibold text-neutral-500">Water access</p>
            </div>
          </Link>

          <div className="flex min-w-0 items-center gap-2">
            {onAreaChange && areas && (
              <select
                value={selectedArea || ''}
                onChange={(e) => onAreaChange(e.target.value)}
                className="hidden h-10 max-w-44 rounded-lg border border-black/10 bg-white px-3 text-sm font-bold text-neutral-700 outline-none sm:block"
              >
                <option value="">All areas</option>
                {areas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            )}

            <Link
              href="/demo"
              className="hidden rounded-lg px-3 py-2 text-sm font-bold text-neutral-600 transition hover:bg-black/5 md:inline-flex"
            >
              Map
            </Link>
            <Link
              href="/request"
              className="hidden rounded-lg px-3 py-2 text-sm font-bold text-neutral-600 transition hover:bg-black/5 md:inline-flex"
            >
              Request
            </Link>
            {showRoleSwitcher && <RoleSwitcher currentRole={currentRole} onRoleChange={onRoleChange} />}
          </div>
        </div>
      </div>
    </nav>
  );
}
