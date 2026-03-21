'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { base64Encode, base64Decode } from '@/lib/base64'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Copy, Trash2 } from 'lucide-react'

type Mode = 'encode' | 'decode'

export function Base64Tool() {
  const t = useTranslations('base64.tool')
  const [inputText, setInputText] = useState('')
  const [mode, setMode] = useState<Mode>('encode')

  const decodeResult = mode === 'decode' ? base64Decode(inputText) : null
  const output =
    mode === 'encode'
      ? base64Encode(inputText)
      : decodeResult && !decodeResult.error
        ? decodeResult.result
        : ''
  const hasError = mode === 'decode' && inputText !== '' && decodeResult?.error === true
  const charCount = output.length

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
        {/* Mode tabs */}
        <div className="flex gap-2 mb-3" role="tablist">
          {(['encode', 'decode'] as Mode[]).map(m => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={
                mode === m
                  ? 'px-4 py-1.5 rounded-[4px] text-sm font-medium transition-colors bg-[var(--color-navy)] text-white'
                  : 'px-4 py-1.5 rounded-[4px] text-sm transition-colors bg-white dark:bg-zinc-800 border border-[var(--color-border-brand)] dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-[var(--color-navy)] hover:text-[var(--color-navy)]'
              }
            >
              {m === 'encode' ? t('encodeTab') : t('decodeTab')}
            </button>
          ))}
        </div>

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

        {hasError && (
          <p className="mt-1 text-xs text-red-500 dark:text-red-400" role="alert">
            {t('invalidBase64')}
          </p>
        )}

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
