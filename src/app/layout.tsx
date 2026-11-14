import type { Metadata } from "next";
import { Sarabun, Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Production Area Inspection Checklist",
  description:
    "แบบฟอร์มกรอกข้อมูลตรวจพื้นที่ผลิต — Pass / Fail / N/A พร้อมส่งออก Excel",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${sora.variable} ${sarabun.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
