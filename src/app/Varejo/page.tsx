import type { Metadata } from "next";
import SegmentLandingTemplate from "@/components/segments/SegmentLandingTemplate";
import { SEGMENTS_CONFIG } from "@/config/segmentsConfig";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: SEGMENTS_CONFIG.varejo.metaTitle,
  description: SEGMENTS_CONFIG.varejo.metaDescription,
  openGraph: {
    title: SEGMENTS_CONFIG.varejo.metaTitle,
    description: SEGMENTS_CONFIG.varejo.metaDescription,
    type: "website",
    locale: "pt_BR",
  },
};

export default function VarejoPage() {
  return <SegmentLandingTemplate config={SEGMENTS_CONFIG.varejo} />;
}
