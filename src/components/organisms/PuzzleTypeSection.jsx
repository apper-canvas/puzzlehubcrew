import React from 'react';
import Button from '@/components/atoms/Button'; // New atom
import PuzzleTypeCard from '@/components/molecules/PuzzleTypeCard'; // New molecule

const PuzzleTypeSection = ({ selectedType, setSelectedType, getPuzzleCount, puzzleTypesConfig }) => {
    return (
        <div>
            <h2 className="text-2xl font-heading text-gray-800 mb-4">Choose Your Challenge</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                {puzzleTypesConfig.map(({ type, icon, color, key }) => (
                    <PuzzleTypeCard
                        key={key}
                        type={type}
                        icon={icon}
                        color={color}
                        count={getPuzzleCount(key)}
                        onClick={() => setSelectedType(key)}
                    />
                ))}
            </div>

{/* Filter Tabs */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
                <Button
                    onClick={() => setSelectedType('all')}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                        selectedType === 'all'
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-600 hover:bg-surface-50'
                    }`}
                    whileTap={{ scale: 0.95 }} // Existing animation
                >
                    All Puzzles
                </Button>
                {puzzleTypesConfig.map(({ type, key }) => (
                    <Button
                        key={key}
                        onClick={() => setSelectedType(key)}
                        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                            selectedType === key
                                ? 'bg-primary text-white'
                                : 'bg-white text-gray-600 hover:bg-surface-50'
                        }`}
                        whileTap={{ scale: 0.95 }} // Existing animation
                    >
                        {type}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default PuzzleTypeSection;