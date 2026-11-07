import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CANONICAL_ROUTES: Record<string, string> = {
  '/atuaria': '/Atuaria',
  '/atuária': '/Atuaria',
  '/estudios': '/Estudios',
  '/estúdios': '/Estudios',
  '/saloes': '/Saloes',
  '/salões': '/Saloes',
  '/salao': '/Saloes',
  '/salão': '/Saloes',
  '/barbearias': '/Barbearias',
  '/barbearia': '/Barbearias',
  '/advocacia': '/Advocacia',
  '/advogados': '/Advocacia',
  '/contabilidade': '/Contabilidade',
  '/contabil': '/Contabilidade',
  '/contábil': '/Contabilidade',
  '/farmacias': '/Farmacias',
  '/farmácias': '/Farmacias',
  '/farmacia': '/Farmacias',
  '/farmácia': '/Farmacias',
  '/oticas': '/Oticas',
  '/óticas': '/Oticas',
  '/otica': '/Oticas',
  '/ótica': '/Oticas',
  '/odontologia': '/Odontologia',
  '/odonto': '/Odontologia',
  '/dentistas': '/Odontologia',
  '/varejo': '/Varejo',
  '/lojas': '/Varejo',
  '/comercio': '/Varejo',
  '/comércio': '/Varejo',
};

export function middleware(request: NextRequest) {
  const rawPathname = request.nextUrl.pathname;
  let decoded = rawPathname;
  try {
    decoded = decodeURIComponent(rawPathname);
  } catch {
    decoded = rawPathname;
  }

  const trimmed = decoded.replace(/\/+$/, '');
  if (!trimmed || trimmed === '') {
    return NextResponse.next();
  }

  const lower = trimmed.toLowerCase();
  const targetCanonical = CANONICAL_ROUTES[lower];

  if (targetCanonical && trimmed !== targetCanonical) {
    const url = request.nextUrl.clone();
    url.pathname = targetCanonical;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|Book_Lana|logo.png).*)',
  ],
};
