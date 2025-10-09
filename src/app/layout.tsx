// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pikme (Pty) Ltd",
  description: "Driver onboarding and document submission portal for Pikme (Pty) Ltd.",
  icons: { icon: "/pikme-logo.png", shortcut: "/pikme-logo.png", apple: "/pikme-logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-6xl items-center px-4">
            <a href="/" aria-label="Pikme (Pty) Ltd">
              <img src="/pikme-logo.png" alt="Pikme (Pty) Ltd logo" className="h-9 w-auto" height={36} />
            </a>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
