import { WeeklyData } from "../types/crowdness";
import { fetchCrowdData } from "../utils/api";
import CrowdednessStatusClient from "./CrowdednessStatusClient";

interface CrowdednessStatusServerProps {
  warehouseId: number;
}

/**
 * SSR: fetch crowd data once, pass to client.
 * We don't embed dynamic date/time on the server
 * to avoid hydration mismatch.
 */
export default async function CrowdednessStatusServer({
  warehouseId,
}: CrowdednessStatusServerProps) {
  let weeklyData: WeeklyData[] = [];

  try {
    const response = await fetchCrowdData(warehouseId);
    weeklyData = response.data.weeklyData; // SSR data
  } catch (error) {
    console.error("Error fetching crowd data:", error);
  }

  return (
    <CrowdednessStatusClient
      initialCrowdData={weeklyData}
    />
  );
}
