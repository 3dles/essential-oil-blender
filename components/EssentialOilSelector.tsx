
import React, { useState } from 'react';
import { EssentialOil } from '../types';
import { PlusIcon } from './icons';

interface EssentialOilSelectorProps {
  oils: EssentialOil[];
  onAddOil: (oil: EssentialOil) => void;
}

const EssentialOilSelector: React.FC<EssentialOilSelectorProps> = ({ oils, onAddOil }) => {
  const [selectedOilId, setSelectedOilId] = useState<string>(oils[0]?.id || '');

  const handleAddClick = () => {
    const selectedOil = oils.find((oil) => oil.id === selectedOilId);
    if (selectedOil) {
      onAddOil(selectedOil);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <select
        value={selectedOilId}
        onChange={(e) => setSelectedOilId(e.target.value)}
        className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 ease-in-out"
      >
        {oils.map((oil) => (
          <option key={oil.id} value={oil.id}>
            {oil.name}
          </option>
        ))}
      </select>
      <button
        onClick={handleAddClick}
        className="flex-shrink-0 bg-emerald-500 text-white p-3 rounded-xl hover:bg-emerald-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        aria-label="오일 추가"
      >
        <PlusIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default EssentialOilSelector;
