export const CANONICAL_ROUTES: Record<string, string> = {
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

export function resolveCanonicalRedirect(rawPathname: string): string | null {
  let decoded = rawPathname;
  try {
    decoded = decodeURIComponent(rawPathname);
  } catch {
    decoded = rawPathname;
  }

  const trimmed = decoded.replace(/\/+$/, '');
  if (!trimmed || trimmed === '') {
    return null;
  }

  const lower = trimmed.toLowerCase();
  const targetCanonical = CANONICAL_ROUTES[lower];

  if (targetCanonical && trimmed !== targetCanonical) {
    return targetCanonical;
  }

  return null;
}

