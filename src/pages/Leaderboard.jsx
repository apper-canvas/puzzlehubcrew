import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'
import leaderboardService from '../services/api/leaderboardService'
import { toast } from 'react-toastify'

const LeaderboardEntry = ({ entry, rank, isHighlighted = false }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: rank * 0.05 }}
    className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
      isHighlighted ? 'bg-accent/10 border-2 border-accent' : 'bg-white hover:bg-surface-50'
    }`}
  >
    <div className="flex items-center space-x-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
        rank === 1 ? 'bg-accent text-white' :
        rank === 2 ? 'bg-gray-400 text-white' :
        rank === 3 ? 'bg-amber-600 text-white' :
        'bg-gray-200 text-gray-600'
      }`}>
        {rank}
      </div>
      <div>
        <div className="font-medium text-gray-800">{entry.playerName}</div>
        <div className="text-sm text-gray-600 capitalize">{entry.puzzleType} Expert</div>
      </div>
    </div>
    <div className="text-right">
      <div className="font-bold text-primary text-lg">{entry.score}</div>
      <div className="text-sm text-gray-600">{Math.floor(entry.time / 60)}:{(entry.time % 60).toString().padStart(2, '0')}</div>
    </div>
  </motion.div>
)

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedType, setSelectedType] = useState('all')

  const puzzleTypes = ['all', 'jigsaw', 'logic', 'crossword', 'sudoku', 'trivia']

  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await leaderboardService.getTopScores(selectedType)
        setLeaderboard(result)
      } catch (err) {
        setError(err.message || 'Failed to load leaderboard')
        toast.error('Failed to load leaderboard')
      } finally {
        setLoading(false)
      }
    }
    loadLeaderboard()
  }, [selectedType])

  if (loading) {
    return (
      <div className="p-6 pb-20 md:pb-6 max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded mx-auto mb-2 w-48"></div>
          <div className="h-4 bg-gray-200 rounded mx-auto w-64"></div>
        </div>
        
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded-lg w-24 flex-shrink-0"></div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-5 bg-gray-200 rounded w-12 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-10"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 pb-20 md:pb-6 text-center max-w-4xl mx-auto">
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Unable to load leaderboard</h3>
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

  return (
    <div className="p-6 pb-20 md:pb-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-heading text-gray-800 mb-2 flex items-center justify-center space-x-2">
          <ApperIcon name="Trophy" className="w-8 h-8 text-accent" />
          <span>Leaderboard</span>
        </h1>
        <p className="text-gray-600">See how you rank against other puzzle solvers</p>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {puzzleTypes.map(type => (
          <motion.button
            key={type}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors capitalize ${
              selectedType === type
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-surface-50'
            }`}
          >
            {type === 'all' ? 'All Puzzles' : type}
          </motion.button>
        ))}
      </div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
          <h2 className="text-xl font-semibold">
            {selectedType === 'all' ? 'Top Puzzle Solvers' : `Top ${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Players`}
          </h2>
          <p className="text-white/90">Based on scores and completion times</p>
        </div>

        {/* Entries */}
        <div className="p-6">
          {leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <ApperIcon name="Users" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No scores yet</h3>
              <p className="text-gray-600">Be the first to complete a puzzle and claim the top spot!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <LeaderboardEntry
                  key={`${entry.playerName}-${entry.puzzleType}-${index}`}
                  entry={entry}
                  rank={index + 1}
                  isHighlighted={entry.playerName === 'You'}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 bg-gradient-to-r from-accent/10 to-warning/10 rounded-xl p-6 border border-accent/20"
      >
        <div className="flex items-start space-x-3">
          <ApperIcon name="Info" className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">How Scoring Works</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Base score determined by puzzle difficulty</li>
              <li>• Time bonus for quick completion</li>
              <li>• Daily challenges offer double points</li>
              <li>• Rankings update in real-time</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Leaderboard