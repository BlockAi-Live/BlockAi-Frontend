import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { StaggerContainer, StaggerItem } from "../ScrollReveal";

export default function FAQ() {
  const faqs = [
    {
      q: "How does BlockAI discover trading alpha?",
      a: "BlockAI analyzes on-chain flows, smart-money behavior, and token metrics using AI-powered models to surface likely alpha opportunities before they trend.",
    },
    {
      q: "What blockchains are supported?",
      a: "We currently support Base. We are continuously expanding our coverage to include more L1s and L2s based on community demand.",
    },
    {
      q: "Is the BlockAI Token required for access?",
      a: "Basic analytics are free for everyone. Holding BlockAI Token unlocks premium features like real-time whale alerts, advanced predictive models, and exclusive community channels.",
    },
    {
      q: "How accurate are the AI predictions?",
      a: "Our models are trained on historical on-chain data and continuously learn from market movements. While no tool can guarantee 100% accuracy, BlockAI provides probability-based insights to give you a statistical edge.",
    },
  ];

  return (
    <section className="mt-32 px-6 md:px-0 max-w-3xl mx-auto relative z-10 mb-32">
      <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center tracking-tight text-white">
        FAQ
      </h3>
      <p className="text-neutral-500 text-base md:text-lg text-center mb-12 max-w-md mx-auto">
        Common questions, answered.
      </p>
      
      <Accordion type="single" collapsible className="w-full">
        <StaggerContainer className="space-y-2">
          {faqs.map((f, i) => (
            <StaggerItem key={i}>
              <AccordionItem 
                value={`item-${i}`} 
                className="border border-neutral-800/60 bg-neutral-900/30 rounded-xl px-5 overflow-hidden data-[state=open]:border-neutral-700 transition-colors duration-200"
              >
                <AccordionTrigger className="text-left text-neutral-200 hover:text-white hover:no-underline py-5 text-[15px] font-medium transition-colors">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-neutral-500 text-sm leading-relaxed pb-5">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Accordion>
    </section>
  );
}
