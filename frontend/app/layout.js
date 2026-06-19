import { Space_Grotesk, Syne } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import BackgroundFX from "@/components/BackgroundFX";

const sans = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata = {
  title: "Verand Store — Top-up Game & Jasa Joki",
  description:
    "Platform top-up game dan jasa joki profesional untuk Mobile Legends, Genshin Impact, dan Honkai: Star Rail.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${sans.variable} ${display.variable}`}>
      <body>
        <BackgroundFX />
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <Chatbot />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
