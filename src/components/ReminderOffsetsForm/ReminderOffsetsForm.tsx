'use client';

export interface ReminderOffsetsFormProps {
  offsets: number[];
  onChange: (offsets: number[]) => void;
}

export function ReminderOffsetsForm({ offsets, onChange }: ReminderOffsetsFormProps) {
  function handleAdd(value: number) {
    const next = Array.from(new Set([...offsets, value])).sort((a, b) => a - b);
    onChange(next);
  }

  function handleRemove(value: number) {
    onChange(offsets.filter((o) => o !== value));
  }

  function handleCustomSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const raw = Number(form.get('custom'));
    if (Number.isFinite(raw) && raw >= 1 && raw <= 30) handleAdd(raw);
    (e.currentTarget as HTMLFormElement).reset();
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {offsets.map((d) => (
          <span key={d} className="inline-flex items-center gap-2 rounded-full px-3 py-1 border">
            {d} days before
            <button
              type="button"
              aria-label={`Remove ${d}`}
              className="text-red-600"
              onClick={() => handleRemove(d)}
            >
              ×
            </button>
          </span>
        ))}
        {offsets.length === 0 && (
          <span className="text-sm text-muted-foreground">No reminders yet.</span>
        )}
      </div>

      <div className="flex gap-2">
        <button type="button" className="border rounded-md px-3 py-2" onClick={() => handleAdd(3)}>
          Add 3 days
        </button>
        <button type="button" className="border rounded-md px-3 py-2" onClick={() => handleAdd(7)}>
          Add 7 days
        </button>
        <button type="button" className="border rounded-md px-3 py-2" onClick={() => handleAdd(14)}>
          Add 14 days
        </button>
      </div>

      <form className="flex items-center gap-2" onSubmit={handleCustomSubmit}>
        <input
          name="custom"
          type="number"
          min={1}
          max={30}
          placeholder="Custom days (1–30)"
          className="border rounded-md p-2 w-48"
          required
        />
        <button className="rounded-md px-3 py-2 bg-black text-white" type="submit">
          Add custom
        </button>
      </form>
    </div>
  );
}
