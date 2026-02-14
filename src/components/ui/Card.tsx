import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps extends Omit<HTMLMotionProps<"div">, 'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'> {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'neubrutalist' | 'glass';
  hover?: boolean;
}

export default function Card({ 
  children, 
  className = '', 
  variant = 'default',
  hover = false,
  ...rest
}: CardProps) {
  const variants = {
    default: 'bg-card border border-nav-lime/20',
    neubrutalist: 'neubrutalist-card',
    glass: 'glass'
  };

  const hoverAnimation = hover ? {
    whileHover: { scale: 1.02, y: -4 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      {...hoverAnimation}
      className={`rounded-lg p-6 ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
