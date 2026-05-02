import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ConfigProvider } from "./context/ConfigContext";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Calculadora de Reformas",
  description: "Estimación instantánea para tu reforma",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ConfigProvider>{children}</ConfigProvider>
      </body>
    </html>
  );
}
