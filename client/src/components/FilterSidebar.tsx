import React from 'react';

interface FilterProps {
  allSizes: string[];
  allColors: string[];
  selectedSizes: string[];
  selectedColors: string[];
  stockFilter: 'all' | 'inStock' | 'outOfStock';
  onToggleSize: (size: string) => void;
  onToggleColor: (color: string) => void;
  onStockChange: (val: 'all' | 'inStock' | 'outOfStock') => void;
  onClear: () => void;
}

const FilterSidebar: React.FC<FilterProps> = ({
  allSizes, allColors, selectedSizes, selectedColors,
  stockFilter, onToggleSize, onToggleColor, onStockChange, onClear,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Filters</h2>
        <button onClick={onClear} className="text-sm text-indigo-600 hover:underline">Clear All</button>
      </div>

      {/* Size filter */}
      <div>
        <h3 className="font-semibold mb-2">Size</h3>
        <div className="flex flex-wrap gap-2">
          {allSizes.map(s => (
            <button
              key={s}
              onClick={() => onToggleSize(s)}
              className={`px-3 py-1 border rounded text-sm ${
                selectedSizes.includes(s) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Color filter */}
      <div>
        <h3 className="font-semibold mb-2">Color</h3>
        <div className="flex flex-wrap gap-2">
          {allColors.map(c => (
            <button
              key={c}
              onClick={() => onToggleColor(c)}
              className={`px-3 py-1 border rounded text-sm ${
                selectedColors.includes(c) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Stock filter */}
      <div>
        <h3 className="font-semibold mb-2">Availability</h3>
        <select
          value={stockFilter}
          onChange={e => onStockChange(e.target.value as 'all' | 'inStock' | 'outOfStock')}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="all">All</option>
          <option value="inStock">In Stock</option>
          <option value="outOfStock">Out of Stock</option>
        </select>
      </div>
    </div>
  );
};

export default FilterSidebar;
