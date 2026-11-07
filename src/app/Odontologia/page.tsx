import type { Metadata } from "next";
import SegmentLandingTemplate from "@/components/segments/SegmentLandingTemplate";
import { SEGMENTS_CONFIG } from "@/config/segmentsConfig";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: SEGMENTS_CONFIG.odontologia.metaTitle,
  description: SEGMENTS_CONFIG.odontologia.metaDescription,
  openGraph: {
    title: SEGMENTS_CONFIG.odontologia.metaTitle,
    description: SEGMENTS_CONFIG.odontologia.metaDescription,
    type: "website",
    locale: "pt_BR",
  },
};

export default function OdontologiaPage() {
  return <SegmentLandingTemplate config={SEGMENTS_CONFIG.odontologia} />;
}
