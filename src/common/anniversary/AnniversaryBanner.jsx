// AnniversaryBanner.jsx
import React from "react";
import { motion } from "framer-motion";
import { GiPartyPopper } from "react-icons/gi";

const AnniversaryBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 w-full mb-6"
    >
      <div className="bg-gradient-to-r from-purple-500 via-yellow-400 to-pink-500 text-white text-center py-3 rounded-2xl shadow-xl text-xl font-extrabold tracking-wide animate-pulse flex items-center justify-center gap-2">
        <GiPartyPopper size={24} /> 3 Years of Growth & Innovation – Happy
        Anniversary Team! 🎊
      </div>
    </motion.div>
  );
};

export default AnniversaryBanner;
