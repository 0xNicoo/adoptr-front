'use client'

import { getAllExamples } from './actions';
import Link from 'next/link';
import FilterForm from './components/filterForm';
import ExampleList from './components/exampleList';
import { useEffect, useState } from 'react';

const Example = () => {
    
    const [data, updateData] = useState([]);
    
    useEffect(() => {
        handleGetData()
    }, []);

    const handleGetData = async () => {
        const response = await getAllExamples()
        updateData(response)
    }

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
            <FilterForm updateData={updateData}/>
            <ExampleList list={data} />
        </div>
    )
}



export default Example