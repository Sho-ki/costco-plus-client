// function degreesToRadians(degrees: number): number {
//   return degrees * (Math.PI / 180);
// }

// export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
//   const earthRadiusKm = 6371;

//   const dLat = degreesToRadians(lat2 - lat1);
//   const dLon = degreesToRadians(lon2 - lon1);

//   lat1 = degreesToRadians(lat1);
//   lat2 = degreesToRadians(lat2);

//   const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//             Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return earthRadiusKm * c;
// }

// export function findNearestWarehouse(userLat: number, userLon: number, warehouses: Warehouse[]): Warehouse {
//   let nearestWarehouse = warehouses[0];
//   let shortestDistance = calculateDistance(userLat, userLon, warehouses[0].latitude, warehouses[0].longitude);

//   for (let i = 1; i < warehouses.length; i++) {
//     const distance = calculateDistance(userLat, userLon, warehouses[i].latitude, warehouses[i].longitude);
//     if (distance < shortestDistance) {
//       shortestDistance = distance;
//       nearestWarehouse = warehouses[i];
//     }
//   }

//   return nearestWarehouse;
// }
