import type { Metadata } from "next";
import { AuthProvider } from "@/components/AdminAuthProvider";

export const metadata: Metadata = {
  title: "لوحة التحكم | FameX Admin",
  description: "إدارة مشاريع ومحتوى منصة FameX",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
