# MongoDB Database Connection Guide

## 🚀 Quick Setup

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create an account
3. Choose the **FREE** tier (M0 Sandbox)

### Step 2: Create a Cluster
1. Click "Build a Database"
2. Choose **FREE** shared cluster
3. Select a cloud provider and region (choose closest to you)
4. Click "Create Cluster"

### Step 3: Set Up Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and strong password
5. Set privileges to "Read and write to any database"
6. Click "Add User"

### Step 4: Set Up Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
   - **For production**: Add only your server's IP address
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string

### Step 6: Configure Your App
1. Create a `.env.local` file in your project root:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@your-cluster.mongodb.net/nextjs-weather?retryWrites=true&w=majority

# JWT Secret (generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-change-this-in-production

# App Configuration
NODE_ENV=development
```

2. Replace the placeholders:
   - `YOUR_USERNAME`: Your database username
   - `YOUR_PASSWORD`: Your database password
   - `your-cluster`: Your cluster name

## 🔧 Example Connection String

Your connection string should look like this:
```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/nextjs-weather?retryWrites=true&w=majority
```

## 🛡️ Security Best Practices

### For Development:
- Use the free tier for testing
- Allow access from anywhere (0.0.0.0/0)
- Use simple passwords for testing

### For Production:
- Use a paid tier for better performance
- Restrict IP access to your server only
- Use strong, unique passwords
- Enable MongoDB Atlas security features
- Use environment variables for all secrets

## 🚨 Troubleshooting

### Common Issues:

1. **Connection Timeout**
   - Check your internet connection
   - Verify IP address is whitelisted
   - Ensure cluster is running

2. **Authentication Failed**
   - Double-check username and password
   - Make sure user has correct permissions
   - Verify database name in connection string

3. **Network Access Denied**
   - Add your IP address to whitelist
   - Use 0.0.0.0/0 for development (not recommended for production)

### Test Your Connection:

Create a test file `test-db.js` in your project root:

```javascript
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

async function testConnection() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  }
}

testConnection();
```

Run it with:
```bash
node test-db.js
```

## 📊 Database Structure

Your app will automatically create these collections:

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔄 Environment Variables

Make sure your `.env.local` file is in the project root and contains:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority
JWT_SECRET=your-jwt-secret-key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
NODE_ENV=development
```

## 🚀 Next Steps

1. Create your `.env.local` file with the connection string
2. Run `npm run dev` to start your application
3. Visit `http://localhost:3000` to test the app
4. Try creating a user account to test the database connection

## 📞 Need Help?

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

