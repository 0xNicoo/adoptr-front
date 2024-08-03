import Link from 'next/link';
import { getData } from '@/app/lib/api'
import DeleteBtn from './components/deleteBtn';

const Example = async () => {
    const data = await getData()
    return(
        <>
            <h4 className="text-2xl font-bold mb-4">Prueba</h4>

            <Link href="/example/create">
                <button className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
                    Crear example
                </button>
            </Link>

            <ul className="mt-4 space-y-2">
                {data.map((item, index) => (
                    <li key={index} className="bg-gray-100 p-4 rounded shadow-md flex items-center justify-between">
                        <span>{item.title}</span>
                        <DeleteBtn id={item.id} />
                    </li>
                ))}
            </ul>
        </>
    )
}



export default Example