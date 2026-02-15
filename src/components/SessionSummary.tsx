/**
 * SessionSummary component - Displays post-debate analysis and performance metrics
 */

import { DebateAnalysis } from '../types';
import { motion } from 'framer-motion';
import { Trophy, Target, Zap, TrendingUp, Lightbulb, ArrowRight, Sparkles } from 'lucide-react';

/**
 * Props for SessionSummary component
 */
interface SessionSummaryProps {
  analysis: DebateAnalysis;
  onBack: () => void;
}

/**
 * Props for MetricBar sub-component
 */
interface MetricBarProps {
  label: string;
  score: number; // 0-100
  color?: string;
  delay?: number;
}

/**
 * MetricBar sub-component - Renders a labeled progress bar for metric scores
 */
function MetricBar({ label, score, color = 'bg-nav-lime', delay = 0 }: MetricBarProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="mb-4"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-400 text-sm font-bold uppercase tracking-wide">{label}</span>
        <span className="text-white text-lg font-black">{score}</span>
      </div>
      <div className="h-3 bg-[#111] rounded-full border border-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ delay: delay + 0.2, duration: 1, ease: "easeOut" }}
          className={`h-full ${color} rounded-full`}
        />
      </div>
    </motion.div>
  );
}

/**
 * SessionSummary component - Displays comprehensive debate analysis
 */
export default function SessionSummary({ analysis, onBack }: SessionSummaryProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-nav-lime', text: 'text-black', shadow: 'shadow-[0_0_60px_rgba(163,230,53,0.4)]' };
    if (score >= 60) return { bg: 'bg-sky-500', text: 'text-white', shadow: 'shadow-[0_0_60px_rgba(14,165,233,0.4)]' };
    if (score >= 40) return { bg: 'bg-amber-500', text: 'text-black', shadow: 'shadow-[0_0_60px_rgba(245,158,11,0.4)]' };
    return { bg: 'bg-red-500', text: 'text-white', shadow: 'shadow-[0_0_60px_rgba(239,68,68,0.4)]' };
  };

  const scoreStyle = getScoreColor(analysis.score);

  return (
    <div className="w-full h-full overflow-y-auto p-6 md:p-12 bg-nav-black">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-12"
      >
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-[#FDF9F0] leading-[0.9] mb-4">
          Battle<br/>
          <span className="text-nav-lime">Results</span>
        </h1>
        <p className="text-gray-400 text-lg font-medium">Your performance breakdown and insights</p>
      </motion.div>

      {/* Grid layout for analysis display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">

        {/* HERO SCORE CARD - Inspired by "Start Your Journey" */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className={`relative ${scoreStyle.bg} rounded-[2.5rem] p-8 overflow-hidden ${scoreStyle.shadow} col-span-1 md:col-span-3`}
        >
          {/* Animated background pattern */}
          <motion.div 
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}
          />

          {/* Floating decorative elements */}
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -right-10 -top-10 w-40 h-40 border-4 border-white/20 rounded-full"
          />
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -left-10 -bottom-10 w-32 h-32 border-4 border-white/20 rounded-2xl rotate-45"
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className={`w-24 h-24 ${scoreStyle.text === 'text-black' ? 'bg-black/10' : 'bg-white/10'} rounded-2xl flex items-center justify-center`}
              >
                <Trophy size={48} className={scoreStyle.text} />
              </motion.div>
              <div>
                <h3 className={`${scoreStyle.text} text-2xl font-black mb-2 uppercase tracking-tight`}>Overall Performance</h3>
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                  className="text-8xl font-black tracking-tighter leading-none"
                  style={{ color: scoreStyle.text === 'text-black' ? '#000' : '#fff' }}
                >
                  {analysis.score}
                </motion.div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className={`px-6 py-3 ${scoreStyle.text === 'text-black' ? 'bg-black/10' : 'bg-white/10'} rounded-xl border-2 ${scoreStyle.text === 'text-black' ? 'border-black/20' : 'border-white/20'}`}
              >
                <div className={`text-xs font-black uppercase tracking-widest ${scoreStyle.text} opacity-70 mb-1`}>Confidence</div>
                <div className={`text-2xl font-black ${scoreStyle.text}`}>{analysis.confidenceLevel}</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className={`px-6 py-3 ${scoreStyle.text === 'text-black' ? 'bg-black/10' : 'bg-white/10'} rounded-xl border-2 ${scoreStyle.text === 'text-black' ? 'border-black/20' : 'border-white/20'}`}
              >
                <div className={`text-xs font-black uppercase tracking-widest ${scoreStyle.text} opacity-70 mb-1`}>Archetype</div>
                <div className={`text-xl font-black ${scoreStyle.text}`}>{analysis.archetype}</div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* METRICS CARDS - Neubrutalist Button Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="relative bg-sky-500 rounded-[2rem] p-8 overflow-hidden shadow-[0_8px_0_rgb(3,105,161)] hover:shadow-[0_12px_0_rgb(3,105,161)] hover:-translate-y-1 transition-all cursor-pointer"
        >
          <div className="absolute top-4 right-4">
            <Sparkles className="w-8 h-8 text-white/30" />
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Target size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Core Skills</h3>
          </div>
          <div className="space-y-3">
            <MetricBar label="Vocabulary" score={analysis.vocabularyScore} color="bg-white" delay={1.2} />
            <MetricBar label="Clarity" score={analysis.clarityScore} color="bg-white" delay={1.3} />
            <MetricBar label="Argument Strength" score={analysis.argumentStrength} color="bg-white" delay={1.4} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="relative bg-nav-orange rounded-[2rem] p-8 overflow-hidden shadow-[0_8px_0_rgb(192,53,21)] hover:shadow-[0_12px_0_rgb(192,53,21)] hover:-translate-y-1 transition-all cursor-pointer"
        >
          <div className="absolute top-4 right-4">
            <Zap className="w-8 h-8 text-white/30" />
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <TrendingUp size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Advanced</h3>
          </div>
          <div className="space-y-3">
            <MetricBar label="Persuasion" score={analysis.persuasionScore} color="bg-white" delay={1.5} />
            <MetricBar label="Adaptability" score={analysis.strategicAdaptability} color="bg-white" delay={1.6} />
            <MetricBar label="Argument" score={analysis.argumentStrength} color="bg-white" delay={1.7} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="relative bg-nav-yellow rounded-[2rem] p-8 overflow-hidden shadow-[0_8px_0_rgb(179,141,0)] hover:shadow-[0_12px_0_rgb(179,141,0)] hover:-translate-y-1 transition-all cursor-pointer"
        >
          <div className="absolute top-4 right-4">
            <Lightbulb className="w-8 h-8 text-black/30" />
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-black/10 rounded-2xl flex items-center justify-center">
              <Sparkles size={32} className="text-black" />
            </div>
            <h3 className="text-2xl font-black text-black uppercase tracking-tight">Proficiency</h3>
          </div>
          <div className="text-center py-4">
            <div className="text-6xl font-black text-black mb-2">{analysis.englishProficiency}</div>
            <div className="text-sm font-bold text-black/70 uppercase tracking-widest">English Level</div>
          </div>
        </motion.div>

        {/* STRENGTHS & WEAKNESSES - Full Width Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Strengths */}
          <div className="relative bg-emerald-500/10 border-2 border-emerald-500/30 rounded-[2rem] p-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Your Strengths</h3>
              </div>
              <ul className="space-y-3">
                {analysis?.strengths && analysis.strengths.length > 0 ? (
                  analysis.strengths.map((strength, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.4 + index * 0.1 }}
                      className="flex items-start gap-3 bg-[#111] border border-emerald-500/20 rounded-xl p-4"
                    >
                      <div className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-white text-sm leading-relaxed font-medium">{strength}</span>
                    </motion.li>
                  ))
                ) : (
                  <li className="text-gray-400 text-sm italic">Focus on the suggestions to develop your strengths</li>
                )}
              </ul>
            </div>
          </div>

          {/* Weaknesses */}
          <div className="relative bg-amber-500/10 border-2 border-amber-500/30 rounded-[2rem] p-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <TrendingUp size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Growth Areas</h3>
              </div>
              <ul className="space-y-3">
                {analysis?.weaknesses && analysis.weaknesses.length > 0 ? (
                  analysis.weaknesses.map((weakness, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.4 + index * 0.1 }}
                      className="flex items-start gap-3 bg-[#111] border border-amber-500/20 rounded-xl p-4"
                    >
                      <div className="w-6 h-6 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <TrendingUp size={16} className="text-amber-400" />
                      </div>
                      <span className="text-white text-sm leading-relaxed font-medium">{weakness}</span>
                    </motion.li>
                  ))
                ) : (
                  <li className="text-gray-400 text-sm italic">Keep practicing to identify areas for improvement</li>
                )}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* SUGGESTIONS - Full Width Neubrutalist Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="col-span-1 md:col-span-3 relative bg-nav-lime rounded-[2rem] p-8 overflow-hidden shadow-[0_8px_0_rgb(140,174,0)] hover:shadow-[0_12px_0_rgb(140,174,0)] hover:-translate-y-1 transition-all"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-black/10 rounded-2xl flex items-center justify-center">
                <Lightbulb size={32} className="text-black" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-black uppercase tracking-tight">Action Plan</h3>
                <p className="text-black/70 font-bold text-sm">Tips to level up your debate skills</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis?.suggestions?.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.9 + index * 0.1 }}
                  className="flex items-start gap-3 bg-black/10 border-2 border-black/20 rounded-xl p-4"
                >
                  <div className="w-8 h-8 bg-black/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-black font-black text-sm">{index + 1}</span>
                  </div>
                  <span className="text-black text-sm leading-relaxed font-medium">{suggestion}</span>
                </motion.div>
              )) || <div className="text-black/70 text-sm">No suggestions available</div>}
            </div>
          </div>
        </motion.div>

        {/* WILDCARD INSIGHT - Special Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.2 }}
          className="col-span-1 md:col-span-3 relative bg-gradient-to-br from-purple-600 to-pink-600 rounded-[2rem] p-8 overflow-hidden"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -right-20 w-64 h-64 border-4 border-white/20 rounded-full"
          />
          <div className="relative z-10 text-center">
            <Sparkles className="w-12 h-12 text-white mx-auto mb-4" />
            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3">Wildcard Insight</h3>
            <p className="text-white text-lg leading-relaxed italic max-w-3xl mx-auto">
              "{analysis.wildcardInsight}"
            </p>
          </div>
        </motion.div>

        {/* Return to Dashboard Button - Neubrutalist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4 }}
          className="md:col-span-3 flex justify-center mt-8"
        >
          <button
            onClick={onBack}
            className="group px-12 py-5 bg-sky-500 hover:bg-sky-600 text-white font-black uppercase tracking-wide rounded-xl transition-all shadow-[0_8px_0_rgb(3,105,161)] active:shadow-none active:translate-y-2 flex items-center gap-3"
          >
            <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to Dashboard
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

      </div>
    </div>
  );
}

// Export MetricBar for use in subsequent tasks
export { MetricBar };
