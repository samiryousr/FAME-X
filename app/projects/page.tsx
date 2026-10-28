import type { Metadata } from "next";
import AllProjects from "@/components/AllProjects";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "مشاريع FameX | معرض الأعمال",
  description: "استكشف مشاريع FameX ومعاينات مواقعنا وتجاربنا الرقمية.",
};

export default function AllProjectsPage() {
  return (
    <>
      <AllProjects />
      <Footer homeHref="/" />
    </>
  );
}
