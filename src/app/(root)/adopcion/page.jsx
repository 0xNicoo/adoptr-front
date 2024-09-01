"use client";

import React, { useState, useEffect } from "react";
import AdoptionContainter from "./components/adoptionContainer";
import PublicationList from "./components/publicationList";
import SectionAdop from "./components/sectionadop";
import { getAdoption } from "./actions";
import FilterForm from "./components/filterForm";



export default function AdoptionPage() {

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
      <AdoptionContainter />
    </div>
  );
}
