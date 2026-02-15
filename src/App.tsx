import { useState, lazy, Suspense } from 'react';
import { AppView, DebateStyle, DebateAnalysis } from './types';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import DebateLive from './components/DebateLive';
import SessionSummary from './components/SessionSummary';
import Settings from './components/Settings';
import Activity from './components/Activity';
import Achievements from './components/Achievements';
import { saveSession } from './services/storageService';

// Lazy load PersonaShowcase for better performance
const PersonaShowcase = lazy(() => import('./components/PersonaShowcase'));

function App() {
  // Global state management
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [currentStyle, setCurrentStyle] = useState<DebateStyle>(DebateStyle.COACH);
  const [currentDuration, setCurrentDuration] = useState<number>(5);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [lastAnalysis, setLastAnalysis] = useState<DebateAnalysis | null>(null);
  const [profileImage, setProfileImage] = useState<string>(
    localStorage.getItem('mindmelee_profile_image') || ''
  );
  const [userName, setUserName] = useState<string>(
    localStorage.getItem('mindmelee_user_name') || 'User One'
  );
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [forceShowSettings, setForceShowSettings] = useState<boolean>(false);

  // API key validation - check localStorage first, then env
  const storedApiKey = localStorage.getItem('mindmelee_api_key') || '';
  const envApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  const apiKey = storedApiKey || envApiKey;
  const apiKeyMissing = !apiKey || apiKey === 'your_api_key_here';

  /**
   * Transition to Live Arena view
   * Requirement 12.1: Navigate to Live Arena when user starts debate
   */
  const startDebate = (topic: string, style: DebateStyle, duration: number) => {
    setCurrentTopic(topic);
    setCurrentStyle(style);
    setCurrentDuration(duration);
    setSessionStartTime(Date.now());
    setCurrentView(AppView.DEBATE_LIVE);
  };

  /**
   * Store analysis and show Summary view
   * Requirement 12.2: Navigate to Summary after analysis completes
   */
  const handleAnalysisComplete = (analysis: DebateAnalysis) => {
    // Calculate actual session duration
    const durationSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
    
    // Save session with analysis data
    saveSession(currentTopic, durationSeconds, analysis);
    
    setLastAnalysis(analysis);
    setCurrentView(AppView.SUMMARY);
  };

  /**
   * Reset state and return to Dashboard
   * Requirement 12.3: Navigate back to Dashboard from other views
   */
  const goBackToDashboard = () => {
    setCurrentView(AppView.DASHBOARD);
    setCurrentTopic('');
    setLastAnalysis(null);
  };

  /**
   * Navigate to Settings view
   */
  const goToSettings = () => {
    setCurrentView(AppView.SETTINGS);
    setForceShowSettings(true);
  };

  /**
   * Navigate to Activity view
   * Requirement 1.1: Navigate to Activity when user clicks Activity button
   */
  const goToActivity = () => {
    setCurrentView(AppView.ACTIVITY);
  };

  /**
   * Navigate to Persona view
   * Requirement 1.1: Navigate to Persona when user clicks Persona button
   */
  const goToPersona = () => {
    setCurrentView(AppView.PERSONA);
  };

  /**
   * Navigate to Achievements view
   */
  const goToAchievements = () => {
    setCurrentView(AppView.ACHIEVEMENTS);
  };

  /**
   * Handle profile image upload
   */
  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setProfileImage(imageData);
        localStorage.setItem('mindmelee_profile_image', imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  // Show landing page first
  if (showLanding) {
    return <Landing onEnter={() => setShowLanding(false)} />;
  }

  // Error screen for missing API key - NO SIDEBAR
  if (apiKeyMissing && !forceShowSettings) {
    return (
      <div className="min-h-screen bg-nav-black flex items-center justify-center p-8">
        <div className="max-w-2xl w-full bg-[#111] border-2 border-red-500/50 rounded-[2rem] p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-red-500/5" />
          
          <div className="relative z-10">
            <div className="w-20 h-20 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">
              API Key Required
            </h1>
            
            <p className="text-gray-400 mb-8 text-base md:text-lg font-medium">
              MindMelee requires a Google Gemini API key to function.
            </p>
            
            <div className="bg-[#151515] border border-white/10 rounded-2xl p-6 text-left mb-8">
              <h2 className="text-white font-black text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Quick Setup
              </h2>
              <ol className="text-gray-300 space-y-3 list-decimal list-inside text-sm leading-relaxed">
                <li>
                  Get your API key from{' '}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-500 hover:text-sky-400 underline font-medium"
                  >
                    Google AI Studio
                  </a>
                </li>
                <li>Click the button below to open Settings</li>
                <li>Paste your API key and save</li>
              </ol>
            </div>
            
            <button
              onClick={goToSettings}
              className="w-full px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white font-black uppercase tracking-wide rounded-xl transition-all shadow-[0_8px_0_rgb(3,105,161)] active:shadow-none active:translate-y-2 mb-6"
            >
              Open Settings
            </button>
            
            <p className="text-gray-500 text-xs">
              Your API key is stored locally and never sent to any server except Google's Gemini API.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Get header title based on current view
   * Requirement 12.4: Header title matches current view
   */

  /**
   * Render appropriate view based on currentView state
   * Requirements: 12.1, 12.2, 12.3, 12.5, 13.4
   */
  return (
    <div className="min-h-screen bg-[#111111] flex">
      {/* Sidebar - CodeJam Style */}
      {currentView !== AppView.DEBATE_LIVE && (
        <aside className="hidden md:flex w-64 bg-[#111111] border-r border-white/10 flex-col p-4 fixed left-0 top-0 bottom-0 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-1.5 mb-10">
          <div className="bg-nav-lime p-2 rounded-xl shrink-0">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-white font-black text-2xl tracking-tight">MindMelee</span>
        </div>

        {/* User Profile Section */}
        <div className="px-6 py-6 ">
          <div className="flex flex-col items-center">
            <label htmlFor="profile-upload" className="cursor-pointer group">
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                className="hidden"
              />
              <div className="relative">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-3 border-nav-lime/30 group-hover:border-nav-lime/60 transition-all duration-200"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-nav-lime to-nav-yellow flex items-center justify-center border-3 border-nav-lime/30 group-hover:border-nav-lime/60 transition-all duration-200">
                    <svg
                      className="w-10 h-10 text-nav-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-nav-lime"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>
            </label>
            {isEditingName ? (
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onBlur={() => {
                  setIsEditingName(false);
                  localStorage.setItem('mindmelee_user_name', userName);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsEditingName(false);
                    localStorage.setItem('mindmelee_user_name', userName);
                  }
                }}
                autoFocus
                className="text-white font-semibold text-base mt-3 bg-transparent border-b-2 border-lime-400 outline-none text-center px-2"
              />
            ) : (
              <div className="text-white font-semibold text-base mt-3">{userName}</div>
            )}
            <button 
              onClick={() => setIsEditingName(true)}
              className="text-nav-cream/70 text-xs mt-2 hover:text-nav-lime transition-colors duration-200 font-medium"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Navigation - CodeJam Style */}
        <nav className="flex-1 space-y-2">
          <button
            onClick={goBackToDashboard}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-bold relative overflow-hidden ${
              currentView === AppView.DASHBOARD
                ? 'text-black'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {currentView === AppView.DASHBOARD && (
              <div className="absolute inset-0 bg-nav-lime" />
            )}
            <svg
              className="w-5 h-5 relative z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            <span className="relative z-10">Dashboard</span>
          </button>

          <button
            onClick={goToActivity}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-bold relative overflow-hidden ${
              currentView === AppView.ACTIVITY
                ? 'text-black'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {currentView === AppView.ACTIVITY && (
              <div className="absolute inset-0 bg-nav-lime" />
            )}
            <svg
              className="w-5 h-5 relative z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="relative z-10">Activity</span>
          </button>

          <button
            onClick={goToPersona}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-bold relative overflow-hidden ${
              currentView === AppView.PERSONA
                ? 'text-black'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {currentView === AppView.PERSONA && (
              <div className="absolute inset-0 bg-nav-lime" />
            )}
            <svg
              className="w-5 h-5 relative z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="relative z-10">Persona</span>
          </button>

          <button
            onClick={goToAchievements}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-bold relative overflow-hidden ${
              currentView === AppView.ACHIEVEMENTS
                ? 'text-black'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {currentView === AppView.ACHIEVEMENTS && (
              <div className="absolute inset-0 bg-nav-lime" />
            )}
            <svg
              className="w-5 h-5 relative z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
            <span className="relative z-10">Achievements</span>
          </button>

          <button
            onClick={goToSettings}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-bold relative overflow-hidden ${
              currentView === AppView.SETTINGS
                ? 'text-black'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {currentView === AppView.SETTINGS && (
              <div className="absolute inset-0 bg-nav-lime" />
            )}
            <svg
              className="w-5 h-5 relative z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="relative z-10">Settings</span>
          </button>
        </nav>

        {/* Dark Mode Toggle at Bottom */}
        <div className="p-4">
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-slate-400 text-sm">Light</span>
            <button className="relative w-12 h-6 bg-lime-400 rounded-full transition">
              <div className="absolute right-1 top-1 w-4 h-4 bg-void rounded-full transition"></div>
            </button>
            <span className="text-white text-sm font-medium">Dark</span>
          </div>
        </div>
        </aside>
      )}

      {/* Main Content Area - NO HEADER */}
      <div className="flex-1 flex flex-col">
        {/* View Content - Full Height */}
        <main className={`flex-1 overflow-auto ${currentView === AppView.DEBATE_LIVE ? '' : 'md:ml-64'}`}>
          {currentView === AppView.DASHBOARD && (
            <div className="animate-fadeIn">
              <Dashboard onStartDebate={startDebate} onNavigateToPersona={goToPersona} />
            </div>
          )}

          {currentView === AppView.DEBATE_LIVE && (
            <div className="animate-fadeIn">
              <DebateLive
                topic={currentTopic}
                style={currentStyle}
                durationMinutes={currentDuration}
                onAnalysisComplete={handleAnalysisComplete}
                onBack={goBackToDashboard}
              />
            </div>
          )}

          {currentView === AppView.SUMMARY && lastAnalysis && (
            <div className="animate-fadeIn">
              <SessionSummary
                analysis={lastAnalysis}
                onBack={goBackToDashboard}
              />
            </div>
          )}

          {currentView === AppView.SETTINGS && (
            <div className="animate-fadeIn">
              <Settings onBack={goBackToDashboard} />
            </div>
          )}

          {currentView === AppView.ACTIVITY && (
            <div className="animate-fadeIn">
              <Activity onBack={goBackToDashboard} />
            </div>
          )}

          {currentView === AppView.PERSONA && (
            <div className="animate-fadeIn">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-400"></div>
                  </div>
                }
              >
                <PersonaShowcase onBack={goBackToDashboard} />
              </Suspense>
            </div>
          )}

          {currentView === AppView.ACHIEVEMENTS && (
            <div className="animate-fadeIn">
              <Achievements />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
