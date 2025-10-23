# Firebase Phone Authentication Setup Guide

## 🔥 Firebase Project Setup

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name (e.g., "nextjs-weather-app")
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Phone Authentication
1. In your Firebase project, go to **Authentication**
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Enable **Phone** provider
5. Add your domain to authorized domains:
   - `localhost` (for development)
   - Your production domain (when deploying)

### Step 3: Get Firebase Configuration
1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click **Web app** icon (`</>`)
4. Register your app with a nickname
5. Copy the Firebase configuration object

### Step 4: Update Environment Variables
Replace the placeholder values in your `.env.local` file:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-actual-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-actual-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-actual-app-id
```

### Step 5: Configure reCAPTCHA (Important!)
1. In Firebase Console, go to **Authentication** > **Settings**
2. Scroll down to **Authorized domains**
3. Add `localhost` for development
4. Add your production domain when deploying

## 📱 How Phone Authentication Works

### User Flow:
1. **User enters phone number** on login page
2. **Firebase sends SMS** with verification code
3. **User enters verification code**
4. **System verifies code** with Firebase
5. **User is logged in** and redirected to dashboard

### Features Implemented:
- ✅ **SMS Verification**: Real SMS codes sent to phone numbers
- ✅ **reCAPTCHA Protection**: Prevents spam and abuse
- ✅ **Auto User Creation**: Creates user account if doesn't exist
- ✅ **Session Management**: Maintains login session
- ✅ **Resend Code**: Users can request new codes
- ✅ **Countdown Timer**: Shows when user can resend code

## 🚀 Testing

### Test Phone Numbers (Development):
Firebase provides test phone numbers for development:
- **US**: `+1 650-555-3434` (verification code: `123456`)
- **UK**: `+44 20 7946 0958` (verification code: `123456`)

### Production:
- Real phone numbers will receive actual SMS codes
- Users must enter the real verification code

## 🔧 Troubleshooting

### Common Issues:

1. **"reCAPTCHA not available"**
   - Make sure you're on localhost or authorized domain
   - Check if reCAPTCHA is properly configured in Firebase

2. **"Invalid phone number"**
   - Use international format: `+1234567890`
   - Make sure phone number is valid

3. **"SMS not received"**
   - Check if phone number is correct
   - Try test phone numbers for development
   - Check Firebase quotas and billing

4. **"Firebase config not found"**
   - Make sure all environment variables are set
   - Restart development server after updating `.env.local`

## 📋 Next Steps

1. **Set up Firebase project** following the steps above
2. **Update environment variables** with your Firebase config
3. **Test with development phone numbers**
4. **Deploy and test with real phone numbers**

## 🔒 Security Notes

- **Never commit** `.env.local` to version control
- **Use HTTPS** in production
- **Configure authorized domains** properly
- **Monitor Firebase usage** and set up billing alerts
- **Use Firebase Security Rules** for database protection

