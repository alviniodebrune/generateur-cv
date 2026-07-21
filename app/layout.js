import "./globals.css";

export const metadata = {
  title: "Générateur de CV",
  description: "Crée ton CV professionnel en PDF en quelques minutes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="font-body">{children}</body>
    </html>
  );
}
