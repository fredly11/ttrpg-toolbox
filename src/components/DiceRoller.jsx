import { createContext, useState } from 'react';

export const DicePoolContext = createContext();

export const DicePoolProvider = ({ children }) => {
  const [pools, setPools] = useState([]);
  const [rollResults, setRollResults] = useState([]);

  const addPool = (pool) => {
    setPools((prev) => [...prev, pool].slice(0, 5)); // Limit to 5 pools
  };

  const removePool = (id) => {
    setPools((prev) => prev.filter((pool) => pool.id !== id));
  };

  const addRollResult = (result) => {
    setRollResults((prev) => [result, ...prev].slice(0, 100)); // Limit to 100 results
  };

  return (
    <DicePoolContext.Provider value={{ pools, addPool, removePool, rollResults, addRollResult }}>
      {children}
    </DicePoolContext.Provider>
  );
};