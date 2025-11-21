
import React from 'react';
import { SavedBlend } from '../types';
import { BookOpenIcon, TrashIcon } from './icons';

interface SavedBlendsListProps {
  savedBlends: SavedBlend[];
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
}

const SavedBlendsList: React.FC<SavedBlendsListProps> = ({ savedBlends, onLoad, onDelete }) => {
  if (savedBlends.length === 0) {
    return (
      <div className="text-center py-10 px-4 border-2 border-dashed border-gray-300 rounded-xl">
        <p className="text-gray-500">저장된 블렌드가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {savedBlends.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between bg-gray-100 p-3 rounded-xl hover:shadow-md transition-shadow duration-200"
        >
          <span className="font-medium text-gray-800 truncate">{item.name}</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onLoad(item.id)}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-semibold text-emerald-700 bg-emerald-100 rounded-lg hover:bg-emerald-200 transition-colors"
              aria-label={`${item.name} 불러오기`}
            >
              <BookOpenIcon className="w-5 h-5" />
              <span>불러오기</span>
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-semibold text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
              aria-label={`${item.name} 삭제하기`}
            >
              <TrashIcon className="w-5 h-5" />
               <span>삭제</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedBlendsList;
