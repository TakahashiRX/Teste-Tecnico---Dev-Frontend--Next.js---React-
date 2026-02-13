import type { Metadata } from "next";
import { Providers } from "@/app/providers";
import "./globals.css"; // Manteremos isso para as diretivas do Tailwind

export const metadata: Metadata = {
  title: "NEO - Chamados",
  description: "Plataforma de gerenciamento de chamados da Estech",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
