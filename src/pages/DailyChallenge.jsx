import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'
import dailyChallengeService from '../services/api/dailyChallengeService'
import puzzleService from '../services/api/puzzleService'
import { toast } from 'react-toastify'

const DailyChallenge = () => {
  const [challenge, setChallenge] = useState(null)
  const [puzzle, setPuzzle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadDailyChallenge = async () => {
      setLoading(true)
      setError(null)
      try {
        const todayChallenge = await dailyChallengeService.getTodaysChallenge()
        setChallenge(todayChallenge)
        
        if (todayChallenge.puzzleId) {
          const puzzleData = await puzzleService.getById(todayChallenge.puzzleId)
          setPuzzle(puzzleData)
        }
      } catch (err) {
        setError(err.message || 'Failed to load daily challenge')
        toast.error('Failed to load daily challenge')
      } finally {
        setLoading(false)
      }
    }
    loadDailyChallenge()
  }, [])

  const handlePlayChallenge = () => {
    if (puzzle) {
      navigate(`/play/${puzzle.id}`)
    }
  }

  if (loading) {
    return (
      <div className="p-6 pb-20 md:pb-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl p-8 shadow-md animate-pulse">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
            <div className="flex-1">
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
          <div className="aspect-video bg-gray-200 rounded-lg mb-6"></div>
          <div className="flex justify-between items-center">
            <div className="h-10 bg-gray-200 rounded w-32"></div>
            <div className="h-6 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 pb-20 md:pb-6 text-center max-w-4xl mx-auto">
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Unable to load challenge</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="bg-primary text-white px-6 py-2 rounded-lg font-medium"
        >
          Try Again
        </motion.button>
      </div>
    )
  }

  if (!challenge || !puzzle) {
    return (
      <div className="p-6 pb-20 md:pb-6 text-center max-w-4xl mx-auto">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ApperIcon name="Calendar" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        </motion.div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No challenge today</h3>
        <p className="text-gray-600">Check back tomorrow for a new daily challenge!</p>
      </div>
    )
  }

  return (
    <div className="p-6 pb-20 md:pb-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl overflow-hidden shadow-md"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 rounded-xl p-4">
              <ApperIcon name="Calendar" className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-heading mb-2">Daily Challenge</h1>
              <p className="text-white/90">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Challenge Content */}
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{puzzle.title}</h2>
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-2 text-gray-600">
                <ApperIcon name="Puzzle" className="w-4 h-4" />
                <span className="capitalize">{puzzle.type} Puzzle</span>
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                puzzle.difficulty === 'Easy' ? 'bg-success text-white' :
                puzzle.difficulty === 'Medium' ? 'bg-warning text-white' :
                'bg-error text-white'
              }`}>
                {puzzle.difficulty}
              </span>
            </div>
          </div>

          {/* Puzzle Preview */}
          <div className="aspect-video bg-gradient-to-br from-surface-100 to-surface-200 rounded-lg mb-6 relative overflow-hidden">
            <img 
              src={puzzle.thumbnail} 
              alt={puzzle.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="bg-white rounded-full p-4 shadow-lg"
              >
                <ApperIcon name="Play" className="w-8 h-8 text-primary" />
              </motion.div>
            </div>
          </div>

          {/* Stats and Action */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{challenge.participants}</div>
                <div className="text-sm text-gray-600">Participants</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{challenge.topScores?.length || 0}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePlayChallenge}
              className="bg-primary text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:bg-secondary transition-colors flex items-center space-x-2"
            >
              <ApperIcon name="Play" className="w-5 h-5" />
              <span>Start Challenge</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Top Scores */}
      {challenge.topScores && challenge.topScores.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-white rounded-xl p-6 shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <ApperIcon name="Trophy" className="w-5 h-5 text-accent" />
            <span>Today's Leaderboard</span>
          </h3>
          <div className="space-y-3">
            {challenge.topScores.slice(0, 5).map((score, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-surface-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-accent text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-amber-600 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-800">{score.playerName}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">{score.score} pts</div>
                  <div className="text-sm text-gray-600">{Math.floor(score.time / 60)}:{(score.time % 60).toString().padStart(2, '0')}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default DailyChallenge