import { useState } from 'react'
import { Link } from 'react-router-dom'

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const [isToolsOpen, setIsToolsOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          TTRPG Toolbox
        </Link>

        {/* Hamburger Menu for Mobile */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
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
              <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 rounded shadow-md z-10">
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
              onClick={() => setIsLoggedIn(true)}
              className="bg-blue-800 px-4 py-2 rounded hover:bg-blue-700"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-600 text-white px-4 py-2">
          <div className="flex flex-col space-y-2">
            <Link
              to="/"
              className="hover:text-blue-200 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            
            {/* Tools Dropdown for Mobile */}
            <div>
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className="hover:text-blue-200 focus:outline-none py-2 w-full text-left"
              >
                Tools ▼
              </button>
              {isToolsOpen && (
                <div className="pl-4 space-y-2">
                  <Link
                    to="/tools/dice-roller"
                    className="block hover:text-blue-200 py-2"
                    onClick={() => {
                      setIsToolsOpen(false)
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    Dice Roller
                  </Link>
                  <Link
                    to="/tools/knowledge-base"
                    className="block hover:text-blue-200 py-2"
                    onClick={() => {
                      setIsToolsOpen(false)
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    Knowledge Base
                  </Link>
                  <Link
                    to="/tools/random-generator"
                    className="block hover:text-blue-200 py-2"
                    onClick={() => {
                      setIsToolsOpen(false)
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    Random Generator
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/blog"
              className="hover:text-blue-200 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/contact"
              className="hover:text-blue-200 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>

            {isLoggedIn ? (
              <Link
                to="/profile"
                className="hover:text-blue-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
            ) : (
              <button
                onClick={() => {
                  setIsLoggedIn(true)
                  setIsMobileMenuOpen(false)
                }}
                className="bg-blue-800 px-4 py-2 rounded hover:bg-blue-700 text-left"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar