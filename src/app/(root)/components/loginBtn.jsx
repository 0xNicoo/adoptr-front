import Link from 'next/link';


import { isLoggedIn } from '../actions';
import DropdownUser from './dropdownuser';

const LoginBtn = async () => {
    const isAuthenticated = await isLoggedIn()

    return (
        <div className="relative">
            {isAuthenticated ? 
                (  
                    <DropdownUser />
                ) 
                : 
                (
                    <div>
                        <Link href="/login" className="text-primary-blue font-bold">Iniciar Sesión</Link>
                    </div>
                )
            }
        </div>
    );
};

export default LoginBtn;