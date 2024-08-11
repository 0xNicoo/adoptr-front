import Link from 'next/link';
import ExampleContainer from './components/exampleContainer';


const Example = () => {
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
            <ExampleContainer />
        </div>
    )
}

export default Example