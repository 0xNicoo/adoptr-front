import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const customIcon = L.icon({
  iconUrl: '/images/5737612.png', // Ruta a tu imagen
  iconSize: [32, 32], // Tamaño del ícono
  iconAnchor: [16, 32], // Punto del ícono que se alineará con la ubicación del marcador
  popupAnchor: [0, -32] // Punto desde donde se abrirá el popup
});

const MapForm = ({ setLatitude, setLongitude, latitude, longitude }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Para el input de búsqueda
  const [searchTriggered, setSearchTriggered] = useState(false); // Estado para manejar la búsqueda

  useEffect(() => {
    const newMap = L.map(mapRef.current).setView([latitude || -34.9011, longitude || -56.1645], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(newMap);

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
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];

        if (map) {
          // Asegurarse de mover el mapa, pero no el marcador
          map.setView([parseFloat(lat), parseFloat(lon)], 15);
        }
        setSearchTriggered(true); // Indicar que la búsqueda fue exitosa
      } else {
        alert("No se encontró la ubicación.");
      }
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      alert("Hubo un error al buscar la ubicación.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Buscar zona"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-l-md p-2 flex-grow focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition-all"
        >
          Buscar
        </button>
      </form>

      <div ref={mapRef} className="h-64 w-full sm:h-80 md:h-96 lg:h-[500px]"></div>
    </div>
  );
};

export default MapForm;

