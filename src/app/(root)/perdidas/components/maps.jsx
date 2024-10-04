"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Aquí defines las coordenadas de tus mascotas (ejemplo)
const pets = [
  { id: 1, name: 'Fido', position: [-34.6037, -58.3816] }, // Buenos Aires
  { id: 2, name: 'Luna', position: [-34.9285, -57.9619] }, // Córdoba
];

const MapComponent = () => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Solo se ejecuta en el cliente
    if (typeof window !== 'undefined') {
      // Crea un icono de huella
      L.Icon.Default.mergeOptions({
        iconUrl: '/images/cat-big.png', // Asegúrate de que la ruta sea correcta
        shadowUrl: null,
        iconSize: [30, 30], // Tamaño del icono
        iconAnchor: [15, 30], // Punto del icono que se alinea con el marcador
        popupAnchor: [0, -30], // Punto del popup que se alinea con el marcador
      });
    }
  }, []);

  return (
    <div className="map-container">
      {/* Centro en Buenos Aires, Argentina */}
      <MapContainer center={[-34.6037, -58.3816]} zoom={5} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Marcadores para cada mascota */}
        {pets.map((pet) => (
          <Marker key={pet.id} position={pet.position}>
            <Popup>{pet.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;

