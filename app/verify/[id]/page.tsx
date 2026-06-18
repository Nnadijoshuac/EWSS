'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import TopNav from '@/components/TopNav';
import VerificationBadge from '@/components/VerificationBadge';
import { WATER_SOURCES } from '@/lib/mock-data';
import { getSourceTypeLabel, getSourceTypeIcon, getTimeAgo } from '@/lib/utils';
import { formatPrice } from '@/lib/pricing';

export default function VerifyPage() {
  const params = useParams();
  const sourceId = params?.id as string;

  const source = WATER_SOURCES.find((s) => s.id === sourceId);

  if (!source) {
    return (
      <div className="bg-water-50 min-h-screen">
        <TopNav currentRole="resident" onRoleChange={() => {}} showRoleSwitcher={false} />
        <main className="container-max section-padding text-center">
          <p className="text-lg text-gray-600">Water source not found.</p>
          <Link href="/demo">
            <button className="btn-primary mt-4">Back to Map</button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-water-50 min-h-screen">
      <TopNav currentRole="resident" onRoleChange={() => {}} showRoleSwitcher={false} />

      <main className="container-max section-padding">
        <Link href="/demo" className="text-water-600 hover:text-water-700 font-medium mb-8 block">
           Back to Map
        </Link>

        <div className="max-w-2xl">
          {/* QR Scan Result */}
          <div className="card border-4 border-green-400 bg-green-50 mb-8 text-center">
            <p className="text-5xl mb-3"></p>
            <h2 className="heading-md text-green-900 m-0 mb-2">QR Code Verified</h2>
            <p className="text-green-800">
              This water source has been verified and registered with Kwnch
            </p>
          </div>

          {/* Source Details */}
          <div className="card mb-8">
            <div className="flex items-start gap-4 mb-6 pb-6 border-b-2 border-water-200">
              <span className="text-5xl">{getSourceTypeIcon(source.type)}</span>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="heading-lg m-0">{source.name}</h1>
                  <VerificationBadge
                    verified={source.verified}
                    verificationStatus={source.verificationStatus}
                  />
                </div>
                <p className="text-gray-600 mb-2">{getSourceTypeLabel(source.type)}</p>
                <p className="text-sm text-gray-600">Operator: <strong>{source.operatorName}</strong></p>
              </div>
            </div>

            {/* Key Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-water-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 font-bold mb-1 uppercase">Location</p>
                <p className="font-bold text-water-900">{source.area}</p>
                <p className="text-xs text-gray-600">{source.distanceKm} km away</p>
              </div>

              <div className="bg-water-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 font-bold mb-1 uppercase">Status</p>
                <p className="font-bold text-green-700"> Available</p>
                <p className="text-xs text-gray-600">Active Now</p>
              </div>

              <div className="bg-water-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 font-bold mb-1 uppercase">Price</p>
                <p className="font-bold text-water-600">
                  {formatPrice(Math.round(source.pricePerLitre))}
                  <span className="text-sm">/L</span>
                </p>
              </div>

              <div className="bg-water-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 font-bold mb-1 uppercase">Capacity</p>
                <p className="font-bold text-water-900">
                  {(source.availableLitres / 1000).toFixed(1)}K L
                </p>
                <p className="text-xs text-gray-600">Available</p>
              </div>

              <div className="bg-water-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 font-bold mb-1 uppercase">Rating</p>
                <p className="font-bold text-water-900">
                   {source.rating.toFixed(1)}/5.0
                </p>
                <p className="text-xs text-gray-600">{source.reviewCount} reviews</p>
              </div>

              <div className="bg-water-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 font-bold mb-1 uppercase">Last QC</p>
                <p className="font-bold text-water-900">{source.lastQualityCheck}</p>
                <p className="text-xs text-gray-600">Quality Check</p>
              </div>
            </div>

            <div className="divider my-6" />

            {/* Contact */}
            <div className="mb-6">
              <p className="text-sm font-bold text-water-900 mb-3"> Contact Operator</p>
              {source.operatorPhone && (
                <a
                  href={`tel:${source.operatorPhone}`}
                  className="block w-full py-3 px-4 rounded-lg border-2 border-water-600 text-water-600 font-bold hover:bg-water-50 text-center transition"
                >
                  Call: {source.operatorPhone}
                </a>
              )}
            </div>

            {/* Security Info */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-bold text-blue-900 mb-2"> Verification Details</p>
              <ul className="text-xs text-blue-900 space-y-1">
                <li> Registered with Kwnch on Jan 15, 2024</li>
                <li> Regular quality inspections conducted</li>
                <li> All legal documentation verified</li>
                <li> {source.complaintCount} complaint{source.complaintCount !== 1 ? 's' : ''} on record</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Link href="/demo">
                <button className="btn-primary w-full">
                  Request Water from {source.name.split(' ')[0]}
                </button>
              </Link>
              <Link href="/report">
                <button className="btn-secondary w-full">
                  Report Issue
                </button>
              </Link>
            </div>
          </div>

          {/* Trust Information */}
          <div className="card border-2 border-green-200 bg-green-50">
            <h3 className="heading-sm text-green-900 mb-4"> Why Trust This Source?</h3>
            <ul className="space-y-2 text-sm text-green-900">
              <li className="flex gap-3">
                <span className="text-lg"></span>
                <div>
                  <p className="font-bold">Verified Operator</p>
                  <p className="text-xs opacity-75">We've verified all credentials and legal status</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-lg"></span>
                <div>
                  <p className="font-bold">Regular Quality Checks</p>
                  <p className="text-xs opacity-75">Water tested monthly by independent lab</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-lg"></span>
                <div>
                  <p className="font-bold">Community Rated</p>
                  <p className="text-xs opacity-75">
                    {source.reviewCount} residents have reviewed this source
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-lg"></span>
                <div>
                  <p className="font-bold">Protected Customers</p>
                  <p className="text-xs opacity-75">
                    Report issues and get support from Kwnch
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
