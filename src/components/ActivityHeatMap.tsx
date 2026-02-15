import { useMemo, useState } from 'react';
import { SessionHistoryItem } from '../types';

/**
 * ActivityHeatMap Component
 * Displays a calendar heat map showing activity frequency across days
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 */

interface ActivityHeatMapProps {
  sessions: SessionHistoryItem[];
}

interface HeatMapCell {
  date: Date;
  dateString: string;
  count: number;
  intensity: number; // 0-4 scale
}

function ActivityHeatMap({ sessions }: ActivityHeatMapProps) {
  const [hoveredCell, setHoveredCell] = useState<HeatMapCell | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Calculate date range: last 12 weeks - Requirement 3.1
  const { startDate, endDate } = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (12 * 7)); // 12 weeks = 84 days
    return { startDate: start, endDate: end };
  }, []);

  // Generate heat map cells with session counts and intensity - Requirements 3.1, 3.2, 3.3
  const heatMapCells = useMemo(() => {
    // Count sessions per date
    const sessionCountByDate = new Map<string, number>();
    
    sessions.forEach((session) => {
      const sessionDate = new Date(session.date);
      const dateKey = sessionDate.toISOString().split('T')[0] ?? ''; // YYYY-MM-DD
      if (dateKey) {
        sessionCountByDate.set(dateKey, (sessionCountByDate.get(dateKey) || 0) + 1);
      }
    });

    // Find max count for intensity calculation
    const maxCount = Math.max(...Array.from(sessionCountByDate.values()), 1);

    // Generate cells for each date in range
    const cells: HeatMapCell[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0] ?? '';
      const count = sessionCountByDate.get(dateKey) || 0;
      
      // Calculate intensity on 0-4 scale based on session count - Requirement 3.3
      let intensity = 0;
      if (count > 0) {
        // Scale intensity: 1-4 based on count relative to max
        const ratio = count / maxCount;
        if (ratio >= 0.75) intensity = 4;
        else if (ratio >= 0.5) intensity = 3;
        else if (ratio >= 0.25) intensity = 2;
        else intensity = 1;
      }

      cells.push({
        date: new Date(currentDate),
        dateString: dateKey,
        count,
        intensity,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return cells;
  }, [sessions, startDate, endDate]);

  // Get color class based on intensity - Requirement 3.3, 3.4
  const getIntensityColor = (intensity: number): string => {
    switch (intensity) {
      case 0:
        return 'bg-slate-800'; // No activity
      case 1:
        return 'bg-nav-lime/20';
      case 2:
        return 'bg-nav-lime/40';
      case 3:
        return 'bg-nav-lime/70';
      case 4:
        return 'bg-nav-lime'; // Highest activity
      default:
        return 'bg-slate-800';
    }
  };

  // Format date for tooltip
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Handle cell hover - Requirement 3.5
  const handleCellHover = (cell: HeatMapCell, event: React.MouseEvent) => {
    setHoveredCell(cell);
    setTooltipPosition({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleCellLeave = () => {
    setHoveredCell(null);
  };

  // Organize cells into weeks (rows of 7 days)
  const weeks: HeatMapCell[][] = [];
  for (let i = 0; i < heatMapCells.length; i += 7) {
    weeks.push(heatMapCells.slice(i, i + 7));
  }

  return (
    <div className="group relative bg-[#111] border border-white/10 rounded-[2.5rem] p-1 overflow-hidden hover:border-white/20 transition-colors">
      <div className="bg-[#151515] rounded-[2.3rem] p-6 md:p-8 h-full relative z-10">
        <h2 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Activity Heat Map</h2>
        <p className="text-xs text-gray-400 mb-6 font-medium">Last 12 weeks of practice activity</p>

        {/* Heat Map Grid - Requirements 3.1, 8.3 */}
        <div className="overflow-x-auto -mx-2 px-2">
          <div className="space-y-1.5 min-w-max">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex gap-1.5">
                {week.map((cell) => (
                  <div
                    key={cell.dateString}
                    className={`w-4 h-4 md:w-5 md:h-5 rounded-md ${getIntensityColor(
                      cell.intensity
                    )} transition-all duration-200 hover:scale-125 hover:ring-2 hover:ring-nav-lime cursor-pointer touch-manipulation`}
                    onMouseEnter={(e) => handleCellHover(cell, e)}
                    onMouseLeave={handleCellLeave}
                    onTouchStart={(e) => handleCellHover(cell, e as any)}
                    onTouchEnd={handleCellLeave}
                    title={`${formatDate(cell.date)}: ${cell.count} session${
                      cell.count !== 1 ? 's' : ''
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 mt-6 text-xs text-gray-400 font-bold">
          <span>Less</span>
          <div className="flex gap-1.5">
            <div className="w-4 h-4 rounded-md bg-slate-800" />
            <div className="w-4 h-4 rounded-md bg-nav-lime/20" />
            <div className="w-4 h-4 rounded-md bg-nav-lime/40" />
            <div className="w-4 h-4 rounded-md bg-nav-lime/70" />
            <div className="w-4 h-4 rounded-md bg-nav-lime" />
          </div>
          <span>More</span>
        </div>

        {/* Tooltip - Requirement 3.5 */}
        {hoveredCell && (
          <div
            className="fixed z-50 bg-[#111] border-2 border-nav-lime/30 rounded-xl px-4 py-2 shadow-2xl pointer-events-none"
            style={{
              left: `${tooltipPosition.x + 10}px`,
              top: `${tooltipPosition.y + 10}px`,
            }}
          >
            <div className="text-sm font-black text-white">
              {formatDate(hoveredCell.date)}
            </div>
            <div className="text-xs text-gray-400 font-medium">
              {hoveredCell.count} session{hoveredCell.count !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivityHeatMap;
