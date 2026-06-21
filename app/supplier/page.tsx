'use client';

import { useState } from 'react';
import TopNav from '@/components/TopNav';
import SupplierStatusToggle from '@/components/SupplierStatusToggle';
import VerificationBadge from '@/components/VerificationBadge';
import StatusPill from '@/components/StatusPill';
import { UserRole, SourceStatus, WaterOrder } from '@/lib/types';
import { WATER_SOURCES, SAMPLE_ORDERS } from '@/lib/mock-data';
import { formatPrice } from '@/lib/pricing';

export default function SupplierPage() {
  const [role, setRole] = useState<UserRole>('supplier');
  const [supplierStatus, setSupplierStatus] = useState<SourceStatus>('available');
  const [orders, setOrders] = useState<WaterOrder[]>(SAMPLE_ORDERS);
  const demoSupplier = WATER_SOURCES[0];

  const updateOrder = (orderId: string, status: WaterOrder['status']) => {
    setOrders((current) => current.map((order) => (order.id === orderId ? { ...order, status } : order)));
  };

  if (role !== 'supplier') {
    return (
      <div className="min-h-screen bg-white">
        <TopNav currentRole={role} onRoleChange={setRole} showRoleSwitcher />
        <div className="mx-auto max-w-[1200px] px-4 pb-20 pt-32 sm:px-6 lg:px-8">
          <p className="text-lg text-[#5e5e5e]">Switching to {role} view...</p>
        </div>
      </div>
    );
  }

  const incomingOrders = orders.filter((order) => order.status === 'requested');
  const acceptedOrders = orders.filter((order) => order.status === 'accepted');
  const onTheWayOrders = orders.filter((order) => order.status === 'on_the_way');

  return (
    <div className="min-h-screen bg-white">
      <TopNav currentRole={role} onRoleChange={setRole} showRoleSwitcher />

      <main className="mx-auto max-w-[1200px] px-4 pb-28 pt-24 sm:px-6 sm:pt-28 lg:px-8">
        <header className="border-b border-[#d8d8d8] pb-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <VerificationBadge verified={demoSupplier.verified} verificationStatus={demoSupplier.verificationStatus} />
                <span className="text-sm text-[#5e5e5e]">{demoSupplier.area}</span>
              </div>
              <h1 className="max-w-3xl text-4xl font-normal leading-[1.1] tracking-[-0.035em] text-black sm:text-[52px]">
                {demoSupplier.name}
              </h1>
              <p className="mt-4 text-sm leading-6 text-[#5e5e5e]">
                {demoSupplier.rating.toFixed(1)} rating · {demoSupplier.reviewCount} reviews · {demoSupplier.operatorPhone}
              </p>
            </div>
            <div className="w-full max-w-md">
              <p className="mb-2 text-xs text-[#5e5e5e]">Current availability</p>
              <SupplierStatusToggle status={supplierStatus} onStatusChange={setSupplierStatus} />
            </div>
          </div>
        </header>

        <section className="my-12 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[#d8d8d8] bg-[#d8d8d8] lg:grid-cols-4">
          <Metric label="Water capacity" value={`${(demoSupplier.availableLitres / 1000).toFixed(1)}K L`} />
          <Metric label="Price per litre" value={formatPrice(demoSupplier.pricePerLitre)} />
          <Metric label="Completed today" value={orders.filter((order) => order.status === 'delivered').length} />
          <Metric label="Complaints" value={demoSupplier.complaintCount} />
        </section>

        <section className="mb-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-[#5e5e5e]">Dispatch queue</p>
              <h2 className="mt-1 text-4xl font-normal tracking-[-0.03em]">Incoming requests</h2>
            </div>
            <span className="rounded-full bg-[#f6f6f6] px-4 py-2 text-sm">{incomingOrders.length} waiting</span>
          </div>

          {incomingOrders.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {incomingOrders.map((order) => (
                <article key={order.id} className="rounded-lg bg-[#f6f6f6] p-5">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-medium text-black">{order.residentName}</h3>
                      <p className="mt-1 text-sm text-[#5e5e5e]">{order.residentArea} · {order.quantityLitres.toLocaleString()}L</p>
                      <p className="mt-3 text-xs text-[#5e5e5e]">Estimated revenue</p>
                      <p className="text-lg font-medium">{formatPrice(order.price)}</p>
                    </div>
                    <StatusPill status={order.status} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => updateOrder(order.id, 'accepted')} className="btn-primary">Accept</button>
                    <button className="btn-secondary">Reject</button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-lg bg-[#f6f6f6] p-8 text-center text-[#5e5e5e]">No incoming requests at the moment.</p>
          )}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <OrderColumn
            title="Accepted orders"
            orders={acceptedOrders}
            empty="No accepted orders yet."
            action="Mark on the way"
            onAction={(id) => updateOrder(id, 'on_the_way')}
          />
          <OrderColumn
            title="On the way"
            orders={onTheWayOrders}
            empty="No orders in transit."
            action="Mark delivered"
            onAction={(id) => updateOrder(id, 'delivered')}
          />
        </section>
      </main>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white p-5 sm:p-6">
      <p className="text-xs text-[#5e5e5e]">{label}</p>
      <p className="mt-3 text-3xl font-normal tracking-[-0.03em] text-black sm:text-4xl">{value}</p>
    </div>
  );
}

function OrderColumn({
  title,
  orders,
  empty,
  action,
  onAction,
}: {
  title: string;
  orders: WaterOrder[];
  empty: string;
  action: string;
  onAction: (id: string) => void;
}) {
  return (
    <div className="rounded-lg border border-[#d8d8d8] bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-normal tracking-[-0.02em]">{title}</h2>
        <span className="rounded-full bg-[#f6f6f6] px-3 py-1 text-xs">{orders.length}</span>
      </div>
      {orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order) => (
            <article key={order.id} className="rounded-lg bg-[#f6f6f6] p-4">
              <p className="font-medium text-black">{order.residentName}</p>
              <p className="mt-1 text-xs text-[#5e5e5e]">{order.quantityLitres.toLocaleString()}L · {order.residentArea}</p>
              <button onClick={() => onAction(order.id)} className="btn-small mt-4 w-full">{action}</button>
            </article>
          ))}
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-[#5e5e5e]">{empty}</p>
      )}
    </div>
  );
}
