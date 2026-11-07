import type { Metadata } from 'next';
import InstitutionalHub from '@/components/root/InstitutionalHub';

export const metadata: Metadata = {
  title: 'Domino Automate | Engenharia de Sistemas, Inteligência Analítica e Automações com IA',
  description:
    'Software house e consultoria de engenharia aplicada em Brasília-DF. Desenvolvemos ecossistemas digitais, motores analíticos em Python/n8n e agentes de IA privada para 10 verticais de negócios.',
  alternates: {
    canonical: 'https://domino-automate.com.br',
  },
  openGraph: {
    title: 'Domino Automate | Engenharia de Sistemas, Automação n8n & IA Aplicada',
    description:
      'Desenvolvemos ecossistemas digitais, motores analíticos em Python/n8n e agentes de IA no WhatsApp para operações corporativas e verticais especializadas.',
    url: 'https://domino-automate.com.br',
    type: 'website',
  },
};

export default function Home() {
  return <InstitutionalHub />;
}
