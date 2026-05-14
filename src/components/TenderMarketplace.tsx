import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Building2,
  Globe,
  DollarSign,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useStore } from "../store/useStore";
import { MOCK_TENDERS } from "../data";

export default function TenderMarketplace() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const { isInitialized, initialize, tenders, addGeneratedTender } = useStore();
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!isInitialized) initialize();
  }, [isInitialized, initialize]);

  // Create an endlessly rotating slice of 4 items to simulate 'daily arriving' tenders
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const itemsToShow = 4;

  // Fallback to MOCK_TENDERS if store not loaded yet to prevent breaking SSR/initial render layout
  const dataSource = tenders.length > 0 ? tenders : MOCK_TENDERS;

  useEffect(() => {
    // Every 15 seconds, slide the marketplace forward
    const slideInterval = setInterval(() => {
      setVisibleStartIndex((prev) => (prev + 1) % dataSource.length);
    }, 15000);
    return () => clearInterval(slideInterval);
  }, [dataSource.length]);

  useEffect(() => {
    // Periodically generate a completely new tender using AI
    const generateInterval = setInterval(async () => {
      if (!isGenerating && isInitialized) {
        setIsGenerating(true);
        try {
          const { AIService } = await import("../services/aiService");
          const newTender = await AIService.getInstance().generateNewTender();
          newTender.id = `T-GEN-${Math.random().toString(36).substr(2, 9)}`;
          addGeneratedTender(newTender);
          setVisibleStartIndex(0); // Snap to the new one!

          // Optionally, add a notification that a new tender arrived
          const { StorageService } = await import("../services/storageService");
          StorageService.addNotification({
            title: `New Tender: ${newTender.title}`,
            message: `A new ${newTender.budget} opportunity in ${newTender.category} just arrived matching your profile.`,
            type: "info",
          });
        } catch (err: any) {
          if (err?.message?.includes("exceeded your current quota") || err?.status === 429 || err?.status === "RESOURCE_EXHAUSTED" || err?.message?.includes("RESOURCE_EXHAUSTED")) {
            console.warn("Background tender generation limited by API quota.");
          } else {
            console.error("Background tender generation failed:", err);
          }
        } finally {
          setIsGenerating(false);
        }
      }
    }, 600000); // 10 minutes

    return () => clearInterval(generateInterval);
  }, [isGenerating, isInitialized, addGeneratedTender]);

  // Compute the current 4 visible items
  const visibleTenders = [];
  for (let i = 0; i < itemsToShow; i++) {
    const safeIndex = (visibleStartIndex + i) % dataSource.length;
    visibleTenders.push(dataSource[safeIndex]);
  }

  const analyzeTender = (tender: (typeof dataSource)[0]) => {
    // Navigating to the AI route and passing state to auto-trigger the analysis flow
    navigate("/ai", {
      state: {
        autoFillTitle: tender.title,
        autoFillText: `TENDER TITLE: ${tender.title}\nORGANIZATION: ${tender.organization}\nBUDGET: ${tender.budget}\nLOCATION: ${tender.country}\n\nDESCRIPTION: ${tender.description}\n\nREQUIREMENTS:\n${tender.requirements.map((r) => "- " + r).join("\n")}`,
      },
    });
  };

  return (
    <section className="py-32 relative overflow-hidden bg-white" id="marketplace">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Market Scanning
              </span>
              {isGenerating && (
                <span className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-2">
                  <Sparkles
                    size={12}
                    className="text-slate-400 animate-pulse"
                  />
                  AI generating new tender...
                </span>
              )}
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-4">
              Live Marketplace
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Global procurement opportunities ingested and structured in
              real-time. Connect your profile to receive intelligent matching
              signals.
            </p>
          </div>
          <button
            onClick={() => navigate("/tenders")}
            className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shrink-0 shadow-sm"
          >
            View All Tenders
            <ChevronRight
              size={16}
            />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          <AnimatePresence mode="popLayout">
            {visibleTenders.map((tender) => (
              <motion.div
                key={tender.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="group bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-all duration-300 shadow-sm flex flex-col justify-between"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md border border-slate-200">
                        {tender.category}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {tender.status}
                      </span>
                    </div>
                    <span className="text-slate-400 text-xs font-medium">
                      ID: {tender.id}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 mb-4 tracking-tight line-clamp-2 group-hover:text-slate-700 transition-colors">
                    {tender.title}
                  </h3>

                  <div className="flex flex-col gap-2 mb-6">
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <Building2
                        size={16}
                        className="text-slate-400 shrink-0"
                      />
                      <span className="truncate">{tender.organization}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <Globe
                        size={16}
                        className="text-slate-400 shrink-0"
                      />
                      <span>{tender.country}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-900 text-sm font-medium">
                      <DollarSign
                        size={16}
                        className="text-slate-400 shrink-0"
                      />
                      <span>
                        {tender.budget}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 relative z-10 mt-auto pt-4 border-t border-slate-100">
                  <button
                    onClick={() => navigate(`/tenders/${tender.id}`)}
                    className="flex-1 py-2 text-center bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 rounded-lg text-sm font-medium transition-colors"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => analyzeTender(tender)}
                    className="flex-1 py-2 text-center bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Sparkles size={14} />
                    Analyze
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
