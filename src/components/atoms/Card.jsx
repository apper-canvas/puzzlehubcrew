import React from 'react';
import { motion } from 'framer-motion'; // Allowed as it's from MainFeature.jsx

const Card = ({ children, className, onClick, whileHover, whileTap, ...props }) => {
    return (
        <motion.div
            onClick={onClick}
            whileHover={whileHover}
            whileTap={whileTap}
            className={`bg-white rounded-xl shadow-md transition-all ${className || ''}`}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;