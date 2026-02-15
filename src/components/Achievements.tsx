import { motion, useScroll } from 'framer-motion';
import { useRef, useState } from 'react';
import { Brain, Heart, Scale, Sword, Check, Lock, Star } from 'lucide-react';
import { ARCHETYPE_DEFINITIONS } from '../services/personaService';
import { getStats } from '../services/storageService';
import ArchetypeDetail from './ArchetypeDetail';

const iconMap: Record<string, any> = {
  brain: Brain,
  heart: Heart,
  scale: Scale,
  sword: Sword,
};

export default function Achievements() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const stats = getStats();
  const totalSessions = stats?.totalSessions || 0;
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);

  // Show first 4 archetypes
  const displayedArchetypes = ARCHETYPE_DEFINITIONS.slice(0, 4);

  const checkUnlocked = (archetype: typeof ARCHETYPE_DEFINITIONS[0]) => {
    if (archetype.id === 'analytical-strategist') return true;
    
    return archetype.unlockRequirements?.every(req => {
      if (req.type === 'sessions') return totalSessions >= req.value;
      return false;
    }) || false;
  };

  // Show detail view if archetype selected
  if (selectedArchetype) {
    return <ArchetypeDetail archetypeId={selectedArchetype} onBack={() => setSelectedArchetype(null)} />;
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-nav-black text-white p-6 md:p-12 relative overflow-hidden">
      
      {/* Background */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center mb-20 max-w-5xl mx-auto"
      >
        <div className="text-nav-lime font-bold uppercase tracking-widest text-xs mb-2">Unlock Your Potential</div>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
          Achievements
        </h1>
      </motion.div>

      {/* Timeline */}
      <div className="relative max-w-4xl mx-auto z-10 pb-40">
        
        {/* Central Line */}
        <div className="absolute left-7 md:left-1/2 top-0 bottom-0 w-1 bg-white/10 md:-translate-x-1/2 rounded-full">
          <motion.div 
            style={{ scaleY: scrollYProgress, transformOrigin: "top" }}
            className="w-full h-full bg-nav-lime shadow-[0_0_15px_#CCFF00]"
          />
        </div>

        {/* Archetype Nodes */}
        <div className="space-y-32">
          {displayedArchetypes.map((archetype, index) => {
            const isLeft = index % 2 === 0;
            const isUnlocked = checkUnlocked(archetype);
            const Icon = iconMap[archetype.icon] || Brain;
            
            return (
              <motion.div 
                key={archetype.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`relative flex items-center md:justify-between ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                
                {/* Content Card */}
                <div className={`
                  ml-20 md:ml-0 w-full md:w-[42%] 
                  bg-[#111] border border-white/10 p-8 rounded-[2.5rem] relative group
                  hover:border-white/30 transition-colors
                  ${!isUnlocked ? 'opacity-40 grayscale' : ''}
                `}>
                  <div 
                    className={`absolute top-0 bottom-0 w-2 ${isLeft ? 'right-0 rounded-r-[2.5rem]' : 'left-0 rounded-l-[2.5rem]'}`}
                    style={{ backgroundColor: archetype.color }}
                  />
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      isUnlocked ? 'bg-nav-lime text-black' : 'bg-white/10 text-gray-500'
                    }`}>
                      {isUnlocked ? 'Unlocked' : 'Locked'}
                    </span>
                    <span className="text-gray-600 font-mono text-xs uppercase">Archetype</span>
                  </div>

                  <h3 className="text-3xl font-black uppercase tracking-tight mb-2">
                    {archetype.name}
                  </h3>
                  <p className="text-gray-400 font-medium leading-relaxed mb-6">
                    {archetype.description.slice(0, 150)}...
                  </p>

                  {/* Requirements */}
                  {!isUnlocked && archetype.unlockRequirements && (
                    <div className="mb-6 space-y-2">
                      <div className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2">Requirements:</div>
                      {archetype.unlockRequirements.map((req, i) => (
                        <div key={i} className="text-sm text-gray-500 flex items-center gap-2">
                          <Lock size={12} />
                          {req.description}
                        </div>
                      ))}
                    </div>
                  )}

                  <button 
                    className={`
                      w-full py-3 rounded-xl font-black uppercase tracking-wide flex items-center justify-center gap-2 transition-transform active:scale-95
                      ${!isUnlocked
                        ? 'bg-white/5 text-gray-600 cursor-not-allowed' 
                        : 'bg-white text-black hover:bg-nav-lime'
                      }
                    `}
                    disabled={!isUnlocked}
                    onClick={() => isUnlocked && setSelectedArchetype(archetype.id)}
                  >
                    {isUnlocked ? 'View Details' : <><Lock size={16} /> Locked</>}
                  </button>
                </div>

                {/* Center Node Marker */}
                <div className="absolute left-7 md:left-1/2 -translate-x-1/2 w-14 h-14 bg-nav-black border-4 border-[#111] rounded-full flex items-center justify-center z-20">
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    className={`
                      w-full h-full rounded-full flex items-center justify-center border-4
                      ${isUnlocked 
                        ? 'bg-nav-lime border-nav-lime text-black' 
                        : 'bg-[#222] border-white/10 text-gray-600'}
                    `}
                    style={{
                      backgroundColor: isUnlocked ? archetype.color : undefined,
                      borderColor: isUnlocked ? archetype.color : undefined,
                    }}
                  >
                    {isUnlocked ? <Check size={24} strokeWidth={3} /> : <Icon size={20} />}
                  </motion.div>
                </div>

                {/* Empty Space */}
                <div className="hidden md:block w-[42%]" />

              </motion.div>
            );
          })}
        </div>

        {/* Coming Soon */}
        <div className="relative flex justify-center mt-32">
           <div className="absolute left-[28px] md:left-1/2 top-[-128px] h-32 w-1 bg-gradient-to-b from-white/10 to-transparent md:-translate-x-1/2" />
           <div className="bg-[#111] border border-white/10 border-dashed px-8 py-4 rounded-full text-gray-500 font-black uppercase tracking-widest text-sm flex items-center gap-3">
             <Star size={16} /> More Coming Soon
           </div>
        </div>

      </div>
    </div>
  );
}
