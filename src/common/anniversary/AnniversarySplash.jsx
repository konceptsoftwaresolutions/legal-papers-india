import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const AnniversarySplash = ({ onFinish }) => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    confetti({
      particleCount: 250,
      spread: 120,
      origin: { y: 0.6 },
    });

    const timer = setTimeout(() => {
      setShowSplash(false);
      if (onFinish) onFinish();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center text-white overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Animated Logo / App Name */}
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold tracking-wide text-center bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent drop-shadow-md"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Legal Papers India
          </motion.h1>

          {/* Anniversary Message */}
          <motion.p
            className="text-lg md:text-2xl text-center mt-4 font-medium text-gray-100"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            🎉 Celebrating{" "}
            <span className="text-pink-400 font-bold">3 Years</span> of Service
            & Trust
          </motion.p>

          <motion.p
            className="text-sm md:text-base mt-2 text-center text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            Thank you for growing with us!
          </motion.p>

          {/* Subtle glow ring */}
          <motion.div
            className="absolute w-[300px] h-[300px] rounded-full bg-pink-500 blur-3xl opacity-30"
            initial={{ scale: 0 }}
            animate={{ scale: 1.5 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnniversarySplash;
