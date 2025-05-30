import type { Metadata } from "next";
import "../styles/globals.css";
import { ThemeProvider } from "@/provider/theme-provider";
import { inter } from "@/utils/fonts";
import Header from "@/components/Header";
import ToggleTheme from "@/components/toggle-theme";

export const metadata: Metadata = {
  title: "BookKeeper",
  description: "Библиотека (учёт книг и читателей)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased min-h-screen dark:bg-neutral-900`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="px-3 max-w-screen-2xl mx-auto py-5">{children}</main>
          <ToggleTheme />
        </ThemeProvider>
      </body>
    </html>
  );
}
