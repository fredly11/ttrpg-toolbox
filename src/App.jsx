import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { getCurrentUser, signOut, fetchAuthSession } from 'aws-amplify/auth';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './components/Home.jsx';
import DiceRoller from './components/DiceRoller.jsx';
import AdvancedDiceRoller from './components/AdvancedDiceRoller.jsx';
import MyBoard from './components/MyBoard.jsx';
import KnowledgeBase from './components/KnowledgeBase.jsx';
import RandomGenerator from './components/RandomGenerator.jsx';
import Blog from './components/Blog.jsx';
import Contact from './components/Contact.jsx';
import Profile from './components/Profile.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import ConfirmSignup from './components/ConfirmSignup.jsx';
import ResetPassword from './components/ResetPassword.jsx';
import { DicePoolProvider } from './context/DicePoolContext.jsx';

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      const email = session.tokens?.idToken?.payload?.email;
      setUser({ ...currentUser, email });
    } catch {
      setUser(null);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Determine if right sidebar should be shown (exclude dice pages)
  const showRightSidebar = ![
    '/tools/dice-roller',
    '/tools/dice-roller/advanced',
    '/tools/dice-roller/my-board'
  ].includes(location.pathname);

  return (
    <DicePoolProvider>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar user={user} handleLogout={handleLogout} />
        <main className="flex flex-1 max-w-[1920px] mx-auto py-8">
          {/* Left Empty Space (80px) */}
          <div className="hidden md:block w-[80px] min-w-[80px]"></div>
          {/* Left Sidebar (200px) */}
          <aside className="hidden md:block w-[200px] min-w-[200px] px-4">
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-600">Sidebar (Ads/Widgets)</p>
            </div>
          </aside>
          {/* Main Content (960px, wider for dice pages) */}
          <section className={`w-full px-4 ${showRightSidebar ? 'md:w-[960px]' : 'md:w-[1160px]'}`}>
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
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/confirm-signup" element={<ConfirmSignup />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
          </section>
          {/* Right Sidebar (200px, non-dice pages only) */}
          {showRightSidebar && (
            <aside className="hidden md:block w-[200px] min-w-[200px] px-4">
              <div className="bg-white p-4 rounded shadow">
                <p className="text-gray-600">Right Sidebar (Ads/Widgets)</p>
              </div>
            </aside>
          )}
          {/* Right Empty Space (200px) */}
          <div className="hidden md:block w-[200px] min-w-[200px]"></div>
        </main>
        <Footer />
      </div>
    </DicePoolProvider>
  );
}

export default App;