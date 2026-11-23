import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { NavTracker } from "@/components/nav/NavTracker";
import { THEME_SCRIPT } from "@/lib/theme";
import "@/app/globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MAESTRO - Dirige ton jeu",
  description:
    "Programme de foot gratuit sur 12 semaines pour les 13-14 ans : un test de profil, des séances jour par jour, des fiches d'exercices et un suivi de progression. Sans inscription.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      data-theme="dark"
      suppressHydrationWarning
      className={`${archivo.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        {/* Applique le thème enregistré avant la première peinture. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col bg-bg font-sans text-ink">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-bg"
        >
          Aller au contenu
        </a>
        <SiteHeader />
        <main id="contenu" className="flex flex-1 flex-col">
          {children}
        </main>
        <SiteFooter />
        <NavTracker />
        {/* Mesure d'audience anonyme, sans cookie (voir /confidentialite). */}
        <Analytics />
      </body>
    </html>
  );
}
