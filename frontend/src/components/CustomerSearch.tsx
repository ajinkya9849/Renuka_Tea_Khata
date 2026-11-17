import React, { useEffect, useState, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useKhataStore } from '../store/useKhataStore';

export const CustomerSearch: React.FC = () => {
  const { searchQuery, setSearchQuery, fetchCustomers } = useKhataStore();
  const [localValue, setLocalValue] = useState(searchQuery);
  const debounceTimer = useRef<any>(null);

  useEffect(() => {
    setLocalValue(searchQuery);
  }, [searchQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setSearchQuery(val);
      fetchCustomers(val);
    }, 250);
  };

  const handleClear = () => {
    setLocalValue('');
    setSearchQuery('');
    fetchCustomers('');
  };

  return (
    <div className="px-5 py-2">
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-[#6B7280] pointer-events-none flex items-center justify-center">
          <Search className="w-4 h-4 text-[#C45A0A]" />
        </div>
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          placeholder="Search customer..."
          className="w-full pl-10 pr-10 py-3 bg-[#FBEBDD] border border-[#F3DEC9] rounded-2xl text-sm font-medium text-[#181818] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#C45A0A] focus:border-transparent transition-all shadow-cafe-sm"
        />
        {localValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 w-6 h-6 rounded-full bg-[#FFE7CC] text-[#5B2D16] flex items-center justify-center hover:bg-[#F3DEC9] transition-all"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
