"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation"; 
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getLostsAction } from "@/actions/lost";

// Componente para mover el mapa a una posición específica
const MoveMapToLocation = ({ position }) => {
  const map = useMap(); 
  useEffect(() => {
    if (position) {
      map.setView(position, 15); // Mueve el mapa a la ubicación del usuario
    }
  }, [position, map]);

  return null; 
};

const MapComponent = () => {
  const [lostPets, setLostPets] = useState([]); 
  const [userLocation, setUserLocation] = useState(null); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const [searchLocation, setSearchLocation] = useState(null);
  const router = useRouter(); 
  const mapRef = useRef(); 

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Crea un icono de huella
      L.Icon.Default.mergeOptions({
        iconUrl: "/images/cat-big.png",
        shadowUrl: null,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      });

      // Obtener la ubicación del usuario
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation([latitude, longitude]); // Actualiza la ubicación del usuario
          },
          (error) => {
            console.error("Error al obtener la ubicación del usuario:", error);
            setUserLocation([-34.6037, -58.3816]); // Buenos Aires como fallback
          }
        );
      } else {
        setUserLocation([-34.6037, -58.3816]); // Fallback si no se admite la geolocalización
      }
    }

    // Obtener mascotas perdidas
    const fetchLostPets = async () => {
      try {
        const response = await getLostsAction({}, 1, 10);
        setLostPets(response.data);
      } catch (error) {
        console.error("Error al obtener las mascotas perdidas:", error);
      }
    };

    fetchLostPets();
  }, []);

  // Función para buscar una ubicación en Nominatim
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
        setSearchLocation([parseFloat(lat), parseFloat(lon)]); // Actualiza la ubicación de búsqueda
      } else {
        alert("No se encontró la ubicación.");
      }
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      alert("Hubo un error al buscar la ubicación.");
    }
  };

  const handleMarkerClick = (id) => {
    router.push(`/perdidas/${id}`);
  };

  if (!userLocation) {
    return <div>Cargando mapa...</div>;
  }

  return (
    <div className="map-container w-full h-full p-4">
      {/* Formulario de búsqueda */}
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

      <MapContainer
        center={userLocation}
        zoom={15}
        style={{ height: "700px", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MoveMapToLocation position={searchLocation || userLocation} />

        {/* Marcadores para cada mascota perdida */}
        {lostPets.map((pet) => (
          <Marker
            key={pet.id}
            position={[pet.latitude, pet.longitude]}
            eventHandlers={{
              click: () => handleMarkerClick(pet.id),
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;

