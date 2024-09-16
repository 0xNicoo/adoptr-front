'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAdoption } from '../actions';
import FilterForm from './filterForm';
import PublicationList from './publicationList';
import PaginationComponent from './pagination';
import CustomLoading from '@/app/components/customLoading';


const itemsPerPage = 8;

const AdoptionContainer = () => {
    const router = useRouter();
    const [publicaciones, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({}); // Almacena filtros

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const pageFromUrl = parseInt(urlParams.get('page')) || 1;

        // Usa los filtros de la URL
        const currentFilters = {};
        for (const [key, value] of urlParams.entries()) {
            if (key !== 'page') {
                currentFilters[key] = value;
            }
        }
        setFilters(currentFilters); 
        fetchAdoptions(currentFilters, pageFromUrl);
    }, []);

    const handlePageChange = async (page) => {
        // Mantiene los filtros en la URL al cambiar de página
        const query = new URLSearchParams({ ...filters, page });
        router.push(`?${query.toString()}`, undefined, { shallow: true });
        fetchAdoptions(filters, page);
    };

    const changeTotalPage = (total) => {
        setTotalPage(Math.ceil(total / itemsPerPage));
    };

    const fetchAdoptions = async (filters, page) => {
        setLoading(true);
        try {
            const { total, data } = await getAdoption(filters, page);
            changeTotalPage(total);
            setPublications(data);
            setCurrentPage(page);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const updateFilters = (newFilters) => {
        setFilters(newFilters);
        const query = new URLSearchParams({ ...newFilters, page: 1 });
        router.push(`?${query.toString()}`, undefined, { shallow: true });
        fetchAdoptions(newFilters, 1);
    };

    if (loading) return (

    <div role="status" className='flex items-center justify-center h-screen'>
        <CustomLoading />
    </div>
    );
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <FilterForm
                updateData={setPublications}
                updateTotalPage={changeTotalPage}
                updateCurrentPage={setCurrentPage}
                updateFilters={updateFilters} 
                initialFilters={filters} 
            />
            <PublicationList publications={publicaciones} />
            <div className="mt-8 mb-12">
                <PaginationComponent
                    totalPages={totalPage}
                    initialPage={1}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </div>
        </>
    );
};

export default AdoptionContainer;
