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
  const hasActiveFilters = selectedSizes.length > 0 || selectedColors.length > 0 || stockFilter !== 'all';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">Filters</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">Refine your wardrobe</p>
        </div>
        {hasActiveFilters && (
          <button 
            onClick={onClear} 
            className="text-xs font-semibold text-rose-500 hover:text-rose-700 transition tracking-wide"
          >
            Reset
          </button>
        )}
      </div>

      {/* Stock Filter - Modern Segmented Control */}
      <div className="space-y-3">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
          Availability
        </h3>
        <div className="grid grid-cols-3 gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
          {[
            { id: 'all', label: 'All' },
            { id: 'inStock', label: 'In Stock' },
            { id: 'outOfStock', label: 'Sold Out' },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => onStockChange(opt.id as any)}
              className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
                stockFilter === opt.id
                  ? 'bg-white text-gray-900 shadow-sm font-semibold'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      {allSizes.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-gray-100">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
            Size
          </h3>
          <div className="flex flex-wrap gap-2">
            {allSizes.map(s => {
              const active = selectedSizes.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => onToggleSize(s)}
                  className={`min-w-10 h-10 px-3 flex items-center justify-center text-xs font-semibold rounded-xl border transition-all ${
                    active
                      ? 'bg-gray-900 text-white border-gray-900 shadow-sm scale-95'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Color Filter */}
      {allColors.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-gray-100">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
            Color Palette
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {allColors.map(c => {
              const active = selectedColors.includes(c);
              return (
                <button
                  key={c}
                  onClick={() => onToggleColor(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    active
                      ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                      : 'bg-gray-50 text-gray-700 border-gray-200/60 hover:bg-gray-100'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;
