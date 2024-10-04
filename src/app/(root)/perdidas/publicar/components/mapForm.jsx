import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

  useEffect(() => {
    const map = L.map(mapRef.current).setView([-34.9011, -56.1645], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      
      setLatitude(lat);
      setLongitude(lng);
      console.log(lat)  
      // Si el marcador ya existe, lo movemos; si no, lo creamos
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], { icon: customIcon }).addTo(map);
      }
    });

    return () => {
      map.off('click'); // Elimina el evento 'click'
      map.remove(); // Elimina el mapa
    };
  }, [setLatitude, setLongitude]);

  return (
    <div ref={mapRef} style={{ height: '400px', width: '100%' }} />
  );
};

export default MapForm;
