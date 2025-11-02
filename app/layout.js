import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import {NavBar} from "@/app/components/navbar/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata = {
  title: "Opala Filmes",
  description: "Lugar onde opaleiros podem votar sobre filmes em paz",
  keywords: ["filmes", "opala", "votação", "cinema", "comunidade"],
  authors: [{ name: "Opala Filmes Team" }],
  creator: "Opala Filmes",
  publisher: "Opala Filmes",
  robots: "index, follow",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" }
    ],
    other: [
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
    ]
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://opala-filmes.vercel.app/",
    title: "Opala Filmes",
    description: "Lugar onde opaleiros podem votar sobre filmes em paz",
    siteName: "Opala Filmes",
    images: [{
      url: "/opala-filmes.png",
      width: 1200,
      height: 630,
      alt: "Opala Filmes Preview"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Opala Filmes",
    description: "Lugar onde opaleiros podem votar sobre filmes em paz",
    images: ["/opala-filmes.png"]
  },
  metadataBase: new URL("https://opala-filmes.vercel.app/"),
};

export { viewport } from './viewport'

import NextAuthProvider from "@/app/components/NextAuthProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} antialiased`}
      >
      <NextAuthProvider>
        {children}
      </NextAuthProvider>
      </body>
    </html>
  );
}
