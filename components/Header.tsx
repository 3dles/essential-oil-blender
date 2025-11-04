
import React from 'react';
import { BeakerIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <BeakerIcon className="h-8 w-8 text-emerald-600" />
            <h1 className="ml-3 text-2xl font-bold text-gray-800">
              에센셜 오일 블렌드 분석기
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
