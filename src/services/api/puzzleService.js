import puzzleData from '../mockData/puzzles.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const puzzleService = {
  async getAll() {
    await delay(300)
    return [...puzzleData]
  },

  async getById(id) {
    await delay(200)
    const puzzle = puzzleData.find(p => p.id === id)
    if (!puzzle) {
      throw new Error('Puzzle not found')
    }
    return { ...puzzle }
  },

  async getByType(type) {
    await delay(250)
    return puzzleData.filter(p => p.type === type).map(p => ({ ...p }))
  },

  async getByDifficulty(difficulty) {
    await delay(250)
    return puzzleData.filter(p => p.difficulty === difficulty).map(p => ({ ...p }))
  },

  async create(puzzle) {
    await delay(400)
    const newPuzzle = {
      ...puzzle,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    puzzleData.push(newPuzzle)
    return { ...newPuzzle }
  },

  async update(id, updates) {
    await delay(350)
    const index = puzzleData.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Puzzle not found')
    }
    
    puzzleData[index] = { ...puzzleData[index], ...updates }
    return { ...puzzleData[index] }
  },

  async delete(id) {
    await delay(300)
    const index = puzzleData.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Puzzle not found')
    }
    
    const deleted = puzzleData.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default puzzleService