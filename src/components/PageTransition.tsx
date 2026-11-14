import type { ReactNode } from "react";
import { motion } from "framer-motion";

const PageTransition = ({ children, reduce }: { children: ReactNode; reduce: boolean }) => (
  <motion.div
    className="page"
    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
    transition={{ duration: reduce ? 0.2 : 0.55, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

export default PageTransition;
