import { SessionHistoryItem } from '../types';
import ScoreTrendChart from './ScoreTrendChart';
import DurationDistributionChart from './DurationDistributionChart';

interface ChartsSectionProps {
  sessions: SessionHistoryItem[];
}

export default function ChartsSection({ sessions }: ChartsSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
      {/* Score Trend Chart - Requirement 8.2 */}
      <div className="group relative bg-[#111] border border-white/10 rounded-[2.5rem] p-1 overflow-hidden hover:border-white/20 transition-colors animate-slideUp" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
        <div className="bg-[#151515] rounded-[2.3rem] p-6 h-full relative z-10">
          <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight">Score Trend</h3>
          <ScoreTrendChart sessions={sessions} />
        </div>
      </div>

      {/* Duration Distribution Chart - Requirement 8.2 */}
      <div className="group relative bg-[#111] border border-white/10 rounded-[2.5rem] p-1 overflow-hidden hover:border-white/20 transition-colors animate-slideUp" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
        <div className="bg-[#151515] rounded-[2.3rem] p-6 h-full relative z-10">
          <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight">Session Duration Distribution</h3>
          <DurationDistributionChart sessions={sessions} />
        </div>
      </div>
    </div>
  );
}
