'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import MapWrapper from '../../components/MapWrapper';

function DashboardPage() {
  const [user, setUser] = useState({
    name: 'Guest User',
    email: 'guest@example.com',
    phoneNumber: null
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Try to get user data if available, but don't require it
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
        }
        // If no session, just use guest user data (already set above)
      } catch (error) {
        // If error, just use guest user data (already set above)
        console.log('No user session found, using guest mode');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      // Reset to guest user after logout
      setUser({
        name: 'Guest User',
        email: 'guest@example.com',
        phoneNumber: null
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Weather Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.name}
              </span>
              {user?.email === 'guest@example.com' ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => router.push('/login')}
                >
                  Login
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {user?.email === 'guest@example.com' ? 'Welcome to the Dashboard!' : `Welcome back, ${user?.name}!`}
            </h2>
            <p className="text-gray-600">
              {user?.email === 'guest@example.com' 
                ? 'Explore the interactive map below. Login to access additional features.'
                : 'Here\'s your dashboard with interactive maps'
              }
            </p>
          </div>

          {/* Map Section */}
          <div className="mb-8">
            <Card>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                🗺️ Interactive Map
              </h3>
              <p className="text-gray-600 mb-4">
                Your location will be automatically detected and shown on the map.
              </p>
              <MapWrapper />
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ⚡ Quick Actions
              </h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  View Profile
                </Button>
                <Button variant="outline" className="w-full">
                  Settings
                </Button>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                📊 Dashboard Info
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Interactive map with location tracking
                </p>
                <p className="text-sm text-gray-600">
                  Real-time user position detection
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
