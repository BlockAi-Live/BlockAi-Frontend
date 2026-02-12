import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function FinalCTA() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <section className="mt-20 mb-16 px-6 md:px-0 relative z-10 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-center justify-between gap-8 py-10 px-8 rounded-2xl border border-neutral-800/40 bg-neutral-900/30"
      >
        <div>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
            Ready to get started?
          </h3>
          <p className="text-sm text-neutral-500 max-w-sm">
            Free during beta. No credit card needed.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/signup")}
            className="group px-6 py-3 rounded-xl text-sm font-semibold text-black bg-[#14F195] hover:bg-[#12d883] transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
          >
            {isAuthenticated ? "Open Dashboard" : "Get Started"}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <a
            href="https://discord.gg/FuPn3FbkG9"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl text-sm font-medium text-neutral-400 border border-neutral-800 hover:border-neutral-700 hover:text-white transition-all duration-200 whitespace-nowrap"
          >
            Join Discord
          </a>
        </div>
      </motion.div>
    </section>
  );
}
