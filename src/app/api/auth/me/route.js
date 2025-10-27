const { NextRequest, NextResponse } = require('next/server');

async function GET(request) {
  try {
    const userCookie = request.cookies.get('user')?.value;
    
    if (!userCookie) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      );
    }

    // Parse user data from cookie
    const user = JSON.parse(userCookie);

    return NextResponse.json({
      user: {
        id: user.id,
        _id: user._id || user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

module.exports = { GET };
