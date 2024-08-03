'use client'

import { useForm } from "react-hook-form";
import { createExample } from "../actions";
import { useRouter } from "next/navigation";


const Form = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const router = useRouter();

    const handlePost = (data) => {
        createExample(data)
    }

    const handleBack = () => {
        router.back();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form
            onSubmit={handleSubmit(handlePost)}
            className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
        >
            <h2 className="text-2xl font-bold mb-4 text-center">CREAR</h2>

            <div className="relative z-0">
                <input
                    type="text"
                    id="title"
                    {...register('title', { required: 'El título es obligatorio' })}
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                />
                <label
                    htmlFor="title"
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                    Title
                </label>
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div className="relative z-0">
                <textarea
                    id="text"
                    {...register('text', { required: 'El texto es obligatorio' })}
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                />
                <label
                    htmlFor="text"
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                    Text
                </label>
                {errors.text && <p className="text-red-500 text-sm mt-1">{errors.text.message}</p>}
            </div>

            <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Crear
            </button>

            <button
                type="button"
                onClick={handleBack}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
                Volver
            </button>
        </form>
    </div>
    );
}

export default Form;