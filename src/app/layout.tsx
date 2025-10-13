// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pikme (Pty) Ltd",
  description: "Driver onboarding and document submission portal for Pikme (Pty) Ltd.",
  icons: {
    icon: "/1000041292%20(2).jpg",
    shortcut: "/1000041292%20(2).jpg",
    apple: "/1000041292%20(2).jpg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-6xl items-center px-4">
            <a href="/" aria-label="Pikme (Pty) Ltd">
              <img src="/1000041292%20(2).jpg" alt="Pikme (Pty) Ltd logo" className="h-9 w-auto" height={36} />
            </a>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}