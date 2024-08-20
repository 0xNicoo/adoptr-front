"use client";

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

const DropdownAdoptar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="z-50 relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="text-primary-blue flex items-center space-x-1"
      >
        <span>Adoptar</span>
        <ChevronDownIcon className="w-4 h-4 text-custom-blue" />
      </button>

      {isDropdownOpen && (
        <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <Link
              href="/adopcion"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Adoptar
            </Link>
            <Link
              href="/adopcion/publicar/form"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Poner en Adopción
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownAdoptar;
