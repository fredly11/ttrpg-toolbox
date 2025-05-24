import { createContext, useState } from 'react';

export const DicePoolContext = createContext();

export const DicePoolProvider = ({ children }) => {
  const [pools, setPools] = useState([]);
  const [rollResults, setRollResults] = useState([]);

  const addPool = (pool) => {
    setPools((prev) => {
      if (prev.length >= 5) {
        return [pool, ...prev.slice(0, 4)];
      }
      return [pool, ...prev];
    });
  };

  const removePool = (id) => {
    setPools((prev) => prev.filter((pool) => pool.id !== id));
  };

  const addRollResult = (result) => {
    setRollResults((prev) => [result, ...prev.slice(0, 19)]); // Keep last 20 results
  };

  return (
    <DicePoolContext.Provider value={{ pools, addPool, removePool, rollResults, addRollResult }}>
      {children}
    </DicePoolContext.Provider>
  );
};