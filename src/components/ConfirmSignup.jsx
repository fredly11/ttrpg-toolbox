import { useState } from 'react';
import { confirmSignUp } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

function ConfirmSignup() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await confirmSignUp({ username, confirmationCode: code });
      localStorage.removeItem('username');
      navigate('/tools/dice-roller');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Confirm Sign Up</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleConfirm} className="space-y-4">
        <div>
          <label className="block text-gray-700">Confirmation Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter code from email"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Confirm
        </button>
      </form>
    </div>
  );
}

export default ConfirmSignup;