'use client'

import { useForm } from "react-hook-form";
import Link from 'next/link';

const SignupForm = () => {

    const { register, handleSubmit, formState: { errors }, watch } = useForm();

    const password = watch('password');

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <section className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md mx-auto min-h-[60vh]">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col space-y-4"
            >
                <div>
                    <label htmlFor="email" className="block text-gray-700 text-sm font-medium">Correo Electrónico</label>
                    <input
                        type="email"
                        id="email"
                        {...register('email', { required: 'El correo electrónico es obligatorio' })}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        placeholder="Introduce tu correo electrónico"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div>
                    <label htmlFor="password" className="block text-gray-700 text-sm font-medium">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        {...register('password', { required: 'La contraseña es obligatoria' })}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        placeholder="Introduce tu contraseña"
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium">Confirmar Contraseña</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        {...register('confirmPassword', {
                            required: 'La confirmación de contraseña es obligatoria',
                            validate: value => value === password || 'Las contraseñas no coinciden'
                        })}
                        className="w-full p-3 border border-gray-300 rounded-md"
                        placeholder="Confirma tu contraseña"
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                </div>

                <button
                    type="submit"
                    className="mx-auto py-2 px-4 bg-primary-blue text-white rounded-full hover:bg-primary-blue-dark transition-colors duration-300"
                >
                    Registrarse
                </button>
                <p className="text-center text-sm mt-4">
                    ¿Ya tenés una cuenta?{' '}
                    <Link href="/login" className="text-primary-orange underline hover:text-primary-orange-dark transition-colors duration-300 font-semibold">
                        Iniciar Sesión
                    </Link>
                </p>
            </form>
        </section>
    );
}

export default SignupForm;
