import { fetchGasPrice } from "../utils/api";
import { FuelPrice } from "../types/fuelPrice";
import GoogleAdsense from "./GoogleAdsense";
import FuelPricesServer from './FuelPricesServer';

interface GasPricesServerProps {
  warehouseId: number;
}

export default async function GasPricesServer({ warehouseId }: GasPricesServerProps) {
  let fuelPrices: FuelPrice[] | null = null;

  // ----------------------------
  // ① サーバーサイドでガソリン価格を取得
  // ----------------------------
  try {
    const gasPriceData = await fetchGasPrice(warehouseId);
    const { kerosene, regular, diesel, premium } = gasPriceData.data;

    fuelPrices = [
      { type: "軽油", price: diesel, color: "green" },
      { type: "レギュラー", price: regular, color: "red" },
      { type: "ハイオク", price: premium, color: "yellow" },
      { type: "灯油", price: kerosene, color: "blue" },
    ];
  } catch (err) {
    console.error(err);
    return <div>Failed to load fuel prices</div>;
  }

  if (!fuelPrices) {
    return <div>データがありません</div>;
  }

  // ----------------------------
  // ② 価格表示 + 広告
  // ----------------------------
  return (
    <>
      <FuelPricesServer initialFuelPrices={fuelPrices} />
      <GoogleAdsense type="autorelaxed" />
    </>
  );
}
