import { useEffect, useState } from 'react';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        const session = await fetchAuthSession();
        const email = session.tokens?.idToken?.payload?.email;
        setUser({ ...currentUser, email });
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  if (!user) {
    return <div className="bg-white p-6 rounded shadow text-center">Loading...</div>;
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <p className="text-gray-700">Email: {user.email}</p>
      <p className="text-gray-700">Manage your account and settings.</p>
    </div>
  );
}

export default Profile;