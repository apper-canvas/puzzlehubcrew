import React from 'react';
import PuzzleCard from '../molecules/PuzzleCard';
import EmptyState from './EmptyState';
import { motion } from 'framer-motion';

const PuzzleGridSection = ({ puzzles, selectedType, puzzleTypesConfig, onPlay }) => {
    const currentTypeLabel = selectedType === 'all'
        ? 'All Puzzles'
        : `${puzzleTypesConfig.find(t => t.key === selectedType)?.type} Puzzles`;

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    {currentTypeLabel}
                </h2>
                <span className="text-gray-600">{puzzles.length} available</span>
            </div>

            {puzzles.length === 0 ? (
                <EmptyState
                    icon="Search"
                    message="No puzzles found for this type"
                    animateIcon={false}
                />
            ) : (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {puzzles.map((puzzle, index) => (
                        <motion.div
                            key={puzzle.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <PuzzleCard puzzle={puzzle} onPlay={onPlay} />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default PuzzleGridSection;