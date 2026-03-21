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
    <section aria-labelledby="faq-heading" className="mt-12 pt-8 border-t border-[#c5e0d8]">
      <h2
        id="faq-heading"
        className="text-xl font-bold text-[#1a2744] dark:text-zinc-200 mb-4 flex items-center gap-2"
      >
        <HelpCircle className="h-[18px] w-[18px] text-[#1a2744] dark:text-zinc-400" />
        {heading}
      </h2>
      <Accordion type="single" collapsible>
        {items.map((item, i) => (
          <AccordionItem
            key={i}
            value={`item-${i}`}
            className="border-b data-[state=open]:border-l-4 data-[state=open]:border-l-[#1a2744] data-[state=open]:pl-4 data-[state=open]:bg-[#f8fffe] data-[state=open]:rounded-r-md"
          >
            <AccordionTrigger className="text-base font-semibold text-zinc-800 dark:text-zinc-200 hover:text-[#1a2744] dark:hover:text-zinc-100 hover:no-underline py-5">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400 pb-5">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
