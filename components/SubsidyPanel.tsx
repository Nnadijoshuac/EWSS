import { SubsidyVoucher } from '@/lib/types';
import { formatPrice } from '@/lib/pricing';

interface SubsidyPanelProps {
  vouchers: SubsidyVoucher[];
}

export default function SubsidyPanel({ vouchers }: SubsidyPanelProps) {
  const activeVouchers = vouchers.filter((v) => v.status === 'active');
  const redeemedVouchers = vouchers.filter((v) => v.status === 'redeemed');

  return (
    <div className="card">
      <h3 className="heading-sm mb-4">Subsidy Distribution</h3>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-700">
            {activeVouchers.length}
          </p>
          <p className="text-xs text-[#404751]">Active Vouchers</p>
        </div>
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-blue-700">
            {redeemedVouchers.length}
          </p>
          <p className="text-xs text-[#404751]">Redeemed</p>
        </div>
        <div className="bg-[#f7f9fb] border-2 border-[#cfe5ff] rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-[#005e97]">
            {activeVouchers.reduce((sum, v) => sum + v.maxLitres, 0).toLocaleString()}
          </p>
          <p className="text-xs text-[#404751]">Max Litres</p>
        </div>
      </div>

      {/* Active vouchers */}
      {activeVouchers.length > 0 && (
        <div>
          <p className="text-xs font-bold text-[#404751] mb-3 uppercase">
            Active Vouchers
          </p>
          <div className="space-y-2 mb-4">
            {activeVouchers.map((voucher) => (
              <div key={voucher.id} className="bg-green-50 rounded-lg p-3 border border-green-200">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-bold text-green-900">{voucher.residentName}</p>
                  <span className="badge badge-success">{voucher.discountPercent}% OFF</span>
                </div>
                <p className="text-xs text-green-700">
                  {voucher.area}  Up to {voucher.maxLitres.toLocaleString()}L
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Redeemed vouchers */}
      {redeemedVouchers.length > 0 && (
        <div>
          <p className="text-xs font-bold text-[#404751] mb-3 uppercase">
            Recently Redeemed
          </p>
          <div className="space-y-2">
            {redeemedVouchers.slice(0, 3).map((voucher) => (
              <div key={voucher.id} className="bg-[#f2f4f6] rounded-lg p-3 border border-[#c0c7d2]/30 opacity-75">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-[#404751]">{voucher.residentName}</p>
                  <span className="badge bg-[#e0e3e5] text-[#191c1e]">Redeemed</span>
                </div>
                <p className="text-xs text-[#404751]">
                  {voucher.area}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {vouchers.length === 0 && (
        <p className="text-center text-[#404751] py-6">No subsidy vouchers issued yet.</p>
      )}
    </div>
  );
}
