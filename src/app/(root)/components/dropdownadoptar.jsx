"use client";

import { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useFormStoreAdopcion } from '@/app/store';

const DropdownAdoptar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef(null); 
  const {resetForm} = useFormStoreAdopcion()
  const router = useRouter()

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Cerrar dropdown cuando cambia la url
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePublish = () => {
    resetForm()
    router.push('/adopcion/publicar/form')

  }

  return (
    <div className="z-50 relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="text-primary-blue flex items-center space-x-1"
      >
        <span>Adoptar</span>
        <ChevronDownIcon className="w-4 h-4 text-custom-blue" />
      </button>

      {isDropdownOpen && (
        <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            <Link
              href="/adopcion?page=1"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Adoptar
            </Link>
            <button
              onClick={handlePublish}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              Poner en Adopción
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownAdoptar;
