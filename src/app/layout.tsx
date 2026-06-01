import type { Metadata } from "next";
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
      <body>{children}</body>
    </html>
  );
}
