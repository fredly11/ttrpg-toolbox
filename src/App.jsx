import { useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Mock login state

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <main className="flex flex-1 container mx-auto px-4 py-8">
        {/* Sidebars for ads or other content */}
        <aside className="hidden md:block w-1/4 pr-4">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-600">Sidebar (Ads/Widgets)</p>
          </div>
        </aside>
        <section className="w-full md:w-2/4">
          <div className="bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Welcome to TTRPG Toolbox</h1>
            <p className="text-gray-700">
              Your one-stop shop for tabletop RPG tools. Select a tool from the navigation bar to get started!
            </p>
          </div>
        </section>
        <aside className="hidden md:block w-1/4 pl-4">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-600">Sidebar (Ads/Widgets)</p>
          </div>
        </aside>
      </main>
      <Footer />
    </div>
  )
}

export default App