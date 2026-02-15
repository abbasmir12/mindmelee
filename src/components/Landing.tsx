import { motion } from 'framer-motion';
import { Zap, Brain, TrendingUp, Target } from 'lucide-react';

interface LandingProps {
  onEnter: () => void;
}

export default function Landing({ onEnter }: LandingProps) {
  const features = [
    { icon: Brain, label: 'AI Opponent', color: 'nav-lime' },
    { icon: Zap, label: 'Real-time', color: 'nav-yellow' },
    { icon: TrendingUp, label: 'Analytics', color: 'nav-blue' },
    { icon: Target, label: 'Improve', color: 'nav-orange' },
  ];

  return (
    <div className="min-h-screen bg-nav-black relative overflow-hidden flex items-center justify-center">
      {/* Animated background grid */}
      <div className="absolute inset-0 pattern-grid opacity-20" />
      
      {/* Floating orbs */}
      <motion.div
        className="absolute top-20 left-20 w-64 h-64 bg-nav-lime/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-nav-blue/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Logo animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
          className="mb-8 inline-block"
        >
          <div className="w-24 h-24 bg-nav-lime rounded-2xl flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(204,255,0,0.4)] mx-auto">
            <Zap className="w-14 h-14 text-nav-black" strokeWidth={3} />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-7xl md:text-9xl font-black text-nav-cream mb-6 tracking-tighter"
        >
          Mind<span className="text-nav-lime">Melee</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-xl md:text-2xl text-nav-cream/70 mb-12 font-medium max-w-2xl mx-auto"
        >
          Master the art of debate with AI-powered coaching.
          <br />
          Real-time voice battles. Instant feedback. Level up.
        </motion.p>

        {/* Features grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex justify-center gap-6 mb-12 flex-wrap"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.1, y: -5 }}
              className="flex items-center gap-3 bg-card border-2 border-nav-lime/20 rounded-xl px-6 py-3 hover:border-nav-lime/40 transition-all"
            >
              <feature.icon className={`w-5 h-5 text-${feature.color}`} strokeWidth={2.5} />
              <span className="text-nav-cream font-bold">{feature.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnter}
          className="bg-nav-lime text-nav-black px-12 py-5 rounded-xl font-black text-xl shadow-[6px_6px_0px_0px_rgba(204,255,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(204,255,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-150"
        >
          START DEBATING
        </motion.button>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
          className="mt-16 text-nav-cream/40 text-sm font-medium"
        >
          Press to enter →
        </motion.div>
      </div>
    </div>
  );
}
