import { createContext, useState, useEffect } from 'react';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

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
      await getCurrentUser(); // Throws if not authenticated
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      if (!token) throw new Error('No token available');
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
      await getCurrentUser();
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      if (!token) throw new Error('No token available');
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
      await getCurrentUser();
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      if (!token) throw new Error('No token available');
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