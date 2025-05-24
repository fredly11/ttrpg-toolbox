import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import DiceRoller from './components/DiceRoller'
import AdvancedDiceRoller from './components/AdvancedDiceRoller'
import MyBoard from './components/MyBoard'
import { DicePoolProvider } from './context/DicePoolContext'

function Home() {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Welcome to TTRPG Toolbox</h1>
      <p className="text-gray-700">
        Your one-stop shop for tabletop RPG tools. Select a tool from the navigation bar to get started!
      </p>
    </div>
  )
}

function KnowledgeBase() {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Knowledge Base</h1>
      <p className="text-gray-700">Build and manage your TTRPG knowledge base.</p>
    </div>
  )
}

function RandomGenerator() {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Random Generator</h1>
      <p className="text-gray-700">Generate random items, events, or more.</p>
    </div>
  )
}

function Blog() {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Blog</h1>
      <p className="text-gray-700">Read the latest TTRPG tips and updates.</p>
    </div>
  )
}

function Contact() {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Contact</h1>
      <p className="text-gray-700">Get in touch with us!</p>
    </div>
  )
}

function Profile() {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <p className="text-gray-700">Manage your account and settings.</p>
    </div>
  )
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Mock login state

  return (
    <DicePoolProvider>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <main className="flex flex-1 max-w-[1920px] mx-auto py-8">
          {/* Left Empty Space (1/8) */}
          <div className="hidden md:block w-[80px] min-w-[80px]"></div>
          {/* Left Sidebar (1/8) */}
          <aside className="hidden md:block w-[60px] min-w-[200px] px-4">
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-600">Sidebar (Ads/Widgets)</p>
            </div>
          </aside>
          {/* Main Content (1/2 for non-dice pages, 5/8 for dice pages) */}
          <section className="w-full md:w-[960px] px-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tools/dice-roller" element={<DiceRoller />} />
              <Route path="/tools/dice-roller/advanced" element={<AdvancedDiceRoller />} />
              <Route path="/tools/dice-roller/my-board" element={<MyBoard />} />
              <Route path="/tools/knowledge-base" element={<KnowledgeBase />} />
              <Route path="/tools/random-generator" element={<RandomGenerator />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </section>
          {/* Right Sidebar (1/8, non-dice pages only) */}
          <aside className="hidden md:block w-[60px] min-w-[200px] px-4">
            <Routes>
              <Route path="/" element={
                <div className="bg-white p-4 rounded shadow">
                  <p className="text-gray-600">Right Sidebar (Ads/Widgets)</p>
                </div>
              } />
              <Route path="/tools/knowledge-base" element={
                <div className="bg-white p-4 rounded shadow">
                  <p className="text-gray-600">Right Sidebar (Ads/Widgets)</p>
                </div>
              } />
              <Route path="/tools/random-generator" element={
                <div className="bg-white p-4 rounded shadow">
                  <p className="text-gray-600">Right Sidebar (Ads/Widgets)</p>
                </div>
              } />
              <Route path="/blog" element={
                <div className="bg-white p-4 rounded shadow">
                  <p className="text-gray-600">Right Sidebar (Ads/Widgets)</p>
                </div>
              } />
              <Route path="/contact" element={
                <div className="bg-white p-4 rounded shadow">
                  <p className="text-gray-600">Right Sidebar (Ads/Widgets)</p>
                </div>
              } />
              <Route path="/profile" element={
                <div className="bg-white p-4 rounded shadow">
                  <p className="text-gray-600">Right Sidebar (Ads/Widgets)</p>
                </div>
              } />
            </Routes>
          </aside>
          {/* Right Empty Space (1/8) */}
          <div className="hidden md:block w-[240px] min-w-[200px]"></div>
        </main>
        <Footer />
      </div>
    </DicePoolProvider>
  )
}

export default App