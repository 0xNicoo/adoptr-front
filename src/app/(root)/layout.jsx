// src/app/layout.jsx
import { Inter } from "next/font/google";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Adoptr",
  description: "Generated by create next app",
  icons: {
      icon: 'images/icono3.png',
  }
};

// TODO: hacer el navbar responsive (hamburger menu)
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`flex flex-col min-h-screen bg-background-gray ${inter.className}`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
