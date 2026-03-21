'use client'

interface HowItWorksCard {
  badge: string
  badgeColor: string
  title: string
  description: string
  example: string
}

interface SubToolHowItWorksProps {
  heading: string
  cards: HowItWorksCard[]
}

export function SubToolHowItWorks({ heading, cards }: SubToolHowItWorksProps) {
  return (
    <section
      className="mt-8 p-6 bg-[#f0faf8] border border-[var(--color-border-brand)] rounded-[6px]"
      aria-labelledby="how-it-works-heading"
    >
      <h2
        id="how-it-works-heading"
        className="text-xl font-bold text-[var(--color-navy)] dark:text-zinc-100 mb-6"
      >
        {heading}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-white dark:bg-zinc-800 border border-[var(--color-border-brand)] rounded-[6px] p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="inline-flex items-center justify-center w-7 h-7 rounded-[4px] text-white text-xs font-bold shrink-0"
                style={{ backgroundColor: card.badgeColor }}
              >
                {card.badge}
              </span>
              <span className="text-[14px] font-semibold text-[var(--color-navy)] dark:text-zinc-100">
                {card.title}
              </span>
            </div>
            <p className="text-[13px] text-zinc-600 dark:text-zinc-300 mb-3 leading-relaxed">
              {card.description}
            </p>
            <div className="font-mono text-[12px] bg-zinc-50 dark:bg-zinc-900 border border-[var(--color-border-brand)] rounded px-3 py-2 text-zinc-700 dark:text-zinc-300 break-all">
              {card.example}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
