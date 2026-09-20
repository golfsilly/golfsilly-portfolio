"use client";

import { motion, useReducedMotion } from "motion/react";

export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={{
        y: reduceMotion ? 0 : [12, 0],
        opacity: reduceMotion ? 1 : [0.75, 1],
      }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: reduceMotion ? 0 : -3 }}
    >
      {children}
    </motion.div>
  );
}
