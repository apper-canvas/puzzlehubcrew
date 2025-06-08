import React from 'react';
import ApperIcon from '@/components/ApperIcon'; // Existing dependency
import Card from '@/components/atoms/Card'; // New atom
import DifficultyBadge from '@/components/molecules/DifficultyBadge'; // New molecule

const PuzzleCard = ({ puzzle, onPlay }) => (
    <Card
        onClick={() => onPlay(puzzle)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="overflow-hidden cursor-pointer"
    >
        <div className="aspect-video bg-gradient-to-br from-surface-100 to-surface-200 relative">
            <img
                src={puzzle.thumbnail}
                alt={puzzle.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                    e.target.style.display = 'none';
                }}
            />
            <div className="absolute top-2 right-2">
                <DifficultyBadge difficulty={puzzle.difficulty} />
            </div>
            <div className="absolute inset-0 bg-primary/10 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <ApperIcon name="Play" className="w-12 h-12 text-primary" />
            </div>
        </div>
        <div className="p-4">
            <h3 className="font-semibold text-gray-800 mb-1">{puzzle.title}</h3>
            <p className="text-sm text-gray-600 capitalize">{puzzle.type} Puzzle</p>
        </div>
    </Card>
);

export default PuzzleCard;