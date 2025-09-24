import { DashboardNav } from '@/components/DashboardNav/DashboardNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <DashboardNav items={[
        { href: '/bills', label: 'Bills' },
        { href: '/settings', label: 'Settings' },
      ]} />
      <main className="mx-auto max-w-5xl p-6 space-y-8">
        {children}
      </main>
    </div>
  );
}
