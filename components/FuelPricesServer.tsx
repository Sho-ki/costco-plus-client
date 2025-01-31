import { FuelPrice } from "../types/fuelPrice";

interface FuelPricesServerProps {
  initialFuelPrices: FuelPrice[];
}

export default function FuelPricesServer({ initialFuelPrices }: FuelPricesServerProps) {
  const colorClasses: { [key: string]: string } = {
    red: "bg-red-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
    yellow: "bg-yellow-500",
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">今日のガソリン代</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {initialFuelPrices.map((fuel, index) => {
          const bgClass = colorClasses[fuel.color] || "bg-gray-500";
          return (
            <div
              key={fuel.type}
              className={`${bgClass} p-6 rounded-lg shadow-md text-white`}
            >
              <h3 className="text-xl font-semibold mb-2">{fuel.type}</h3>
              <div className="text-3xl font-bold">
                {fuel.price && fuel.price > 0
                  ? `¥${Math.floor(fuel.price * 100) / 100}/L`
                  : "-"}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-8 text-center text-gray-600">
        ※ 価格は定期的に更新されます
      </div>
    </div>
  );
}
