import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mb-8"
        >
          <ApperIcon name="PuzzleIcon" className="w-24 h-24 text-primary mx-auto" />
        </motion.div>
        
        <h1 className="text-4xl font-heading text-primary mb-4">
          Puzzle Not Found
        </h1>
        
        <p className="text-gray-600 mb-8">
          Looks like this puzzle piece went missing! Let's get you back to solving.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/puzzles')}
          className="bg-primary text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:bg-secondary transition-colors"
        >
          Back to Puzzles
        </motion.button>
      </motion.div>
    </div>
  )
}

export default NotFound