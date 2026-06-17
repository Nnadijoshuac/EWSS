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
      <label className="block text-sm font-bold text-water-900 mb-3">
        How much water do you need?
      </label>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {QUANTITY_OPTIONS.map((qty) => (
          <button
            key={qty}
            onClick={() => onQuantityChange(qty)}
            className={`py-3 px-2 rounded-lg font-medium transition-all ${
              selectedQuantity === qty
                ? 'bg-water-600 text-white ring-2 ring-water-800'
                : 'bg-white border-2 border-water-200 text-water-900 hover:border-water-400'
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
        <span className="flex items-center px-3 py-3 bg-water-50 border-2 border-water-200 rounded-lg font-medium text-water-600">
          L
        </span>
      </div>
    </div>
  );
}
