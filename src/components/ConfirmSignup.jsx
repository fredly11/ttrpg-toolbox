import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { confirmSignUp } from 'aws-amplify/auth';

function ConfirmSignup() {
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await confirmSignUp({ username, confirmationCode: code });
      navigate('/login');
    } catch (err) {
      console.error('Confirm signup error:', err);
      alert('Confirmation failed: ' + err.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Confirm Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="code" className="block text-gray-700">Confirmation Code</label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-2 border rounded"
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