"use client"; 

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapPreview = ({ latitude, longitude }) => {
    return (
        <div className="w-full h-48 md:h-72 lg:h-96"> {/* Contenedor con altura responsive */}
            <MapContainer 
                center={[latitude, longitude]} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }} // Mapa ocupa todo el contenedor
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[latitude, longitude]}>
                    <Popup>
                        Aquí está la ubicación de la mascota perdida.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default MapPreview;

