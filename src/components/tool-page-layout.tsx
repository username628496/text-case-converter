import type { ReactNode } from 'react'

interface ToolPageLayoutProps {
  toolArea: ReactNode        // The main tool widget (ToolPage, ReverseTextTool, etc.)
  belowTool?: ReactNode      // Optional content between tool and FAQ (HowItWorksSection, ToolCards — homepage only)
  faqSection: ReactNode      // FAQSection component
  relatedTools: ReactNode    // RelatedTools component
  jsonLd?: ReactNode         // Optional JsonLd (always last, invisible)
}

export function ToolPageLayout({ toolArea, belowTool, faqSection, relatedTools, jsonLd }: ToolPageLayoutProps) {
  return (
    <div className="space-y-8 w-full">
      {/* 1. Tool area */}
      <div>{toolArea}</div>

      {/* 2. Below-tool content (homepage-only: HowItWorksSection + ToolCards) */}
      {belowTool && <div>{belowTool}</div>}

      {/* 3. FAQ */}
      <div>{faqSection}</div>

      {/* 4. Related tools */}
      <div>{relatedTools}</div>

      {/* 5. JSON-LD (invisible) */}
      {jsonLd}
    </div>
  )
}
