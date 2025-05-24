import { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DicePoolContext } from '../context/DicePoolContext';

function MyBoard() {
  const location = useLocation();
  const { pools, removePool, rollResults, addRollResult } = useContext(DicePoolContext);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [error, setError] = useState('');

  const buttonSlots = Array(5).fill(null).map((_, index) => pools[index] || null);

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = () => {
    if (confirmDeleteId) {
      removePool(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const rollPool = async (pool) => {
    setError('');
    const poolData = {
      poolName: pool.name,
      rolls: pool.rolls.map((roll) => ({
        name: roll.name,
        numDice: roll.numDice,
        sides: roll.sides,
        dropLowest: roll.dropDice && roll.dropType === 'lowest' ? roll.dropCount : 0,
        dropHighest: roll.dropDice && roll.dropType === 'highest' ? roll.dropCount : 0,
      })),
      modifier: pool.rolls.reduce((sum, roll) => sum + (roll.modifier || 0), 0),
    };
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/roll-pool`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(poolData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const result = await response.json();
      addRollResult(result);
    } catch (err) {
      setError(`Failed to roll ${pool.name}: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col md:flex-row flex-1 md:space-x-4 w-[1200px]">
      {/* Tabs for Mobile */}
      <div className="md:hidden bg-white p-4 rounded-t-lg shadow mb-4">
        <div className="flex flex-col space-y-2">
          <Link
            to="/tools/dice-roller"
            className={`px-4 py-2 rounded text-center ${location.pathname === '/tools/dice-roller' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-blue-200'}`}
          >
            Basic
          </Link>
          <Link
            to="/tools/dice-roller/advanced"
            className={`px-4 py-2 rounded text-center ${location.pathname === '/tools/dice-roller/advanced' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-blue-200'}`}
          >
            Advanced
          </Link>
          <Link
            to="/tools/dice-roller/my-board"
            className={`px-4 py-2 rounded text-center ${location.pathname === '/tools/dice-roller/my-board' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-blue-200'}`}
          >
            My Board
          </Link>
        </div>
      </div>

      {/* Mode Selection Sidebar (1/8) */}
      <aside className="hidden md:block w-[240px] min-w-[200px] px-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Dice Roller Modes</h2>
          <ul className="space-y-2">
            <li>
              <Link
                to="/tools/dice-roller"
                className={`block px-3 py-2 rounded hover:bg-blue-200 ${location.pathname === '/tools/dice-roller' ? 'bg-blue-100' : ''}`}
              >
                Basic
              </Link>
            </li>
            <li>
              <Link
                to="/tools/dice-roller/advanced"
                className={`block px-3 py-2 rounded hover:bg-blue-200 ${location.pathname === '/tools/dice-roller/advanced' ? 'bg-blue-100' : ''}`}
              >
                Advanced
              </Link>
            </li>
            <li>
              <Link
                to="/tools/dice-roller/my-board"
                className={`block px-3 py-2 rounded hover:bg-blue-200 ${location.pathname === '/tools/dice-roller/my-board' ? 'bg-blue-100' : ''}`}
              >
                My Board
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content: My Board (5/16) */}
      <section className="w-full md:w-[600px] px-4 overflow-y-auto md:pb-0 pb-24">
        <div className="bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold mb-6">My Board</h1>
          <p className="text-gray-700 mb-4">Manage up to 5 custom dice pools in the free version.</p>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {buttonSlots.map((pool, index) => (
              <div key={index} className="relative">
                {pool ? (
                  <>
                    <button
                      onClick={() => rollPool(pool)}
                      className="w-full p-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                      aria-label={`Roll ${pool.name}`}
                    >
                      {pool.name}
                    </button>
                    <button
                      onClick={() => handleDelete(pool.id)}
                      className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                      aria-label={`Delete ${pool.name}`}
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <div className="w-full p-4 bg-gray-200 rounded text-gray-500 text-center">
                    Empty Slot
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Confirmation Dialog */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="text-gray-700 mb-4">Are you sure you want to delete this dice pool?</p>
            <div className="flex space-x-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Box: Fixed on Mobile, Sidebar on Desktop (3/16) */}
      <div className="w-full md:w-[360px] md:min-w-[300px] px-4">
        <div className="md:static fixed bottom-0 left-0 right-0 bg-white p-4 rounded-t-lg shadow-lg md:shadow md:rounded md:h-96 z-10 md:bg-white">
          <div className="flex justify-between items-center md:hidden">
            <h2 className="text-lg font-semibold">Roll Results</h2>
            <button
              onClick={() => setIsResultsOpen(!isResultsOpen)}
              className="text-gray-600 focus:outline-none"
              aria-label={isResultsOpen ? 'Hide results' : 'Show results'}
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
                  d={isResultsOpen ? 'M19 14l-7-7-7 7' : 'M5 10l7-7 7 7'}
                />
              </svg>
            </button>
          </div>
          <div
            className={`border border-gray-300 p-4 rounded-b-lg md:rounded md:h-80 overflow-y-auto ${isResultsOpen ? 'block' : 'hidden md:block'}`}
          >
            {rollResults.length === 0 ? (
              <p className="text-gray-600">No rolls yet.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {rollResults.map((result) => (
                  <li key={result.rollId} className="border-b pb-2">
                    {result.diceType ? (
                      <>
                        <span className="font-bold">
                          {result.input.numDice}
                          {result.diceType}
                          {result.input.modifier !== 0 ? `${result.input.modifier > 0 ? '+' : ''}${result.input.modifier}` : ''}
                        </span>
                        : [{result.results.rolls.join(', ')}]
                        {result.results.keptRolls.length < result.results.rolls.length &&
                          ` (kept [${result.results.keptRolls.join(', ')}])`}
                        = <span className="font-bold">{result.results.total}</span>
                        <br />
                        <span className="text-gray-500 text-xs">{result.timestamp}</span>
                      </>
                    ) : (
                      <>
                        <span className="font-bold">{result.poolName}</span>
                        <ul className="ml-4">
                          {result.rolls.map((roll) => (
                            <li key={roll.name}>
                              {roll.name}: {roll.input.numDice}d{roll.input.sides}
                              {roll.input.dropLowest > 0 && ` drop lowest ${roll.input.dropLowest}`}
                              {roll.input.dropHighest > 0 && ` drop highest ${roll.input.dropHighest}`}
                              : [{roll.results.rolls.join(', ')}]
                              {roll.results.keptRolls.length < roll.results.rolls.length &&
                                ` (kept [${roll.results.keptRolls.join(', ')}])`}
                              = {roll.results.subtotal}
                            </li>
                          ))}
                        </ul>
                        {result.modifier !== 0 && (
                          <span>
                            Modifier: {result.modifier > 0 ? '+' : ''}{result.modifier}
                          </span>
                        )}
                        <br />
                        Total: <span className="font-bold">{result.total}</span>
                        <br />
                        <span className="text-gray-500 text-xs">{result.timestamp}</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyBoard;