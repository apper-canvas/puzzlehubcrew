import React from 'react';
import { motion } from 'framer-motion'; // Allowed as it's from MainFeature.jsx

const Button = ({ children, onClick, className, whileHover, whileTap, ...props }) => {
    return (
        <motion.button
            onClick={onClick}
            className={className}
            whileHover={whileHover}
            whileTap={whileTap}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;