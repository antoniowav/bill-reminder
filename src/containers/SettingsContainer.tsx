'use client';

import { ReminderOffsetsForm } from '@/components/ReminderOffsetsForm/ReminderOffsetsForm';
import { SettingsSection } from '@/components/SettingsSection/SettingsSection';
import { useState } from 'react';

export default function SettingsContainer() {
  const [offsets, setOffsets] = useState<number[]>([3, 7, 14]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Settings</h1>

      <SettingsSection title="Reminders" description="Choose when we nudge you before a bill is due.">
        <ReminderOffsetsForm offsets={offsets} onChange={setOffsets} />
      </SettingsSection>

      <SettingsSection title="Integrations" description="Connect Google Calendar, Gmail (coming soon).">
        <div className="text-sm text-muted-foreground">OAuth buttons will live here.</div>
      </SettingsSection>

      <SettingsSection title="Data" description="Export your data or delete your account.">
        <div className="text-sm text-muted-foreground">Export / Delete actions live here.</div>
      </SettingsSection>
    </div>
  );
}
