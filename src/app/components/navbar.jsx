import { ChevronDownIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import localFont from 'next/font/local';
import DropdownAdoptar from './dropdownadoptar'; // Asegúrate de que la ruta es correcta

import "../globals.css";
import Link from 'next/link';

const gentyDemo = localFont({
  src: '../resources/font/GentyDemo-Regular.ttf',
  display: 'swap',
});



const Navbar = () => {
  return (
    <nav className="bg-white-800 text-white px-4 pt-4 pb-2 flex justify-between items-center border-b border-gray-300">
      <div className="ml-10">
        <Link href="/" className={`${gentyDemo.className} text-7xl shadow-gray-500 text-shadow-lg`}>
          <span className="text-primary-blue">Adop</span>
          <span className="text-primary-orange">tr</span>
        </Link>
      </div>

      <div className="flex items-center space-x-24 mr-6">
        <div className="space-x-20">
          <DropdownAdoptar />
          <Link href="/example" className="text-primary-blue">Servicios</Link>
          <Link href="/perdidas" className="text-primary-blue">Mascotas perdidas</Link>
          <Link href="/novedades" className="text-primary-blue">Novedades</Link>
        </div>

        <div className="relative">
          <button className="flex items-center space-x-2 p-2 rounded">
            <UserCircleIcon className="w-8 h-8 text-custom-blue" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
