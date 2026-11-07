import type { Metadata } from 'next';
import SegmentLandingTemplate from '@/components/segments/SegmentLandingTemplate';
import { SEGMENTS_CONFIG } from '@/config/segmentsConfig';

const cfg = SEGMENTS_CONFIG.advocacia;

export const metadata: Metadata = {
  title: cfg.metaTitle,
  description: cfg.metaDescription,
  alternates: { canonical: `https://domino-automate.com.br${cfg.slug}` },
  openGraph: {
    title: cfg.metaTitle,
    description: cfg.metaDescription,
    url: `https://domino-automate.com.br${cfg.slug}`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: cfg.metaTitle,
    description: cfg.metaDescription,
  },
};

export default function AdvocaciaPage() {
  return <SegmentLandingTemplate config={cfg} />;
}
