import React from "react";
import { motion } from "framer-motion";
import { Box } from "@radix-ui/themes";

const LoadingSpinner: React.FC = () => {
  return (
    <Box style={{ position: "relative", width: "50px", height: "50px" }}>
      <motion.div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          border: "4px solid rgba(0, 0, 0, 0.1)",
          borderTopColor: "var(--accent-9)",
          borderRadius: "50%",
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </Box>
  );
};

export default LoadingSpinner;
