import dailyChallengeData from '../mockData/dailyChallenge.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const dailyChallengeService = {
  async getTodaysChallenge() {
    await delay(300)
    const today = new Date().toDateString()
    let challenge = dailyChallengeData.find(c => 
      new Date(c.date).toDateString() === today
    )
    
    if (!challenge) {
      // Generate today's challenge if none exists
      challenge = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        puzzleId: "puzzle-1",
        participants: Math.floor(Math.random() * 500) + 100,
        topScores: []
      }
      dailyChallengeData.push(challenge)
    }
    
    return { ...challenge }
  },

  async submitScore(score) {
    await delay(400)
    const today = new Date().toDateString()
    const challenge = dailyChallengeData.find(c => 
      new Date(c.date).toDateString() === today
    )
    
    if (challenge) {
      challenge.topScores.push(score)
      challenge.topScores.sort((a, b) => b.score - a.score)
      challenge.topScores = challenge.topScores.slice(0, 10) // Keep top 10
      challenge.participants += 1
    }
    
    return { ...challenge }
  },

  async getChallengeHistory() {
    await delay(350)
    return dailyChallengeData.map(c => ({ ...c }))
  },

  async getChallenge(date) {
    await delay(250)
    const challenge = dailyChallengeData.find(c => 
      new Date(c.date).toDateString() === new Date(date).toDateString()
    )
    
    if (!challenge) {
      throw new Error('Challenge not found for this date')
    }
    
    return { ...challenge }
  }
}

export default dailyChallengeService