import type { Metadata } from 'next';
import EstudiosLanding from '@/components/estudios/EstudiosLanding';

export const metadata: Metadata = {
  title: 'Automação de WhatsApp, IA e Landing Pages para Estúdios de Beleza & Estética',
  description:
    'Recepcionista de IA 24/7 no WhatsApp, blindagem anti no-show via n8n, lembretes de manutenção e sites de alto padrão para estúdios de cílios, sobrancelhas e clínicas de estética.',
  alternates: {
    canonical: 'https://domino-automate.com.br/Estudios',
  },
  openGraph: {
    title: 'Domino Automate | Automação IA & WhatsApp para Estúdios de Beleza',
    description:
      'Recepcionista de IA 24/7 no WhatsApp, blindagem anti no-show via n8n e Landing Pages de alto padrão para estúdios de beleza e estética.',
    url: 'https://domino-automate.com.br/Estudios',
    siteName: 'Domino Automate',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1024,
        height: 538,
        alt: 'Domino Automate | Estúdios de Beleza & Estética',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Domino Automate | Automação IA & WhatsApp para Estúdios de Beleza',
    description:
      'Recepcionista de IA 24/7 no WhatsApp, blindagem anti no-show via n8n e Landing Pages de alto padrão.',
  },
};

export default function EstudiosPage() {
  return <EstudiosLanding />;
}
