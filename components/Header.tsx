
import React from 'react';
import { BeakerIcon, CogIcon } from './icons';

interface HeaderProps {
    onOpenSettings?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <BeakerIcon className="h-8 w-8 text-emerald-600" />
            <h1 className="ml-3 text-2xl font-bold text-gray-800 hidden sm:block">
              에센셜 오일 블렌드 분석기
            </h1>
            <h1 className="ml-3 text-xl font-bold text-gray-800 sm:hidden">
              오일 블렌더
            </h1>
          </div>
          {onOpenSettings && (
            <button 
                onClick={onOpenSettings}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="설정"
            >
                <CogIcon className="h-7 w-7" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
