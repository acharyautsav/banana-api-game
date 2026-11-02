// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * BANANA ARCADE: PageTransition Component
 * ============================================================================
 * Shared subtle page transition wrapper:
 * - Enter-only animation: fade and 8px slide up over ~200ms.
 * - Robust against route transitions and ProtectedRoute state updates.
 * - Fully respects OS prefers-reduced-motion setting.
 * ============================================================================
 */
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const PageTransition = ({ children }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="w-full flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
