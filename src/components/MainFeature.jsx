import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from './ApperIcon'
import puzzleService from '../services/api/puzzleService'
import { toast } from 'react-toastify'

const PuzzleTypeCard = ({ type, icon, count, color, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="bg-white rounded-xl p-6 shadow-md cursor-pointer border-2 border-transparent hover:border-primary/20 transition-all"
  >
    <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4`}>
      <ApperIcon name={icon} className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{type}</h3>
    <p className="text-gray-600 text-sm">{count} puzzles available</p>
  </motion.div>
)

const DifficultyBadge = ({ difficulty }) => {
  const colors = {
    Easy: 'bg-success text-white',
    Medium: 'bg-warning text-white',
    Hard: 'bg-error text-white'
  }
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[difficulty]}`}>
      {difficulty}
    </span>
  )
}

const PuzzleCard = ({ puzzle, onPlay }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="bg-white rounded-xl overflow-hidden shadow-md cursor-pointer"
    onClick={() => onPlay(puzzle)}
  >
    <div className="aspect-video bg-gradient-to-br from-surface-100 to-surface-200 relative">
      <img 
        src={puzzle.thumbnail} 
        alt={puzzle.title}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.style.display = 'none'
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
  </motion.div>
)

const MainFeature = () => {
  const [puzzles, setPuzzles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedType, setSelectedType] = useState('all')
  const navigate = useNavigate()

  const puzzleTypes = [
    { type: 'Jigsaw', icon: 'Puzzle', color: 'bg-primary', key: 'jigsaw' },
    { type: 'Logic', icon: 'Brain', color: 'bg-secondary', key: 'logic' },
    { type: 'Crossword', icon: 'Grid3X3', color: 'bg-accent', key: 'crossword' },
    { type: 'Sudoku', icon: 'Hash', color: 'bg-info', key: 'sudoku' },
    { type: 'Trivia', icon: 'HelpCircle', color: 'bg-success', key: 'trivia' }
  ]

  useEffect(() => {
    const loadPuzzles = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await puzzleService.getAll()
        setPuzzles(result)
      } catch (err) {
        setError(err.message || 'Failed to load puzzles')
        toast.error('Failed to load puzzles')
      } finally {
        setLoading(false)
      }
    }
    loadPuzzles()
  }, [])

  const filteredPuzzles = selectedType === 'all' 
    ? puzzles 
    : puzzles.filter(puzzle => puzzle.type === selectedType)

  const handlePlayPuzzle = (puzzle) => {
    navigate(`/play/${puzzle.id}`)
  }

  const getPuzzleCount = (type) => {
    return puzzles.filter(puzzle => puzzle.type === type).length
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-md animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
              <div className="aspect-video bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h3>
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

  if (puzzles.length === 0) {
    return (
      <div className="p-6 text-center">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="Puzzle" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        </motion.div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No puzzles available</h3>
        <p className="text-gray-600">Check back later for new puzzles to solve!</p>
      </div>
    )
  }

  return (
    <div className="p-6 pb-20 md:pb-6 space-y-6 max-w-7xl mx-auto">
      {/* Puzzle Type Cards */}
      <div>
        <h2 className="text-2xl font-heading text-gray-800 mb-4">Choose Your Challenge</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          {puzzleTypes.map(({ type, icon, color, key }) => (
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
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedType('all')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedType === 'all'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-surface-50'
            }`}
          >
            All Puzzles
          </motion.button>
          {puzzleTypes.map(({ type, key }) => (
            <motion.button
              key={key}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedType(key)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedType === key
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-surface-50'
              }`}
            >
              {type}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Puzzle Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {selectedType === 'all' ? 'All Puzzles' : `${puzzleTypes.find(t => t.key === selectedType)?.type} Puzzles`}
          </h2>
          <span className="text-gray-600">{filteredPuzzles.length} available</span>
        </div>
        
        {filteredPuzzles.length === 0 ? (
          <div className="text-center py-12">
            <ApperIcon name="Search" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No puzzles found for this type</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {filteredPuzzles.map((puzzle, index) => (
              <motion.div
                key={puzzle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PuzzleCard puzzle={puzzle} onPlay={handlePlayPuzzle} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default MainFeature