import { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState('request'); // request, confirm
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRequest = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await Auth.forgotPassword(email);
      setStep('confirm');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await Auth.forgotPasswordSubmit(email, code, newPassword);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {step === 'request' ? (
        <form onSubmit={handleRequest} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Send Reset Code
          </button>
        </form>
      ) : (
        <form onSubmit={handleConfirm} className="space-y-4">
          <div>
            <label className="block text-gray-700">Confirmation Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Reset Password
          </button>
        </form>
      )}
      <p className="mt-4 text-center">
        Back to{' '}
        <a href="/login" className="text-blue-600 hover:underline">
          Log in
        </a>
      </p>
    </div>
  );
}

export default ResetPassword;