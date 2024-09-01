import { getAdoption } from '../actions';
import { useEffect, useState } from 'react';
import FilterForm from './filterForm';
import PublicationList from './publicationList';
import PaginationComponent from './pagination';

const itemsPerPage = 3;

const AdoptionContainer = () => { 
    const [publicaciones, setPublications] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
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

    const handleGetData = async () => {
        const response = await getAdoption();
        setPublications(response);
    };

    useEffect(() => {
        handleGetData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    return (
        <>
            <FilterForm updateData={setPublications} />
            <PublicationList 
                publications={currentPublications} 
            />
            <div className="mt-8 mb-12">
                <PaginationComponent
                    totalPages={Math.ceil(publicaciones.length / itemsPerPage)}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </div>
        </>
    );
};

export default AdoptionContainer;
