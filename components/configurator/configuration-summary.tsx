import {
  calculateFloorArea,
  calculateVolume
} from "@/lib/calculations/acoustic-calculations";
import type { RoomDetails } from "@/lib/stores/configurator-store";

type ConfigurationSummaryProps = {
  roomDetails: RoomDetails;
};

export function ConfigurationSummary({ roomDetails }: ConfigurationSummaryProps) {
  const floorArea = calculateFloorArea(roomDetails.length, roomDetails.width);
  const volume = calculateVolume(
    roomDetails.length,
    roomDetails.width,
    roomDetails.height
  );
  const summary = [
    ["Room Type", roomDetails.roomType],
    [
      "Dimensions (L x W x H)",
      `${roomDetails.length || 0} ft x ${roomDetails.width || 0} ft x ${
        roomDetails.height || 0
      } ft`
    ],
    ["Floor Area", `${floorArea.toLocaleString()} sq ft`],
    ["Volume", `${volume.toLocaleString()} cu ft`],
    ["Ceiling Type", roomDetails.ceilingType],
    ["Floor Type", roomDetails.floorType],
    ["Windows", roomDetails.windows]
  ];

  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-medium tracking-tight text-slate-800">Summary</h2>
      <dl className="mt-6 space-y-5">
        {summary.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs font-medium text-slate-500">{label}</dt>
            <dd className="mt-1 text-sm font-mono font-medium tabular-nums text-slate-900">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
