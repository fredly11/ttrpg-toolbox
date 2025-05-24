import { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DicePoolContext } from '../context/DicePoolContext';

function AdvancedDiceRoller() {
  const location = useLocation();
  const { addPool, rollResults, addRollResult } = useContext(DicePoolContext);
  const [rolls, setRolls] = useState([
    { id: 1, name: '', numDice: 1, sides: 6, modifier: 0, dropDice: false, dropCount: 0, dropType: 'highest' },
  ]);
  const [poolName, setPoolName] = useState('');
  const [includeCombinedTotal, setIncludeCombinedTotal] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [error, setError] = useState('');

  const addRoll = () => {
    setRolls((prev) => [
      ...prev,
      { id: prev.length + 1, name: '', numDice: 1, sides: 6, modifier: 0, dropDice: false, dropCount: 0, dropType: 'highest' },
    ]);
  };

  const updateRoll = (id, field, value) => {
    setRolls((prev) =>
      prev.map((roll) =>
        roll.id === id
          ? { ...roll, [field]: typeof value === 'string' ? value : parseInt(value) || 0 }
          : roll
      )
    );
  };

  const toggleDropDice = (id) => {
    setRolls((prev) =>
      prev.map((roll) => (roll.id === id ? { ...roll, dropDice: !roll.dropDice } : roll))
    );
  };

  const savePool = () => {
    if (poolName.trim() && rolls.some((roll) => roll.name.trim())) {
      addPool({
        id: Date.now(),
        name: poolName,
        includeCombinedTotal,
        rolls: rolls.map((roll) => ({
          name: roll.name,
          numDice: parseInt(roll.numDice) || 1,
          sides: parseInt(roll.sides) || 6,
          modifier: parseInt(roll.modifier) || 0,
          dropDice: roll.dropDice,
          dropCount: parseInt(roll.dropCount) || 0,
          dropType: roll.dropType,
        })),
      });
      setPoolName('');
      setIncludeCombinedTotal(false);
      setRolls([
        { id: 1, name: '', numDice: 1, sides: 6, modifier: 0, dropDice: false, dropCount: 0, dropType: 'highest' },
      ]);
    }
  };

  const rollPool = async () => {
    setError('');
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      setError('API URL not configured. Please check environment settings.');
      return;
    }
    const poolData = {
      poolName: poolName || 'Unnamed Pool',
      rolls: rolls.map((roll) => ({
        name: roll.name || `Roll ${roll.id}`,
        numDice: parseInt(roll.numDice) || 1,
        sides: parseInt(roll.sides) || 6,
        modifier: parseInt(roll.modifier) || 0,
        dropLowest: roll.dropDice && roll.dropType === 'lowest' ? parseInt(roll.dropCount) || 0 : 0,
        dropHighest: roll.dropDice && roll.dropType === 'highest' ? parseInt(roll.dropCount) || 0 : 0,
      })),
      includeCombinedTotal
    };
    try {
      const response = await fetch(`${apiUrl}/roll-pool`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(poolData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `HTTP error ${response.status}: ${errorData.error || 'Unknown error'}`
        );
      }
      const result = await response.json();
      addRollResult(result);
    } catch (err) {
      console.error('Roll pool error:', err);
      setError(
        err.name === 'TypeError' && err.message.includes('Failed to fetch')
          ? `Failed to roll pool: CORS error or network issue. Ensure API is accessible.`
          : `Failed to roll pool: ${err.message}`
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

      {/* Main Content: Advanced Dice Roller (5/16) */}
      <section className="w-full md:w-[600px] px-4 overflow-y-auto md:pb-0 pb-24">
        <div className="bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold mb-6">Advanced Dice Roller</h1>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <div className="space-y-6">
            {rolls.map((roll) => (
              <div key={roll.id} className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <input
                    type="text"
                    placeholder="Roll Name (e.g., Attack Roll)"
                    value={roll.name}
                    onChange={(e) => updateRoll(roll.id, 'name', e.target.value)}
                    className="p-2 border rounded w-full"
                    aria-label="Roll name"
                  />
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      value={roll.numDice}
                      onChange={(e) => updateRoll(roll.id, 'numDice', e.target.value)}
                      min={1}
                      className="w-16 p-2 border rounded text-center"
                      aria-label="Number of dice"
                    />
                    <span className="text-gray-700">d</span>
                    <input
                      type="number"
                      value={roll.sides}
                      onChange={(e) => updateRoll(roll.id, 'sides', e.target.value)}
                      min={1}
                      className="w-16 p-2 border rounded text-center"
                      aria-label="Number of sides"
                    />
                    <span className="text-gray-700">+</span>
                    <input
                      type="number"
                      value={roll.modifier}
                      onChange={(e) => updateRoll(roll.id, 'modifier', e.target.value)}
                      className="w-16 p-2 border rounded text-center"
                      aria-label="Roll modifier"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={roll.dropDice}
                        onChange={() => toggleDropDice(roll.id)}
                        className="h-4 w-4"
                        aria-label="Drop dice toggle"
                      />
                      <span>Drop Dice</span>
                    </label>
                    <input
                      type="number"
                      value={roll.dropCount}
                      onChange={(e) => updateRoll(roll.id, 'dropCount', e.target.value)}
                      min={0}
                      className="w-16 p-2 border rounded text-center"
                      disabled={!roll.dropDice}
                      aria-label="Number of dice to drop"
                    />
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`drop-type-${roll.id}`}
                          value="highest"
                          checked={roll.dropType === 'highest'}
                          onChange={(e) => updateRoll(roll.id, 'dropType', e.target.value)}
                          disabled={!roll.dropDice}
                          className="h-4 w-4"
                          aria-label="Drop highest dice"
                        />
                        <span>Highest</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`drop-type-${roll.id}`}
                          value="lowest"
                          checked={roll.dropType === 'lowest'}
                          onChange={(e) => updateRoll(roll.id, 'dropType', e.target.value)}
                          disabled={!roll.dropDice}
                          className="h-4 w-4"
                          aria-label="Drop lowest dice"
                        />
                        <span>Lowest</span>
                      </label>
                    </div>
                  </div>
                </div>
                <hr className="border-gray-300" />
              </div>
            ))}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
              <button
                onClick={addRoll}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add Another Roll
              </button>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Dice Pool Name"
                  value={poolName}
                  onChange={(e) => setPoolName(e.target.value)}
                  className="p-2 border rounded flex-1"
                  aria-label="Dice pool name"
                />
                <label className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={includeCombinedTotal}
                    onChange={(e) => setIncludeCombinedTotal(e.target.checked)}
                    className="h-4 w-4"
                    aria-label="Include combined total"
                  />
                  <span className="text-sm">Combined Total</span>
                </label>
              </div>
              <button
                onClick={savePool}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save Pool
              </button>
              <button
                onClick={rollPool}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Roll Pool
              </button>
            </div>
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
                              <span className="font-bold">{roll.name}</span>: [
                              {roll.results.rolls.map((r, i) => (
                                <span key={i} className={r.dropped ? 'text-gray-400' : ''}>
                                  {r.value}
                                  {i < roll.results.rolls.length - 1 ? ', ' : ''}
                                </span>
                              ))}
                              ]{roll.input.modifier !== 0 && ` + ${roll.input.modifier}`}{' '}
                              = <span className="font-bold">{roll.results.total}</span>
                            </li>
                          ))}
                        </ul>
                        {result.combinedTotal !== undefined && (
                          <div className="ml-4">
                            Total: <span className="font-bold">{result.combinedTotal}</span>
                          </div>
                        )}
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

export default AdvancedDiceRoller;