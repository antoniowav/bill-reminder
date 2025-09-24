export interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  isSlim?: boolean;
}

export function SettingsSection({ title, description, children, isSlim = false }: SettingsSectionProps) {
  return (
    <section className={`rounded-xl border ${isSlim ? 'p-3' : 'p-4'} space-y-2`}>
      <div>
        <h3 className="font-medium">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  );
}
