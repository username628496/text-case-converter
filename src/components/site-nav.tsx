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
    sidebarTools: string
  }
  toolGroups: Array<{
    label: string
    tools: Array<{ name: string; href: string; slug: string }>
  }>
}

export function SiteNav({ locale, siteName, translations, toolGroups }: SiteNavProps) {
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
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              borderRadius: 4,
              backgroundColor: '#1a2744',
              color: 'white',
              fontSize: 11,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            Tt
          </span>
          {siteName}
        </a>

        {/* Desktop nav */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {/* Text Tools */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>{translations.textTools}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="p-2 w-52">
                  {(toolGroups[0]?.tools ?? []).map((tool) => (
                    <li key={tool.slug}>
                      <a
                        href={tool.href}
                        className="block px-3 py-2 rounded-[4px] text-[14px] text-zinc-700 dark:text-zinc-300 hover:bg-[#e8f5f2] dark:hover:bg-zinc-800 hover:text-[#1a2744] transition-colors"
                      >
                        {tool.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Code & Data */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>{translations.codeData}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="p-2 w-52">
                  {(toolGroups[1]?.tools ?? []).map((tool) => (
                    <li key={tool.slug}>
                      <a
                        href={tool.href}
                        className="block px-3 py-2 rounded-[4px] text-[14px] text-zinc-700 dark:text-zinc-300 hover:bg-[#e8f5f2] dark:hover:bg-zinc-800 hover:text-[#1a2744] transition-colors"
                      >
                        {tool.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Font Styles — coming soon */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="opacity-50 cursor-not-allowed">{translations.fontStyles}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="p-2 w-52">
                  <li className="px-3 py-2 text-[13px] text-zinc-400 italic">Coming soon</li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Random Generators */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>{translations.randomGenerators}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="p-2 w-52">
                  {(toolGroups[2]?.tools ?? []).map((tool) => (
                    <li key={tool.slug}>
                      <a
                        href={tool.href}
                        className="block px-3 py-2 rounded-[4px] text-[14px] text-zinc-700 dark:text-zinc-300 hover:bg-[#e8f5f2] dark:hover:bg-zinc-800 hover:text-[#1a2744] transition-colors"
                      >
                        {tool.name}
                      </a>
                    </li>
                  ))}
                </ul>
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
                {toolGroups.map((group) => (
                  <div key={group.label}>
                    <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      {group.label}
                    </h3>
                    <ul className="mt-2 space-y-1">
                      {group.tools.map((tool) => (
                        <li key={tool.slug}>
                          <a
                            href={tool.href}
                            className="block px-2 py-1.5 rounded-[4px] text-sm text-zinc-700 dark:text-zinc-300 hover:bg-[var(--color-mint)] dark:hover:bg-zinc-800 hover:text-[var(--color-navy)]"
                          >
                            {tool.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
