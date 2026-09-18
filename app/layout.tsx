import type { Metadata } from "next"
import { Geist_Mono, Inter, Noto_Sans_Thai } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { LocaleProvider } from "@/components/i18n/locale-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toast"
import { TooltipProvider } from "@/components/ui/tooltip"
import { getDictionary } from "@/lib/i18n"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

// Inter has no Thai glyphs, so Thai copy would fall back to a system font and
// look unrelated. Noto Sans Thai sits after Inter in the stack, which means
// Latin still renders as Inter and only Thai characters come from here.
const notoThai = Noto_Sans_Thai({
  subsets: ["thai"],
  variable: "--font-thai",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Northwind Commerce",
    template: "%s · Northwind Commerce",
  },
  description:
    "Order management dashboard template built with Next.js, Tailwind v4 and shadcn/ui.",
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { locale, dict } = await getDictionary()

  return (
    <html
      lang={locale}
      // next-themes writes the theme class on <html> before paint, which the
      // server render cannot know about.
      suppressHydrationWarning
      className={cn(
        "h-full antialiased",
        inter.variable,
        notoThai.variable,
        geistMono.variable
      )}
    >
      <body className="min-h-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LocaleProvider locale={locale} dict={dict}>
            <TooltipProvider>{children}</TooltipProvider>
          </LocaleProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
