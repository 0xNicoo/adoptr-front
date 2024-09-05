'use client'

import Link from 'next/link';
import { ChevronDownIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import { logOut } from '../actions';

const DropdownUser = () => {

    const [isOpen, setIsOpen] = useState(false)

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    };

    const handleLogout = async () => {
        await logOut()
        setIsOpen(false)
    };

    return(
        <div className="relative">
            <div className="flex items-center space-x-2 p-2 rounded cursor-pointer" onClick={toggleDropdown}>
                <ChevronDownIcon className="w-4 h-4 text-custom-blue" />
                <UserCircleIcon className="w-8 h-8 text-custom-blue" />
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <Link href="/mi-perfil" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Perfil
                    </Link>
                    <button 
                        onClick={handleLogout} 
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                        Salir
                    </button>
                    <Link href="/chatList" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Chats
                    </Link>
                </div>
            )}
        </div>
    )
}

export default DropdownUser;