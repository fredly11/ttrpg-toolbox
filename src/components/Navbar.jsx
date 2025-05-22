import { useState } from 'react'
import { Link } from 'react-router-dom' // For future routing

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const [isToolsOpen, setIsToolsOpen] = useState(false)

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          TTRPG Toolbox
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-blue-200">Home</Link>
          
          {/* Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsToolsOpen(!isToolsOpen)}
              className="hover:text-blue-200 focus:outline-none"
            >
              Tools ▼
            </button>
            {isToolsOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 rounded shadow-md">
                <Link
                  to="/tools/dice-roller"
                  className="block px-4 py-2 hover:bg-blue-100"
                  onClick={() => setIsToolsOpen(false)}
                >
                  Dice Roller
                </Link>
                <Link
                  to="/tools/knowledge-base"
                  className="block px-4 py-2 hover:bg-blue-100"
                  onClick={() => setIsToolsOpen(false)}
                >
                  Knowledge Base
                </Link>
                <Link
                  to="/tools/random-generator"
                  className="block px-4 py-2 hover:bg-blue-100"
                  onClick={() => setIsToolsOpen(false)}
                >
                  Random Generator
                </Link>
              </div>
            )}
          </div>

          <Link to="/blog" className="hover:text-blue-200">Blog</Link>
          <Link to="/contact" className="hover:text-blue-200">Contact</Link>

          {/* Profile/Login Button */}
          {isLoggedIn ? (
            <Link to="/profile" className="hover:text-blue-200">
              Profile
            </Link>
          ) : (
            <button
              onClick={() => setIsLoggedIn(true)} // Mock login action
              className="bg-blue-800 px-4 py-2 rounded hover:bg-blue-700"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar