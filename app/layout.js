import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Expensio",
  description: "One stop finance platform",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} `}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system" // or "light"
            enableSystem={true}
          >
            {/* header */}
            <Header />

            <main className="min-h-screen">{children}</main>
            <Toaster richColors />
            {/* footer */}
            <footer className="bg-blue-50 dark:bg-black py-12">
              <div className="container mx-auto px-10 text-center text-gray-600">
                <p>Made with 💗 by Satyam Gupta</p>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
