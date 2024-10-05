"use client"; 

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const MapPreview = ({ latitude, longitude }) => {
    useEffect(() => {
        const pawIcon = new L.Icon({
            iconUrl: "/images/iconMap.png",
            iconSize: [50, 50],
            iconAnchor: [25, 50],
            popupAnchor: [0, -50],
        });

        // Usar el icono personalizado para todos los marcadores
        L.Marker.prototype.options.icon = pawIcon; 
    }, []);

    return (
        <div className="w-full h-64 md:h-96 lg:h-[400px]"> 
            <MapContainer 
                center={[latitude, longitude]} 
                zoom={20} 
                style={{ height: '100%', width: '100%' }} 
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[latitude, longitude]}>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default MapPreview;
