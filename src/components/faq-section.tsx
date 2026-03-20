import { HelpCircle } from 'lucide-react'
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
        className="text-xl font-semibold text-[var(--color-navy)] dark:text-zinc-200 mb-4 flex items-center gap-2"
      >
        <HelpCircle className="h-5 w-5" />
        {heading}
      </h2>
      <Accordion type="single" collapsible>
        {items.map((item, i) => (
          <AccordionItem
            key={i}
            value={`item-${i}`}
            className="border-b data-[state=open]:border-l-[3px] data-[state=open]:border-l-[#1a2744] data-[state=open]:pl-4"
          >
            <AccordionTrigger className="text-[15px] font-semibold text-zinc-700 dark:text-zinc-300 no-underline hover:no-underline data-[state=open]:text-[#1a2744] dark:data-[state=open]:text-zinc-100">
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
