"use client";

import { PageHeader } from "@/components/PageHeader/PageHeader";
import { ReminderOffsetsForm } from "@/components/ReminderOffsetsForm/ReminderOffsetsForm";
import { SettingsSection } from "@/components/SettingsSection/SettingsSection";
import { useState } from "react";

export default function SettingsContainer() {
  const [offsets, setOffsets] = useState<number[]>([3, 7, 14]);

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Reminders, integrations, and data control." />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="panel">
          <SettingsSection
            title="Reminders"
            description="Choose when we nudge you before a bill is due."
          >
            <ReminderOffsetsForm offsets={offsets} onChange={setOffsets} />
          </SettingsSection>
        </div>

        <div className="panel">
          <SettingsSection
            title="Integrations"
            description="Connect Calendar and Gmail."
          >
            <div className="text-sm text-neutral-600">OAuth buttons will live here.</div>
          </SettingsSection>
        </div>

        <div className="md:col-span-2 panel">
          <SettingsSection
            title="Data"
            description="Export or delete your data."
          >
            <div className="text-sm text-neutral-600">Export/Delete actions here.</div>
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}
