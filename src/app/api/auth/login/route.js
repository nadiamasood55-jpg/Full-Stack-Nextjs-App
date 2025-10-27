const { NextRequest, NextResponse } = require('next/server');
const connectDB = require('../../../../lib/mongodb');
const User = require('../../../../models/User');
const { generateToken } = require('../../../../lib/auth');

async function POST(request) {
  try {
    const { email, phoneNumber, password } = await request.json();

    // Validation - either email or phone number is required
    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    if (!email && !phoneNumber) {
      return NextResponse.json(
        { error: 'Either email or phone number is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user by email or phone number and include password for comparison
    let user;
    if (email) {
      user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    } else {
      user = await User.findOne({ phoneNumber: phoneNumber.trim() }).select('+password');
    }
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create response with simple session
    const response = NextResponse.json(
      {
        message: 'Login successful',
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
      _id: user._id.toString(),
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
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

module.exports = { POST };
