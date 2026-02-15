/**
 * PersonaShowcase - CodeJam style with blue/lime/orange theme
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, Scale, Sword, Lightbulb, Book, Star, Target, Check, Lock, Sparkles } from 'lucide-react';
import { PersonaService, ARCHETYPE_DEFINITIONS } from '@/services/personaService';
import { getHistory } from '@/services/storageService';
import { SplineScene } from './ui/spline';
import type { PersonaArchetype, PersonaTrait } from '@/types';

interface PersonaShowcaseProps {
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

export default function PersonaShowcase(_props: PersonaShowcaseProps) {
  const [persona, setPersona] = useState<{
    archetype: PersonaArchetype;
    traits: PersonaTrait[];
  } | null>(null);
  const [thoughtIndex, setThoughtIndex] = useState(0);
  
  // Initialize random thoughts once
  const [thoughts] = useState(() => {
    const allThoughts = [
      'Sounds good!',
      'Keep practicing to unlock new archetypes!',
      'Ready for another battle?',
      'Interesting strategy you have there!',
      'I see potential in you!',
      'One more session perhaps?',
      'You\'re getting stronger!',
      'Fascinating debate style!',
      'Keep up the momentum!',
      'Your growth is remarkable!',
      'Challenge accepted?',
      'Let\'s see what you\'ve got!',
      'Time to level up!',
      'You\'re on fire today!',
      'Impressive progress!',
    ];
    const shuffled = [...allThoughts].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 8);
  });

  useEffect(() => {
    const sessions = getHistory();
    const result = PersonaService.calculatePersona(sessions);
    setPersona({
      archetype: result.archetype,
      traits: result.traits,
    });
  }, []);

  // Rotate thoughts every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setThoughtIndex((prev) => (prev + 1) % 8);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!persona) {
    return (
      <div className="min-h-screen bg-nav-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white/20 border-t-nav-lime rounded-full animate-spin" />
      </div>
    );
  }

  const averageScore = Math.round(
    persona.traits.reduce((acc, t) => acc + t.value, 0) / persona.traits.length
  );

  // Add dynamic thoughts with archetype name and score
  const dynamicThoughts = [
    `Oh! ${persona.archetype.name}!`,
    `Your score is ${averageScore}... impressive!`,
    'You could become the next one with more debates!',
    'Hmm! No energy for more debates?',
    'Your debate skills are evolving!',
  ];

  // Combine with random thoughts
  const allDisplayThoughts = [...dynamicThoughts, ...thoughts].slice(0, 8);

  return (
    <div className="min-h-screen bg-nav-black text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8"
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-[#FDF9F0] leading-[0.9]">
            Your<br/>
            <span className="text-nav-lime">Persona</span>
          </h1>
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <Sparkles size={16} className="text-nav-lime" />
            <span className="text-xs font-bold uppercase tracking-widest text-white/60">Archetype Unlocked</span>
          </div>
        </motion.div>

        {/* Main Persona Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 items-start"
        >
          {/* Left: Archetype Card - Smaller */}
          <div className="bg-gradient-to-br from-lime-900/20 to-green-900/20 border-2 border-transparent rounded-[2rem] p-6 md:p-8 relative overflow-hidden transition-all duration-500 flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 pointer-events-none" />
            
            {/* Large Archetype Icon */}
            <div className="relative z-10 text-center">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-lime-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 shadow-[0_0_50px_rgba(132,204,22,0.5)]">
                {React.createElement(iconMap[persona.archetype.icon] || Brain, { 
                  size: 60, 
                  className: "text-black md:w-20 md:h-20",
                  strokeWidth: 2 
                })}
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-lime-500 uppercase tracking-tight mb-2">
                {persona.archetype.name}
              </h2>
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs text-gray-400">Overall Score:</span>
                <span className="text-xl font-black text-white">{averageScore}<span className="text-base text-gray-500">/100</span></span>
              </div>
            </div>
          </div>

          {/* Right: 3D Scene with Thought Bubble */}
          <div className="w-full h-[600px] md:h-[700px] relative -mt-20 md:-mt-32">
            {/* Thought Bubble - Right side */}
            <motion.div
              key={thoughtIndex}
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="absolute top-32 md:top-40 -right-4 md:right-4 z-20 w-32 md:w-40"
            >
              {/* Thought dots */}
              <div className="absolute -bottom-6 left-4 flex items-end gap-1">
                <div className="w-2 h-2 bg-white rounded-full" />
                <div className="w-3 h-3 bg-white rounded-full" />
                <div className="w-4 h-4 bg-white rounded-full" />
              </div>
              
              {/* Thought bubble */}
              <div className="bg-white text-black px-3 py-2 rounded-full shadow-2xl">
                <p className="text-[10px] md:text-xs font-bold text-center leading-tight">
                  {allDisplayThoughts[thoughtIndex]}
                </p>
              </div>
            </motion.div>

            {/* Robot */}
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </motion.div>

        {/* Description Section */}
        <div className="mb-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-black uppercase tracking-tight mb-6 text-white">About Your Archetype</h3>
          <div className="text-sm md:text-base leading-relaxed space-y-3 bg-[#111] border border-white/10 rounded-[2rem] p-6 md:p-8">
            {persona.archetype.description.split('. ').map((sentence, idx) => {
              if (idx === 0) {
                return (
                  <p key={idx} className="text-sky-400 text-base md:text-lg italic font-medium">
                    {sentence}.
                  </p>
                );
              } else if (idx === 1) {
                return (
                  <p key={idx} className="text-sky-400 text-base md:text-lg italic font-medium">
                    {sentence}.
                  </p>
                );
              } else if (idx === 2 || idx === 3) {
                return (
                  <p key={idx} className="text-white font-bold">
                    {sentence}.
                  </p>
                );
              } else {
                return (
                  <p key={idx} className="text-gray-300 font-medium">
                    {sentence}.
                  </p>
                );
              }
            })}
          </div>
        </div>

        {/* Traits Section - Achievements Style */}
        <div className="mb-16">
          <h3 className="text-3xl font-black uppercase tracking-tight mb-8 text-white">Your Traits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {persona.traits.map((trait, index) => (
              <motion.div
                key={trait.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-[#111] border border-white/10 rounded-[2.5rem] p-1 overflow-hidden hover:border-white/20 transition-colors"
              >
                <div className="bg-[#151515] rounded-[2.3rem] p-6 h-full flex flex-col">
                  {/* Top Row */}
                  <div className="flex justify-between items-start mb-6">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: persona.archetype.color }}
                    >
                      <Sparkles size={28} className="text-white" strokeWidth={2.5} />
                    </div>
                    <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Trait
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h4 className="text-2xl font-black text-white mb-2 leading-none">{trait.name}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed font-medium">
                      {trait.description}
                    </p>
                  </div>

                  {/* Value */}
                  <div className="mt-6 pt-6 border-t border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-gray-500">Score</span>
                      <span className="text-white text-3xl font-black">{trait.value}<span className="text-lg text-gray-500">/100</span></span>
                    </div>
                    <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${trait.value}%`,
                          backgroundColor: persona.archetype.color 
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-5 blur-2xl transition-opacity pointer-events-none"
                  style={{ backgroundColor: persona.archetype.color }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* All Archetypes - Learn Card Style */}
        <div>
          <h3 className="text-3xl font-black uppercase tracking-tight mb-8 text-white">Explore Archetypes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ARCHETYPE_DEFINITIONS.map((archetype, index) => {
              const Icon = iconMap[archetype.icon] || Brain;
              const isUnlocked = archetype.id === persona.archetype.id;
              
              return (
                <motion.div
                  key={archetype.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-[#111] border border-white/10 rounded-[2.5rem] p-1 overflow-hidden hover:border-white/20 transition-colors"
                >
                  <div className="bg-[#151515] rounded-[2.3rem] p-8 h-full flex flex-col relative z-10">
                    
                    {/* Top Row */}
                    <div className="flex justify-between items-start mb-8">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundColor: archetype.color }}
                      >
                        <Icon size={32} className="text-white" strokeWidth={2.5} />
                      </div>
                      <div className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${
                        isUnlocked ? 'bg-nav-lime text-black border-nav-lime' : 'bg-white/5 text-gray-400 border-white/10'
                      }`}>
                        {isUnlocked ? 'Current' : 'Locked'}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-3xl font-black text-white mb-3 leading-none">
                        {archetype.name}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed font-medium">
                        {archetype.description.slice(0, 120)}...
                      </p>
                    </div>

                    {/* CTA */}
                    <div className="mt-8 pt-8 border-t border-white/5">
                      <button 
                        className={`w-full py-4 font-black uppercase tracking-wide rounded-xl transition-colors flex items-center justify-center gap-2 ${
                          isUnlocked 
                            ? 'bg-white text-black hover:bg-nav-lime' 
                            : 'bg-white/5 text-gray-600 cursor-not-allowed'
                        }`}
                        disabled={!isUnlocked}
                      >
                        {isUnlocked ? <><Check size={18} /> Your Archetype</> : <><Lock size={18} /> Locked</>}
                      </button>
                    </div>
                  </div>

                  {/* Hover Glow */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-5 blur-2xl transition-opacity pointer-events-none"
                    style={{ backgroundColor: archetype.color }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
