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
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="heading-sm m-0">Order #{order.id.split('-')[1]}</h3>
          <p className="text-xs text-gray-600">{order.sourceName}</p>
        </div>
        <StatusPill status={order.status} />
      </div>

      {/* Order Details */}
      <div className="bg-water-50 rounded-lg p-4 mb-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Quantity:</span>
          <span className="font-bold text-water-900">
            {order.quantityLitres.toLocaleString()} L
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Location:</span>
          <span className="font-bold text-water-900">{order.residentArea}</span>
        </div>
        <div className="divider my-2" />
        <div className="flex justify-between">
          <span className="text-gray-600">Water Cost:</span>
          <span className="font-medium text-gray-700">
            {formatPrice(order.price - order.deliveryFee)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Delivery Fee:</span>
          <span className="font-medium text-gray-700">
            {formatPrice(order.deliveryFee)}
          </span>
        </div>
        {order.subsidyApplied && (
          <div className="flex justify-between text-green-700 font-medium">
            <span>Government Subsidy:</span>
            <span>-{formatPrice(order.subsidyAmount)}</span>
          </div>
        )}
        <div className="divider my-2" />
        <div className="flex justify-between text-base font-bold text-water-900">
          <span>Total:</span>
          <span>{formatPrice(order.price)}</span>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="mb-6">
        <p className="text-xs font-bold text-gray-600 mb-3 uppercase">Delivery Status</p>
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
                        ? 'bg-water-600 text-white ring-4 ring-water-200'
                        : 'bg-green-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {isCompleted ? (isCurrent ? '' : '') : idx + 1}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${isCurrent ? 'text-water-600' : ''}`}>
                    {getOrderStatusLabel(status)}
                  </p>
                  {isCurrent && (
                    <p className="text-xs text-gray-600">
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
        <div className="bg-green-50 border border-green-300 rounded-lg p-4">
          <p className="text-sm font-bold text-green-800 mb-2"> Order Delivered!</p>
          <p className="text-xs text-green-700">
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
