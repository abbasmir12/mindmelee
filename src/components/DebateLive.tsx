/**
 * DebateLive Component
 * 
 * The active debate interface where real-time voice interaction occurs.
 * Manages connection to Gemini Live API, displays transcriptions,
 * shows audio visualization, and handles session timing.
 * 
 * Requirements: 3.1, 3.2, 4.1, 5.1, 7.1
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeminiLiveService } from '../services/geminiLiveService';
import { type ChatMessage, type DebateAnalysis, DebateStyle } from '../types';

// Global singleton to prevent multiple connections across all instances
let globalConnectionLock = false;
let globalService: GeminiLiveService | null = null;

/**
 * Props for DebateLive component
 */
interface DebateLiveProps {
  topic: string;
  style: DebateStyle;
  durationMinutes: number;
  onAnalysisComplete: (analysis: DebateAnalysis) => void;
  onBack: () => void;
}

/**
 * DebateLive Component
 * 
 * Handles the live debate session with real-time audio streaming,
 * transcription display, and session management.
 */
export default function DebateLive({
  topic,
  style,
  durationMinutes,
  onAnalysisComplete, // Will be used in task 21
  onBack,
}: DebateLiveProps) {
  // Component state (Requirement 3.1, 3.2, 4.1, 5.1, 7.1)
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  // Refs for service and messages array
  const serviceRef = useRef<GeminiLiveService | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const hasConnectedRef = useRef<boolean>(false);

  // Keep messages ref in sync with state for closure access
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  /**
   * Format time in MM:SS format
   * Requirement 7.3: Timer format follows MM:SS pattern
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Handle session stop - disconnect and trigger analysis
   * Requirements 7.4, 8.1, 8.2, 8.3, 8.4, 8.5
   */
  const handleStop = async () => {
    console.log('🛑 Stopping debate session...');
    
    // Clear timer interval (Requirement 8.2)
    if (timerIntervalRef.current !== null) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    // Store service reference before disconnecting
    const currentService = serviceRef.current;
    const currentMessages = messagesRef.current;

    // Disconnect service FIRST (Requirements 8.2, 8.3, 8.4)
    if (currentService) {
      await currentService.disconnect();
    }
    
    // Clear global locks
    globalConnectionLock = false;
    globalService = null;

    // Trigger analysis generation AFTER disconnection (Requirement 8.5)
    if (currentService && currentMessages.length > 0) {
      try {
        setIsAnalyzing(true);
        const analysis = await currentService.analyzeDebate(currentMessages, topic);
        
        // Check if analysis is null (no participation detected) - AC2, AC5
        if (analysis === null) {
          setIsAnalyzing(false);
          // Don't save to history (AC5) - just show error and return
          setErrorMsg('No participation detected. We didn\'t hear you speak during this session. Please check your microphone and try again.');
          
          // Auto-return to dashboard after 5 seconds
          setTimeout(() => {
            onBack();
          }, 5000);
          return;
        }
        
        onAnalysisComplete(analysis);
      } catch (error) {
        console.error('Failed to generate analysis:', error);
        setIsAnalyzing(false);
        setErrorMsg('Failed to generate analysis. Please try again.');
        setTimeout(() => {
          onBack();
        }, 3000);
      }
    } else {
      // No messages to analyze, just go back
      onBack();
    }
  };

  // Initialize GeminiLiveService and connect on mount (Requirements 3.1, 3.2, 3.3, 11.1, 11.2)
  useEffect(() => {
    // GLOBAL singleton check - absolutely prevent double connections
    if (globalConnectionLock || globalService) {
      console.log('🚫 BLOCKED: Another connection is already active globally');
      return;
    }
    
    // Prevent double connection in React Strict Mode or multiple renders
    if (hasConnectedRef.current || serviceRef.current) {
      console.log('⚠️ Connection already initiated, skipping...');
      return;
    }
    
    // Lock globally
    globalConnectionLock = true;
    hasConnectedRef.current = true;

    // Get API key from localStorage (Settings) first, then fallback to env
    const storedApiKey = localStorage.getItem('debate_master_api_key') || '';
    const envApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    const apiKey = storedApiKey || envApiKey;

    if (!apiKey || apiKey === 'your_api_key_here') {
      setErrorMsg('API key not configured. Please go to Settings to add your Gemini API key.');
      return;
    }

    // Get live model from localStorage
    const liveModel = localStorage.getItem('mindmelee_live_model') || 'gemini-2.5-flash-native-audio-preview-12-2025';

    // Initialize GeminiLiveService with callbacks
    const service = new GeminiLiveService(
      apiKey,
      liveModel,
      // onTranscript callback - update messages state AND transcript display
      (text: string, isUser: boolean, isFinal: boolean) => {
        const role = isUser ? 'user' : 'model';
        
        // Update messages for analysis
        setMessages((prevMessages) => {
          const currentMessages = [...prevMessages];

          const lastMessageIndex = currentMessages.findIndex(
            (msg, idx) =>
              msg.role === role &&
              !msg.isFinal &&
              idx === currentMessages.length - 1
          );

          if (lastMessageIndex !== -1 && !isFinal) {
            const existingMessage = currentMessages[lastMessageIndex];
            if (existingMessage) {
              currentMessages[lastMessageIndex] = {
                ...existingMessage,
                text,
                isFinal,
              };
            }
          } else {
            const newMessage: ChatMessage = {
              id: `${Date.now()}-${Math.random()}`,
              role,
              text,
              timestamp: Date.now(),
              isFinal,
            };
            currentMessages.push(newMessage);
          }

          return currentMessages;
        });

        // No longer need transcript display logic - messages are shown directly
      },
      // onStatusChange callback - update connection indicator (Requirement 3.3)
      (isConnected: boolean) => {
        setIsConnected(isConnected);
      },
      // onAudioLevel callback - update audio visualizer
      (level: number) => {
        setAudioLevel(Math.floor(level / 20)); // Convert to 0-5 range for bars
      },
      // onError callback - display error messages (Requirement 11.2, 11.3)
      (error: Error) => {
        console.error('Gemini Live Service Error:', error);
        setErrorMsg(error.message);
      }
    );

    serviceRef.current = service;
    globalService = service; // Store globally

    // Connect to Gemini Live API (Requirement 3.2)
    const initConnection = async () => {
      try {
        await service.connect(topic, style);

        // Add system message to indicate session start
        setMessages([{
          id: `system-${Date.now()}`,
          role: 'system',
          text: `Debate session started: ${topic}`,
          timestamp: Date.now(),
          isFinal: true,
        }]);
      } catch (error) {
        console.error('Failed to connect:', error);
        setErrorMsg(
          error instanceof Error
            ? error.message
            : 'Failed to connect to Gemini Live API'
        );
      }
    };

    void initConnection();

    // Cleanup on unmount (Requirement 8.2, 8.3, 8.4)
    return () => {
      console.log('🧹 Cleaning up DebateLive component...');
      
      // Clear timer interval
      if (timerIntervalRef.current !== null) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }

      // Disconnect service
      if (serviceRef.current) {
        void serviceRef.current.disconnect();
        serviceRef.current = null;
      }
      
      // Reset ALL locks
      globalConnectionLock = false;
      globalService = null;
      hasConnectedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once on mount

  /**
   * Timer effect - increment elapsed seconds and auto-stop when duration reached
   * Requirements 7.1, 7.2, 7.3, 7.4
   */
  useEffect(() => {
    // Only start timer when connected
    if (!isConnected) {
      return;
    }

    // Set up interval timer (Requirement 7.1)
    timerIntervalRef.current = window.setInterval(() => {
      setElapsedSeconds((prev) => {
        const newElapsed = prev + 1;

        // Check if duration reached (Requirement 7.4)
        const durationSeconds = durationMinutes * 60;
        if (newElapsed >= durationSeconds) {
          // Auto-stop session
          void handleStop();
        }

        return newElapsed;
      });
    }, 1000); // Increment every second (Requirement 7.2)

    // Clear interval on cleanup
    return () => {
      if (timerIntervalRef.current !== null) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [isConnected, durationMinutes]); // Re-run if connection state or duration changes



  // Calculate remaining time and check if low
  const remainingSeconds = Math.max(0, durationMinutes * 60 - elapsedSeconds);
  const isLowTime = remainingSeconds < 60;

  // Loading screen for analysis generation (Requirements 15.1, 15.2, 15.3, 15.4)
  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-nav-black text-nav-cream">
        {/* Spinning icon (Requirement 15.2) */}
        <div className="mb-6">
          <svg
            className="w-16 h-16 text-nav-lime animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>

        {/* "Generating Report" message (Requirement 15.3) */}
        <h2 className="text-2xl font-bold text-nav-cream mb-2">
          Generating Report
        </h2>

        {/* Descriptive subtitle (Requirement 15.4) */}
        <p className="text-nav-cream/70 text-center max-w-md">
          Analyzing your debate performance and preparing detailed feedback...
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      
      {/* Animated Grid Background - CodeJam Style */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(white 2px, transparent 2px), linear-gradient(90deg, white 2px, transparent 2px)',
          backgroundSize: '100px 100px'
        }} />
      </div>

      {/* Diagonal Accent Stripes */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute h-full w-2 bg-nav-lime"
            style={{
              left: `${i * 8}%`,
              transform: 'skewX(-15deg)',
            }}
          />
        ))}
      </div>

      {/* Top Bar - CodeJam Style */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="absolute top-0 left-0 right-0 z-30 p-6 flex items-center justify-between"
      >
        {/* Topic Badge */}
        <div className="bg-white rounded-2xl px-6 py-3 shadow-[0_6px_0_rgb(0,0,0)] border-4 border-black max-w-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-nav-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-widest font-black text-gray-500">Topic</div>
              <div className="text-sm font-black uppercase tracking-tight truncate text-black">{topic}</div>
            </div>
          </div>
        </div>

        {/* Mode & Status */}
        <div className="flex gap-3">
          <div className={`rounded-2xl px-6 py-3 shadow-[0_6px_0_rgb(0,0,0)] border-4 border-black ${
            style === DebateStyle.COACH ? 'bg-sky-400' : 'bg-orange-400'
          }`}>
            <div className="text-sm font-black uppercase tracking-tight text-black">
              {style === DebateStyle.COACH ? 'Coach' : 'Fierce'}
            </div>
          </div>
          
          {isConnected && (
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="bg-red-500 rounded-2xl px-6 py-3 shadow-[0_6px_0_rgb(0,0,0)] border-4 border-black"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-black rounded-full" />
                <div className="text-sm font-black uppercase tracking-tight text-black">Live</div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Connecting Screen - Centered */}
      {!isConnected && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 mx-auto mb-8 bg-nav-lime rounded-[2rem] shadow-[0_12px_0_rgb(140,174,0)] border-4 border-black flex items-center justify-center"
            >
              <div className="w-16 h-16 bg-black rounded-2xl" />
            </motion.div>
            <h1 className="text-8xl font-black uppercase tracking-tighter text-white mb-4">
              DEBATE
            </h1>
            <div className="text-nav-lime text-xl font-black uppercase tracking-[0.3em]">
              Connecting...
            </div>
          </motion.div>
        </div>
      )}

      {/* Left Side - Timer & Controls */}
      {isConnected && (
        <div className="absolute left-[15%] top-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-8">
          <motion.div
            key="timer"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            {/* Timer Card */}
            <motion.div 
              animate={isLowTime ? { 
                scale: [1, 1.05, 1],
                rotate: [0, -1, 1, 0]
              } : {}}
              transition={{ duration: 0.5, repeat: isLowTime ? Infinity : 0 }}
              className={`inline-block rounded-[3rem] px-16 py-10 shadow-[0_16px_0_rgb(0,0,0)] border-[6px] border-black ${
                isLowTime ? 'bg-red-500' : 'bg-nav-lime'
              }`}
            >
              <div className="text-[10rem] font-black text-black leading-none tabular-nums tracking-tighter">
                {formatTime(remainingSeconds)}
              </div>
            </motion.div>
            
            {/* Audio Bars */}
            <div className="flex justify-center gap-2 mt-6">
              {[...Array(7)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-4 bg-white rounded-full"
                  animate={{
                    height: audioLevel > i ? 40 + (i * 8) : 20,
                    opacity: audioLevel > i ? 1 : 0.3
                  }}
                  transition={{ duration: 0.1 }}
                />
              ))}
            </div>
          </motion.div>

          {/* End Button */}
          <motion.button
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onClick={handleStop}
            className="bg-red-500 hover:bg-red-600 rounded-xl px-10 py-4 shadow-[0_6px_0_rgb(153,27,27)] border-4 border-black font-black uppercase tracking-tight text-lg text-black transition-all hover:shadow-[0_8px_0_rgb(153,27,27)] hover:-translate-y-1 active:shadow-none active:translate-y-2 flex items-center gap-3"
          >
            <div className="w-6 h-6 bg-black rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-red-500 rounded-sm" />
            </div>
            End Debate
          </motion.button>
        </div>
      )}

      {/* Right Side - Transcript Feed */}
      {isConnected && (
        <div className="absolute right-[10%] top-24 bottom-8 w-[40%] z-20">
          {/* Fade overlay at top */}
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
          
          <div className="relative h-full flex flex-col-reverse gap-4 overflow-hidden">
            <AnimatePresence initial={false}>
              {messages.filter(m => m.role !== 'system').slice(-5).reverse().map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ x: 100, opacity: 0, scale: 0.9 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -50, opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  className={`rounded-xl p-4 shadow-[0_6px_0_rgb(0,0,0)] border-4 border-black ${
                    message.role === 'user' ? 'bg-sky-400 shadow-[0_6px_0_rgb(3,105,161)]' : 'bg-purple-400 shadow-[0_6px_0_rgb(126,34,206)]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-black">
                      <div className={`font-black text-lg ${
                        message.role === 'user' ? 'text-sky-400' : 'text-purple-400'
                      }`}>
                        {message.role === 'user' ? 'Y' : 'AI'}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[9px] uppercase tracking-widest font-black text-black/60 mb-1">
                        {message.role === 'user' ? 'You' : 'AI Opponent'}
                      </div>
                      <p className="text-black font-bold text-sm leading-relaxed break-words">{message.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Fade overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
        </div>
      )}

      {/* Error display - CodeJam Style */}
      {errorMsg && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40 max-w-md">
          <div className="bg-red-500/10 border-2 border-red-500/50 rounded-2xl p-6 backdrop-blur-md animate-in fade-in slide-in-from-top-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-red-400 font-black text-sm uppercase tracking-wide mb-1">Connection Error</p>
                <p className="text-white text-sm leading-relaxed">{errorMsg}</p>
              </div>
              <button
                onClick={() => setErrorMsg(null)}
                className="text-red-400 hover:text-red-300 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
