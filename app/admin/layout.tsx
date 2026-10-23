import type { Metadata, Viewport } from "next";
import "../globals.css";
import "./admin.css";
import { fontVariables } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0b0c0e",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="uz" className={fontVariables}>
      <body className="admin-shell min-h-dvh font-sans text-fg antialiased">{children}</body>
    </html>
  );
}
