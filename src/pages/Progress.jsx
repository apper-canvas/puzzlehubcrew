import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'
import userProgressService from '../services/api/userProgressService'
import { toast } from 'react-toastify'

const StatCard = ({ icon, label, value, color = 'bg-primary' }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white rounded-xl p-6 shadow-md"
  >
    <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4`}>
      <ApperIcon name={icon} className="w-6 h-6 text-white" />
    </div>
    <div className="text-2xl font-bold text-gray-800 mb-1">{value}</div>
    <div className="text-gray-600 text-sm">{label}</div>
  </motion.div>
)

const AchievementBadge = ({ achievement, earned = false }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`p-4 rounded-xl border-2 text-center ${
      earned 
        ? 'bg-accent/10 border-accent text-accent' 
        : 'bg-gray-50 border-gray-200 text-gray-400'
    }`}
  >
    <ApperIcon name={achievement.icon} className="w-8 h-8 mx-auto mb-2" />
    <div className="font-medium text-sm">{achievement.title}</div>
    <div className="text-xs mt-1">{achievement.description}</div>
  </motion.div>
)

const Progress = () => {
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const achievements = [
    { icon: 'Target', title: 'First Solve', description: 'Complete your first puzzle', threshold: 1 },
    { icon: 'Flame', title: 'Hot Streak', description: '5 day solving streak', threshold: 5 },
    { icon: 'Award', title: 'Puzzle Master', description: 'Complete 50 puzzles', threshold: 50 },
    { icon: 'Zap', title: 'Speed Demon', description: 'Complete puzzle under 2 minutes', threshold: 1 },
    { icon: 'Star', title: 'Daily Champion', description: 'Win daily challenge', threshold: 1 },
    { icon: 'Crown', title: 'Century Club', description: 'Complete 100 puzzles', threshold: 100 }
  ]

  useEffect(() => {
    const loadProgress = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await userProgressService.getUserProgress()
        setProgress(result)
      } catch (err) {
        setError(err.message || 'Failed to load progress')
        toast.error('Failed to load progress')
      } finally {
        setLoading(false)
      }
    }
    loadProgress()
  }, [])

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const getAchievementProgress = (achievement) => {
    if (!progress) return 0
    
    switch (achievement.title) {
      case 'First Solve':
      case 'Puzzle Master':
      case 'Century Club':
        return Math.min(progress.puzzlesCompleted, achievement.threshold)
      case 'Hot Streak':
        return Math.min(progress.currentStreak, achievement.threshold)
      default:
        return 0
    }
  }

  const isAchievementEarned = (achievement) => {
    return getAchievementProgress(achievement) >= achievement.threshold
  }

  if (loading) {
    return (
      <div className="p-6 pb-20 md:pb-6 max-w-6xl mx-auto space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-md animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4 border-2 border-gray-200 rounded-xl">
                <div className="w-8 h-8 bg-gray-200 rounded mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 pb-20 md:pb-6 text-center max-w-6xl mx-auto">
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Unable to load progress</h3>
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

  if (!progress) {
    return (
      <div className="p-6 pb-20 md:pb-6 text-center max-w-6xl mx-auto">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="TrendingUp" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        </motion.div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No progress yet</h3>
        <p className="text-gray-600">Start solving puzzles to track your progress!</p>
      </div>
    )
  }

  return (
    <div className="p-6 pb-20 md:pb-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-heading text-gray-800 mb-2">Your Progress</h1>
        <p className="text-gray-600">Track your puzzle-solving journey</p>
      </div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <StatCard
          icon="Puzzle"
          label="Puzzles Completed"
          value={progress.puzzlesCompleted}
          color="bg-primary"
        />
        <StatCard
          icon="Clock"
          label="Total Time"
          value={formatTime(progress.totalTime)}
          color="bg-secondary"
        />
        <StatCard
          icon="Flame"
          label="Current Streak"
          value={`${progress.currentStreak} days`}
          color="bg-accent"
        />
        <StatCard
          icon="Calendar"
          label="Last Played"
          value={progress.lastPlayed ? new Date(progress.lastPlayed).toLocaleDateString() : 'Never'}
          color="bg-info"
        />
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-6 shadow-md"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center space-x-2">
          <ApperIcon name="Award" className="w-6 h-6 text-accent" />
          <span>Achievements</span>
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <AchievementBadge 
                achievement={achievement} 
                earned={isAchievementEarned(achievement)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-6 shadow-md"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center space-x-2">
          <ApperIcon name="Activity" className="w-6 h-6 text-primary" />
          <span>Recent Activity</span>
        </h2>
        
        {progress.completedPuzzles && progress.completedPuzzles.length > 0 ? (
          <div className="space-y-3">
            {progress.completedPuzzles.slice(-5).reverse().map((puzzle, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-surface-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ApperIcon name="CheckCircle" className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{puzzle.title}</div>
                    <div className="text-sm text-gray-600 capitalize">{puzzle.type} • {puzzle.difficulty}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-primary">{formatTime(puzzle.completionTime)}</div>
                  <div className="text-sm text-gray-600">{new Date(puzzle.completedAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <ApperIcon name="Clock" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No recent activity</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Progress