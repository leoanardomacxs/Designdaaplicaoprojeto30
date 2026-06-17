//Ele prepara o terreno do HTML
import "./globals.css";

export const metadata = {
  title: "CuidaMais",
  description: "Monitoramento diário da saúde do paciente",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}