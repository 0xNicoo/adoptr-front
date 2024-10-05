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
    });

    setMap(newMap);

    return () => {
      newMap.off('click');
      newMap.remove();
    };
  }, [setLatitude, setLongitude]);

  // Este efecto escucha los cambios en latitude y longitude y actualiza el marcador
  useEffect(() => {
    if (markerRef.current && latitude && longitude) {
      markerRef.current.setLatLng([latitude, longitude]);
      map.setView([latitude, longitude], 15); // Centra el mapa en la nueva ubicación
    }
  }, [latitude, longitude, map]);

  return <div ref={mapRef} className="h-64 w-full sm:h-80 md:h-96 lg:h-[500px]"></div>;
};

export default MapForm;

