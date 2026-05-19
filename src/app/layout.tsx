import type { Metadata } from "next";
import { Poppins, Fredoka } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

// Menggunakan Fredoka (versi modern dari Fredoka_One)
const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Quiz Anak SD - Belajar Menyenangkan!",
    template: "%s | Quiz Anak SD",
  },
  description:
    "Platform belajar interaktif untuk anak SD. Pelajari Matematika, Bahasa Indonesia, IPA, IPS dan lebih banyak lagi dengan quiz seru dan menyenangkan!",
  keywords: ["quiz anak sd", "belajar online", "edukasi anak", "quiz interaktif"],
  authors: [{ name: "Quiz Anak SD Team" }],
  openGraph: {
    title: "Quiz Anak SD - Belajar Menyenangkan!",
    description: "Platform belajar interaktif untuk anak SD",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${poppins.variable} ${fredoka.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}