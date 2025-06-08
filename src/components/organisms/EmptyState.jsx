import React from 'react';
import ApperIcon from '@/components/ApperIcon'; // Existing dependency
import { motion } from 'framer-motion'; // Allowed as it's from MainFeature.jsx

const EmptyState = ({ iconName, title, message, animateIcon = false }) => {
    return (
        <div className="p-6 text-center">
            {animateIcon ? (
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                >
                    <ApperIcon name={iconName} className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                </motion.div>
            ) : (
                <ApperIcon name={iconName} className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            )}
            {title && <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>}
            <p className="text-gray-600">{message}</p>
        </div>
    );
};

export default EmptyState;