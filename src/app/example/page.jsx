import Link from 'next/link';
import { getData } from '@/app/lib/api'
import DeleteBtn from './components/deleteBtn';
import FilterForm from './components/filterForm';

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
            <FilterForm />
            <ul className="mt-4 space-y-2">
                {data.map((item, index) => (
                    <li key={index} className={`${item.active ? 'bg-gray-100' : 'bg-gray-300'} p-4 rounded shadow-md flex items-center justify-between`}>
                        <div className="flex flex-col">
                            <span className="text-black text-lg">{item.title}</span>
                            <span className="text-gray-700 text-md">{item.text}</span>
                            <span className="text-gray-500 text-sm">{item.type}</span>
                        </div>
                        <div className="flex space-x-1">
                            <DeleteBtn id={item.id} />
                            <Link href="/example/edit">
                                <button className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded transition">
                                    Edit
                                </button>
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}



export default Example