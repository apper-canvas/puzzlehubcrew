import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'
import puzzleService from '../services/api/puzzleService'
import userProgressService from '../services/api/userProgressService'
import { toast } from 'react-toastify'

const PuzzlePlay = () => {
  const { puzzleId } = useParams()
  const navigate = useNavigate()
  const [puzzle, setPuzzle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [gameState, setGameState] = useState('playing') // playing, completed, paused
  const [startTime, setStartTime] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [showCompletionModal, setShowCompletionModal] = useState(false)

  useEffect(() => {
    const loadPuzzle = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await puzzleService.getById(puzzleId)
        setPuzzle(result)
        setStartTime(Date.now())
      } catch (err) {
        setError(err.message || 'Failed to load puzzle')
        toast.error('Failed to load puzzle')
      } finally {
        setLoading(false)
      }
    }
    loadPuzzle()
  }, [puzzleId])

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && startTime) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [gameState, startTime])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handlePuzzleComplete = async () => {
    setGameState('completed')
    setShowCompletionModal(true)
    
    // Calculate score based on difficulty and time
    const difficultyMultiplier = {
      Easy: 100,
      Medium: 200,
      Hard: 300
    }
    const baseScore = difficultyMultiplier[puzzle.difficulty] || 100
    const timeBonus = Math.max(0, 300 - elapsedTime) // Bonus for completing under 5 minutes
    const finalScore = baseScore + timeBonus

    try {
      await userProgressService.recordCompletion({
        puzzleId: puzzle.id,
        title: puzzle.title,
        type: puzzle.type,
        difficulty: puzzle.difficulty,
        completionTime: elapsedTime,
        score: finalScore,
        completedAt: new Date().toISOString()
      })
      toast.success('Puzzle completed! Progress saved.')
    } catch (err) {
      console.error('Failed to save progress:', err)
      toast.error('Puzzle completed but failed to save progress')
    }
  }

  const handleRestart = () => {
    setGameState('playing')
    setStartTime(Date.now())
    setElapsedTime(0)
    setShowCompletionModal(false)
  }

  const handleExit = () => {
    navigate('/puzzles')
  }

  if (loading) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
            <ApperIcon name="Puzzle" className="w-8 h-8 text-primary" />
          </div>
          <p className="text-gray-600">Loading puzzle...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Puzzle not found</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/puzzles')}
            className="bg-primary text-white px-6 py-2 rounded-lg font-medium"
          >
            Back to Puzzles
          </motion.button>
        </div>
      </div>
    )
  }

  if (!puzzle) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="Search" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Puzzle not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-full">
          <div className="flex items-center space-x-4 min-w-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExit}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="ArrowLeft" className="w-5 h-5 text-gray-600" />
            </motion.button>
            <div className="min-w-0">
              <h1 className="font-semibold text-gray-800 truncate">{puzzle.title}</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="capitalize">{puzzle.type}</span>
                <span>•</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  puzzle.difficulty === 'Easy' ? 'bg-success/20 text-success' :
                  puzzle.difficulty === 'Medium' ? 'bg-warning/20 text-warning' :
                  'bg-error/20 text-error'
                }`}>
                  {puzzle.difficulty}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-lg font-mono">
              <ApperIcon name="Clock" className="w-5 h-5 text-gray-600" />
              <span className="text-primary font-bold">{formatTime(elapsedTime)}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRestart}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Restart puzzle"
              >
                <ApperIcon name="RotateCcw" className="w-5 h-5 text-gray-600" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setGameState(gameState === 'paused' ? 'playing' : 'paused')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title={gameState === 'paused' ? 'Resume' : 'Pause'}
              >
                <ApperIcon name={gameState === 'paused' ? 'Play' : 'Pause'} className="w-5 h-5 text-gray-600" />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Game Area */}
      <main className="flex-1 flex items-center justify-center p-4 bg-surface-50 overflow-hidden">
        <div className="max-w-4xl w-full h-full flex items-center justify-center">
          {gameState === 'paused' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center bg-white rounded-xl p-8 shadow-lg"
            >
              <ApperIcon name="Pause" className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Puzzle Paused</h2>
              <p className="text-gray-600 mb-6">Take a break and come back when you're ready</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setGameState('playing')}
                className="bg-primary text-white px-6 py-3 rounded-lg font-medium"
              >
                Resume Puzzle
              </motion.button>
            </motion.div>
          ) : (
            // Puzzle content placeholder - this would contain the actual puzzle implementation
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full h-full bg-white rounded-xl shadow-lg flex items-center justify-center relative overflow-hidden"
            >
              <div className="text-center p-8">
                <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <ApperIcon name="Puzzle" className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  {puzzle.type.charAt(0).toUpperCase() + puzzle.type.slice(1)} Puzzle
                </h2>
                <p className="text-gray-600 mb-8">
                  This is a {puzzle.difficulty.toLowerCase()} level {puzzle.type} puzzle. 
                  The actual puzzle interface would be implemented here.
                </p>
                
                {/* Demo completion button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePuzzleComplete}
                  className="bg-accent text-white px-8 py-3 rounded-lg font-medium shadow-lg"
                >
                  Complete Puzzle (Demo)
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Completion Modal */}
      <AnimatePresence>
        {showCompletionModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowCompletionModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <ApperIcon name="Trophy" className="w-10 h-10 text-white" />
                </motion.div>
                
                <h2 className="text-2xl font-heading text-gray-800 mb-2">Puzzle Complete!</h2>
                <p className="text-gray-600 mb-6">Great job solving this {puzzle.difficulty.toLowerCase()} puzzle</p>
                
                <div className="bg-surface-50 rounded-lg p-4 mb-6">
                  <div className="text-3xl font-bold text-primary mb-1">{formatTime(elapsedTime)}</div>
                  <div className="text-sm text-gray-600">Completion Time</div>
                </div>
                
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRestart}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium"
                  >
                    Play Again
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleExit}
                    className="flex-1 bg-primary text-white py-3 rounded-lg font-medium"
                  >
                    New Puzzle
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PuzzlePlay