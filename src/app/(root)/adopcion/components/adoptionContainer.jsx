'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Importa useRouter
import { getAdoption } from '../actions';
import FilterForm from './filterForm';
import PublicationList from './publicationList';
import PaginationComponent from './pagination';

const itemsPerPage = 6;

const AdoptionContainer = () => { 
    const router = useRouter();
    const [publicaciones, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPage, setTotalPage] = useState(0);

    useEffect(() => {
        // Extrae la página actual de la URL
        const pageFromUrl = parseInt(new URLSearchParams(window.location.search).get('page')) || 1;
        fetchAdoptions(pageFromUrl);
    }, []);

    const handlePageChange = async (page) => {
        router.push(`?page=${page}`, undefined, { shallow: true }); // Actualiza la URL sin recargar la página
        fetchAdoptions(page);
    };

    const changeTotalPage = (total) => {
        setTotalPage(Math.ceil(total / itemsPerPage));
    }

    const fetchAdoptions = async (page) => {
        setLoading(true);
        try {
            const {total, data} = await getAdoption(null, page);
            changeTotalPage(total);
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
            <FilterForm updateData={setPublications} updateTotalPage={changeTotalPage}/>
            <PublicationList 
                publications={publicaciones} 
            />
            <div className="mt-8 mb-12">
                <PaginationComponent
                    totalPages={totalPage}
                    initialPage={1}
                    currentPage={parseInt(new URLSearchParams(window.location.search).get('page')) || 1}
                    onPageChange={handlePageChange}
                />
            </div>
        </>
    );
};

export default AdoptionContainer;
