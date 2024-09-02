'use client'

import { getAdoption } from '../actions';
import { useEffect, useState } from 'react';
import FilterForm from './filterForm';
import PublicationList from './publicationList';
import PaginationComponent from './pagination';

const itemsPerPage = 6

const AdoptionContainer = () => { 
    const [publicaciones, setPublications] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPage, setTotalPage] = useState(0);

    useEffect(() => {
        fetchAdoptions();
    }, []);

    const handlePageChange = async (page) => {
        console.log("PAGE DE ADOPTION CONTAINER", page)
        setCurrentPage(page);
        const {total, data} = await getAdoption(null, page);
        setTotalPage(Math.ceil(total / itemsPerPage))
        setPublications(data);
    };

    const fetchAdoptions = async () => {
        setLoading(true);
        try {
            const {total, data} = await getAdoption(null, currentPage);
            setTotalPage(Math.ceil(total / itemsPerPage))
            setPublications(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    return (
        <>
            <FilterForm updateData={setPublications} />
            <PublicationList 
                publications={publicaciones} 
            />
            <div className="mt-8 mb-12">
                <PaginationComponent
                    totalPages={totalPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </div>
        </>
    );
};

export default AdoptionContainer;
