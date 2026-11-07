import type { Metadata } from "next";
import SegmentLandingTemplate from "@/components/segments/SegmentLandingTemplate";
import { SEGMENTS_CONFIG } from "@/config/segmentsConfig";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: SEGMENTS_CONFIG.barbearias.metaTitle,
  description: SEGMENTS_CONFIG.barbearias.metaDescription,
  openGraph: {
    title: SEGMENTS_CONFIG.barbearias.metaTitle,
    description: SEGMENTS_CONFIG.barbearias.metaDescription,
    type: "website",
    locale: "pt_BR",
  },
};

export default function BarbeariasPage() {
  return <SegmentLandingTemplate config={SEGMENTS_CONFIG.barbearias} />;
}
