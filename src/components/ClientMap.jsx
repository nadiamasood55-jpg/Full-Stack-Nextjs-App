'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

function LocationTracker() {
  const [userPosition, setUserPosition] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const map = useMap();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = [position.coords.latitude, position.coords.longitude];
          setUserPosition(userPos);
          map.flyTo(userPos, 13);
          setLocationError(null);
        },
        (error) => {
          console.log('Error getting location:', error);
          setLocationError(error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
    }
  }, [map]);

  return userPosition ? (
    <Marker position={userPosition}>
      <Popup>
        <div className="text-center p-2">
          <h3 className="font-bold text-lg text-blue-600">📍 Your Location</h3>
          <p className="text-sm text-gray-600">Current position</p>
        </div>
      </Popup>
    </Marker>
  ) : locationError ? (
    <div className="absolute top-4 left-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-[1000]">
      <strong>Location Error:</strong> {locationError}
    </div>
  ) : (
    <div className="absolute top-4 left-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded z-[1000]">
      <strong>Requesting location...</strong> Please allow location access.
    </div>
  );
}

function ClientMap() {
  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg border-2 border-gray-200">
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User location marker */}
        <LocationTracker />
        
        {/* Sample marker */}
        <Marker position={[51.505, -0.09]}>
          <Popup>
            <div className="text-center">
              <h3 className="font-semibold text-lg">Welcome!</h3>
              <p className="text-sm text-gray-600 mt-1">
                This is a sample location marker.
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default ClientMap;




