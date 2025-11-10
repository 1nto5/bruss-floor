import '@/app/globals.css';
import { i18n } from '@/lib/config/i18n';
import { ThemeProvider } from '@/lib/providers/theme-provider';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BRUSS Floor',
  description: 'Shop Floor applications',
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <html lang={i18n.defaultLocale} suppressHydrationWarning>
      <head />

      <body className="bg-background min-h-screen font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
