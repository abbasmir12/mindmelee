import * as React from "react";
import { motion } from "framer-motion";
import { PersonaArchetype } from "@/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  Brain,
  Heart,
  Scale,
  Sword,
  Lightbulb,
  Book,
  Star,
  Target,
  Lock,
} from "lucide-react";

interface ArchetypeCardProps {
  archetype: PersonaArchetype;
  isActive: boolean;
  onClick?: () => void;
}

/**
 * Icon mapping for archetype types
 */
const getArchetypeIcon = (iconName: string) => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    brain: Brain,
    heart: Heart,
    scale: Scale,
    sword: Sword,
    lightbulb: Lightbulb,
    book: Book,
    star: Star,
    target: Target,
  };

  return icons[iconName.toLowerCase()] || Brain;
};

/**
 * ArchetypeCard component
 * Displays an archetype with icon, name, and description
 * Provides hover effects and highlights active archetype
 * Memoized for performance
 */
const ArchetypeCardComponent = ({
  archetype,
  isActive,
  onClick,
}: ArchetypeCardProps) => {
  const Icon = React.useMemo(() => getArchetypeIcon(archetype.icon), [archetype.icon]);
  const prefersReducedMotion = useReducedMotion();

  const isLocked = archetype.isLocked ?? false;

  return (
    <motion.button
      onClick={isLocked ? undefined : onClick}
      disabled={isLocked}
      className={`
        relative p-6 rounded-[2rem] text-left w-full h-full min-h-[280px]
        backdrop-blur-xl bg-nav-cream/5 border transition-colors
        focus:outline-none focus:ring-2 focus:ring-nav-lime focus:ring-offset-2 focus:ring-offset-void
        will-change-transform gpu-accelerate flex flex-col
        ${isLocked ? "opacity-60 cursor-not-allowed" : ""}
        ${
          isActive
            ? "border-nav-lime bg-nav-lime/10"
            : "border-nav-lime/10 hover:border-nav-lime/20"
        }
      `}
      whileHover={prefersReducedMotion || isLocked ? {} : { scale: 1.05 }}
      whileTap={prefersReducedMotion || isLocked ? {} : { scale: 0.98 }}
      transition={prefersReducedMotion ? {} : { type: "spring", stiffness: 300, damping: 30 }}
      style={{
        boxShadow: isActive
          ? "0 0 30px rgba(163, 230, 53, 0.25)"
          : "0 0 0px transparent",
        transform: 'translateZ(0)', // GPU acceleration
      }}
      aria-label={isLocked ? `${archetype.name} archetype (locked)` : `Select ${archetype.name} archetype`}
      aria-pressed={isActive}
      aria-disabled={isLocked}
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-[2rem] opacity-0 pointer-events-none will-change-opacity"
        style={{
          background: `radial-gradient(circle at center, ${archetype.color}20, transparent 70%)`,
          transform: 'translateZ(0)', // GPU acceleration
        }}
        whileHover={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={prefersReducedMotion ? {} : { duration: 0.3 }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div
          className={`
            inline-flex p-3 rounded-xl mb-4
            ${isActive ? "bg-nav-lime/20 border-nav-lime/30" : "bg-nav-cream/10 border-white/20"}
            border
          `}
        >
          <Icon
            className="w-6 h-6 text-nav-lime"
          />
        </div>

        {/* Name */}
        <h3
          className={`
            text-xl font-bold mb-2
            ${isActive ? "text-nav-lime" : "text-nav-cream"}
          `}
        >
          {archetype.name}
        </h3>

        {/* Description (truncated) or Lock Requirements */}
        {isLocked ? (
          <div className="space-y-2">
            <p className="text-sm text-nav-cream/70 font-semibold flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Unlock Requirements:
            </p>
            <ul className="text-xs text-nav-cream/70 space-y-1">
              {archetype.unlockRequirements?.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-nav-lime mt-0.5">•</span>
                  <span>{req.description}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-nav-cream/80 line-clamp-3">
            {archetype.description}
          </p>
        )}
      </div>

      {/* Lock overlay */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-[2rem] backdrop-blur-sm">
          <Lock className="w-12 h-12 text-nav-cream/70" />
        </div>
      )}

    </motion.button>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const ArchetypeCard = React.memo(ArchetypeCardComponent);
