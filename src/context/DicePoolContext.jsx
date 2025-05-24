import { createContext, useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';

export const DicePoolContext = createContext();

export const DicePoolProvider = ({ children }) => {
  const [pools, setPools] = useState([]);
  const [rollResults, setRollResults] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchPools();
  }, []);

  const fetchPools = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const token = user.signInUserSession.idToken.jwtToken;
      const response = await fetch(`${apiUrl}/get-pools`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch pools');
      const data = await response.json();
      setPools(data.slice(0, 5)); // Limit to 5
    } catch {
      setPools([]); // Guest user
    }
  };

  const addPool = async (pool) => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const token = user.signInUserSession.idToken.jwtToken;
      const response = await fetch(`${apiUrl}/save-pool`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pool)
      });
      if (!response.ok) throw new Error('Failed to save pool');
      await fetchPools();
    } catch {
      setPools((prev) => [...prev, { ...pool, id: Date.now() }].slice(0, 5)); // Guest user
    }
  };

  const removePool = async (id) => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const token = user.signInUserSession.idToken.jwtToken;
      const response = await fetch(`${apiUrl}/delete-pool`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ poolId: id })
      });
      if (!response.ok) throw new Error('Failed to delete pool');
      await fetchPools();
    } catch {
      setPools((prev) => prev.filter((pool) => pool.id !== id));
    }
  };

  const addRollResult = (result) => {
    setRollResults((prev) => [result, ...prev].slice(0, 100));
  };

  return (
    <DicePoolContext.Provider value={{ pools, addPool, removePool, rollResults, addRollResult }}>
      {children}
    </DicePoolContext.Provider>
  );
};