import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import LoginBtn from './navbar/loginBtn';

export default function Navbar() {
  return (
    <nav>
        <Disclosure as="nav" className="bg-white border-b border-gray-300 drop-shadow-md pb-2 pt-4 z-50">
            <div className="mx-auto max-w-10xl px-2 sm:px-6 lg:px-8 ">
                <div className="relative flex items-center justify-between">
                    {/* Mobile Menu Button */}
                    <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-primary-blue focus:outline-none focus:ring-2 focus:ring-inset">
                        <span className="sr-only">Abrir menú</span>
                        <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                        <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
                        </DisclosureButton>
                    </div>
                    {/* Logo */}
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex items-center space-x-4 sm:space-x-16">
                        <Link href="/" className="text-4xl sm:text-7xl shadow-gray-500 text-shadow-lg text-primary-blue font-genty-demo">
                            <span className="text-primary-blue">Adop</span>
                            <span className="text-primary-orange">tr</span>
                        </Link>
                        </div>
                    </div>

                    {/* Menu Links */}
                    <div className="hidden sm:ml-6 sm:block flex items-center space-x-12 text-primary-blue font-bold">
                        <span>Adoptar</span>
                        <span>Servicios</span>
                        <span>Perdidas</span>
                    </div>
                    <div className="hidden sm:block">
                        <LoginBtn />
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <DisclosurePanel className="sm:hidden px-2 pb-3 pt-2">
                <div className="flex flex-col space-y-1 text-primary-blue font-bold items-end">
                    <span>Adoptar</span>
                    <span>Servicios</span>
                    <span>Perdidas</span>
                </div>
            </DisclosurePanel>
        </Disclosure>
    </nav>
  );
};