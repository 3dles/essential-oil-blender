
import React from 'react';
import { BlendItem } from '../types';
import { MinusIcon, PlusIcon, TrashIcon } from './icons';

interface BlendListProps {
  blend: BlendItem[];
  onUpdateDrops: (oilId: string, newDrops: number) => void;
  onRemoveOil: (oilId: string) => void;
}

const BlendList: React.FC<BlendListProps> = ({ blend, onUpdateDrops, onRemoveOil }) => {
  if (blend.length === 0) {
    return (
      <div className="text-center py-10 px-4 border-2 border-dashed border-gray-300 rounded-xl">
        <p className="text-gray-500">블렌드에 오일을 추가해주세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {blend.map(({ oil, drops }) => (
        <div
          key={oil.id}
          className="flex items-center justify-between bg-gray-100 p-3 rounded-xl"
        >
          <span className="font-medium text-gray-700 truncate w-2/5">{oil.name}</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onUpdateDrops(oil.id, drops - 1)}
              className="p-1 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition"
              aria-label="방울 수 감소"
            >
              <MinusIcon className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-semibold text-emerald-600">{drops}방울</span>
            <button
              onClick={() => onUpdateDrops(oil.id, drops + 1)}
              className="p-1 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition"
              aria-label="방울 수 증가"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => onRemoveOil(oil.id)}
            className="p-2 rounded-full text-red-500 hover:bg-red-100 transition"
            aria-label="오일 제거"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default BlendList;
