import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { ErrorBoundary } from "@/components/shared/error-boundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vortex Dashboard",
  description: "Customer Relationship Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
                    var theme = localStorage.getItem('theme') || 'dark';
                    var root = document.documentElement;
                    if (root) {
                      root.classList.remove('dark', 'light');
                      root.classList.add(theme);
                    }
                  }
                } catch (e) {
                  // Silently fail if localStorage is not available
                }
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
            storageKey="theme"
          >
            {children}
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
