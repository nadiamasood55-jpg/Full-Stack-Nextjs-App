'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Create a completely client-side only map component
const ClientOnlyMap = dynamic(() => import('./ClientMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-200">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading map...</p>
      </div>
    </div>
  )
});

function MapWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return <ClientOnlyMap />;
}

export default MapWrapper;




