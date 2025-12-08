"use client";

import Link from "next/link";
import { ChevronDownIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { logoutAction } from "@/actions/auth";

export default function LoginBtn() {

    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const dropdownRef = useRef(null); 
    const router = useRouter(); 

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    
    const handleLogout = async () => {
        setIsOpen(false);
        await logoutAction();
        router.push("/");
    };  

    useEffect(() => {
     setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !(dropdownRef.current as HTMLElement).contains(event.target as Node)) {
        setIsOpen(false);
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
    }, []);

    return (
        <div className="relative ml-10" ref={dropdownRef}>
          <div
            className="flex items-center space-x-2 p-2 rounded cursor-pointer"
            onClick={toggleDropdown}
          >
            <ChevronDownIcon className="w-4 h-4 text-custom-blue" />
            <UserCircleIcon className="w-8 h-8 text-custom-blue" />
          </div>
    
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <Link href="/mi-perfil" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Perfil
              </Link>
    
              <Link href="/adopcion/favoritas" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Favoritas
              </Link>
    
              <Link href="/chat/publicaciones" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                Chats
              </Link>
    
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Salir
              </button>
            </div>
          )}
        </div>
      );
}