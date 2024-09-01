'use client'

import { getAdoption } from '../actions';
import { useEffect, useState } from 'react';
import FilterForm from './filterForm';
import PublicationList from './publicationList';
import PaginationComponent from './pagination';

const itemsPerPage = 3;

const AdoptionContainer = () => { 
    const [data, updateData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [publicaciones, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdoptions = async () => {
          setLoading(true);
          try {
            const data = await getAdoption();
            setPublications(data);
          } catch (error) {
            setError(error.message);
          } finally {
            setLoading(false);
          }
        };
    
        fetchAdoptions();
      }, []);


    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPublications = publicaciones.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
      };
    
    useEffect(() => {
        handleGetData()
    }, []);

    const handleGetData = async () => {
        const response = await getAdoption()
        updateData(response)
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    return(
        <>
            <FilterForm updateData={updateData}/>
            <PublicationList publications={data} 
                publicaciones={currentPublications}
                handlePageChange={handlePageChange}
                currentPage={currentPage}
              />
            <div className="mt-8 mb-12">
                <PaginationComponent
                totalPages={Math.ceil(publicaciones.length / itemsPerPage)}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                />
            </div>
        </>
    )
}

export default AdoptionContainer