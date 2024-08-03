import Link from 'next/link';
import { getData } from '@/app/lib/api'
import DeleteBtn from './components/deleteBtn';

const Example = async () => {
    const data = await getData()
    return(
        <div className="px-4 py-4 mx-auto max-w-7xl">
            <h4 className="text-2xl font-bold mb-4">Prueba</h4>

            <div className="flex justify-end mb-4">
                <Link href="/example/create">
                    <button className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition">
                        Crear example
                    </button>
                </Link>
            </div>

            <ul className="mt-4 space-y-2">
                {data.map((item, index) => (
                    <li key={index} className="bg-gray-100 p-4 rounded shadow-md flex items-center justify-between">
                        <span>{item.title}</span>
                        <DeleteBtn id={item.id} />
                    </li>
                ))}
            </ul>
        </div>
    )
}



export default Example