import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import TRPCProvider from "@/components/providers/trpc-provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DesignFolio | Curated Designer Portfolios",
  description: "The premium platform for designers to showcase work and clients to hire excellence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* <ClerkProvider> */
      <html lang="en" className="h-full">
        <body className={`${inter.className} min-h-full flex flex-col antialiased`}>
          <TRPCProvider>
            {children}
            <Toaster />
          </TRPCProvider>
        </body>
      </html>
    /* </ClerkProvider> */
  );
}
