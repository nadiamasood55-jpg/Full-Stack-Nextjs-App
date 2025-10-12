const { NextRequest, NextResponse } = require('next/server');

function middleware(request) {
  // Simple middleware - just allow all access for now
  // We'll handle authentication in the dashboard component itself
  return NextResponse.next();
}

const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/login',
    '/signup',
  ],
};

module.exports = { middleware, config };
