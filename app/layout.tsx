import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Repo-Sage",
  description: "Advanced Repository Analytics & Onboarding Platform",
  icons: {
    icon: "/fevicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-screen`}>
        <ThemeProvider defaultTheme="system" storageKey="repo-sage-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}