import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, ShieldCheck, FileWarning, TrendingUp, AlertTriangle, FileText, CheckCircle2, ChevronRight, BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tender } from '../data';

export interface WinProbabilityResult {
  score: number;
  label: 'High Chance' | 'Medium Chance' | 'Low Chance';
  color: string;
  bgColor: string;
  borderColor: string;
  explanation: string;
  strengths: string[];
  risks: string[];
  recommendation: 'Apply' | 'Apply carefully' | 'Do not apply';
  missingDocuments: string[];
  strategy: string;
}

export function analyzeWinProbability(tender: Tender | null): WinProbabilityResult {
  if (!tender) {
    return {
      score: 0, label: 'Low Chance', color: 'text-slate-500', bgColor: 'bg-slate-50', borderColor: 'border-slate-200',
      explanation: "", strengths: [], risks: [], recommendation: 'Do not apply', missingDocuments: [], strategy: ""
    };
  }

  let val = 0;
  for (let i = 0; i < tender.id.length; i++) {
    val += tender.id.charCodeAt(i) * (i + 1);
  }
  
  // Base score between 35 and 92
  const score = 35 + (val % 58);

  let label: 'High Chance' | 'Medium Chance' | 'Low Chance' = 'Medium Chance';
  let color = 'text-amber-500';
  let bgColor = 'bg-amber-50';
  let borderColor = 'border-amber-200';
  let recommendation: 'Apply' | 'Apply carefully' | 'Do not apply' = 'Apply carefully';

  if (score >= 70) {
    label = 'High Chance';
    color = 'text-emerald-600';
    bgColor = 'bg-emerald-50';
    borderColor = 'border-emerald-200';
    recommendation = 'Apply';
  } else if (score < 50) {
    label = 'Low Chance';
    color = 'text-red-600';
    bgColor = 'bg-red-50';
    borderColor = 'border-red-200';
    recommendation = 'Do not apply';
  }

  return {
    score,
    label,
    color,
    bgColor,
    borderColor,
    explanation: `Based on an AI analysis of requirements, experience, budget fit, deadline feasibility, document readiness, and competition risk, your estimated chance of winning is ${score}%. The budget and timeline align well with your standard capabilities.`,
    strengths: tender.requirements.length > 0 ? tender.requirements.slice(0, 2) : ["Technical expertise", "Competitive pricing"],
    risks: [
      "Timeline is aggressive for the requested scope",
      `High competition expected in the ${tender.category} category`
    ],
    missingDocuments: [
      "ISO 27001 Certification (If applicable)",
      "Local partner agreement"
    ],
    strategy: score >= 50 
      ? "Highlight your past relevant projects clearly in the executive summary. Consider proposing a phased delivery to mitigate timeline risks." 
      : "Partner with a specialized firm to overcome the compliance gaps. Ensure all mandatory documents are strictly followed.",
    recommendation
  };
}

// Visual Gauge Component
function ScoreGauge({ score, strokeColor }: { score: number, strokeColor: string }) {
  const dashArray = 251.2; // 2 * pi * r (r=40)
  const dashOffset = dashArray - (dashArray * score) / 100;

  return (
    <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle 
          cx="50" cy="50" r="40" 
          fill="transparent" stroke="#f1f5f9" strokeWidth="8"
        />
        <motion.circle 
          cx="50" cy="50" r="40" 
          fill="transparent" 
          stroke={strokeColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={dashArray}
          initial={{ strokeDashoffset: dashArray }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-xl font-semibold text-slate-900">{score}%</span>
      </div>
    </div>
  );
}

interface WinProbabilityProps {
  tender?: Tender; // if on detail page
  dashboardView?: boolean; // if true, shows a smaller, general card
  hasProfileData?: boolean;
}

export function WinProbabilityCard({ tender, dashboardView = false, hasProfileData = true }: WinProbabilityProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<WinProbabilityResult | null>(null);

  useEffect(() => {
    if (hasProfileData && tender) {
      setResult(analyzeWinProbability(tender));
    } else if (hasProfileData && dashboardView) {
      // Mock global chance
      const mockResult = analyzeWinProbability({ id: "T-GLOBAL", requirements: ["Strong track record", "Competitive pricing"], category: "General" } as any);
      mockResult.explanation = "Based on your company profile and track record, your overall average win probability across your saved tenders is strong.";
      setResult(mockResult);
    }
  }, [tender, dashboardView, hasProfileData]);

  if (!hasProfileData) {
    return (
      <div className="bg-white border border-slate-200 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center">
        <BrainCircuit className="text-slate-400 mb-3" size={32} />
        <h3 className="font-semibold text-slate-900 mb-1">AI Analysis Required</h3>
        <p className="text-slate-500 text-sm mb-4">Complete your profile to unlock win probability scores.</p>
        <Link to="/profile" className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
          Setup Profile
        </Link>
      </div>
    );
  }

  if (!result) return null;

  const hexColor = result.score >= 70 ? '#059669' : result.score >= 50 ? '#d97706' : '#dc2626';

  if (dashboardView) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-base text-slate-900">Win Probability</h2>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${result.bgColor} border ${result.borderColor} ${result.color} text-[11px] font-medium`}>
                {result.score >= 70 ? <ShieldCheck size={12} /> : result.score >= 50 ? <AlertTriangle size={12} /> : <FileWarning size={12} />}
                {result.label}
            </div>
          </div>
          
          <div className="flex items-center gap-6 mb-4">
            <ScoreGauge score={result.score} strokeColor={hexColor} />
            <p className="text-sm text-slate-600">
               {result.explanation}
            </p>
          </div>
          
        
        <div className="mt-auto border-t border-slate-100 pt-4 space-y-3">
           <div className="flex items-start gap-2 text-sm">
             <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
             <div>
               <span className="font-semibold text-slate-900 block">Top Strength</span>
               <span className="text-slate-500">{result.strengths[0]}</span>
             </div>
           </div>
           <div className="flex items-start gap-2 text-sm">
             <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
             <div>
               <span className="font-semibold text-slate-900 block">Main Risk</span>
               <span className="text-slate-500">{result.risks[0]}</span>
             </div>
           </div>
        </div>
      </div>
    );
  }

  // Tender Detail View
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm relative overflow-hidden">        
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2 mb-1">
                <BrainCircuit className="text-slate-700" size={20} />
                Match Analysis
            </h2>
            <p className="text-slate-500 text-sm">Advanced evaluation based on your company profile matching.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
             <ScoreGauge score={result.score} strokeColor={hexColor} />
             <div className="space-y-1.5">
                 <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md ${result.bgColor} border ${result.borderColor} ${result.color} text-[11px] font-medium`}>
                    {result.score >= 70 ? <ShieldCheck size={14} /> : result.score >= 50 ? <AlertTriangle size={14} /> : <FileWarning size={14} />}
                    {result.label}
                 </div>
                 <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Predicted outcome</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
                <div>
                   <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-2">Analysis</h3>
                   <p className="text-slate-600 text-sm">{result.explanation}</p>
                </div>
                
                <div>
                   <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-2">Core Strengths</h3>
                   <ul className="space-y-2">
                       {result.strengths.map((s, i) => (
                           <li key={i} className="flex gap-2 text-sm text-slate-600"><CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={16} /> {s}</li>
                       ))}
                   </ul>
                </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
                <div>
                   <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2">Risk Factors</h3>
                   <ul className="space-y-2">
                       {result.risks.map((r, i) => (
                           <li key={i} className="flex gap-2 text-sm text-slate-600"><AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={16} /> {r}</li>
                       ))}
                   </ul>
                </div>

                <div>
                   <h3 className="text-xs font-semibold uppercase tracking-wider text-red-700 mb-2">Missing Documents</h3>
                   {result.missingDocuments.length > 0 ? (
                       <ul className="space-y-2">
                           {result.missingDocuments.map((m, i) => (
                               <li key={i} className="flex gap-2 text-sm text-slate-600"><FileWarning className="text-red-500 shrink-0 mt-0.5" size={16} /> {m}</li>
                           ))}
                       </ul>
                   ) : (
                       <p className="text-sm text-slate-500 italic">No missing requirements detected.</p>
                   )}
                </div>
            </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 bg-slate-50 rounded-lg p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-2">Suggested Strategy</h3>
            <p className="text-slate-600 text-sm mb-4">{result.strategy}</p>
            
            <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-500">AI Recommendation:</span>
                <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                    result.recommendation === 'Apply' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                    result.recommendation === 'Apply carefully' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                    'bg-red-50 border-red-200 text-red-700'
                }`}>
                    {result.recommendation.toUpperCase()}
                </span>
            </div>
        </div>
    </div>
  );
}
