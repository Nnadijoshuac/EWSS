import { SubsidyVoucher } from '@/lib/types';

interface SubsidyPanelProps {
  vouchers: SubsidyVoucher[];
}

export default function SubsidyPanel({ vouchers }: SubsidyPanelProps) {
  const activeVouchers = vouchers.filter((v) => v.status === 'active');
  const redeemedVouchers = vouchers.filter((v) => v.status === 'redeemed');

  return (
    <div className="card">
      <p className="text-sm text-[#5e5e5e]">Public support</p>
      <h3 className="mb-5 mt-1 text-2xl font-normal tracking-[-0.02em]">Subsidy distribution</h3>

      <div className="mb-6 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-[#d8d8d8] bg-[#d8d8d8]">
        <div className="bg-white p-3 text-center">
          <p className="text-2xl font-normal text-black">
            {activeVouchers.length}
          </p>
          <p className="mt-1 text-[11px] text-[#5e5e5e]">Active</p>
        </div>
        <div className="bg-white p-3 text-center">
          <p className="text-2xl font-normal text-black">
            {redeemedVouchers.length}
          </p>
          <p className="mt-1 text-[11px] text-[#5e5e5e]">Redeemed</p>
        </div>
        <div className="bg-white p-3 text-center">
          <p className="text-2xl font-normal text-black">
            {activeVouchers.reduce((sum, v) => sum + v.maxLitres, 0).toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-[#5e5e5e]">Max litres</p>
        </div>
      </div>

      {/* Active vouchers */}
      {activeVouchers.length > 0 && (
        <div>
          <p className="mb-3 text-xs text-[#767676]">
            Active Vouchers
          </p>
          <div className="space-y-2 mb-4">
            {activeVouchers.map((voucher) => (
              <div key={voucher.id} className="rounded-lg bg-[#f6f6f6] p-4">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-medium text-black">{voucher.residentName}</p>
                  <span className="rounded-full bg-black px-2 py-1 text-xs font-medium text-white">{voucher.discountPercent}% off</span>
                </div>
                <p className="mt-1 text-xs text-[#5e5e5e]">
                  {voucher.area} · Up to {voucher.maxLitres.toLocaleString()}L
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Redeemed vouchers */}
      {redeemedVouchers.length > 0 && (
        <div>
          <p className="mb-3 text-xs text-[#767676]">
            Recently Redeemed
          </p>
          <div className="space-y-2">
            {redeemedVouchers.slice(0, 3).map((voucher) => (
              <div key={voucher.id} className="rounded-lg bg-[#f6f6f6] p-3 opacity-75">
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
