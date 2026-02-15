/**
 * Settings component - CodeJam style with API configuration
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Cpu, BarChart3, Eye, EyeOff, Check, Shield } from 'lucide-react';

interface SettingsProps {
  onBack: () => void;
}

interface ModelConfig {
  id: string;
  name: string;
  description: string;
  deprecated?: boolean;
}

const LIVE_MODELS: ModelConfig[] = [
  { id: 'gemini-2.5-flash-native-audio-preview-12-2025', name: 'Gemini 2.5 Flash Native Audio', description: 'Latest native audio support (Recommended)' },
  { id: 'gemini-2.5-pro-preview-tts', name: 'Gemini 2.5 Pro TTS', description: 'Advanced TTS with low latency' },
  { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash Exp (Deprecated)', description: 'Experimental - Use 2.5 models instead', deprecated: true },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash (Deprecated)', description: 'Shutdown: March 31, 2026', deprecated: true },
];

const ANALYSIS_MODELS: ModelConfig[] = [
  { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro (Preview)', description: 'Most advanced analysis' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', description: 'Advanced reasoning' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Fast analysis' },
];

function ModelSelector({ 
  models, 
  selected, 
  onSelect 
}: { 
  models: ModelConfig[]; 
  selected: string; 
  onSelect: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const currentModel = models.find(m => m.id === selected) || models[0];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-[#111] border border-white/10 rounded-2xl hover:border-white/30 transition-colors"
      >
        <div className="flex flex-col items-start gap-1">
          <span className="font-bold uppercase tracking-wide text-white text-sm">{currentModel?.name || 'Select Model'}</span>
          <span className="text-xs text-gray-500">{currentModel?.description || ''}</span>
        </div>
        <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 max-h-60 overflow-y-auto"
          >
            {models.map(model => (
              <button
                key={model.id}
                onClick={() => {
                  onSelect(model.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors text-left ${
                  selected === model.id ? 'bg-white/10 text-nav-lime' : model.deprecated ? 'text-gray-600' : 'text-gray-400'
                }`}
              >
                <div className="flex-1">
                  <div className={`font-bold uppercase tracking-wide text-sm ${model.deprecated ? 'line-through' : ''}`}>
                    {model.name}
                  </div>
                  <div className={`text-xs ${model.deprecated ? 'text-red-500/70' : 'text-gray-500'}`}>
                    {model.description}
                  </div>
                </div>
                {selected === model.id && <Check size={16} className="ml-auto" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Settings({ onBack }: SettingsProps) {
  const [apiKey, setApiKey] = useState('');
  const [liveModel, setLiveModel] = useState('gemini-2.5-flash-native-audio-preview-12-2025');
  const [analysisModel, setAnalysisModel] = useState('gemini-2.5-flash');
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [apiConnected, setApiConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const savedApiKey = localStorage.getItem('mindmelee_api_key') || '';
    const savedLiveModel = localStorage.getItem('mindmelee_live_model') || 'gemini-2.5-flash-native-audio-preview-12-2025';
    const savedAnalysisModel = localStorage.getItem('mindmelee_analysis_model') || 'gemini-2.5-flash';

    setApiKey(savedApiKey);
    setLiveModel(savedLiveModel);
    setAnalysisModel(savedAnalysisModel);

    // Check if API is connected on mount
    if (savedApiKey) {
      testApiConnection(savedApiKey);
    }
  }, []);

  const testApiConnection = async (key: string) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
      );
      
      if (response.ok) {
        setApiConnected(true);
        setErrorMessage('');
        return true;
      } else {
        const error = await response.json();
        setApiConnected(false);
        setErrorMessage(error.error?.message || 'Invalid API key');
        return false;
      }
    } catch (error) {
      setApiConnected(false);
      setErrorMessage('Failed to connect to API');
      return false;
    }
  };

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setSaveStatus('error');
      setErrorMessage('API key is required');
      return;
    }

    setSaveStatus('saving');
    setErrorMessage('');

    // Test API connection
    const isValid = await testApiConnection(apiKey);

    if (isValid) {
      localStorage.setItem('mindmelee_api_key', apiKey);
      localStorage.setItem('mindmelee_live_model', liveModel);
      localStorage.setItem('mindmelee_analysis_model', analysisModel);

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } else {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-300 mx-auto min-h-screen relative">
      
      {/* HEADER */}
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-[#FDF9F0] leading-[0.9]">
          System<br/>
          <span className="text-sky-500">Config.</span>
        </h1>
        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
          <div className={`w-2 h-2 rounded-full ${apiConnected ? 'bg-nav-lime animate-pulse' : 'bg-red-500'}`} />
          <span className="text-xs font-bold uppercase tracking-widest text-white/60">
            {apiConnected ? 'API Connected' : 'API Not Connected'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT COL: Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            <button className="w-full flex items-center gap-4 px-4 py-3 bg-white/5 rounded-xl text-white font-bold text-sm hover:bg-white/10 transition-colors">
              <Key size={18} className="text-sky-500" /> API Configuration
            </button>
            <button 
              onClick={onBack}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 font-bold text-sm hover:text-white hover:bg-white/5 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Back to Dashboard
            </button>
          </nav>

          {/* Info Card */}
          <div className="mt-8 bg-sky-900/20 border border-sky-500/30 rounded-2xl p-6">
            <Shield size={24} className="text-sky-500 mb-3" />
            <h3 className="text-white font-black text-sm uppercase tracking-wide mb-2">Secure Storage</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Your API key is stored locally in your browser. It never leaves your device.
            </p>
          </div>
        </div>

        {/* RIGHT COL: Configuration */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* API Key Section */}
          <div className="group relative">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-nav-lime mb-4">
              <Key size={12} /> Google Gemini API Key
            </label>
            
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key..."
                className="w-full bg-[#111] border border-white/10 rounded-2xl px-6 py-4 text-white font-mono text-sm focus:outline-none focus:border-sky-500 transition-colors pr-12"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showApiKey ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              Get your free API key from{' '}
              <a 
                href="https://aistudio.google.com/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sky-500 hover:underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>

          {/* Error Message - CodeJam Style */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#111] border-2 border-red-500/50 rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-red-500/5" />
              <div className="relative z-10 flex items-start gap-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-red-400 font-black text-sm uppercase tracking-wide mb-1">Connection Failed</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{errorMessage}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Live Debate Model */}
          <div className="group relative">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-nav-orange mb-4">
              <Cpu size={12} /> Live Debate Model
            </label>
            <div className="bg-[#111] border border-white/10 p-6 rounded-[2rem] hover:border-white/30 transition-colors relative">
              <div className="absolute top-0 left-0 bottom-0 w-2 bg-nav-orange rounded-l-[2rem]" />
              <ModelSelector 
                models={LIVE_MODELS}
                selected={liveModel}
                onSelect={setLiveModel}
              />
              <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                Used for real-time voice debate sessions with bidirectional audio streaming.
              </p>
            </div>
          </div>

          {/* Analysis Model */}
          <div className="group relative">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-sky-500 mb-4">
              <BarChart3 size={12} /> Analysis Model
            </label>
            <div className="bg-[#111] border border-white/10 p-6 rounded-[2rem] hover:border-white/30 transition-colors relative">
              <div className="absolute top-0 left-0 bottom-0 w-2 bg-sky-500 rounded-l-[2rem]" />
              <ModelSelector 
                models={ANALYSIS_MODELS}
                selected={analysisModel}
                onSelect={setAnalysisModel}
              />
              <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                Used for post-debate performance analysis and detailed feedback generation.
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-8 border-t border-white/10">
            <button
              onClick={handleSave}
              disabled={!apiKey.trim() || saveStatus === 'saving'}
              className="w-full py-4 bg-sky-500 hover:bg-sky-600 text-white font-black uppercase tracking-wide rounded-xl transition-all shadow-[0_8px_0_rgb(3,105,161)] active:shadow-none active:translate-y-2 flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {saveStatus === 'saving' && 'Testing API...'}
              {saveStatus === 'saved' && <><Check size={20} /> Saved Successfully!</>}
              {saveStatus === 'error' && 'Failed to Connect'}
              {saveStatus === 'idle' && 'Save Configuration'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
