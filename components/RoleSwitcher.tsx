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
    <div className="inline-flex max-w-[48vw] gap-1 overflow-x-auto rounded-full bg-[#333333] p-1 sm:max-w-none">
      {roles.map(({ role, label }) => (
        <button
          key={role}
          onClick={() => onRoleChange(role)}
          className={`h-8 shrink-0 rounded-full px-3 text-xs font-medium transition sm:px-4 sm:text-sm ${
            currentRole === role
              ? 'bg-white text-black'
              : 'text-white hover:bg-[#4b4b4b]'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
