import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "./print.css";
import { AuthProvider } from "@/components/AuthProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "PYRIZE - Profesyonel Emlak Sunumları",
  description: "Emlak danışmanları için AI destekli funnel sayfaları oluşturun",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <body className={`${poppins.variable} font-sans antialiased`} suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
