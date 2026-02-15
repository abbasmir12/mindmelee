/**
 * StatCard Component
 * Reusable card component for displaying statistics with icon, title, value, and optional trend
 * Requirement 5.5
 */

import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  color?: 'lime' | 'indigo' | 'emerald' | 'amber';
}

function StatCard({ title, value, subtitle, icon, trend, color = 'lime' }: StatCardProps) {
  // Color variant classes
  const colorClasses = {
    lime: {
      iconBg: 'bg-nav-lime/10',
      iconText: 'text-nav-lime',
      valueText: 'text-nav-lime',
      trendUp: 'text-nav-lime',
      trendDown: 'text-red-400',
    },
    indigo: {
      iconBg: 'bg-indigo-500/10',
      iconText: 'text-indigo-400',
      valueText: 'text-indigo-400',
      trendUp: 'text-indigo-400',
      trendDown: 'text-red-400',
    },
    emerald: {
      iconBg: 'bg-emerald-500/10',
      iconText: 'text-emerald-400',
      valueText: 'text-emerald-400',
      trendUp: 'text-emerald-400',
      trendDown: 'text-red-400',
    },
    amber: {
      iconBg: 'bg-amber-500/10',
      iconText: 'text-amber-400',
      valueText: 'text-amber-400',
      trendUp: 'text-amber-400',
      trendDown: 'text-red-400',
    },
  };

  const colors = colorClasses[color];

  return (
    <div className="group relative bg-[#111] border border-white/10 rounded-[2.5rem] p-1 overflow-hidden hover:border-white/20 transition-colors">
      <div className="bg-[#151515] rounded-[2.3rem] p-6 h-full flex flex-col relative z-10">
        {/* Icon */}
        <div className={`w-12 h-12 ${colors.iconBg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <div className={colors.iconText}>{icon}</div>
        </div>

        {/* Title */}
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
          {title}
        </h3>

        {/* Value */}
        <div className="flex items-baseline gap-2 mb-1">
          <p className="text-4xl font-black text-white tracking-tighter">
            {value}
          </p>
          
          {/* Trend indicator */}
          {trend && (
            <span
              className={`text-sm font-bold flex items-center gap-1 ${
                trend.direction === 'up' ? colors.trendUp : colors.trendDown
              }`}
            >
              {trend.direction === 'up' ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {Math.abs(trend.value)}%
            </span>
          )}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs text-gray-400 font-medium">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

export default StatCard;
