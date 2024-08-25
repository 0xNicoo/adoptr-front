"use client";

import React, { useState, useEffect } from "react";
import PaginationComponent from "./components/pagination";
import PublicationList from "./components/publicationList";
import SectionAdop from "./components/sectionadop";
import { getAdoption } from "./actions";

const itemsPerPage = 3;

export default function AdoptionPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [publications, setPublications] = useState([]);
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
  const currentPublications = publications.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div
      className="flex flex-col justify-between items-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/back.png')", 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <SectionAdop />
      <PublicationList
        publications={currentPublications}
        handlePageChange={handlePageChange}
        currentPage={currentPage}
      />
      <div className="mt-8 mb-12">
        <PaginationComponent
          totalPages={Math.ceil(publications.length / itemsPerPage)}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
