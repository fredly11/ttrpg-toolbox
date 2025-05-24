import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import DiceRoller from './components/DiceRoller.jsx';
import AdvancedDiceRoller from './components/AdvancedDiceRoller.jsx';
import MyBoard from './components/MyBoard.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import ConfirmSignup from './components/ConfirmSignup.jsx';
import ResetPassword from './components/ResetPassword.jsx';
import { DicePoolProvider } from './context/DicePoolContext.jsx';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    }
  };

  const handleLogout = async () => {
    await Auth.signOut();
    setUser(null);
    navigate('/login');
  };

  return (
    <DicePoolProvider>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold">TTRPG Toolbox</Link>
            <nav>
              {user ? (
                <>
                  <span className="mr-4">Welcome, {user.attributes.email}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="mr-4 hover:underline">Log In</Link>
                  <Link to="/signup" className="hover:underline">Sign Up</Link>
                </>
              )}
            </nav>
          </div>
        </header>
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<DiceRoller />} />
            <Route path="/tools/dice-roller" element={<DiceRoller />} />
            <Route path="/tools/dice-roller/advanced" element={<AdvancedDiceRoller />} />
            <Route path="/tools/dice-roller/my-board" element={<MyBoard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/confirm-signup" element={<ConfirmSignup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </main>
      </div>
    </DicePoolProvider>
  );
}

export default App;