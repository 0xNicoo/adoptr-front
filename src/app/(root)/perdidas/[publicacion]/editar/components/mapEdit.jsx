"use client";

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapEdit = ({ latitude, longitude, onLocationChange }) => {
    const [position, setPosition] = useState([latitude, longitude]);

    useEffect(() => {
        setPosition([latitude, longitude]);
    }, [latitude, longitude]);

    const handleMarkerDrag = (event) => {
        const { lat, lng } = event.target.getLatLng();
        setPosition([lat, lng]);
        onLocationChange(lat, lng); // Llama a la función para actualizar latitud y longitud en el componente padre
    };

    const handleMapClick = (event) => {
        const { lat, lng } = event.latlng; // Obtiene la latitud y longitud del clic
        setPosition([lat, lng]);
        onLocationChange(lat, lng); // Actualiza la latitud y longitud en el componente padre
    };

    return (
        <div className="w-full h-48 md:h-72 lg:h-96">
            <MapContainer
                center={position}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                whenCreated={(map) => {
                    map.on('click', handleMapClick); // Agregar el evento de clic al mapa
                }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker 
                    position={position} 
                    draggable={true} // Hacer el marcador arrastrable
                    eventHandlers={{ // Manejar el evento de arrastre
                        dragend: handleMarkerDrag
                    }}
                >
                    <Popup>
                        Aquí está la ubicación de la mascota perdida.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default MapEdit;
