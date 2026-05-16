import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../api/blogAPI';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await blogAPI.getAllBlogs();
      setBlogs(data.blogs || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading blogs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">All Blogs</h1>
          <Link
            to="/create-blog"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Create Blog
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No blogs found. Be the first to create one!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {blogs.map((blog) => (
              <Link key={blog._id} to={`/blog/${blog._id}`}>
                <div className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    {blog.image && (
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full md:w-48 h-48 object-cover"
                      />
                    )}
                    <div className="flex-1 p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">{blog.title}</h2>
                      <p className="text-gray-600 mb-4 line-clamp-2">{blog.content}</p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>By {blog.author?.name}</span>
                        <span>{blog.views} views</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
