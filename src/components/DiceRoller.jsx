import { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DicePoolContext } from '../context/DicePoolContext';

function DiceRoller() {
  const location = useLocation();
  const { rollResults, addRollResult } = useContext(DicePoolContext);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [inputs, setInputs] = useState({
    d4: { numDice: 1, modifier: 0 },
    d6: { numDice: 1, modifier: 0 },
    d8: { numDice: 1, modifier: 0 },
    d10: { numDice: 1, modifier: 0 },
    d12: { numDice: 1, modifier: 0 },
    d20: { numDice: 1, modifier: 0 },
    d100: { numDice: 1, modifier: 0 },
  });
  const [error, setError] = useState('');
  const diceTypes = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];

  const handleInputChange = (dice, field, value) => {
    setInputs((prev) => ({
      ...prev,
      [dice]: { ...prev[dice], [field]: parseInt(value) || 0 },
    }));
  };

  const rollDice = async (dice) => {
    setError('');
    const { numDice, modifier } = inputs[dice];
    const sides = parseInt(dice.replace('d', ''));
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      setError('API URL not configured. Please check environment settings.');
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/roll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numDice, sides, modifier }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `HTTP error ${response.status}: ${errorData.error || 'Unknown error'}`
        );
      }
      const result = await response.json();
      addRollResult({ ...result, diceType: dice });
    } catch (err) {
      console.error('Roll error:', err);
      setError(
        err.name === 'TypeError' && err.message.includes('Failed to fetch')
          ? `Failed to roll ${dice}: CORS error or network issue. Ensure API is accessible.`
          : `Failed to roll ${dice}: ${err.message}`
      );
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

      {/* Main Content: Basic Dice Roller (5/16) */}
      <section className="w-full md:w-[600px] px-4 overflow-y-auto md:pb-0 pb-24">
        <div className="bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold mb-6">Basic Dice Roller</h1>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <div className="space-y-4">
            {diceTypes.map((dice) => (
              <div key={dice} className="flex items-center space-x-4">
                <input
                  type="number"
                  value={inputs[dice].numDice}
                  onChange={(e) => handleInputChange(dice, 'numDice', e.target.value)}
                  min={1}
                  className="w-16 p-2 border rounded text-center"
                  aria-label={`Number of ${dice} to roll`}
                />
                <button
                  onClick={() => rollDice(dice)}
                  className="bg-blue-600 w-16 text-white px-2 py-1 rounded hover:bg-blue-700"
                >
                  Roll {dice}
                </button>
                <span className="text-gray-700">+</span>
                <input
                  type="number"
                  value={inputs[dice].modifier}
                  onChange={(e) => handleInputChange(dice, 'modifier', e.target.value)}
                  className="w-16 p-2 border rounded text-center"
                  aria-label={`${dice} roll modifier`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

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
                              <span className="font-bold">{roll.name}</span>: {roll.input.numDice}d{roll.input.sides}
                              {roll.input.dropLowest > 0 && ` drop lowest ${roll.input.dropLowest}`}
                              {roll.input.dropHighest > 0 && ` drop highest ${roll.input.dropHighest}`}
                              : [{roll.results.rolls.join(', ')}]
                              {roll.results.keptRolls.length < roll.results.rolls.length &&
                                ` (kept [${roll.results.keptRolls.join(', ')}])`}
                              = <span className="font-bold">{roll.results.total}</span>
                              {roll.input.modifier !== 0 && ` (+${roll.input.modifier})`}
                            </li>
                          ))}
                        </ul>
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

export default DiceRoller;