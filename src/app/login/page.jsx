'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import PhoneVerification from '../../components/PhoneVerification';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (loginMethod === 'email') {
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    } else {
      if (!formData.phoneNumber) {
        newErrors.phoneNumber = 'Phone number is required';
      } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Please enter a valid phone number';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (loginMethod === 'phone') {
        // For phone login, show verification component
        setShowPhoneVerification(true);
        return;
      }

      // For email login, use traditional method
      const loginData = {
        email: formData.email,
        password: formData.password,
      };

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to dashboard after successful login
        router.push('/dashboard');
      } else {
        setErrors({ general: data.error || 'Login failed' });
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneVerificationSuccess = async (firebaseUser) => {
    try {
      // Create or update user in your database
      const response = await fetch('/api/auth/phone-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
          firebaseUid: firebaseUser.uid,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to dashboard after successful phone verification
        router.push('/dashboard');
      } else {
        setErrors({ general: data.error || 'Phone verification failed' });
        setShowPhoneVerification(false);
      }
    } catch (error) {
      setErrors({ general: 'An error occurred during phone verification.' });
      setShowPhoneVerification(false);
    }
  };

  const handleBackToLogin = () => {
    setShowPhoneVerification(false);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link
              href="/signup"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              create a new account
            </Link>
          </p>
        </div>

        {showPhoneVerification ? (
          <PhoneVerification
            phoneNumber={formData.phoneNumber}
            onVerificationSuccess={handlePhoneVerificationSuccess}
            onBack={handleBackToLogin}
          />
        ) : (
          <Card className="mt-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {errors.general}
              </div>
            )}

            {/* Login Method Toggle */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('email');
                  setErrors({});
                  setFormData(prev => ({ ...prev, phoneNumber: '' }));
                }}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  loginMethod === 'email'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                📧 Email
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('phone');
                  setErrors({});
                  setFormData(prev => ({ ...prev, email: '' }));
                }}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  loginMethod === 'phone'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                📱 Phone
              </button>
            </div>

            {loginMethod === 'email' ? (
              <Input
                label="Email address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="Enter your email"
              />
            ) : (
              <Input
                label="Phone number"
                name="phoneNumber"
                type="tel"
                autoComplete="tel"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                error={errors.phoneNumber}
                placeholder="Enter your phone number"
              />
            )}

            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Enter your password"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
            </form>
          </Card>
        )}

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              href="/signup"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
