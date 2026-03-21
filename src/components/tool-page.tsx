'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { transformText, CASE_MODES, type CaseMode } from '@/lib/case-transforms'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { Label } from '@/components/ui/label'
import { Copy, Trash2, Download } from 'lucide-react'

export function ToolPage() {
  const t = useTranslations('tool')
  const [inputText, setInputText] = useState('')
  const [activeMode, setActiveMode] = useState<CaseMode>('sentence')

  const output = transformText(inputText, activeMode)
  const charCount = output.length
  const wordCount = output.trim() ? output.trim().split(/\s+/).length : 0
  const lineCount = output ? output.split('\n').length : 0

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    toast(t('copyToast'))
  }

  const handleClear = () => setInputText('')

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'converted-text.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleTabKeyDown = (e: React.KeyboardEvent) => {
    const currentIndex = CASE_MODES.findIndex(m => m.id === activeMode)
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      const next = (currentIndex + 1) % CASE_MODES.length
      setActiveMode(CASE_MODES[next].id)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const prev = (currentIndex - 1 + CASE_MODES.length) % CASE_MODES.length
      setActiveMode(CASE_MODES[prev].id)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--color-navy)] dark:text-zinc-100">
        {t('title')}
      </h1>
      <p className="text-[15px] text-zinc-700 dark:text-zinc-300 mt-1">
        {t('description')}
      </p>

      <Card className="mt-4 p-4 border-[var(--color-border-brand)]">
        <Label htmlFor="text-input" className="sr-only">
          {t('textareaLabel')}
        </Label>
        <Textarea
          id="text-input"
          value={output}
          onChange={e => setInputText(e.target.value)}
          placeholder={t('placeholder')}
          className="min-h-[160px] resize-y font-mono text-[15px] border-[var(--color-border-brand)]"
          aria-label={t('textareaLabel')}
        />

        {/* Toolbar */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-[13px] text-zinc-400" aria-live="polite">
            {t('charCount', { n: charCount })}
            {' · '}
            {t('wordCount', { n: wordCount })}
            {' · '}
            {t('lineCount', { n: lineCount })}
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
            <Button
              variant="ghost"
              size="icon"
              aria-label={t('downloadAria')}
              onClick={handleDownload}
            >
              <Download />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t('clearAria')}
              onClick={handleClear}
            >
              <Trash2 />
            </Button>
          </div>
        </div>

        {/* Case mode tabs */}
        <div
          className="mt-3"
          style={{
            overflowX: 'auto',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
          } as React.CSSProperties}
        >
          <div
            className="flex gap-2"
            style={{ paddingBottom: 4 }}
            role="tablist"
            onKeyDown={handleTabKeyDown}
          >
            {CASE_MODES.map(mode => (
              <button
                key={mode.id}
                role="tab"
                aria-selected={activeMode === mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={
                  activeMode === mode.id
                    ? 'inline-flex items-center gap-2 px-3 py-1.5 rounded-[4px] text-sm font-medium whitespace-nowrap min-h-[44px] transition-colors duration-150 bg-[var(--color-navy)] text-white'
                    : 'inline-flex items-center gap-2 px-3 py-1.5 rounded-[4px] text-sm whitespace-nowrap min-h-[44px] transition-colors duration-150 bg-white dark:bg-zinc-800 border border-[var(--color-border-brand)] dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:border-[var(--color-navy)] hover:text-[var(--color-navy)] dark:hover:border-zinc-400 dark:hover:text-white'
                }
              >
                <Badge
                  style={{ backgroundColor: mode.color }}
                  className="text-white text-xs w-6 h-6 justify-center p-0 border-transparent"
                >
                  {mode.abbr}
                </Badge>
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
