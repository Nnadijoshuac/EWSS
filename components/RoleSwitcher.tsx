'use client';

import { useEffect, useState } from 'react';
import { UserRole } from '@/lib/types';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export default function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const roles: { role: UserRole; label: string }[] = [
    { role: 'resident', label: 'Resident' },
    { role: 'supplier', label: 'Supplier' },
    { role: 'admin', label: 'Admin' },
  ];

  return (
    <div className="inline-flex max-w-[44vw] gap-1 overflow-x-auto rounded-lg border border-black/10 bg-white p-1 sm:max-w-none">
      {roles.map(({ role, label }) => (
        <button
          key={role}
          onClick={() => onRoleChange(role)}
          className={`h-9 shrink-0 rounded-md px-3 text-xs font-black transition sm:px-4 sm:text-sm ${
            currentRole === role
              ? 'bg-neutral-950 text-white shadow-sm'
              : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
