import { StaggerContainer, StaggerItem } from "../ScrollReveal";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Connect",
    description: "Link your wallet in one click. No signups, no email, no friction.",
  },
  {
    number: "02",
    title: "Analyze",
    description: "AI scans chains in real-time, surfacing patterns humans miss.",
  },
  {
    number: "03",
    title: "Act",
    description: "Get actionable alpha and alerts before the market catches on.",
  },
];

export default function ThreeSteps() {
  return (
    <section className="mt-32 px-6 md:px-0 text-center relative z-10">
      <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
        How it works
      </h3>
      <p className="text-neutral-500 text-base md:text-lg max-w-md mx-auto mb-16">
        Three steps to smarter decisions.
      </p>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-800/50 rounded-xl overflow-hidden max-w-4xl mx-auto">
        {steps.map((step, i) => (
          <StaggerItem key={i}>
            <div className="bg-[#09090b] p-8 md:p-10 text-center group hover:bg-neutral-900/50 transition-colors duration-300 h-full">
              {/* Step number */}
              <div className="text-5xl font-bold text-neutral-800 group-hover:text-[#14F195]/20 transition-colors duration-300 mb-6 font-mono">
                {step.number}
              </div>

              <h4 className="text-xl font-semibold text-white mb-3">
                {step.title}
              </h4>

              <p className="text-sm text-neutral-500 leading-relaxed max-w-[200px] mx-auto">
                {step.description}
              </p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
