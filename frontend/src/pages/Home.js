import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) {
    return navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl p-8 md:p-12">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl text-white font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">{user?.name}!</span>
          </h1>

          <p className="text-xl text-gray-600 mb-2">You have successfully logged in</p>
          <p className="text-gray-500 mb-8">{user?.email}</p>

          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg p-6 mb-8">
            <p className="text-gray-700 text-lg">
              Your authentication is secured with encrypted passwords and JWT tokens. Enjoy your experience!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6">
              <div className="text-3xl mb-2">🔐</div>
              <h3 className="font-semibold text-gray-800 mb-2">Secure</h3>
              <p className="text-sm text-gray-600">Password hashing with bcryptjs</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-semibold text-gray-800 mb-2">Fast</h3>
              <p className="text-sm text-gray-600">JWT token authentication</p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-6">
              <div className="text-3xl mb-2">📱</div>
              <h3 className="font-semibold text-gray-800 mb-2">Responsive</h3>
              <p className="text-sm text-gray-600">Works on all devices</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <Link
              to="/blogs"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition duration-300 text-center"
            >
              📚 View All Blogs
            </Link>
            <Link
              to="/my-blogs"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg transition duration-300 text-center"
            >
              ✏️ My Blogs
            </Link>
            <Link
              to="/create-blog"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg hover:shadow-lg transition duration-300 text-center"
            >
              ➕ Create Blog
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="w-full md:w-auto px-8 py-3 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
