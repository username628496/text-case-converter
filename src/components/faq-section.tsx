import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

interface FAQItem {
  question: string
  answer: string
}

interface FAQSectionProps {
  heading: string
  items: FAQItem[]
}

export function FAQSection({ heading, items }: FAQSectionProps) {
  return (
    <section aria-labelledby="faq-heading" className="mt-10">
      <h2
        id="faq-heading"
        className="text-xl font-semibold text-[var(--color-navy)] dark:text-zinc-200 mb-4"
      >
        {heading}
      </h2>
      <Accordion type="single" collapsible>
        {items.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="text-[15px] font-semibold text-zinc-700 dark:text-zinc-300">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-[1.7] text-zinc-500 dark:text-zinc-400">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
