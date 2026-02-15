/**
 * New Dashboard with Bento Grid Layout - CodeJam Inspired
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Clock, Zap, Swords, Brain, TrendingUp, Target, ArrowRight } from 'lucide-react';
import { DebateStyle, UserStats, SessionHistoryItem } from '../types';
import { getStats, getHistory } from '../services/storageService';

interface DashboardProps {
  onStartDebate: (topic: string, style: DebateStyle, duration: number) => void;
  onNavigateToPersona?: () => void;
}

export default function Dashboard({ onStartDebate, onNavigateToPersona }: DashboardProps) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [history, setHistory] = useState<SessionHistoryItem[]>([]);
  const [topic, setTopic] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<DebateStyle>(DebateStyle.COACH);
  const [duration, setDuration] = useState<number>(5);
  const [quote, setQuote] = useState({ text: '', author: '' });

  // Local quotes as fallback
  const localQuotes = [
    { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
    { text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill' },
    { text: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt' },
    { text: 'In the middle of difficulty lies opportunity.', author: 'Albert Einstein' },
    { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' },
    { text: 'Don\'t watch the clock; do what it does. Keep going.', author: 'Sam Levenson' },
    { text: 'The only impossible journey is the one you never begin.', author: 'Tony Robbins' },
    { text: 'Success doesn\'t just find you. You have to go out and get it.', author: 'Unknown' },
    { text: 'Dream bigger. Do bigger.', author: 'Unknown' },
    { text: 'Wake up with determination. Go to bed with satisfaction.', author: 'Unknown' }
  ];

  // Get random local quote
  const getLocalQuote = () => {
    const randomIndex = Math.floor(Math.random() * localQuotes.length);
    return localQuotes[randomIndex]!;
  };

  // Fetch quote (try API with CORS proxy, fallback to local)
  const fetchQuote = async () => {
    try {
      // Use allorigins.win CORS proxy
      const response = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent('https://api.quotify.top/random?quantity=1'));
      if (response.ok) {
        const data = await response.json();
        setQuote({ text: data.text, author: data.author });
        console.log('✅ API quote fetched');
        return;
      }
    } catch (error) {
      console.log('⚠️ API unavailable, using local quotes');
    }
    
    // Fallback to local quotes
    setQuote(getLocalQuote());
    console.log('✅ Local quote selected');
  };

  useEffect(() => {
    setStats(getStats());
    setHistory(getHistory());
    
    // Fetch initial quote
    fetchQuote();
    
    // Fetch new quote every 60 seconds
    const interval = setInterval(fetchQuote, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const handleStartDebate = () => {
    if (topic.trim()) onStartDebate(topic.trim(), selectedStyle, duration);
  };

  const avgScore = history.length > 0
    ? Math.round(history.reduce((sum, s) => sum + s.score, 0) / history.length)
    : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-thin bg-nav-black">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto p-6 md:p-8 space-y-6"
      >
        
        {/* Hero Section - CodeJam Style Split Title */}
        <motion.div variants={itemVariants} className="mb-12">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-4">
            <span className="text-nav-cream">Ready to </span>
            <span className="text-nav-lime">Battle?</span>
          </h1>
          <p className="text-nav-cream/50 text-xl font-medium">Your debate arena awaits. Choose your challenge.</p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 -mt-8">
          
          {/* Large Score Card - Reduced Height */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -4 }}
            className="md:col-span-5 group relative bg-[#111] border border-white/10 rounded-[2.5rem] p-1 overflow-hidden hover:border-white/20 transition-colors"
          >
            <div className="bg-nav-lime rounded-[2.3rem] p-5 h-full flex flex-col relative z-10">
              {/* Watermark Trophy */}
              <Trophy className="absolute -right-8 -bottom-8 w-40 h-40 text-black/5" strokeWidth={1} />
              
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-black" strokeWidth={2.5} />
                  <span className="text-black font-black text-xs uppercase tracking-[0.2em]">Performance</span>
                </div>
                <div className="text-black text-6xl font-black leading-none mb-3">{avgScore}</div>
                <div className="h-[15px]" />
                <div className="flex gap-6 text-black/80 font-black mb-4">
                  <div>
                    <div className="text-2xl font-black">{stats?.totalSessions || 0}</div>
                    <div className="text-xs uppercase tracking-wider">Battles</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black">{stats?.totalMinutes || 0}</div>
                    <div className="text-xs uppercase tracking-wider">Minutes</div>
                  </div>
                </div>

                <div className="flex-1 mb-10" />

                {/* Quote Section */}
                <motion.div
                  key={quote.text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="pt-4 border-t-2 border-black/10"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <Zap className="w-4 h-4 text-black/60 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    <p className="text-black/80 text-sm leading-relaxed italic font-medium">
                      "{quote.text}"
                    </p>
                  </div>
                  <p className="text-black/60 text-xs font-black uppercase tracking-wider text-right">
                    — {quote.author}
                  </p>
                </motion.div>
              </div>
            </div>
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-nav-lime opacity-0 group-hover:opacity-10 blur-2xl transition-opacity pointer-events-none" />
          </motion.div>

          {/* Start Debate Card - Blue CodeJam Style with Glow */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-7 bg-sky-900/20 border-2 border-sky-500 rounded-[2rem] p-4 md:p-6 relative overflow-hidden transition-all duration-500"
          >
            <div className="absolute inset-0 opacity-20 pointer-events-none" />
            
            {/* Watermark Swords - Blue Glow */}
            <div className="absolute -right-10 -top-10 text-sky-500/10 rotate-12 pointer-events-none">
              <Swords size={200} strokeWidth={1} />
            </div>

            <div className="relative z-10">
              {/* Top Row with Glowing Icon */}
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-sky-500 rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(14,165,233,0.4)]">
                  <Swords size={28} className="text-white md:w-8 md:h-8" strokeWidth={2.5} />
                </div>
                <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Quick Start
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-black text-sky-500 uppercase tracking-tight mb-4">
                Start Your Journey
              </h3>

              {/* Topic Input */}
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What will you debate today?"
                className="w-full bg-black/30 rounded-2xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:bg-black/50 transition-all mb-4 font-medium border border-white/5"
              />

              {/* Mode Selection - Neubrutalist Style */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => setSelectedStyle(DebateStyle.COACH)}
                  className={`py-3 px-4 rounded-xl font-black text-xs uppercase tracking-tight transition-all ${
                    selectedStyle === DebateStyle.COACH
                      ? 'bg-green-500 text-white shadow-[0_4px_0_rgb(21,128,61)] active:shadow-none active:translate-y-1'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Brain className="w-4 h-4 inline mr-2" strokeWidth={2.5} />
                  COACH
                </button>
                <button
                  onClick={() => setSelectedStyle(DebateStyle.AGGRESSIVE)}
                  className={`py-3 px-4 rounded-xl font-black text-xs uppercase tracking-tight transition-all ${
                    selectedStyle === DebateStyle.AGGRESSIVE
                      ? 'bg-nav-orange text-white shadow-[0_4px_0_rgb(192,53,21)] active:shadow-none active:translate-y-1'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Flame className="w-4 h-4 inline mr-2" strokeWidth={2.5} />
                  FIERCE
                </button>
              </div>

              {/* Duration Slider */}
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400 text-xs font-black uppercase tracking-wider">Duration</span>
                  <span className="text-sky-500 font-black text-lg">{duration} min</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full h-2 bg-black/50 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sky-500"
                />
              </div>

              {/* CTA Button - Neubrutalist Style */}
              <button
                onClick={handleStartDebate}
                disabled={!topic.trim()}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 md:py-4 rounded-xl font-black uppercase tracking-wider transition-all shadow-[0_4px_0_rgb(3,105,161)] md:shadow-[0_8px_0_rgb(3,105,161)] active:shadow-none active:translate-y-[4px] md:active:translate-y-[8px] flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
              >
                Start Battle <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>

          {/* Quick Stats - Full CodeJam Learn Card Style */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-4 group relative bg-[#111] border border-white/10 rounded-[2.5rem] p-1 overflow-hidden hover:border-white/20 transition-colors"
          >
            <div className="bg-[#151515] rounded-[2.3rem] p-6 h-full flex flex-col">
              {/* Top Row */}
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-nav-blue rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Clock size={28} className="text-black" strokeWidth={2.5} />
                </div>
                <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Metric
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <h3 className="text-3xl font-black text-white mb-2 leading-none">Total Time</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">
                  Minutes spent in debate battles
                </p>
              </div>

              {/* Value */}
              <div className="mt-6 pt-6 border-t border-white/5">
                <div className="text-white text-5xl font-black">{stats?.totalMinutes || 0}<span className="text-2xl text-gray-500">m</span></div>
              </div>
            </div>
            <div className="absolute inset-0 bg-nav-blue opacity-0 group-hover:opacity-5 blur-2xl transition-opacity pointer-events-none" />
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="md:col-span-4 group relative bg-[#111] border border-white/10 rounded-[2.5rem] p-1 overflow-hidden hover:border-white/20 transition-colors"
          >
            <div className="bg-[#151515] rounded-[2.3rem] p-6 h-full flex flex-col">
              {/* Top Row */}
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-nav-orange rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Zap size={28} className="text-black" strokeWidth={2.5} />
                </div>
                <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Streak
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <h3 className="text-3xl font-black text-white mb-2 leading-none">Active Days</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">
                  Consecutive days of practice
                </p>
              </div>

              {/* Value */}
              <div className="mt-6 pt-6 border-t border-white/5">
                <div className="text-white text-5xl font-black">{Math.min(history.length, 7)}<span className="text-2xl text-gray-500">d</span></div>
              </div>
            </div>
            <div className="absolute inset-0 bg-nav-orange opacity-0 group-hover:opacity-5 blur-2xl transition-opacity pointer-events-none" />
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="md:col-span-4 group relative bg-[#111] border border-white/10 rounded-[2.5rem] p-1 overflow-hidden hover:border-white/20 transition-colors"
          >
            <div className="bg-[#151515] rounded-[2.3rem] p-6 h-full flex flex-col">
              {/* Top Row */}
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-nav-yellow rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp size={28} className="text-black" strokeWidth={2.5} />
                </div>
                <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Progress
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <h3 className="text-3xl font-black text-white mb-2 leading-none">Growth Rate</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">
                  Performance improvement trend
                </p>
              </div>

              {/* Value */}
              <div className="mt-6 pt-6 border-t border-white/5">
                <div className="text-white text-5xl font-black">+{Math.min(history.length * 3, 42)}<span className="text-2xl text-gray-500">%</span></div>
              </div>
            </div>
            <div className="absolute inset-0 bg-nav-yellow opacity-0 group-hover:opacity-5 blur-2xl transition-opacity pointer-events-none" />
          </motion.div>

          {/* Recent Sessions - CodeJam Style */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-12 group relative bg-[#111] border border-white/10 rounded-[2.5rem] p-1 overflow-hidden hover:border-white/20 transition-colors"
          >
            <div className="bg-[#151515] rounded-[2.3rem] p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-nav-lime" strokeWidth={2.5} />
                  <h2 className="text-white font-black text-lg uppercase tracking-[0.2em]">Recent Battles</h2>
                </div>
                {onNavigateToPersona && (
                  <button
                    onClick={onNavigateToPersona}
                    className="text-nav-lime hover:text-nav-yellow font-black text-sm transition-colors uppercase tracking-wider"
                  >
                    View All →
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <Swords className="w-16 h-16 mx-auto mb-4 opacity-20" strokeWidth={1.5} />
                  <p className="font-black text-lg uppercase tracking-wider">No battles yet. Start your first debate!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {history.slice(0, 6).map((session, i) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-black/30 border border-white/5 rounded-2xl p-5 hover:bg-black/50 hover:border-white/10 transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-white font-bold text-sm line-clamp-1">{session.topic}</span>
                        <span className="text-nav-lime font-black text-2xl">{session.score}</span>
                      </div>
                      <div className="flex gap-2 text-xs text-gray-500 font-bold uppercase tracking-wider">
                        <span>{new Date(session.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{Math.round(session.durationSeconds / 60)}m</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}
