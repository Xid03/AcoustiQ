import { Input } from "@/components/ui/input";
import type { RoomDetailsFormValues } from "@/lib/schemas/configurator-schema";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

type RoomDimensionsFormProps = {
  register: UseFormRegister<RoomDetailsFormValues>;
  errors: FieldErrors<RoomDetailsFormValues>;
};

const fields: Array<{ label: string; name: "length" | "width" | "height" }> = [
  { label: "Length (L)", name: "length" },
  { label: "Width (W)", name: "width" },
  { label: "Height (H)", name: "height" }
];

export function RoomDimensionsForm({ register, errors }: RoomDimensionsFormProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-2">
      {fields.map((field) => (
        <label key={field.label} className="block">
          <span className="text-xs font-medium text-slate-600">{field.label}</span>
          <span className="mt-2 flex rounded-lg border border-slate-300 bg-white transition-all duration-150 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
            <Input
              type="number"
              step="0.1"
              className="h-10 border-0 bg-transparent font-mono tabular-nums focus:border-0 focus:ring-0"
              aria-label={field.label}
              aria-invalid={Boolean(errors[field.name])}
              aria-describedby={`${field.name}-error`}
              {...register(field.name, { valueAsNumber: true })}
            />
            <span className="flex h-10 items-center rounded-r-lg bg-slate-50 px-3 text-xs font-medium text-slate-500">
              ft
            </span>
          </span>
          {errors[field.name]?.message ? (
            <span id={`${field.name}-error`} className="mt-1 block text-xs text-red-600">
              {errors[field.name]?.message}
            </span>
          ) : null}
        </label>
      ))}
    </div>
  );
}
