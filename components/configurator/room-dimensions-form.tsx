import { Input } from "@/components/ui/input";

const fields = [
  { label: "Length (L)", value: "20" },
  { label: "Width (W)", value: "16" },
  { label: "Height (H)", value: "10" }
];

export function RoomDimensionsForm() {
  return (
    <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-2">
      {fields.map((field) => (
        <label key={field.label} className="block">
          <span className="text-xs font-medium text-slate-600">{field.label}</span>
          <span className="mt-2 flex rounded-lg border border-slate-300 bg-white transition-all duration-150 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
            <Input
              type="number"
              defaultValue={field.value}
              className="h-10 border-0 bg-transparent font-mono tabular-nums focus:border-0 focus:ring-0"
              aria-label={field.label}
            />
            <span className="flex h-10 items-center rounded-r-lg bg-slate-50 px-3 text-xs font-medium text-slate-500">
              ft
            </span>
          </span>
        </label>
      ))}
    </div>
  );
}
