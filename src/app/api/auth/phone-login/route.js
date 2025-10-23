const { NextRequest, NextResponse } = require('next/server');
const connectDB = require('../../../../lib/mongodb');
const User = require('../../../../models/User');

async function POST(request) {
  try {
    const { phoneNumber, firebaseUid } = await request.json();

    // Validation
    if (!phoneNumber || !firebaseUid) {
      return NextResponse.json(
        { error: 'Phone number and Firebase UID are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user by phone number
    let user = await User.findOne({ phoneNumber: phoneNumber.trim() });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        name: `User ${phoneNumber.slice(-4)}`, // Default name with last 4 digits
        phoneNumber: phoneNumber.trim(),
        firebaseUid: firebaseUid,
      });
    } else {
      // Update existing user with Firebase UID
      user.firebaseUid = firebaseUid;
      await user.save();
    }

    // Create response
    const response = NextResponse.json(
      {
        message: 'Phone login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
        },
      },
      { status: 200 }
    );

    // Set simple session cookie
    response.cookies.set('user', JSON.stringify({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Phone login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

module.exports = { POST };

