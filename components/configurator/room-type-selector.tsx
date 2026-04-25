import { Building2, Presentation, Radio, User } from "lucide-react";

import { cn } from "@/lib/utils";

const roomTypes = [
  {
    icon: Building2,
    title: "Office",
    description: "Private offices, open offices, co-working spaces"
  },
  {
    icon: Presentation,
    title: "Conference Room",
    description: "Meeting and board rooms"
  },
  {
    icon: Radio,
    title: "Home Studio",
    description: "Recording and production studios"
  },
  {
    icon: User,
    title: "Other",
    description: "Classrooms, gyms, restaurants, etc."
  }
];

export function RoomTypeSelector() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {roomTypes.map((room, index) => {
        const Icon = room.icon;
        const selected = index === 0;

        return (
          <button
            key={room.title}
            type="button"
            className={cn(
              "min-h-[128px] rounded-xl border border-slate-200 bg-white p-4 text-center transition-all duration-150 active:scale-[0.98] hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
              selected &&
                "border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/20 hover:bg-indigo-50/60"
            )}
            aria-pressed={selected}
          >
            <Icon
              className={cn(
                "mx-auto h-5 w-5",
                selected ? "text-indigo-600" : "text-slate-500"
              )}
            />
            <span
              className={cn(
                "mt-3 block text-sm font-medium tracking-tight",
                selected ? "text-indigo-700" : "text-slate-800"
              )}
            >
              {room.title}
            </span>
            <span className="mx-auto mt-1 block max-w-[11rem] text-xs leading-5 text-slate-500">
              {room.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
