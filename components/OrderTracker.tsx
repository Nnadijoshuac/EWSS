'use client';

import { WaterOrder } from '@/lib/types';
import StatusPill from './StatusPill';
import { formatPrice } from '@/lib/pricing';
import { getOrderStatusLabel } from '@/lib/utils';

interface OrderTrackerProps {
  order: WaterOrder;
  onStatusChange?: (newStatus: 'requested' | 'accepted' | 'on_the_way' | 'delivered') => void;
}

export default function OrderTracker({ order, onStatusChange }: OrderTrackerProps) {
  const statuses: Array<'requested' | 'accepted' | 'on_the_way' | 'delivered'> = [
    'requested',
    'accepted',
    'on_the_way',
    'delivered',
  ];

  const currentIndex = statuses.indexOf(order.status);

  return (
    <div className="card">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="heading-sm m-0">Order #{order.id.split('-')[1]}</h3>
          <p className="text-xs text-[#5e5e5e]">{order.sourceName}</p>
        </div>
        <StatusPill status={order.status} />
      </div>

      {/* Order Details */}
      <div className="mb-4 space-y-2 rounded-lg bg-[#f6f6f6] p-4 text-sm">
        <div className="flex justify-between">
          <span className="text-[#404751]">Quantity:</span>
          <span className="font-medium text-black">
            {order.quantityLitres.toLocaleString()} L
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#404751]">Location:</span>
          <span className="font-medium text-black">{order.residentArea}</span>
        </div>
        <div className="divider my-2" />
        <div className="flex justify-between">
          <span className="text-[#404751]">Water Cost:</span>
          <span className="font-medium text-[#404751]">
            {formatPrice(order.price - order.deliveryFee)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#404751]">Delivery Fee:</span>
          <span className="font-medium text-[#404751]">
            {formatPrice(order.deliveryFee)}
          </span>
        </div>
        {order.subsidyApplied && (
          <div className="flex justify-between font-medium text-black">
            <span>Government Subsidy:</span>
            <span>-{formatPrice(order.subsidyAmount)}</span>
          </div>
        )}
        <div className="divider my-2" />
        <div className="flex justify-between text-base font-medium text-black">
          <span>Total:</span>
          <span>{formatPrice(order.price)}</span>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="mb-6">
        <p className="text-xs font-bold text-[#404751] mb-3 uppercase">Delivery Status</p>
        <div className="space-y-3">
          {statuses.map((status, idx) => {
            const isCompleted = idx <= currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <div key={status} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 transition-all ${
                    isCompleted
                      ? isCurrent
                        ? 'bg-black text-white ring-4 ring-[#d8d8d8]'
                        : 'bg-black text-white'
                      : 'bg-[#d8d8d8] text-[#5e5e5e]'
                  }`}
                >
                  {isCompleted ? (isCurrent ? '' : '') : idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-black">
                    {getOrderStatusLabel(status)}
                  </p>
                  {isCurrent && (
                    <p className="text-xs text-[#404751]">
                      Est. {order.estimatedDeliveryTime}
                    </p>
                  )}
                </div>
                {isCurrent && onStatusChange && idx < statuses.length - 1 && (
                  <button
                    onClick={() => onStatusChange(statuses[idx + 1])}
                    className="btn-small whitespace-nowrap"
                  >
                    Mark Next
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {order.status === 'delivered' && (
        <div className="rounded-lg bg-[#f6f6f6] p-4">
          <p className="mb-2 text-sm font-medium text-black">Order delivered</p>
          <p className="text-xs text-[#5e5e5e]">
            Thank you for using Vale. Please rate your experience.
          </p>
          <div className="mt-3 flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="text-2xl hover:scale-110 transition-transform"
              >
                
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
