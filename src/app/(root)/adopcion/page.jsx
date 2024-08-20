"use client";

import React, { useState } from "react";
import PaginationComponent from "./components/Pagination";
import PublicationList from "./components/PublicationList";
import SectionAdop from "./components/SectionAdop";

const publications = [
  { id: 1, name: "Pepito", age: "1 Año", sexo:"macho", image: "https://via.placeholder.com/300" },
  { id: 2, name: "Juanito", age: "2 Años", sexo:"macho", image: "https://via.placeholder.com/300" },
  { id: 3, name: "Luna", age: "3 Años", sexo:"hembra", image: "https://via.placeholder.com/300" },
  { id: 4, name: "Mina", age: "4 Años", sexo:"hembra", image: "https://via.placeholder.com/300" },
  { id: 5, name: "Nickito", age: "5 Años", sexo:"macho", image: "https://via.placeholder.com/300" },
  { id: 6, name: "Cachi", age: "6 Años", sexo:"macho", image: "https://via.placeholder.com/300" },
  { id: 7, name: "Sebas", age: "7 Años", sexo:"macho", image: "https://via.placeholder.com/300" },
  { id: 8, name: "Die", age: "8 Años", sexo:"macho", image: "https://via.placeholder.com/300" },
];

const itemsPerPage = 6;

export default function AdoptionPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPublications = publications.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
