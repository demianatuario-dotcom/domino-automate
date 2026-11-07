import type { Metadata } from "next";
import SegmentLandingTemplate from "@/components/segments/SegmentLandingTemplate";
import { SEGMENTS_CONFIG } from "@/config/segmentsConfig";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: SEGMENTS_CONFIG.oticas.metaTitle,
  description: SEGMENTS_CONFIG.oticas.metaDescription,
  openGraph: {
    title: SEGMENTS_CONFIG.oticas.metaTitle,
    description: SEGMENTS_CONFIG.oticas.metaDescription,
    type: "website",
    locale: "pt_BR",
  },
};

export default function OticasPage() {
  return <SegmentLandingTemplate config={SEGMENTS_CONFIG.oticas} />;
}
