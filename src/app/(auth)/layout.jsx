
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function AuthLayout({ children }) {
  return (
    <html lang="en">
      <body className={`flex flex-col min-h-screen ${inter.className}`}>
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
