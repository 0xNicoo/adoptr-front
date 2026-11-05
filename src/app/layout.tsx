import type { Metadata } from "next";
import { Geist, Lilita_One } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/navbar/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const lilitaOne = Lilita_One({
  variable: "--font-lilita-one",
  weight: "400",
  subsets: ["latin"],
});

const gentyDemo = localFont({
  src: "../fonts/GentyDemo-Regular.ttf",
  variable: "--font-genty-demo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Adoptr",
  description: "Pagina para adopcion de mascotas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${lilitaOne.variable} ${gentyDemo.variable}`}>
      <head>
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        ></script>
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        </body>
    </html>
  );
}
