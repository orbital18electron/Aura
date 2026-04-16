import { Teko, Rajdhani, Yatra_One } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import LayoutShell from "@/components/LayoutShell";

const teko = Teko({ subsets: ["latin"], variable: "--font-display", display: "swap", weight: ["300", "400", "500", "600", "700"] });
const rajdhani = Rajdhani({ subsets: ["latin"], variable: "--font-body", display: "swap", weight: ["300", "400", "500", "600", "700"] });
const yatraOne = Yatra_One({ subsets: ["latin"], variable: "--font-accent", display: "swap", weight: "400" });

export const metadata = {
  title: "Aura — ऑरा",
  description: "A retro-maximalist music streaming experience inspired by 70s-80s Indian aesthetics.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${teko.variable} ${rajdhani.variable} ${yatraOne.variable} ${rajdhani.className}`}>
        <Providers>
          <LayoutShell>
            {children}
          </LayoutShell>
        </Providers>
      </body>
    </html>
  );
}
