import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { blogAPI } from '../api/blogAPI';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const data = await blogAPI.getBlogById(id);
      setBlog(data.blog);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch blog');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await blogAPI.deleteBlog(id);
      navigate('/my-blogs');
    } catch (err) {
      setError(err.message || 'Failed to delete blog');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading blog...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
          <Link to="/blogs" className="mt-4 text-indigo-600 hover:text-indigo-700">
            ← Back to blogs
          </Link>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-500">Blog not found</p>
          <Link to="/blogs" className="mt-4 text-indigo-600 hover:text-indigo-700">
            ← Back to blogs
          </Link>
        </div>
      </div>
    );
  }

  const isAuthor = currentUser._id === blog.author._id;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-start">
          <Link to="/blogs" className="text-indigo-600 hover:text-indigo-700">
            ← Back to blogs
          </Link>
          {isAuthor && (
            <div className="flex gap-2">
              <Link
                to={`/edit-blog/${blog._id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Edit
              </Link>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm">
              <h3 className="text-lg font-bold mb-4">Delete Blog?</h3>
              <p className="text-gray-600 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Blog Content */}
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {blog.image && (
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-96 object-cover"
            />
          )}

          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-gray-200 text-gray-600">
              <div>
                <p className="text-sm">Author</p>
                <p className="font-semibold">{blog.author?.name}</p>
              </div>
              <div>
                <p className="text-sm">Published</p>
                <p className="font-semibold">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm">Views</p>
                <p className="font-semibold">{blog.views}</p>
              </div>
            </div>

            {/* Blog Content */}
            <div className="prose prose-lg max-w-none mb-8 text-gray-700 whitespace-pre-wrap">
              {blog.content}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;
