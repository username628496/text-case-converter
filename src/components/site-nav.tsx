'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun, Menu } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from '@/components/ui/navigation-menu'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface SiteNavProps {
  locale: string
  siteName: string
  translations: {
    textTools: string
    codeData: string
    fontStyles: string
    randomGenerators: string
    toggleDark: string
    switchLocale: string
    menu: string
  }
}

export function SiteNav({ locale, siteName, translations }: SiteNavProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const logoHref = locale === 'en' ? '/' : '/vi/'

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-zinc-950 border-b border-[var(--color-border-brand)]">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <a
          href={logoHref}
          className="flex items-center gap-2 text-[var(--color-navy)] dark:text-zinc-100 font-bold text-lg"
        >
          {siteName}
        </a>

        {/* Desktop nav */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>{translations.textTools}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="p-3 w-48" />
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>{translations.codeData}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="p-3 w-48" />
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>{translations.fontStyles}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="p-3 w-48" />
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>{translations.randomGenerators}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="p-3 w-48" />
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            aria-label={translations.toggleDark}
          >
            {mounted ? (
              resolvedTheme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Locale switcher dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-sm" aria-label={translations.switchLocale}>
                {locale === 'en' ? '🇺🇸 EN' : '🇻🇳 VI'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <a
                  href="/"
                  className={locale === 'en' ? 'font-bold text-[var(--color-navy)]' : ''}
                >
                  🇺🇸 English
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href="/vi/"
                  className={locale === 'vi' ? 'font-bold text-[var(--color-navy)]' : ''}
                >
                  🇻🇳 Tiếng Việt
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile hamburger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label={translations.menu}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle>{siteName}</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 space-y-6">
                <div>
                  <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    {translations.textTools}
                  </h3>
                  <p className="text-sm text-zinc-500 mt-2 italic">Coming soon</p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    {translations.codeData}
                  </h3>
                  <p className="text-sm text-zinc-500 mt-2 italic">Coming soon</p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    {translations.fontStyles}
                  </h3>
                  <p className="text-sm text-zinc-500 mt-2 italic">Coming soon</p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    {translations.randomGenerators}
                  </h3>
                  <p className="text-sm text-zinc-500 mt-2 italic">Coming soon</p>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
