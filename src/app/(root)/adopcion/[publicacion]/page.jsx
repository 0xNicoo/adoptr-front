"use client";

import PublicationDetail from './components/publicaciondetalle';
import { useParams } from 'next/navigation';

export default function DetailPage() {
  const { publicacion } = useParams(); // Aquí accedemos al parámetro de la ruta

  console.log(publicacion); // Imprime el parámetro de la ruta

  return (
    <PublicationDetail adoptionId={publicacion} />
  );
}
