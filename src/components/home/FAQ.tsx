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
      a: "We currently support Solana, Ethereum, and Base. We are continuously expanding our coverage to include more L1s and L2s based on community demand.",
    },
    {
      q: "Is the XToken required for access?",
      a: "Basic analytics are free for everyone. Holding XToken unlocks premium features like real-time whale alerts, advanced predictive models, and exclusive community channels.",
    },
    {
      q: "How accurate are the AI predictions?",
      a: "Our models are trained on historical on-chain data and continuously learn from market movements. While no tool can guarantee 100% accuracy, BlockAI provides probability-based insights to give you a statistical edge.",
    },
  ];

  return (
    <section className="mt-32 px-6 md:px-0 max-w-4xl mx-auto relative z-10 mb-32">
      <h3 className="text-[#10e291] text-3xl md:text-4xl lg:text-5xl font-bold mb-16 text-center tracking-wide">
        Frequently Asked Questions
      </h3>
      
      <div className="relative">
        {/* Background Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#10e291] to-[#9b59b6] rounded-2xl opacity-10 blur-xl pointer-events-none"></div>
        
        <Accordion type="single" collapsible className="w-full">
          <StaggerContainer className="space-y-4">
            {faqs.map((f, i) => (
              <StaggerItem key={i}>
                <AccordionItem 
                  value={`item-${i}`} 
                  className="border border-white/10 bg-[#0B0E1A]/80 backdrop-blur-md rounded-xl px-6 overflow-hidden data-[state=open]:border-[#10e291]/50 transition-colors duration-300"
                >
                  <AccordionTrigger className="text-left text-white hover:text-[#10e291] hover:no-underline py-6 text-lg font-medium transition-colors">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 text-base leading-relaxed pb-6">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Accordion>
      </div>
    </section>
  );
}
