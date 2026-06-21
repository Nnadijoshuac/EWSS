'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import TopNav from '@/components/TopNav';
import OrderTracker from '@/components/OrderTracker';
import StatusPill from '@/components/StatusPill';
import { SAMPLE_ORDERS } from '@/lib/mock-data';
import { readResidentOrders } from '@/lib/order-storage';
import { WaterOrder } from '@/lib/types';
import { formatPrice } from '@/lib/pricing';
import LiveTankerMap from '@/components/LiveTankerMap';

const demoCurrentOrder: WaterOrder = {
  id: 'order-live-001',
  residentName: 'Joshua Nnadi',
  residentArea: 'New Haven',
  quantityLitres: 5000,
  sourceId: 'src-005',
  sourceName: 'Government Subsidized Truck',
  status: 'on_the_way',
  price: 76500,
  subsidyApplied: true,
  subsidyAmount: 30000,
  deliveryFee: 1500,
  createdAt: '2026-06-21T10:15:00Z',
  estimatedDeliveryTime: '18 mins',
};

const residentSampleOrders = [
  demoCurrentOrder,
  ...SAMPLE_ORDERS.filter((order) => order.residentName === 'Joshua Nnadi'),
];

function formatOrderDate(dateString: string) {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

function mergeOrders(stored: WaterOrder[], samples: WaterOrder[]) {
  const ids = new Set<string>();
  return [...stored, ...samples]
    .filter((order) => {
      if (ids.has(order.id)) return false;
      ids.add(order.id);
      return true;
    })
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<WaterOrder[]>(residentSampleOrders);
  const [recentlyCreated, setRecentlyCreated] = useState(false);

  useEffect(() => {
    setOrders(mergeOrders(readResidentOrders(), residentSampleOrders));
    setRecentlyCreated(new URLSearchParams(window.location.search).has('created'));
  }, []);

  const currentOrders = useMemo(() => orders.filter((order) => order.status !== 'delivered'), [orders]);
  const previousOrders = useMemo(() => orders.filter((order) => order.status === 'delivered'), [orders]);
  const primaryOrder = currentOrders[0];

  return (
    <div className="min-h-screen bg-white">
      <TopNav currentRole="resident" onRoleChange={() => {}} showRoleSwitcher={false} />

      <main className="mx-auto w-full max-w-[1200px] px-3 pb-28 pt-24 sm:px-6 sm:pt-28 lg:px-8">
        <header className="flex flex-col gap-6 border-b border-[#d8d8d8] pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-[#5e5e5e]">Your water</p>
            <h1 className="mt-2 text-4xl font-normal leading-[1.1] tracking-[-0.035em] sm:text-[52px]">Orders and deliveries</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#5e5e5e] sm:text-base">Track what is arriving and reorder from deliveries you already trust.</p>
          </div>
          <Link href="/" className="btn-primary inline-flex justify-center sm:w-auto">Order water</Link>
        </header>

        {recentlyCreated && (
          <div className="mt-6 flex items-center justify-between gap-4 rounded-lg bg-black p-4 text-white">
            <div>
              <p className="font-medium">Order confirmed</p>
              <p className="mt-1 text-xs text-[#afafaf]">Your supplier has received the request.</p>
            </div>
            <button type="button" onClick={() => setRecentlyCreated(false)} className="text-sm underline underline-offset-4">Dismiss</button>
          </div>
        )}

        <section className="mt-12">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[#5e5e5e]">In progress</p>
              <h2 className="mt-1 text-3xl font-normal tracking-[-0.03em] sm:text-4xl">Current orders</h2>
            </div>
            <span className="rounded-full bg-[#f6f6f6] px-4 py-2 text-sm">{currentOrders.length} active</span>
          </div>

          {primaryOrder ? (
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)] lg:items-start">
              <div className="space-y-5">
                {(primaryOrder.status === 'on_the_way' || primaryOrder.status === 'accepted') && <LiveTankerMap order={primaryOrder} />}
                <OrderTracker order={primaryOrder} />
              </div>
              <aside className="space-y-3">
                {currentOrders.slice(1).map((order) => (
                  <article key={order.id} className="rounded-lg bg-[#f6f6f6] p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{order.sourceName}</p>
                        <p className="mt-1 text-xs text-[#5e5e5e]">{order.quantityLitres.toLocaleString()}L · {order.residentArea}</p>
                      </div>
                      <StatusPill status={order.status} />
                    </div>
                    <p className="mt-4 text-sm text-[#5e5e5e]">Expected {order.estimatedDeliveryTime}</p>
                  </article>
                ))}
                {currentOrders.length === 1 && (
                  <div className="rounded-lg bg-[#f6f6f6] p-6">
                    <p className="font-medium">Need another delivery?</p>
                    <p className="mt-2 text-sm leading-6 text-[#5e5e5e]">Start a separate order without interrupting the one already on its way.</p>
                    <Link href="/" className="mt-4 inline-flex text-sm font-medium underline underline-offset-4">Open the map</Link>
                  </div>
                )}
              </aside>
            </div>
          ) : (
            <div className="rounded-lg bg-[#f6f6f6] p-8 text-center">
              <h3 className="text-2xl font-normal">No active delivery</h3>
              <p className="mt-2 text-sm text-[#5e5e5e]">Choose a tanker from the home map when you need water.</p>
              <Link href="/" className="btn-primary mt-5 inline-flex">Find a tanker</Link>
            </div>
          )}
        </section>

        <section className="mt-16 border-t border-[#d8d8d8] pt-10">
          <div className="mb-6">
            <p className="text-sm text-[#5e5e5e]">History</p>
            <h2 className="mt-1 text-3xl font-normal tracking-[-0.03em] sm:text-4xl">Previous orders</h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {previousOrders.map((order) => (
              <article key={order.id} className="rounded-lg border border-[#d8d8d8] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{order.sourceName}</p>
                    <p className="mt-1 text-xs text-[#5e5e5e]">{formatOrderDate(order.createdAt)} · {order.quantityLitres.toLocaleString()}L</p>
                  </div>
                  <p className="font-medium">{formatPrice(order.price)}</p>
                </div>
                <div className="mt-5 flex items-center justify-between gap-4">
                  <StatusPill status={order.status} />
                  <Link href="/" className="text-sm font-medium underline underline-offset-4">Order again</Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
