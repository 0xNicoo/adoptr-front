import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

// Asegúrate de que la ruta de tu imagen sea correcta
const customIcon = L.icon({
  iconUrl: '/images/5737612.png', // Ruta a tu imagen
  iconSize: [32, 32], // Tamaño del ícono
  iconAnchor: [16, 32], // Punto del ícono que se alineará con la ubicación del marcador
  popupAnchor: [0, -32] // Punto desde donde se abrirá el popup
});

const MapForm = ({ setLatitude, setLongitude }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null); // Referencia para el marcador
  const [map, setMap] = useState(null); // Estado para el mapa

  useEffect(() => {
    const newMap = L.map(mapRef.current).setView([-34.9011, -56.1645], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(newMap);

    // Inicializa el proveedor de búsqueda
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: 'bar',
      autoComplete: true,
      autoCompleteDelay: 250,
      resultItem: {
        render: (result) => {
          return `<div>${result.label}</div>`;
        },
      },
      // Manejar la selección de una ubicación de búsqueda
      onResult: (result) => {
        const { latitude, longitude } = result.location;
        setLatitude(latitude);
        setLongitude(longitude);

        // Mueve el mapa a la ubicación seleccionada
        newMap.setView([latitude, longitude], 15);

        // Mueve o crea el marcador
        if (markerRef.current) {
          markerRef.current.setLatLng([latitude, longitude]);
        } else {
          markerRef.current = L.marker([latitude, longitude], { icon: customIcon }).addTo(newMap);
        }
      }
    });

    // Agrega el control de búsqueda al mapa, pero mantén el input separado
    newMap.addControl(searchControl);

    newMap.on('click', (e) => {
      const { lat, lng } = e.latlng;
      setLatitude(lat);
      setLongitude(lng);

      // Si el marcador ya existe, lo movemos; si no, lo creamos
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], { icon: customIcon }).addTo(newMap);
      }
    });

    setMap(newMap); // Establece el mapa en el estado

    return () => {
      newMap.off('click'); // Elimina el evento 'click'
      newMap.remove(); // Elimina el mapa
    };
  }, [setLatitude, setLongitude]);

  return (
    <div className="relative">
      {/* Contenedor para el mapa */}
      <div ref={mapRef} className="h-96 w-full" />

      {/* Buscador sobre el mapa */}
      <div className="absolute z-10 p-2 bg-white rounded shadow-lg top-4 left-4">
        <input
          type="text"
          placeholder="Buscar ubicación..."
          className="border border-gray-300 rounded px-2 py-1 w-64"
        />
      </div>
    </div>
  );
};

export default MapForm;

