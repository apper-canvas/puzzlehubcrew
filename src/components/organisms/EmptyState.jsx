import React from 'react';
import ApperIcon from '../ApperIcon';
import { motion } from 'framer-motion';

const EmptyState = ({ icon, title, message, animateIcon = false }) => {
    // Provide fallback values for props
    const iconName = icon || 'puzzle';
    const displayMessage = message || 'No items to display';
    
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
            <p className="text-gray-600">{displayMessage}</p>
        </div>
    );
};

export default EmptyState;