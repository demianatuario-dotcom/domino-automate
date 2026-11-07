import type { Metadata } from "next";
import SegmentLandingTemplate from "@/components/segments/SegmentLandingTemplate";
import { SEGMENTS_CONFIG } from "@/config/segmentsConfig";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: SEGMENTS_CONFIG.saloes.metaTitle,
  description: SEGMENTS_CONFIG.saloes.metaDescription,
  openGraph: {
    title: SEGMENTS_CONFIG.saloes.metaTitle,
    description: SEGMENTS_CONFIG.saloes.metaDescription,
    type: "website",
    locale: "pt_BR",
  },
};

export default function SaloesPage() {
  return <SegmentLandingTemplate config={SEGMENTS_CONFIG.saloes} />;
}
