// Simple auth utilities - no JWT tokens needed
// We're using simple session cookies instead

function getUserFromCookies(request) {
  const userCookie = request.cookies.get('user')?.value;
  if (userCookie) {
    try {
      return JSON.parse(userCookie);
    } catch (error) {
      return null;
    }
  }
  return null;
}

module.exports = {
  getUserFromCookies
};
