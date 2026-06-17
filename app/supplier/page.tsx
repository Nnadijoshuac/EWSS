'use client';

import { useState } from 'react';
import TopNav from '@/components/TopNav';
import SupplierStatusToggle from '@/components/SupplierStatusToggle';
import VerificationBadge from '@/components/VerificationBadge';
import StatusPill from '@/components/StatusPill';
import { UserRole, SourceStatus, WaterOrder } from '@/lib/types';
import { WATER_SOURCES, SAMPLE_ORDERS } from '@/lib/mock-data';
import { formatPrice } from '@/lib/pricing';
import { getOrderStatusLabel, getEstimatedDeliveryTime, formatDateShort } from '@/lib/utils';

export default function SupplierPage() {
  const [role, setRole] = useState<UserRole>('supplier');
  const [supplierStatus, setSupplierStatus] = useState<SourceStatus>('available');
  const [orders, setOrders] = useState<WaterOrder[]>(SAMPLE_ORDERS);

  // Demo supplier
  const demoSupplier = WATER_SOURCES[0];

  const handleAcceptOrder = (orderId: string) => {
    setOrders(
      orders.map((o) =>
        o.id === orderId ? { ...o, status: 'accepted' as const } : o
      )
    );
  };

  const handleMarkOnWay = (orderId: string) => {
    setOrders(
      orders.map((o) =>
        o.id === orderId ? { ...o, status: 'on_the_way' as const } : o
      )
    );
  };

  const handleMarkDelivered = (orderId: string) => {
    setOrders(
      orders.map((o) =>
        o.id === orderId ? { ...o, status: 'delivered' as const } : o
      )
    );
  };

  if (role !== 'supplier') {
    return (
      <div className="min-h-screen bg-water-50">
        <TopNav currentRole={role} onRoleChange={setRole} showRoleSwitcher={true} />
        <div className="container-max section-padding text-center">
          <p className="text-lg text-gray-600">
            Switching to {role} view. Redirecting...
          </p>
        </div>
      </div>
    );
  }

  const incomingOrders = orders.filter((o) => o.status === 'requested');
  const acceptedOrders = orders.filter((o) => o.status === 'accepted');
  const onTheWayOrders = orders.filter((o) => o.status === 'on_the_way');

  return (
    <div className="bg-water-50 min-h-screen">
      <TopNav currentRole={role} onRoleChange={setRole} showRoleSwitcher={true} />

      <main className="container-max section-padding">
        {/* Supplier Header */}
        <div className="card border-2 border-water-300 mb-8 bg-gradient-to-r from-water-50 to-blue-50">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="heading-lg m-0 mb-1">{demoSupplier.name}</h1>
              <p className="text-gray-600 mb-4">{demoSupplier.area}</p>

              <div className="flex items-center gap-4">
                <div>
                  <VerificationBadge
                    verified={demoSupplier.verified}
                    verificationStatus={demoSupplier.verificationStatus}
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Rating</p>
                  <p className="font-bold text-water-900">
                     {demoSupplier.rating.toFixed(1)} ({demoSupplier.reviewCount} reviews)
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Phone</p>
                  <p className="font-bold text-water-900">{demoSupplier.operatorPhone}</p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-600 mb-2">Operator: {demoSupplier.operatorName}</p>
              <p className="text-xs text-gray-600">Contact: {demoSupplier.operatorPhone}</p>
            </div>
          </div>

          <div className="divider my-6" />

          {/* Status & Capacity */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-gray-600 font-medium mb-1 uppercase">Current Status</p>
              <SupplierStatusToggle
                status={supplierStatus}
                onStatusChange={setSupplierStatus}
              />
            </div>

            <div className="bg-white rounded-lg p-4 border-2 border-water-200">
              <p className="text-xs text-gray-600 font-medium mb-2 uppercase">Water Capacity</p>
              <p className="heading-md text-water-600 m-0">
                {(demoSupplier.availableLitres / 1000).toFixed(1)}K L
              </p>
              <p className="text-xs text-gray-600 mt-1">Remaining in tank</p>
            </div>

            <div className="bg-white rounded-lg p-4 border-2 border-water-200">
              <p className="text-xs text-gray-600 font-medium mb-2 uppercase">Price</p>
              <p className="heading-md text-water-600 m-0">
                {formatPrice(demoSupplier.pricePerLitre)}
                <span className="text-sm">/L</span>
              </p>
              <p className="text-xs text-gray-600 mt-1">Per litre</p>
            </div>
          </div>
        </div>

        {/* Incoming Requests */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="heading-md m-0">
              Incoming Requests
              {incomingOrders.length > 0 && (
                <span className="ml-3 badge badge-danger">{incomingOrders.length}</span>
              )}
            </h2>
          </div>

          {incomingOrders.length > 0 ? (
            <div className="space-y-3">
              {incomingOrders.map((order) => (
                <div
                  key={order.id}
                  className="border-l-4 border-yellow-500 bg-yellow-50 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-water-900 mb-1">
                        {order.residentName}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                         {order.residentArea}  {order.quantityLitres.toLocaleString()}L
                      </p>
                      <p className="text-xs text-gray-700">
                        Estimated revenue: {formatPrice(order.price)}
                      </p>
                    </div>
                    <StatusPill status={order.status} />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptOrder(order.id)}
                      className="flex-1 btn-primary bg-green-600 hover:bg-green-700"
                    >
                       Accept
                    </button>
                    <button className="flex-1 btn-secondary text-gray-700 border-gray-300">
                       Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No incoming requests at the moment.</p>
            </div>
          )}
        </div>

        {/* Active Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Accepted Orders */}
          <div className="card">
            <h3 className="heading-sm mb-4">
              Accepted Orders
              {acceptedOrders.length > 0 && (
                <span className="ml-2 badge badge-info">{acceptedOrders.length}</span>
              )}
            </h3>

            {acceptedOrders.length > 0 ? (
              <div className="space-y-3">
                {acceptedOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border-l-4 border-blue-500 bg-blue-50 rounded-lg p-3"
                  >
                    <p className="font-bold text-water-900 mb-1">{order.residentName}</p>
                    <p className="text-xs text-gray-600 mb-2">
                      {order.quantityLitres.toLocaleString()}L  {order.residentArea}
                    </p>
                    <button
                      onClick={() => handleMarkOnWay(order.id)}
                      className="w-full btn-small bg-blue-600 hover:bg-blue-700"
                    >
                      Mark On The Way 
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-6">No accepted orders yet.</p>
            )}
          </div>

          {/* On The Way */}
          <div className="card">
            <h3 className="heading-sm mb-4">
              On The Way
              {onTheWayOrders.length > 0 && (
                <span className="ml-2 badge bg-cyan-100 text-cyan-800">{onTheWayOrders.length}</span>
              )}
            </h3>

            {onTheWayOrders.length > 0 ? (
              <div className="space-y-3">
                {onTheWayOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border-l-4 border-cyan-500 bg-cyan-50 rounded-lg p-3"
                  >
                    <p className="font-bold text-water-900 mb-1">{order.residentName}</p>
                    <p className="text-xs text-gray-600 mb-2">
                      {order.quantityLitres.toLocaleString()}L  {order.residentArea}
                    </p>
                    <button
                      onClick={() => handleMarkDelivered(order.id)}
                      className="w-full btn-small bg-green-600 hover:bg-green-700"
                    >
                      Mark Delivered 
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-6">No orders in transit.</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Requests', value: orders.length },
            { label: 'Completed Today', value: orders.filter((o) => o.status === 'delivered').length },
            { label: 'Avg Rating', value: `${demoSupplier.rating.toFixed(1)} ` },
            { label: 'Complaints', value: demoSupplier.complaintCount },
          ].map((stat, idx) => (
            <div key={idx} className="card text-center">
              <p className="text-3xl font-bold text-water-600 mb-1">{stat.value}</p>
              <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
