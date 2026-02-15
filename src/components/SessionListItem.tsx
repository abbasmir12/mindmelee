import { useState } from 'react';
import { SessionHistoryItem } from '../types';
import { ChevronDown, ChevronUp, Calendar, Clock, Trophy } from 'lucide-react';

interface SessionListItemProps {
  session: SessionHistoryItem;
  rank?: number;
}

export default function SessionListItem({ session, rank }: SessionListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes === 0) {
      return `${remainingSeconds}s`;
    }
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-nav-lime';
    if (score >= 60) return 'text-emerald-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-nav-lime/10';
    if (score >= 60) return 'bg-emerald-400/10';
    if (score >= 40) return 'bg-amber-400/10';
    return 'bg-red-400/10';
  };

  return (
    <div
      className={`group relative bg-[#111] border rounded-[1.5rem] p-1 transition-all duration-200 hover:border-white/30 cursor-pointer ${
        rank ? 'border-2 border-nav-lime/50' : 'border-white/10'
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="bg-[#151515] rounded-[1.3rem] p-4 md:p-5 relative z-10">
        {/* Main Content */}
        <div className="flex items-start justify-between gap-3 md:gap-4">
          <div className="flex-1 min-w-0">
            {/* Topic */}
            <div className="flex items-center gap-2 mb-2">
              {rank && (
                <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-nav-lime/20 text-nav-lime text-xs font-black">
                  #{rank}
                </div>
              )}
              <h3 className="text-sm md:text-base font-black text-white truncate uppercase tracking-tight">{session.topic}</h3>
            </div>

            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 font-medium">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(session.date)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatDuration(session.durationSeconds)}</span>
              </div>
            </div>
          </div>

          {/* Score Badge */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl ${getScoreBgColor(
                session.score
              )} border border-white/10`}
            >
              <Trophy className={`w-4 h-4 ${getScoreColor(session.score)}`} />
              <span className={`text-sm font-black ${getScoreColor(session.score)}`}>
                {session.score}
              </span>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-white/10 animate-fadeIn">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Session ID</p>
                <p className="text-white font-mono text-xs truncate">{session.id}</p>
              </div>
              <div>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Time</p>
                <p className="text-white text-sm font-medium">{formatTime(session.date)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Duration</p>
                <p className="text-white text-sm font-medium">{formatDuration(session.durationSeconds)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Performance</p>
                <p className={`font-black text-sm ${getScoreColor(session.score)}`}>{session.score}/100</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
