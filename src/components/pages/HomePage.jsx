import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Existing dependency
import { toast } from 'react-toastify'; // Existing dependency
import puzzleService from '@/services/api/puzzleService'; // Existing dependency

import LoadingState from '@/components/organisms/LoadingState'; // New organism
import ErrorState from '@/components/organisms/ErrorState';   // New organism
import EmptyState from '@/components/organisms/EmptyState';   // New organism
import PuzzleTypeSection from '@/components/organisms/PuzzleTypeSection'; // New organism
import PuzzleGridSection from '@/components/organisms/PuzzleGridSection'; // New organism

const HomePage = () => {
    const [puzzles, setPuzzles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedType, setSelectedType] = useState('all');
    const navigate = useNavigate();

    const puzzleTypesConfig = [
        { type: 'Jigsaw', icon: 'Puzzle', color: 'bg-primary', key: 'jigsaw' },
        { type: 'Logic', icon: 'Brain', color: 'bg-secondary', key: 'logic' },
        { type: 'Crossword', icon: 'Grid3X3', color: 'bg-accent', key: 'crossword' },
        { type: 'Sudoku', icon: 'Hash', color: 'bg-info', key: 'sudoku' },
        { type: 'Trivia', icon: 'HelpCircle', color: 'bg-success', key: 'trivia' }
    ];

    useEffect(() => {
        const loadPuzzles = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await puzzleService.getAll();
                setPuzzles(result);
            } catch (err) {
                setError(err.message || 'Failed to load puzzles');
                toast.error('Failed to load puzzles');
            } finally {
                setLoading(false);
            }
        };
        loadPuzzles();
    }, []);

    const filteredPuzzles = selectedType === 'all'
        ? puzzles
        : puzzles.filter(puzzle => puzzle.type === selectedType);

    const handlePlayPuzzle = (puzzle) => {
        navigate(`/play/${puzzle.id}`);
    };

    const getPuzzleCount = (type) => {
        return puzzles.filter(puzzle => puzzle.type === type).length;
    };

    const handleRetry = () => {
        window.location.reload(); // Re-triggering initial load, matching original functionality
    };

    if (loading) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorState message={error} onRetry={handleRetry} />;
    }

    if (puzzles.length === 0) {
        return (
            <EmptyState
                iconName="Puzzle"
                title="No puzzles available"
                message="Check back later for new puzzles to solve!"
                animateIcon={true}
            />
        );
    }

    return (
        <div className="p-6 pb-20 md:pb-6 space-y-6 max-w-7xl mx-auto">
            <PuzzleTypeSection
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                getPuzzleCount={getPuzzleCount}
                puzzleTypesConfig={puzzleTypesConfig}
            />
            <PuzzleGridSection
                puzzles={filteredPuzzles}
                selectedType={selectedType}
                puzzleTypesConfig={puzzleTypesConfig}
                onPlay={handlePlayPuzzle}
            />
        </div>
    );
};

export default HomePage;