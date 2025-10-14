# Next.js Leaflet Map App

A full-stack Next.js application with authentication, built with JavaScript, Tailwind CSS, and MongoDB.

## 🚀 Quick Start

### 1. Create Environment File
Create a `.env.local` file in the root directory with the following content:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/nextjs-weather?retryWrites=true&w=majority

# JWT Secret (generate a strong secret for production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-change-this-in-production

# App Configuration
NODE_ENV=development
```

### 2. Set up MongoDB
- Create a MongoDB Atlas account at [mongodb.com](https://www.mongodb.com/atlas)
- Create a new cluster
- Get your connection string and replace the placeholders in `.env.local`
- Make sure to whitelist your IP address in MongoDB Atlas

### 3. Run the Application
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 PowerShell Execution Policy Fix

If you encounter the PowerShell execution policy error, run this command:

```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

## Features

- 🔐 **Secure Authentication** - JWT-based authentication with bcrypt password hashing
- 📱 **Responsive Design** - Mobile-first design with Tailwind CSS
- 🎨 **Modern UI** - Beautiful, accessible user interface
- 🛡️ **Security** - HTTP-only cookies, input validation, and CSRF protection
- 🚀 **Performance** - Optimized with Next.js 15 and App Router
- 🗺️ **Interactive Maps** - Leaflet-based maps with location tracking and markers

## Pages

- **Home** (`/`) - Landing page with signup/login options
- **Login** (`/login`) - User authentication
- **Signup** (`/signup`) - User registration
- **Dashboard** (`/dashboard`) - Protected user dashboard

## API Endpoints

- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/login` - Sign in to existing account
- `POST /api/auth/logout` - Sign out
- `GET /api/auth/me` - Get current user information