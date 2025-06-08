import userProgressData from '../mockData/userProgress.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const userProgressService = {
  async getUserProgress() {
    await delay(300)
    return { ...userProgressData }
  },

  async recordCompletion(completionData) {
    await delay(400)
    
    // Update progress data
    userProgressData.puzzlesCompleted += 1
    userProgressData.totalTime += completionData.completionTime
    userProgressData.lastPlayed = completionData.completedAt
    
    // Add to completed puzzles
    userProgressData.completedPuzzles.push(completionData)
    
    // Update streak (simplified logic)
    const today = new Date().toDateString()
    const lastPlayed = new Date(userProgressData.lastPlayed).toDateString()
    
    if (today === lastPlayed) {
      // Same day, maintain streak
    } else {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastPlayed === yesterday.toDateString()) {
        userProgressData.currentStreak += 1
      } else {
        userProgressData.currentStreak = 1
      }
    }
    
    return { ...userProgressData }
  },

  async updateStreak(streak) {
    await delay(200)
    userProgressData.currentStreak = streak
    return { ...userProgressData }
  },

  async resetProgress() {
    await delay(350)
    userProgressData.puzzlesCompleted = 0
    userProgressData.totalTime = 0
    userProgressData.currentStreak = 0
    userProgressData.completedPuzzles = []
    userProgressData.lastPlayed = null
    return { ...userProgressData }
  }
}

export default userProgressService