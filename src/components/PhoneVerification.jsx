'use client';

import React, { useState, useEffect } from 'react';
import { signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth, initializeRecaptcha } from '../lib/firebase';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';

function PhoneVerification({ phoneNumber, onVerificationSuccess, onBack }) {
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (phoneNumber && !codeSent) {
      sendVerificationCode();
    }
  }, [phoneNumber]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const sendVerificationCode = async () => {
    try {
      setLoading(true);
      setError('');

      // Initialize reCAPTCHA
      const recaptchaVerifier = initializeRecaptcha('recaptcha-container');
      
      if (!recaptchaVerifier) {
        throw new Error('reCAPTCHA not available');
      }

      // Send verification code
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      setVerificationId(confirmationResult.verificationId);
      setCodeSent(true);
      setCountdown(60); // 60 seconds countdown
      
      // Clear reCAPTCHA
      recaptchaVerifier.clear();
    } catch (error) {
      console.error('Error sending verification code:', error);
      setError(error.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    try {
      setLoading(true);
      setError('');

      if (!verificationCode || verificationCode.length !== 6) {
        setError('Please enter a valid 6-digit verification code');
        return;
      }

      // Create credential with verification ID and code
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      
      // Sign in with the credential
      const result = await signInWithCredential(auth, credential);
      
      // Call success callback with user data
      onVerificationSuccess(result.user);
    } catch (error) {
      console.error('Error verifying code:', error);
      setError(error.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (countdown > 0) return;
    await sendVerificationCode();
  };

  return (
    <Card>
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            📱 Phone Verification
          </h3>
          <p className="text-sm text-gray-600">
            We sent a verification code to <strong>{phoneNumber}</strong>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {codeSent ? (
          <>
            <Input
              label="Verification Code"
              name="verificationCode"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
            />

            <Button
              onClick={verifyCode}
              loading={loading}
              disabled={loading || verificationCode.length !== 6}
              className="w-full"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{' '}
                <button
                  onClick={resendCode}
                  disabled={countdown > 0}
                  className={`font-medium ${
                    countdown > 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-blue-600 hover:text-blue-500'
                  }`}
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                </button>
              </p>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Sending verification code...</p>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={onBack}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            ← Back to login
          </button>
        </div>

        {/* reCAPTCHA container */}
        <div id="recaptcha-container"></div>
      </div>
    </Card>
  );
}

export default PhoneVerification;
