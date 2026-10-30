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

  const lower = decoded.toLowerCase().replace(/\/+$/, '');

  // Handle /Atuária, /atuária, /Atu%C3%A1ria, /atuaria -> rewrite internally to /Atuaria
  if (lower === '/atuária' || lower === '/atuaria') {
    const url = request.nextUrl.clone();
    url.pathname = '/Atuaria';
    return NextResponse.rewrite(url);
  }

  // Handle /Estúdios, /estúdios, /Est%C3%BAdios, /estudios -> rewrite internally to /Estudios
  if (lower === '/estúdios' || lower === '/estudios') {
    const url = request.nextUrl.clone();
    url.pathname = '/Estudios';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|Book_Lana|logo.png).*)',
  ],
};

