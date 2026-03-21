'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { generatePassword, type PasswordOptions } from '@/lib/password-generator'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Copy } from 'lucide-react'

const DEFAULT_OPTIONS: PasswordOptions = {
  length: 16,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
}

export function PasswordGeneratorTool() {
  const t = useTranslations('passwordGenerator.tool')
  const [options, setOptions] = useState<PasswordOptions>(DEFAULT_OPTIONS)
  const [password, setPassword] = useState('')
  useEffect(() => { setPassword(generatePassword(DEFAULT_OPTIONS)) }, [])

  const handleRegenerate = () => {
    setPassword(generatePassword(options))
  }

  const handleLengthChange = (length: number) => {
    const nextOptions = { ...options, length }
    setOptions(nextOptions)
    setPassword(generatePassword(nextOptions))
  }

  const handleToggle = (key: keyof Omit<PasswordOptions, 'length'>) => {
    const nextOptions = { ...options, [key]: !options[key] }
    setOptions(nextOptions)
    setPassword(generatePassword(nextOptions))
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(password)
    toast(t('copyToast'))
  }

  const charCount = password.length

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--color-navy)] dark:text-zinc-100">
        {t('title')}
      </h1>
      <p className="text-[15px] text-zinc-700 dark:text-zinc-300 mt-1">
        {t('description')}
      </p>

      <Card className="mt-4 p-4 border-[var(--color-border-brand)]">
        {/* Password output */}
        <div className="p-4 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-[var(--color-border-brand)] font-mono text-lg text-zinc-800 dark:text-zinc-200 select-all break-all min-h-[64px] flex items-center">
          {password}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-[13px] text-zinc-400" aria-live="polite">
            {t('charCount', { n: charCount })}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label={t('copyAria')}
              onClick={handleCopy}
            >
              <Copy />
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-4 space-y-4">
          {/* Length slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                {t('lengthLabel')}
              </label>
              <span className="text-sm font-mono text-zinc-600 dark:text-zinc-400 w-8 text-right">
                {options.length}
              </span>
            </div>
            <input
              type="range"
              min={8}
              max={64}
              value={options.length}
              onChange={e => handleLengthChange(Number(e.target.value))}
              className="w-full accent-[var(--color-navy)]"
              aria-label={t('lengthLabel')}
            />
          </div>

          {/* Toggle checkboxes */}
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ['uppercase', t('uppercaseLabel')],
                ['lowercase', t('lowercaseLabel')],
                ['numbers', t('numbersLabel')],
                ['symbols', t('symbolsLabel')],
              ] as [keyof Omit<PasswordOptions, 'length'>, string][]
            ).map(([key, label]) => (
              <label
                key={key}
                className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={options[key]}
                  onChange={() => handleToggle(key)}
                  className="accent-[var(--color-navy)] w-4 h-4"
                />
                {label}
              </label>
            ))}
          </div>

          {/* Regenerate button */}
          <Button
            onClick={handleRegenerate}
            aria-label={t('regenerateAria')}
            className="w-full bg-[var(--color-navy)] hover:bg-[#243460] text-white"
          >
            {t('regenerateBtn')}
          </Button>
        </div>
      </Card>
    </div>
  )
}
