import localFont from 'next/font/local';
import DropdownAdoptar from './dropdownadoptar';
import DropdownServicios from './dropdownservicios';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import "../../globals.css";
import Link from 'next/link';
import LoginBtn from './loginBtn';

const gentyDemo = localFont({
  src: '../../../resources/font/GentyDemo-Regular.ttf',
  display: 'swap',
});

const navigation = [
  { name: 'Mascotas perdidas', href: '#', current: false },
  { name: 'Novedades', href: '#', current: false },
];

const Navbar = () => {
  return (
    <Disclosure as="nav" className="bg-white border-b border-gray-300 drop-shadow-md pb-2 pt-4 z-50">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 ">
        <div className="relative flex items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-primary-blue focus:outline-none focus:ring-2 focus:ring-inset">
              <span className="sr-only">Abrir menú</span>
              <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
            </DisclosureButton>
          </div>
          {/* Logo */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex items-center space-x-4 sm:space-x-16">
              <Link href="/" className={`${gentyDemo.className} text-4xl sm:text-7xl shadow-gray-500 text-shadow-lg`}>
                <span className="text-primary-blue">Adop</span>
                <span className="text-primary-orange">tr</span>
              </Link>
            </div>
          </div>

          {/* Menu Links */}
          <div className="hidden sm:ml-6 sm:block flex items-center space-x-16">
            {/* Dropdown "Adoptar" */}
            <DropdownAdoptar />
            <DropdownServicios />
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  aria-current={item.current ? 'page' : undefined}
                  className="text-primary-blue"
                >
                  {item.name}
                </a>
              ))}
          </div>

          {/* Right Side Icons */}
          <LoginBtn />
        </div>
      </div>

      {/* Mobile Menu */}
      <DisclosurePanel className="sm:hidden flex flex-col space-y-1 px-2 pb-3 pt-2">
        <DropdownAdoptar />
        <DropdownServicios />
        {navigation.map((item) => (
          <DisclosureButton
            key={item.name}
            as="a"
            href={item.href}
            aria-current={item.current ? 'page' : undefined}
            className="text-primary-blue"
          >
            {item.name}
          </DisclosureButton>
        ))}
      </DisclosurePanel>
    </Disclosure>
  );
};

export default Navbar;
