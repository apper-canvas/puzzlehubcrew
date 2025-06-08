import React from 'react';
import ApperIcon from '@/components/ApperIcon'; // Existing dependency
import Button from '@/components/atoms/Button'; // New atom

const ErrorState = ({ message, onRetry }) => {
    return (
        <div className="p-6 text-center">
            <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-4">{message}</p>
            <Button
                onClick={onRetry}
                className="bg-primary text-white px-6 py-2 rounded-lg font-medium"
                whileHover={{ scale: 1.05 }} // Existing animation
                whileTap={{ scale: 0.95 }}   // Existing animation
            >
                Try Again
            </Button>
        </div>
    );
};

export default ErrorState;