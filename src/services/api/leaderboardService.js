import leaderboardData from '../mockData/leaderboard.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const leaderboardService = {
  async getTopScores(puzzleType = 'all', limit = 10) {
    await delay(300)
    
    let scores = [...leaderboardData]
    
    if (puzzleType !== 'all') {
      scores = scores.filter(score => score.puzzleType === puzzleType)
    }
    
    // Sort by score descending, then by time ascending
    scores.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score
      }
      return a.time - b.time
    })
    
    return scores.slice(0, limit)
  },

  async addScore(scoreEntry) {
    await delay(400)
    const newScore = {
      ...scoreEntry,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString()
    }
    
    leaderboardData.push(newScore)
    return { ...newScore }
  },

  async getUserRank(playerName, puzzleType = 'all') {
    await delay(250)
    const topScores = await this.getTopScores(puzzleType, 1000)
    const userIndex = topScores.findIndex(score => score.playerName === playerName)
    
    return userIndex === -1 ? null : userIndex + 1
  },

  async getScoresByPlayer(playerName) {
    await delay(300)
    return leaderboardData
      .filter(score => score.playerName === playerName)
      .map(score => ({ ...score }))
  },

  async clearScores() {
    await delay(350)
    leaderboardData.length = 0
    return []
  }
}

export default leaderboardService