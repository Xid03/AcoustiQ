import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  calculateFloorArea,
  calculateVolume
} from "@/lib/calculations/acoustic-calculations";
import type { RoomDetails } from "@/lib/stores/configurator-store";

type RoomSummaryCardProps = {
  roomDetails: RoomDetails;
};

export function RoomSummaryCard({ roomDetails }: RoomSummaryCardProps) {
  const floorArea = calculateFloorArea(roomDetails.length, roomDetails.width);
  const volume = calculateVolume(
    roomDetails.length,
    roomDetails.width,
    roomDetails.height
  );
  const roomSummary = [
    roomDetails.roomType,
    `${roomDetails.length} ft x ${roomDetails.width} ft x ${roomDetails.height} ft`,
    `${floorArea.toLocaleString()} sq ft`,
    `${volume.toLocaleString()} cu ft`
  ];

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold tracking-tight text-slate-800">
        Room Summary
      </h2>
      <div className="mt-5 space-y-2">
        {roomSummary.map((item) => (
          <p
            key={item}
            className="text-sm font-mono font-medium tabular-nums text-slate-900"
          >
            {item}
          </p>
        ))}
      </div>
      <Button asChild variant="outline" className="mt-5 w-full text-xs">
        <Link href="/configure">View Room Details</Link>
      </Button>
    </section>
  );
}
