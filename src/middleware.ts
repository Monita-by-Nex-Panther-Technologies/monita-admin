import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('access_token')?.value;
    const refreshToken = request.cookies.get('refresh_token')?.value;
  
    if (request.nextUrl.pathname.startsWith('/dashboard') && !accessToken && !refreshToken) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  
    return NextResponse.next();
  }
  