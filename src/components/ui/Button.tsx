import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'onDrag' | 'onDragStart' | 'onDragEnd'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  disabled,
  ...props 
}: ButtonProps) {
  const baseStyles = 'font-bold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-nav-lime text-nav-black neubrutalist-button hover:bg-nav-yellow',
    secondary: 'bg-card text-nav-lime border-2 border-nav-lime hover:bg-nav-lime/10',
    ghost: 'text-nav-lime hover:bg-nav-lime/10 border-2 border-transparent hover:border-nav-lime/30'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}
