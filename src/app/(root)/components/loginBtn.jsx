import Link from 'next/link';
    
import DropdownUser from './dropdownuser';
import Notifications from './notifications';
import { isLoggedInAction } from '@/actions/auth';

const LoginBtn = async () => {
    const isAuthenticated = await isLoggedInAction()

    return (
        <div className="relative">
            {isAuthenticated ? 
                (  
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <Notifications />
                        <DropdownUser />
                    </div>
                ) 
                : 
                (
                    <div className='flex items-center pl-16'>
                        <Link href="/login" className="text-primary-blue font-bold">Iniciar sesión</Link>
                    </div>
                )
            }
        </div>
    );
};

export default LoginBtn;