"use client";

import { PageHeader } from "@/components/PageHeader/PageHeader";
import { ReminderOffsetsForm } from "@/components/ReminderOffsetsForm/ReminderOffsetsForm";
import { SettingsSection } from "@/components/SettingsSection/SettingsSection";
import { Button } from "@/components/ui/button";
import { getReminderSettings, upsertReminderSettings } from "@/data/reminders";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function SettingsContainer() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [offsets, setOffsets] = useState<number[]>([3, 7, 14]);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    let alive = true;

    async function bootstrap() {
      const { data } = await supabase.auth.getUser();
      const uid = data.user?.id ?? null;
      if (!alive) return;

      setUserId(uid);

      if (!uid) {
        setLoading(false);
        return;
      }

      try {
        const existing = await getReminderSettings();
        if (alive && existing?.offsets?.length) setOffsets(existing.offsets);
      } catch {
        /* ignore */
      } finally {
        if (alive) setLoading(false);
      }
    }

    bootstrap();

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleOffsetsChange(next: number[]) {
    setOffsets(next);
    setStatus("saving");

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await upsertReminderSettings(next);
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 1200);
      } catch {
        setStatus("error");
      }
    }, 500);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Reminders, integrations, and data control." />

      {!userId ? (
        <div className="panel">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-medium">You’re signed out</div>
              <p className="text-sm text-neutral-500">Sign in to edit your reminder settings.</p>
            </div>
            <Link href="/sign-in">
              <Button>Sign in</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="panel space-y-4">
            <SettingsSection
              title="Reminders"
              description="Choose how many days before a due date we notify you."
            >
              {loading ? (
                <div className="text-sm text-neutral-500">Loading…</div>
              ) : (
                <>
                  <ReminderOffsetsForm offsets={offsets} onChange={handleOffsetsChange} />
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-neutral-500">
                      {status === "saving" && "Saving…"}
                      {status === "saved" && "Saved"}
                      {status === "error" && <span className="text-red-600">Save failed</span>}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleOffsetsChange([3, 7, 14])}
                    >
                      Reset to defaults
                    </Button>
                  </div>
                </>
              )}
            </SettingsSection>
          </div>

          <div className="panel">
            <SettingsSection
              title="Integrations"
              description="Connect Calendar and Gmail (Pro, coming soon)."
            >
              <div className="text-sm text-neutral-600">Not available yet.</div>
            </SettingsSection>
          </div>

          <div className="md:col-span-2 panel">
            <SettingsSection title="Data" description="Export or delete your data.">
              <div className="flex gap-2">
                <Button variant="outline" type="button">Export CSV</Button>
                <Button variant="destructive" type="button">Delete account</Button>
              </div>
            </SettingsSection>
          </div>
        </div>
      )}
    </div>
  );
}
