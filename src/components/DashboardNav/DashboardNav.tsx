'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface DashboardNavProps {
  items: Array<{ href: string; label: string }>;
}

export function DashboardNav({ items }: DashboardNavProps) {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-4 border-b px-6 py-3">
      <Link href="/" className="font-semibold">DueNorth</Link>
      <div className="flex items-center gap-2 text-sm">
        {items.map(i => {
          const isActive = pathname === i.href;
          return (
            <Link
              key={i.href}
              href={i.href}
              className={`rounded-md px-2 py-1 ${isActive ? 'bg-muted font-medium' : 'hover:bg-muted/60'}`}
            >
              {i.label}
            </Link>
          );
        })}
      </div>
      <div className="ml-auto text-xs text-muted-foreground">v0</div>
    </nav>
  );
}
