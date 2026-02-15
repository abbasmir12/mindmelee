import { useState, useMemo } from 'react';
import { SessionHistoryItem } from '../types';
import SessionListItem from './SessionListItem';
import { History, ChevronLeft, ChevronRight } from 'lucide-react';

interface SessionHistoryListProps {
  sessions: SessionHistoryItem[];
}

const ITEMS_PER_PAGE = 10;

export default function SessionHistoryList({ sessions }: SessionHistoryListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Sort sessions by date descending (most recent first)
  const sortedSessions = useMemo(() => {
    return [...sessions].sort((a, b) => {
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
      // Tie-breaking by session ID if dates are equal
      if (dateCompare === 0) {
        return b.id.localeCompare(a.id);
      }
      return dateCompare;
    });
  }, [sessions]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedSessions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedSessions = sortedSessions.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  // Empty state
  if (sessions.length === 0) {
    return (
      <div className="group relative bg-[#111] border border-white/10 rounded-[2.5rem] p-1 overflow-hidden">
        <div className="bg-[#151515] rounded-[2.3rem] p-8 md:p-12 text-center relative z-10">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-nav-lime/20 flex items-center justify-center">
              <History className="w-8 h-8 text-nav-lime" />
            </div>
          </div>
          <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">No Sessions Yet</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto font-medium">
            Start your first debate to see your session history here. Every practice session helps you
            improve!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-nav-lime/20 flex items-center justify-center">
            <History className="w-5 h-5 text-nav-lime" />
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Session History</h2>
          <span className="text-xs text-gray-500 font-bold">({sortedSessions.length})</span>
        </div>
      </div>

      {/* Session List */}
      <div className="space-y-3">
        {paginatedSessions.map((session) => (
          <SessionListItem key={session.id} session={session} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 gap-2">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-wide transition-all ${
              currentPage === 1
                ? 'bg-[#111] text-gray-600 cursor-not-allowed'
                : 'bg-sky-500 text-white hover:bg-sky-600 shadow-[0_4px_0_rgb(3,105,161)] active:shadow-none active:translate-y-1'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 font-bold">
              <span className="hidden sm:inline">Page </span>{currentPage}<span className="hidden sm:inline"> of {totalPages}</span><span className="sm:hidden">/{totalPages}</span>
            </span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-wide transition-all ${
              currentPage === totalPages
                ? 'bg-[#111] text-gray-600 cursor-not-allowed'
                : 'bg-sky-500 text-white hover:bg-sky-600 shadow-[0_4px_0_rgb(3,105,161)] active:shadow-none active:translate-y-1'
            }`}
          >
            <span className="hidden sm:inline">Next</span>
            <span className="sm:hidden">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
