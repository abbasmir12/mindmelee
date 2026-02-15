/**
 * ConfidenceTrendChart component - Displays confidence level progression over time
 */

import { SessionHistoryItem } from '../types';

interface ConfidenceTrendChartProps {
  sessions: SessionHistoryItem[];
}

export default function ConfidenceTrendChart({ sessions }: ConfidenceTrendChartProps) {
  // Filter sessions that have confidence data and sort by date
  const sessionsWithConfidence = sessions
    .filter(s => s.confidenceLevel)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-10); // Show last 10 sessions

  if (sessionsWithConfidence.length === 0) {
    return (
      <div className="group relative bg-[#111] border border-white/10 rounded-[2.5rem] p-1 overflow-hidden">
        <div className="bg-[#151515] rounded-[2.3rem] p-6 md:p-8 h-full relative z-10">
          <h3 className="text-white text-xl font-black mb-4 uppercase tracking-tight">Confidence Trend</h3>
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">No confidence data available yet</p>
          </div>
        </div>
      </div>
    );
  }

  // Convert confidence levels to numeric values for charting
  const confidenceToValue = (level: string | undefined): number => {
    switch (level) {
      case 'Low': return 25;
      case 'Medium': return 50;
      case 'High': return 75;
      case 'Unstoppable': return 100;
      default: return 0;
    }
  };

  const maxValue = 100;
  const chartHeight = 200;

  return (
    <div className="group relative bg-[#111] border border-white/10 rounded-[2.5rem] p-1 overflow-hidden hover:border-white/20 transition-colors">
      <div className="bg-[#151515] rounded-[2.3rem] p-6 md:p-8 h-full relative z-10">
        <h3 className="text-white text-xl font-black mb-6 uppercase tracking-tight">Confidence Progression</h3>
        
        {/* Chart */}
        <div className="relative" style={{ height: `${chartHeight}px` }}>
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 pr-2 font-bold uppercase">
            <span>100</span>
            <span>75</span>
            <span>50</span>
            <span>25</span>
          </div>

          {/* Chart area */}
          <div className="ml-12 h-full relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="border-t border-white/5" />
              ))}
            </div>

            {/* Data visualization */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              {/* Area fill */}
              <defs>
                <linearGradient id="confidenceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgb(163, 230, 53)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="rgb(163, 230, 53)" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {sessionsWithConfidence.length > 1 && (
                <>
                  {/* Area path */}
                  <path
                    d={`
                      M 0,${chartHeight}
                      ${sessionsWithConfidence.map((session, index) => {
                        const x = (index / (sessionsWithConfidence.length - 1)) * 100;
                        const value = confidenceToValue(session.confidenceLevel);
                        const y = chartHeight - (value / maxValue) * chartHeight;
                        return `L ${x}%,${y}`;
                      }).join(' ')}
                      L 100%,${chartHeight}
                      Z
                    `}
                    fill="url(#confidenceGradient)"
                  />

                  {/* Line path */}
                  <path
                    d={sessionsWithConfidence.map((session, index) => {
                      const x = (index / (sessionsWithConfidence.length - 1)) * 100;
                      const value = confidenceToValue(session.confidenceLevel);
                      const y = chartHeight - (value / maxValue) * chartHeight;
                      return `${index === 0 ? 'M' : 'L'} ${x}%,${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="rgb(163, 230, 53)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              )}

              {/* Data points */}
              {sessionsWithConfidence.map((session, index) => {
                const x = (index / Math.max(sessionsWithConfidence.length - 1, 1)) * 100;
                const value = confidenceToValue(session.confidenceLevel);
                const y = chartHeight - (value / maxValue) * chartHeight;
                
                return (
                  <g key={session.id}>
                    <circle
                      cx={`${x}%`}
                      cy={y}
                      r="5"
                      fill="rgb(163, 230, 53)"
                      stroke="rgb(21, 21, 21)"
                      strokeWidth="2"
                    />
                    <circle
                      cx={`${x}%`}
                      cy={y}
                      r="8"
                      fill="transparent"
                      className="hover:fill-nav-lime/20 transition-all cursor-pointer"
                    >
                      <title>{`${session.confidenceLevel} - ${new Date(session.date).toLocaleDateString()}`}</title>
                    </circle>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Stats summary */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { level: 'Low', color: 'bg-red-500' },
            { level: 'Medium', color: 'bg-amber-500' },
            { level: 'High', color: 'bg-nav-lime' },
            { level: 'Unstoppable', color: 'bg-emerald-500' }
          ].map(({ level, color }) => {
            const count = sessionsWithConfidence.filter(s => s.confidenceLevel === level).length;
            const percentage = Math.round((count / sessionsWithConfidence.length) * 100);
            
            return (
              <div key={level} className="bg-[#111] border border-white/10 rounded-xl p-3 text-center">
                <div className={`w-3 h-3 ${color} rounded-full mx-auto mb-2`} />
                <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{level}</div>
                <div className="text-white text-2xl font-black">{count}</div>
                <div className="text-gray-500 text-xs font-bold">{percentage}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
