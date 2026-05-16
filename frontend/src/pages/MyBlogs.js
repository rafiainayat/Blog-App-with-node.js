import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { blogAPI } from '../api/blogAPI';

const MyBlogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchUserBlogs();
  }, []);

  const fetchUserBlogs = async () => {
    try {
      setLoading(true);
      const data = await blogAPI.getUserBlogs();
      setBlogs(data.blogs || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      setDeletingId(id);
      await blogAPI.deleteBlog(id);
      setBlogs(blogs.filter((blog) => blog._id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete blog');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading your blogs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">My Blogs</h1>
          <Link
            to="/create-blog"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Create New Blog
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">You haven't created any blogs yet.</p>
            <Link
              to="/create-blog"
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Create your first blog →
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {blogs.map((blog) => (
              <div key={blog._id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
                <div className="flex flex-col md:flex-row">
                  {blog.image && (
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full md:w-48 h-48 object-cover"
                    />
                  )}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">{blog.title}</h2>
                      <p className="text-gray-600 mb-4 line-clamp-2">{blog.content}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        {new Date(blog.createdAt).toLocaleDateString()} • {blog.views} views
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/blog/${blog._id}`}
                          className="text-indigo-600 hover:text-indigo-700 font-semibold"
                        >
                          View
                        </Link>
                        <Link
                          to={`/edit-blog/${blog._id}`}
                          className="text-blue-600 hover:text-blue-700 font-semibold"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          disabled={deletingId === blog._id}
                          className="text-red-600 hover:text-red-700 font-semibold disabled:opacity-50"
                        >
                          {deletingId === blog._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBlogs;
