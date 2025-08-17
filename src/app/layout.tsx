import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import { AuthProvider } from "@/components/auth-provider";
import { Web3Provider } from "@/components/web3-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HackathonHub - Connect, Create, Compete",
  description: "The ultimate platform for hackathons. Join global challenges, showcase your projects, and win amazing prizes.",
  keywords: ["hackathon", "coding", "competition", "innovation", "technology", "Web3", "AI"],
  authors: [{ name: "HackathonHub Team" }],
  openGraph: {
    title: "HackathonHub",
    description: "The ultimate platform for hackathons and innovation challenges",
    url: "https://hackathonhub.com",
    siteName: "HackathonHub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HackathonHub",
    description: "The ultimate platform for hackathons and innovation challenges",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Web3Provider>
            <AuthProvider>
              <div className="min-h-screen bg-background">
                <Navbar />
                <main>
                  {children}
                </main>
              </div>
              <Toaster />
            </AuthProvider>
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
