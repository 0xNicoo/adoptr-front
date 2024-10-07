'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FilterForm from './filterForm';
import PublicationServiceList from './publicationServiceList';
import PaginationComponent from './pagination';
import CustomLoading from '@/app/components/customLoading';
import { getServicesAction } from '@/actions/service';
import SectionService from './sectionService';


const itemsPerPage = 8;

const ServiceContainer = () => {
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

        // Obtener `serviceType_id` de la URL
        const serviceType_id = urlParams.get('serviceType_id');

        // Usa los filtros de la URL
        const currentFilters = {};
        for (const [key, value] of urlParams.entries()) {
            if (key !== 'page') {
                currentFilters[key] = value;
            }
        }
        setFilters(currentFilters); 
        fetchServices(currentFilters, pageFromUrl);
    }, []);

    const handlePageChange = async (page) => {
        const query = new URLSearchParams({ ...filters, page });
        router.push(`?${query.toString()}`, undefined, { shallow: true });
        fetchServices(filters, page);
    };

    const fetchServices = async (filters, page) => {
        setLoading(true);
        try {
            const { total, data } = await getServicesAction(filters, page, itemsPerPage);
            setTotalPage(Math.ceil(total / itemsPerPage));
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
        fetchServices(newFilters, 1);
    };

    if (loading) return (
        <div role="status" className='flex items-center justify-center h-screen'>
            <CustomLoading />
        </div>
    );
    if (error) return <p>Error: {error}</p>;

    // Pasa `serviceType_id` al componente `SectionService`
    return (
        <>
            <SectionService serviceType_id={filters.serviceType_id} /> 
            <FilterForm
                updateData={setPublications}
                updateTotalPage={setTotalPage}
                updateCurrentPage={setCurrentPage}
                updateFilters={updateFilters}
                initialFilters={filters}
            />
            <PublicationServiceList publications={publicaciones} />
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

export default ServiceContainer;
