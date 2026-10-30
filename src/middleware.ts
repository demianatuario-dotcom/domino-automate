import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const rawPathname = request.nextUrl.pathname;
  let decoded = rawPathname;
  try {
    decoded = decodeURIComponent(rawPathname);
  } catch {
    decoded = rawPathname;
  }

  const trimmed = decoded.replace(/\/+$/, '');
  const lower = trimmed.toLowerCase();

  // Redirect accented or lowercase /Atuária, /atuária, /atuaria to canonical /Atuaria
  if (lower === '/atuária' || (lower === '/atuaria' && trimmed !== '/Atuaria')) {
    const url = request.nextUrl.clone();
    url.pathname = '/Atuaria';
    return NextResponse.redirect(url, 308);
  }

  // Redirect accented or lowercase /Estúdios, /estúdios, /estudios to canonical /Estudios
  if (lower === '/estúdios' || (lower === '/estudios' && trimmed !== '/Estudios')) {
    const url = request.nextUrl.clone();
    url.pathname = '/Estudios';
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|Book_Lana|logo.png).*)',
  ],
};
