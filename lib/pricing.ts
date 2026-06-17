export interface PricingBreakdown {
  waterCost: number;
  deliveryFee: number;
  subsidyDiscount: number;
  total: number;
}

export function calculatePrice(
  quantityLitres: number,
  pricePerLitre: number,
  distanceKm: number,
  subsidyPercent: number = 0,
  maxSubsidyLitres: number = Infinity
): PricingBreakdown {
  const waterCost = quantityLitres * pricePerLitre;
  const deliveryFee = Math.round(distanceKm * 500);

  const subsidyLitres = Math.min(quantityLitres, maxSubsidyLitres);
  const subsidyDiscount = Math.round((subsidyLitres * pricePerLitre * subsidyPercent) / 100);

  const total = waterCost + deliveryFee - subsidyDiscount;

  return {
    waterCost,
    deliveryFee,
    subsidyDiscount,
    total: Math.max(0, total),
  };
}

export function formatPrice(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}
