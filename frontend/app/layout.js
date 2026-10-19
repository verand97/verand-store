import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import BackgroundFX from "@/components/BackgroundFX";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const display = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

export const metadata = {
  title: "Verand Store — Top-up Game Kilat & Jasa Joki Profesional",
  description:
    "Platform top-up game instan 1-3 menit & jasa joki terpercaya Mobile Legends, Genshin Impact, dan Honkai: Star Rail. 100% Anti-Ban & Garansi Bintang.",
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
