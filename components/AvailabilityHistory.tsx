import { DateTime } from 'luxon';
import { formatDate } from "../utils/dateUtils";
import { Check, X, HelpCircle } from "lucide-react";

interface AvailabilityHistoryProps {
  histories?: {
    date: string;
    value: "InStock" | "OutOfStock" | "Unknown";
  }[];
}

export default function AvailabilityHistory({ histories = [] }: AvailabilityHistoryProps) {
  const daysAgoArray = [2, 1, 0];
  const dayLabels = ["2日前", "昨日", "今日"];

  const last3Days = daysAgoArray.map((daysAgo, idx) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);

    const ymdString = d.toISOString().split("T")[0];
    const matchedRecord = histories.find(
      (h) => {
      const jpDate = DateTime.fromISO(h.date).setZone("Asia/Tokyo").toISO();
      return jpDate?.split("T")[0] === ymdString
    }
    );

    return {
      label: dayLabels[idx],
      date: ymdString,
      value: matchedRecord?.value ?? "Unknown",
    };
  });

  return (
    <div className="mt-4">
      <h3 className="text-xs font-semibold mb-2">直近3日間の在庫報告:</h3>
      <div className="flex justify-between">
        {last3Days.map((dayInfo, index) => (
          <div key={index} className="flex flex-col items-center">
            <span className="text-xs mb-1">
              {dayInfo.label}
            </span>

            {dayInfo.value === "InStock" ? (
              <Check className="text-green-500 w-6 h-6" />
            ) : dayInfo.value === "OutOfStock" ? (
              <X className="text-red-500 w-6 h-6" />
            ) : (
              <HelpCircle className="text-gray-500 w-6 h-6" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
