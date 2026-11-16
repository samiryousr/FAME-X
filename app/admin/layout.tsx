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
  return (
    <div className="relative z-20 min-h-screen bg-[#f7f7f2]">
      <AuthProvider>{children}</AuthProvider>
    </div>
  );
}
