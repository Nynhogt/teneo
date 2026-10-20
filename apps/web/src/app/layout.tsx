import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TENEO | Gestão para construção e meio ambiente",
  description:
    "Uma plataforma para organizar empresas, obras e operações em um só lugar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
