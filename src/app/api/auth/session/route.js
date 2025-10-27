const { NextResponse } = require('next/server');
const connectDB = require('../../../../lib/mongodb');
const User = require('../../../../models/User');

async function POST(request) {
  try {
    await connectDB();
    
    const { userId, action, timestamp } = await request.json();
    
    if (!userId || !action || !timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (action === 'login') {
      // Store login time
      user.lastLoginTime = new Date(timestamp);
      await user.save();
      
      return NextResponse.json({ 
        success: true, 
        message: 'Login time recorded' 
      });
    }
    
    if (action === 'logout') {
      // Calculate session duration
      const loginTime = user.lastLoginTime;
      const logoutTime = new Date(timestamp);
      
      if (loginTime) {
        const sessionDuration = Math.floor((logoutTime - loginTime) / 1000); // in seconds
        const hours = Math.floor(sessionDuration / 3600);
        const minutes = Math.floor((sessionDuration % 3600) / 60);
        const seconds = sessionDuration % 60;
        
        // Store session data
        const sessionData = {
          loginTime: loginTime,
          logoutTime: logoutTime,
          duration: sessionDuration,
          formattedDuration: `${hours}h ${minutes}m ${seconds}s`
        };
        
        // Add to user's session history
        if (!user.sessionHistory) {
          user.sessionHistory = [];
        }
        user.sessionHistory.push(sessionData);
        
        // Keep only last 10 sessions
        if (user.sessionHistory.length > 10) {
          user.sessionHistory = user.sessionHistory.slice(-10);
        }
        
        // Clear login time
        user.lastLoginTime = null;
        await user.save();
        
        return NextResponse.json({ 
          success: true, 
          sessionData,
          message: 'Session logged successfully' 
        });
      }
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Session tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId).select('sessionHistory lastLoginTime');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      sessionHistory: user.sessionHistory || [],
      currentSession: user.lastLoginTime ? {
        loginTime: user.lastLoginTime,
        duration: Math.floor((new Date() - user.lastLoginTime) / 1000)
      } : null
    });
    
  } catch (error) {
    console.error('Session retrieval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

module.exports = { POST, GET };

