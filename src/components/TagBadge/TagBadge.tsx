export interface TagBadgeProps {
  text: string;
}

export function TagBadge({ text }: TagBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full bg-accent text-neutral-700 px-2 py-0.5 text-xs border border-indigo-100">
      {text}
    </span>
  );
}
