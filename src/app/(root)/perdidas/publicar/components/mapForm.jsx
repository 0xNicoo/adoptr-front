'use client'

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@nextui-org/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const customIcon = L.icon({
  iconUrl: '/images/5737612.png', 
  iconSize: [32, 32], 
  iconAnchor: [16, 32], 
  popupAnchor: [0, -32] 
});

const MapForm = ({ setLatitude, setLongitude, latitude, longitude }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [searchTriggered, setSearchTriggered] = useState(false); 

  useEffect(() => {
    const newMap = L.map(mapRef.current).setView([-34.9011, -56.1645], 15); 

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(newMap);

    // Obtener ubicación del usuario
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;

        newMap.setView([userLat, userLon], 15); 

        setLatitude(userLat); 
        setLongitude(userLon); 
      },
      (error) => {
        console.error("Error al obtener la ubicación del usuario:", error);
        alert("No se pudo obtener la ubicación del usuario. Asegúrate de que los permisos de geolocalización están habilitados.");
      }
    );

    // Evento de click en el mapa
    newMap.on('click', (e) => {
      const { lat, lng } = e.latlng;
      setLatitude(lat);
      setLongitude(lng);

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], { icon: customIcon }).addTo(newMap);
      }
      setSearchTriggered(false); // Resetear la búsqueda al marcar
    });

    setMap(newMap);

    return () => {
      newMap.off('click');
      newMap.remove();
    };
  }, [setLatitude, setLongitude]);

  // Este efecto escucha los cambios en latitude y longitude y actualiza el marcador
  useEffect(() => {
    if (markerRef.current && latitude && longitude && !searchTriggered) {
      markerRef.current.setLatLng([latitude, longitude]);
      map.setView([latitude, longitude], 15); // Centra el mapa en la nueva ubicación
    }
  }, [latitude, longitude, map, searchTriggered]);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json&limit=1`
      );

      if (!response.ok) throw new Error('Error al buscar la ubicación');

      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];

        if (map) {
          map.setView([parseFloat(lat), parseFloat(lon)], 15);
        }
        setSearchTriggered(true); 
      } else {
        alert("No se encontró la ubicación.");
      }
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      alert("Hubo un error al buscar la ubicación. Intenta nuevamente.");
    }
  };

  return (
    <div className='mx-2'>
      <form onSubmit={handleSearch} className="flex items-center mb-4 xs:flex-col sm:flex-row" aria-label="Buscar ubicación">
        <input
          type="text"
          placeholder="Buscar zona"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-xl p-2 flex-grow xs:w-full sm:w-auto focus:outline-none"
          aria-label="Zona de búsqueda"
        />
        <Button
          type="submit"
          className="bg-primary-blue text-white xs:w-full sm:w-auto xs:mt-2 sm:mt-0 px-4 py-2 rounded-xl hover:bg-blue-600 transition-all"
          aria-label="Buscar"
        >
          Buscar
        </Button>
      </form>

      <div ref={mapRef} className="h-64 w-full sm:h-80 md:h-96 lg:h-[500px]"></div>
    </div>
  );
};

export default MapForm;

