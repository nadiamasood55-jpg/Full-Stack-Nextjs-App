const { NextRequest, NextResponse } = require('next/server');
const connectDB = require('../../../../lib/mongodb');
const User = require('../../../../models/User');
const { generateToken } = require('../../../../lib/auth');

async function POST(request) {
  try {
    const { name, email, phoneNumber, password } = await request.json();

    // Validation - either email or phone number is required
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Password is required only for email signup
    if (email && !password) {
      return NextResponse.json(
        { error: 'Password is required for email signup' },
        { status: 400 }
      );
    }

    if (!email && !phoneNumber) {
      return NextResponse.json(
        { error: 'Either email or phone number is required' },
        { status: 400 }
      );
    }

    if (password && password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Email validation (if provided)
    if (email) {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Please enter a valid email address' },
          { status: 400 }
        );
      }
    }

    // Phone number validation (if provided)
    if (phoneNumber) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(phoneNumber)) {
        return NextResponse.json(
          { error: 'Please enter a valid phone number' },
          { status: 400 }
        );
      }
    }

    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        ...(email ? [{ email: email.toLowerCase().trim() }] : []),
        ...(phoneNumber ? [{ phoneNumber: phoneNumber.trim() }] : [])
      ]
    });

    if (existingUser) {
      if (existingUser.email === email?.toLowerCase().trim()) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        );
      }
      if (existingUser.phoneNumber === phoneNumber?.trim()) {
        return NextResponse.json(
          { error: 'User with this phone number already exists' },
          { status: 400 }
        );
      }
    }

    // Create new user
    const userData = {
      name: name.trim(),
    };

    if (email) {
      userData.email = email.toLowerCase().trim();
      userData.password = password;
    }
    if (phoneNumber) {
      userData.phoneNumber = phoneNumber.trim();
    }

    const user = new User(userData);
    await user.save();

    // Create response
    const response = NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
        },
      },
      { status: 201 }
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
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

module.exports = { POST };
