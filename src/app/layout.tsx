// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pikme (Pty) Ltd",
  description: "Driver onboarding and document submission portal for Pikme (Pty) Ltd.",
  icons: {
    icon: "/pikmelogo.jpg",
    shortcut: "/pikmelogo.jpg",
    apple: "/pikmelogo.jpg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-transparent backdrop-blur-sm">
          <div className="mx-auto flex h-16 max-w-6xl items-center px-4">
            <a href="/" aria-label="Pikme (Pty) Ltd">
              <img src="/pikmelogo.jpg" alt="Pikme (Pty) Ltd logo" className="h-14 w-auto" height={56} />
            </a>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}