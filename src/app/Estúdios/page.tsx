import type { Metadata } from 'next';
import EstudiosLanding from '@/components/estudios/EstudiosLanding';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Domino Automate | Automação & Recepcionista de IA 24/7 para Estúdios de Beleza e Estética',
  description: 'Multiplique seus agendamentos no WhatsApp 24/7, reduza faltas (No-Show) com automação n8n e posicione seu Estúdio de Beleza ou Clínica de Estética com uma Landing Page de alto padrão.',
};

export default function EstudiosPage() {
  return <EstudiosLanding />;
}

