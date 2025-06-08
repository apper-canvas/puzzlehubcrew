import Puzzles from '../pages/Puzzles'
import DailyChallenge from '../pages/DailyChallenge'
import Progress from '../pages/Progress'
import Leaderboard from '../pages/Leaderboard'
import PuzzlePlay from '../pages/PuzzlePlay'
import NotFound from '../pages/NotFound'

export const routes = {
  puzzles: {
    id: 'puzzles',
    label: 'Puzzles',
    path: '/puzzles',
    icon: 'Grid3X3',
    component: Puzzles
  },
  daily: {
    id: 'daily',
    label: 'Daily Challenge',
    path: '/daily',
    icon: 'Calendar',
    component: DailyChallenge
  },
  progress: {
    id: 'progress',
    label: 'Progress',
    path: '/progress',
    icon: 'TrendingUp',
    component: Progress
  },
  leaderboard: {
    id: 'leaderboard',
    label: 'Leaderboard',
    path: '/leaderboard',
    icon: 'Trophy',
    component: Leaderboard
  },
  play: {
    id: 'play',
    label: 'Play',
    path: '/play/:puzzleId',
    icon: 'Play',
    component: PuzzlePlay,
    hidden: true
  },
  notFound: {
    id: 'notFound',
    label: '404',
    path: '*',
    component: NotFound,
    hidden: true
  }
}

export const routeArray = Object.values(routes)