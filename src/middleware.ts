import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CANONICAL_ROUTES, resolveCanonicalRedirect } from './lib/canonicalRoutes.ts';

export { CANONICAL_ROUTES, resolveCanonicalRedirect };

export function middleware(request: NextRequest) {
  const targetCanonical = resolveCanonicalRedirect(request.nextUrl.pathname);

  if (targetCanonical) {
    const url = request.nextUrl.clone();
    url.pathname = targetCanonical;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|Book_Lana|logo.png|robots.txt|sitemap.xml).*)',
  ],
};
