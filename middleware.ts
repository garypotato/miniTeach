import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  // Get the token from the request
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  // Check if user is trying to access the login page
  if (pathname === "/companion/login") {
    // If user is already authenticated, redirect them away from login page
    if (token) {
      // Check if there's a redirect URL in the search params
      const redirectUrl = searchParams.get('redirect');
      
      // If there's a redirect URL, use it; otherwise go to dashboard
      const destinationUrl = redirectUrl || '/companion/dashboard';
      
      return NextResponse.redirect(new URL(destinationUrl, request.url));
    }
  }
  
  // Allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/companion/login",
    // Add other protected routes here if needed
  ],
};