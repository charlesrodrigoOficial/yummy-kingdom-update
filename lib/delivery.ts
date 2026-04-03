import {
  DEFAULT_DELIVERY_FEE,
  DELIVERY_ZONES,
  FREE_DELIVERY_ORDER_THRESHOLD,
  TAX_RATE,
} from "./constants";

export const normalizeCity = (city?: string) =>
  city?.trim().toLowerCase().replace(/\s+/g, " ");

export function getDeliveryFeeByCity(city?: string) {
  const normalized = normalizeCity(city);
  if (!normalized) return DEFAULT_DELIVERY_FEE;

  const matchedZone = DELIVERY_ZONES.find((zone) =>
    zone.cities.some((cityKey) => normalized.includes(cityKey))
  );

  return matchedZone?.fee ?? DEFAULT_DELIVERY_FEE;
}

export function getDeliveryZoneDetails(city?: string) {
  const normalized = normalizeCity(city);
  if (!normalized) {
    return {
      zone: "Outside Standard Zones",
      fee: DEFAULT_DELIVERY_FEE,
      eta: "75-90 mins",
    };
  }

  const matchedZone = DELIVERY_ZONES.find((zone) =>
    zone.cities.some((cityKey) => normalized.includes(cityKey))
  );

  if (!matchedZone) {
    return {
      zone: "Outside Standard Zones",
      fee: DEFAULT_DELIVERY_FEE,
      eta: "75-90 mins",
    };
  }

  return {
    zone: matchedZone.name,
    fee: matchedZone.fee,
    eta: matchedZone.eta,
  };
}

export function getCartPricing(itemsPrice: number, city?: string) {
  const normalizedItemsPrice = Math.max(itemsPrice, 0);
  const calculatedDelivery = getDeliveryFeeByCity(city);
  const shippingPrice =
    normalizedItemsPrice >= FREE_DELIVERY_ORDER_THRESHOLD
      ? 0
      : calculatedDelivery;
  const taxPrice = Number((normalizedItemsPrice * TAX_RATE).toFixed(2));
  const totalPrice = Number(
    (normalizedItemsPrice + shippingPrice + taxPrice).toFixed(2)
  );

  return {
    itemsPrice: normalizedItemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  };
}
