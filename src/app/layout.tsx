import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agente Virtual",
  description: "Interfaz Next.js para agentes Dify con texto y LiveAvatar."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col">
        <SiteHeader />
        <div className="flex flex-1 flex-col">{children}</div>
        <footer className="mx-auto w-full max-w-7xl px-5 pb-5 pt-2 text-center text-sm text-slate-500 sm:px-8">
          Curso PF-3311 - Agentes Virtuales Inteligentes
        </footer>
      </body>
    </html>
  );
}
