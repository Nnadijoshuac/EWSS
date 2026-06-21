import { WaterOrder } from '@/lib/types';

const ORDER_STORAGE_KEY = 'vale:resident-orders';

export function readResidentOrders(): WaterOrder[] {
  if (typeof window === 'undefined') return [];

  try {
    const value = window.localStorage.getItem(ORDER_STORAGE_KEY);
    return value ? (JSON.parse(value) as WaterOrder[]) : [];
  } catch {
    return [];
  }
}

export function writeResidentOrders(orders: WaterOrder[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
}

export function saveResidentOrder(order: WaterOrder) {
  const current = readResidentOrders().filter((item) => item.id !== order.id);
  writeResidentOrders([order, ...current]);
}

