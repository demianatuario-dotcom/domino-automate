import type { Metadata } from 'next';
import SegmentLandingTemplate from '@/components/segments/SegmentLandingTemplate';
import { SEGMENTS_CONFIG } from '@/config/segmentsConfig';

const cfg = SEGMENTS_CONFIG.varejo;

export const metadata: Metadata = {
  title: cfg.metaTitle,
  description: cfg.metaDescription,
  alternates: { canonical: `https://domino-automate.com.br${cfg.slug}` },
  openGraph: {
    title: cfg.metaTitle,
    description: cfg.metaDescription,
    url: `https://domino-automate.com.br${cfg.slug}`,
    siteName: 'Domino Automate',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/logo.png',
        width: 1024,
        height: 538,
        alt: cfg.metaTitle,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: cfg.metaTitle,
    description: cfg.metaDescription,
  },
};

export default function VarejoPage() {
  return <SegmentLandingTemplate config={cfg} />;
}
