import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { PuzzleTypeSection } from '../components/organisms/PuzzleTypeSection'
import { PuzzleGridSection } from '../components/organisms/PuzzleGridSection'
import LoadingState from '../components/organisms/LoadingState'
import ErrorState from '../components/organisms/ErrorState'
import EmptyState from '../components/organisms/EmptyState'
import { puzzleService } from '../services'

const Puzzles = () => {
  const [puzzles, setPuzzles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedType, setSelectedType] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')

  const puzzleTypes = [
    { id: 'all', name: 'All Puzzles', icon: '🧩' },
    { id: 'jigsaw', name: 'Jigsaw', icon: '🧩' },
    { id: 'logic', name: 'Logic', icon: '🧠' },
    { id: 'crossword', name: 'Crossword', icon: '📝' },
    { id: 'sudoku', name: 'Sudoku', icon: '🔢' },
    { id: 'trivia', name: 'Trivia', icon: '❓' }
  ]

  const difficultyLevels = [
    { id: 'all', name: 'All Levels' },
    { id: 'easy', name: 'Easy' },
    { id: 'medium', name: 'Medium' },
    { id: 'hard', name: 'Hard' },
    { id: 'expert', name: 'Expert' }
  ]

  useEffect(() => {
    const fetchPuzzles = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await puzzleService.getAllPuzzles()
        setPuzzles(data || [])
      } catch (err) {
        setError(err.message || 'Failed to load puzzles')
        toast.error('Failed to load puzzles. Please try again.')
        console.error('Puzzle fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPuzzles()
  }, [])

  const filteredPuzzles = puzzles.filter(puzzle => {
    const matchesType = selectedType === 'all' || puzzle.type === selectedType
    const matchesDifficulty = selectedDifficulty === 'all' || puzzle.difficulty === selectedDifficulty
    return matchesType && matchesDifficulty
  })

  const handleTypeChange = (typeId) => {
    setSelectedType(typeId)
  }

  const handleDifficultyChange = (difficultyId) => {
    setSelectedDifficulty(difficultyId)
  }

  if (loading) {
    return <LoadingState message="Loading puzzles..." />
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={() => window.location.reload()}
      />
    )
  }

  if (!puzzles.length) {
    return (
      <EmptyState 
        title="No Puzzles Available"
        message="Check back later for new puzzle challenges!"
        icon="🧩"
      />
    )
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-heading text-gray-900 mb-4">
            Puzzle Library
          </h1>
          <p className="text-gray-600 text-lg">
            Choose from {puzzles.length} available puzzles across multiple categories
          </p>
        </div>

        {/* Puzzle Type Filter */}
        <PuzzleTypeSection
          types={puzzleTypes}
          selectedType={selectedType}
          onTypeChange={handleTypeChange}
          className="mb-8"
        />

        {/* Difficulty Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Difficulty Level</h3>
          <div className="flex flex-wrap gap-2">
            {difficultyLevels.map(level => (
              <button
                key={level.id}
                onClick={() => handleDifficultyChange(level.id)}
                className={`px-4 py-2 rounded-full border transition-all duration-200 ${
                  selectedDifficulty === level.id
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                }`}
              >
                {level.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredPuzzles.length} puzzle{filteredPuzzles.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Puzzle Grid */}
        {filteredPuzzles.length > 0 ? (
          <PuzzleGridSection 
            puzzles={filteredPuzzles}
            onPuzzleSelect={(puzzle) => {
              // Handle puzzle selection - could navigate to puzzle play page
              toast.info(`Selected ${puzzle.title}`)
            }}
          />
        ) : (
          <EmptyState 
            title="No Puzzles Match Your Filters"
            message="Try adjusting your filters to see more puzzles"
            icon="🔍"
          />
        )}
      </div>
    </div>
  )
}

export default Puzzles