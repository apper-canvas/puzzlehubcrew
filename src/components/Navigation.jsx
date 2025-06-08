import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { routes } from '../config/routes'
import ApperIcon from './ApperIcon'

const Navigation = () => {
  const location = useLocation()
  const visibleRoutes = Object.values(routes).filter(route => !route.hidden)

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 px-4">
      <div className="flex items-center justify-between h-16 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="bg-primary rounded-lg p-2">
            <ApperIcon name="Puzzle" className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-heading text-primary">PuzzleHub</h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          {visibleRoutes.map(route => (
            <NavLink
              key={route.id}
              to={route.path}
              className={({ isActive }) =>
                `relative px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'text-primary bg-surface-50'
                    : 'text-gray-600 hover:text-primary hover:bg-surface-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name={route.icon} className="w-4 h-4" />
                    <span>{route.label}</span>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-surface-50 rounded-lg -z-10"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <ApperIcon name="Menu" className="w-6 h-6 text-gray-600" />
        </div>
      </div>

      {/* Mobile Bottom Tabs */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          {visibleRoutes.map(route => (
            <NavLink
              key={route.id}
              to={route.path}
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary bg-surface-50'
                    : 'text-gray-500 hover:text-primary'
                }`
              }
            >
              <ApperIcon name={route.icon} className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{route.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navigation