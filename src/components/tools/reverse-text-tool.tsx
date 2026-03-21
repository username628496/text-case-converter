'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { reverseText } from '@/lib/reverse-text'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Copy, Trash2 } from 'lucide-react'

export function ReverseTextTool() {
  const t = useTranslations('reverseText.tool')
  const [inputText, setInputText] = useState('')

  const output = reverseText(inputText)
  const charCount = output.length
  const wordCount = output.trim() ? output.trim().split(/\s+/).length : 0

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    toast(t('copyToast'))
  }

  const handleClear = () => setInputText('')

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-[var(--color-navy)] dark:text-zinc-100">
        {t('title')}
      </h1>
      <p className="text-[15px] text-zinc-700 dark:text-zinc-300 mt-1">
        {t('description')}
      </p>

      <Card className="mt-4 p-4 w-full border-[var(--color-border-brand)]">
        <Textarea
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder={t('placeholder')}
          className="min-h-[120px] resize-y font-mono text-[15px] border-[var(--color-border-brand)]"
          aria-label={t('textareaLabel')}
        />

        <div className="mt-3 p-3 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-[var(--color-border-brand)] min-h-[80px] font-mono text-[15px] text-zinc-800 dark:text-zinc-200 select-all break-all">
          {output || <span className="text-zinc-400 dark:text-zinc-500 font-sans">&nbsp;</span>}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-[13px] text-zinc-400" aria-live="polite">
            {t('charCount', { n: charCount })}
            {' · '}
            {t('wordCount', { n: wordCount })}
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
              aria-label={t('clearAria')}
              onClick={handleClear}
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
