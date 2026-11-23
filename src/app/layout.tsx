import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { NavTracker } from "@/components/nav/NavTracker";
import { SiteAnalytics } from "@/components/SiteAnalytics";
import { THEME_SCRIPT } from "@/lib/theme";
import "@/app/globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

// Police des chiffres et petites étiquettes : pas préchargée, pour laisser
// la bande passante du premier écran à Archivo et à la photo principale (LCP).
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  preload: false,
});

const TITLE = "MAESTRO - Dirige ton jeu";
const DESCRIPTION =
  "Programme de foot gratuit sur 12 semaines pour les 13-14 ans : un test de profil, des séances jour par jour, des fiches d’exercices et un suivi de progression. Sans inscription.";

// Aperçu des liens partagés (WhatsApp, Snapchat...) : image dans
// src/app/opengraph-image.jpg, adresses absolues depuis la prod.
export const metadata: Metadata = {
  metadataBase: new URL("https://maestro-nine-chi.vercel.app"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "MAESTRO",
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
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
        <SiteAnalytics />
      </body>
    </html>
  );
}
