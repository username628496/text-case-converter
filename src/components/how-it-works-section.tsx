import { CASE_MODES } from '@/lib/case-transforms'
import { Badge } from '@/components/ui/badge'

interface ModeContent {
  name: string
  description: string
  before: string
  after: string
}

interface HowItWorksSectionProps {
  heading: string
  subheading: string
  modes: Record<string, ModeContent>
}

export function HowItWorksSection({ heading, subheading, modes }: HowItWorksSectionProps) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-[var(--color-navy)] dark:text-zinc-200 mb-1">
        {heading}
      </h2>
      <p className="text-[15px] text-zinc-500 dark:text-zinc-400 mb-6">
        {subheading}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CASE_MODES.map((mode) => {
          const content = modes[mode.id]
          if (!content) return null
          return (
            <div
              key={mode.id}
              className="rounded-[6px] p-4 bg-[#f0faf8] dark:bg-[#1a2f28] border border-[var(--color-border-brand)]"
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  style={{ backgroundColor: mode.color }}
                  className="text-white text-xs w-6 h-6 justify-center p-0 border-transparent"
                >
                  {mode.abbr}
                </Badge>
                <span className="text-[15px] font-medium text-[var(--color-navy)] dark:text-zinc-100">
                  {content.name}
                </span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                {content.description}
              </p>
              <div className="font-mono text-[13px] bg-white dark:bg-zinc-900 rounded-[4px] p-2 border border-zinc-200 dark:border-zinc-700">
                <div className="text-zinc-400">{content.before}</div>
                <div className="text-[var(--color-navy)] dark:text-zinc-100 font-semibold">{content.after}</div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
