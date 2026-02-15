/**
 * ArchetypeDetail - Detailed view of a specific archetype (CodeJam guide style)
 */

import { motion } from 'framer-motion';
import { ArrowLeft, Brain, Heart, Scale, Sword, Lightbulb, Book, Star, Target, CheckCircle, Award, BookOpen } from 'lucide-react';
import { ARCHETYPE_DEFINITIONS } from '@/services/personaService';

interface ArchetypeDetailProps {
  archetypeId: string;
  onBack: () => void;
}

const iconMap: Record<string, any> = {
  brain: Brain,
  heart: Heart,
  scale: Scale,
  sword: Sword,
  lightbulb: Lightbulb,
  book: Book,
  star: Star,
  target: Target,
};

export default function ArchetypeDetail({ archetypeId, onBack }: ArchetypeDetailProps) {
  const archetype = ARCHETYPE_DEFINITIONS.find(a => a.id === archetypeId);

  if (!archetype) {
    return null;
  }

  const Icon = iconMap[archetype.icon] || Brain;

  return (
    <div className="min-h-screen bg-nav-black text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-8 font-bold"
        >
          <ArrowLeft size={20} />
          Back to Achievements
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: archetype.color }}
            >
              <Icon size={40} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Debate Archetype</div>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
                {archetype.name}
              </h1>
            </div>
          </div>
        </motion.div>

        {/* Overview Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 bg-[#111] border border-white/10 rounded-[2rem] p-8"
        >
          <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-white flex items-center gap-3">
            <BookOpen size={24} className="text-sky-500" />
            Overview
          </h2>
          <p className="text-gray-300 leading-relaxed text-base">
            {archetype.description}
          </p>
        </motion.section>

        {/* Strengths Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-white flex items-center gap-3">
            <CheckCircle size={24} className="text-green-500" />
            Core Strengths
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {archetype.strengths.map((strength, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="bg-[#111] border border-white/10 rounded-2xl p-6 hover:border-green-500/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle size={16} className="text-green-500" />
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{strength}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Weaknesses Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-white flex items-center gap-3">
            <Award size={24} className="text-orange-500" />
            Areas for Growth
          </h2>
          <div className="space-y-4">
            {archetype.weaknesses.map((weakness, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="bg-[#111] border border-white/10 rounded-2xl p-6 hover:border-orange-500/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center shrink-0 mt-1">
                    <Award size={16} className="text-orange-500" />
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{weakness}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* How to Unlock Section */}
        {archetype.unlockRequirements && archetype.unlockRequirements.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12 bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-2 border-purple-500/30 rounded-[2rem] p-8"
          >
            <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-white flex items-center gap-3">
              <Target size={24} className="text-purple-400" />
              How to Unlock
            </h2>
            <div className="space-y-4">
              {archetype.unlockRequirements.map((req, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-purple-400 font-black">{idx + 1}</span>
                  </div>
                  <p className="text-gray-300 text-base font-medium">{req.description}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Tips Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-12 bg-[#111] border border-white/10 rounded-[2rem] p-8"
        >
          <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-white flex items-center gap-3">
            <Lightbulb size={24} className="text-yellow-500" />
            Tips to Master This Archetype
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>• <strong className="text-white">Practice consistently:</strong> Complete multiple debate sessions to refine your style and strengthen your archetype traits.</p>
            <p>• <strong className="text-white">Focus on your strengths:</strong> Leverage the core strengths of this archetype to dominate debates and build confidence.</p>
            <p>• <strong className="text-white">Work on weaknesses:</strong> Identify areas for improvement and actively work to balance your debate approach.</p>
            <p>• <strong className="text-white">Experiment with modes:</strong> Try both Coach and Fierce modes to develop versatility and adaptability.</p>
            <p>• <strong className="text-white">Track your progress:</strong> Use the Activity dashboard to monitor your growth and celebrate milestones.</p>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
