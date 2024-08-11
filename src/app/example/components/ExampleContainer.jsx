'use client'

import { getAllExamples } from '../actions';
import { useEffect, useState } from 'react';
import FilterForm from './filterForm';
import ExampleList from './exampleList';

const ExampleContainer = () => { 
    const [data, updateData] = useState([]);
    
    useEffect(() => {
        handleGetData()
    }, []);

    const handleGetData = async () => {
        const response = await getAllExamples()
        updateData(response)
    }
    return(
        <>
            <FilterForm updateData={updateData}/>
            <ExampleList initialList={data} />
        </>
    )
}

export default ExampleContainer