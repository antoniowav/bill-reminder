export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl p-6 space-y-8">
      {children}
    </div>
  );
}
