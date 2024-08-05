import Link from 'next/link';
import DeleteBtn from './deleteBtn';

const ExampleList = ({list}) => {

    return(
        <ul className="mt-4 space-y-2">
            {list.map((item, index) => (
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
    )
}

export default ExampleList;