"use client";

import PublicationDetail from './components/publicaciondetalle';
import { useParams } from 'next/navigation';

export default function DetailPage() {
  const { publicacion } = useParams(); 

  console.log(publicacion); 

  return (
    <PublicationDetail serviceId={publicacion} />
  );
}
