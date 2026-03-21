import { getTranslations } from 'next-intl/server'

interface FooterProps {
  locale: string
}

export async function Footer({ locale }: FooterProps) {
  const tFooter = await getTranslations({ locale, namespace: 'footer' })
  const year = new Date().getFullYear()

  return (
    <footer className="mt-12 border-t border-[var(--color-border-brand)] bg-white dark:bg-zinc-950 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 3-column desktop, single-column mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Column 1: Copyright */}
          <div>
            <p className="font-semibold text-[var(--color-navy)] dark:text-zinc-100 text-sm">
              {tFooter('copyright', { year })}
            </p>
          </div>
          {/* Column 2: Tagline */}
          <div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {tFooter('tagline')}
            </p>
          </div>
          {/* Column 3: Placeholder links */}
          <div>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-[var(--color-navy)] dark:text-zinc-300 hover:underline">
                  {tFooter('privacyPolicy')}
                </a>
              </li>
              <li>
                <a href="#" className="text-[var(--color-navy)] dark:text-zinc-300 hover:underline">
                  {tFooter('termsOfService')}
                </a>
              </li>
              <li>
                <a href="#" className="text-[var(--color-navy)] dark:text-zinc-300 hover:underline">
                  {tFooter('sitemap')}
                </a>
              </li>
              <li>
                <a href="#" className="text-[var(--color-navy)] dark:text-zinc-300 hover:underline">
                  {tFooter('contact')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="border-t border-[var(--color-border-brand)] dark:border-zinc-800 pt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {tFooter('madeWith')}
        </div>
      </div>
    </footer>
  )
}
