import type { Metadata } from "next";
import SegmentLandingTemplate from "@/components/segments/SegmentLandingTemplate";
import { SEGMENTS_CONFIG } from "@/config/segmentsConfig";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: SEGMENTS_CONFIG.farmacias.metaTitle,
  description: SEGMENTS_CONFIG.farmacias.metaDescription,
  openGraph: {
    title: SEGMENTS_CONFIG.farmacias.metaTitle,
    description: SEGMENTS_CONFIG.farmacias.metaDescription,
    type: "website",
    locale: "pt_BR",
  },
};

export default function FarmaciasPage() {
  return <SegmentLandingTemplate config={SEGMENTS_CONFIG.farmacias} />;
}
