import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "RepoSage — Find your first open source contribution",
    template: "%s · RepoSage",
  },
  description:
    "RepoSage matches you with beginner-friendly open source issues in your stack, then explains the codebase and the issue so you can actually contribute.",
  applicationName: "RepoSage",
  authors: [{ name: "RepoSage" }],
  openGraph: {
    title: "RepoSage — Find your first open source contribution",
    description:
      "From good first issue to first PR. RepoSage reads the repo for you.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RepoSage",
    description:
      "From good first issue to first PR. RepoSage reads the repo for you.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <ThemeProvider>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
