import type { Metadata } from "next";
import { Cinzel, Playfair_Display, Space_Grotesk } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Two Souls. One Galaxy. | Seraphina & Aurelius Wedding Invitation",
  description: "A cinematic space-themed wedding invitation. Journey into deep space as Seraphina and Aurelius declare their love and invite you to join their greatest voyage.",
  openGraph: {
    title: "Two Souls. One Galaxy. | Seraphina & Aurelius",
    description: "You are cordially invited to witness the union of Seraphina and Aurelius.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${playfair.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#020208] text-white">
        {children}
      </body>
    </html>
  );
}
