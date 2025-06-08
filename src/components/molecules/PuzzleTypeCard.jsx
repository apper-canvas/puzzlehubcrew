import React from 'react';
import ApperIcon from '@/components/ApperIcon'; // Existing dependency
import Card from '@/components/atoms/Card'; // New atom

const PuzzleTypeCard = ({ type, icon, count, color, onClick }) => (
    <Card
        onClick={onClick}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="p-6 cursor-pointer border-2 border-transparent hover:border-primary/20"
    >
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4`}>
            <ApperIcon name={icon} className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{type}</h3>
        <p className="text-gray-600 text-sm">{count} puzzles available</p>
    </Card>
);

export default PuzzleTypeCard;