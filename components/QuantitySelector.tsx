'use client';

interface QuantitySelectorProps {
  selectedQuantity: number;
  onQuantityChange: (quantity: number) => void;
}

const QUANTITY_OPTIONS = [25, 50, 100, 500, 1000, 5000];

export default function QuantitySelector({
  selectedQuantity,
  onQuantityChange,
}: QuantitySelectorProps) {
  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-black">
        How much water do you need?
      </label>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {QUANTITY_OPTIONS.map((qty) => (
          <button
            key={qty}
            onClick={() => onQuantityChange(qty)}
            className={`rounded-lg border px-2 py-3 font-medium transition ${
              selectedQuantity === qty
                ? 'border-black bg-black text-white'
                : 'border-[#d8d8d8] bg-white text-black hover:border-black'
            }`}
          >
            {qty < 1000 ? `${qty}L` : `${qty / 1000}K`}
          </button>
        ))}
      </div>

      {/* Custom input */}
      <div className="flex gap-2">
        <input
          type="number"
          value={selectedQuantity}
          onChange={(e) => onQuantityChange(Math.max(1, parseInt(e.target.value) || 0))}
          placeholder="Or enter custom amount"
          className="input-field flex-1"
          min="1"
          max="100000"
        />
        <span className="flex items-center rounded-lg border border-[#d8d8d8] bg-[#f6f6f6] px-3 py-3 font-medium text-black">
          L
        </span>
      </div>
    </div>
  );
}
