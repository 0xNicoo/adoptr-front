'use client'

import { useForm } from "react-hook-form";


const LoginForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <section className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md mx-auto h-[50vh]">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col space-y-4"
            >
                <div className="mb-2">
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

                <button
                    type="submit"
                    className="mx-auto py-2 px-4 bg-primary-blue text-white rounded-full hover:bg-primary-blue-dark transition-colors duration-300"
                >
                    Ingresar
                </button>
            </form>
        </section>
    );
}

export default LoginForm;
