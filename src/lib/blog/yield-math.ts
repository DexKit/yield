export function computeYieldFromValue(valueUsd: number, apyPercent: number) {
  const yearlyYieldUsd = valueUsd * (apyPercent / 100);
  return {
    yearlyYieldUsd,
    monthlyYieldUsd: yearlyYieldUsd / 12,
    dailyYieldUsd: yearlyYieldUsd / 365,
  };
}
