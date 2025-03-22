import { Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { FaTimes, FaSpinner, FaTrash, FaPlus } from "react-icons/fa";

export default function PostPage() {
  const { user, token, loading: authLoading, setUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [selectedPost, setSelectedPost] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState(null);

  const getPosts = async () => {
    try {
      if (!token) {
        throw new Error("No authorization token found");
      }
      const res = await fetch(`${import.meta.env.VITE_API_URI}/api/posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setPosts(data.posts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (e) => {
    e.preventDefault();
    try {
      setCreateLoading(true);
      if (!token) {
        setCreateLoading(false);
        throw new Error("No authorization token found");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URI}/api/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newPost),
        }
      );

      if (!response.ok) {
        setCreateLoading(false);
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      setCreateLoading(false);
      // Reset the form
      setNewPost({ title: "", content: "" });

      // Refresh the posts
      getPosts();

      // Close the create note modal
      setIsCreateModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const deletePost = async (postId) => {
    try {
      setDeletingPostId(postId);

      const res = await fetch(
        `${import.meta.env.VITE_API_URI}/api/posts/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }

      // Update the state to remove the deleted post
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      setDeletingPostId(null);
    } catch (err) {
      setError(err.message);
      setDeletingPostId(null);
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_URI}/api/users/verify`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!res.ok) {
            throw new Error("Token verification failed");
          }
          const data = await res.json();
          setUser(data.user);
          getPosts();
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, setUser]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <FaSpinner className="animate-spin text-4xl text-indigo-500" />
      </div>
    );
  }

  const openModal = (post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8 flex-wrap">
        <h1 className="text-3xl font-bold">
          {user.name.split(" ")[0]}'s Notes
        </h1>
        <button
          onClick={openCreateModal}
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          <FaPlus className="inline mr-2" /> Create Note
        </button>
      </div>

      {!user && (
        <h2 className="text-xl">
          Please{" "}
          <Link to="/login" className="text-indigo-500">
            Login
          </Link>{" "}
          to view this page
        </h2>
      )}

      {error && <p className="text-red-500">Error: {error}</p>}

      {user && !error && (
        <>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map((post, index) => (
                <div
                  key={post.id}
                  className={`p-6 rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105 ${
                    index % 2 === 0 ? "bg-indigo-100" : "bg-indigo-100"
                  } ${deletingPostId === post.id ? "fade-out" : ""}`}
                  onClick={() => openModal(post)}
                >
                  <div className="flex justify-between items-center flex-wrap">
                    <h3 className="text-xl font-bold mb-2">
                      {post.title.length > 12
                        ? post.title.slice(0, 12) + "..."
                        : post.title}
                    </h3>
                    <FaTrash
                      className="text-zinc-500 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePost(post.id);
                      }}
                    />
                  </div>

                  <p className="text-gray-700 mb-4 overflow-hidden">
                    {post.content.length > 27
                      ? post.content.slice(0, 27) + "..."
                      : post.content}
                  </p>
                  <small className="text-gray-500">
                    Created at: {new Date(post.created_at).toLocaleString()}
                  </small>
                </div>
              ))}
            </div>
          ) : (
            <p>No notes available.</p>
          )}
        </>
      )}

      {selectedPost && (
        <div className="fixed inset-0 backdrop-brightness-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full transform transition-transform duration-300 ease-in-out max-h-full overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {selectedPost.title.length > 32
                  ? selectedPost.title.slice(0, 32) + "..."
                  : selectedPost.title}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700 hover:cursor-pointer"
                onClick={closeModal}
              >
                <FaTimes size={24} />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[70vh] break-all">
              <p className="text-gray-700">{selectedPost.content}</p>
              <small className="text-gray-500">
                Created at: {new Date(selectedPost.created_at).toLocaleString()}
              </small>
            </div>
          </div>
        </div>
      )}

      {isCreateModalOpen && (
        <div className="fixed inset-0 backdrop-brightness-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full transform transition-transform duration-300 ease-in-out max-h-full overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Create Note</h2>
              <button
                className="text-gray-500 hover:text-gray-700 hover:cursor-pointer"
                onClick={closeCreateModal}
              >
                <FaTimes size={24} />
              </button>
            </div>
            <form onSubmit={createPost} className="flex flex-col w-full">
              <div className="my-4 flex flex-col">
                <label className="text-sm text-zinc-600 mb-1" htmlFor="title">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Title"
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost({ ...newPost, title: e.target.value })
                  }
                  required
                  className="border border-zinc-300 rounded-md p-3 outline-none transition duration-200 focus:ring focus:ring-zinc-300"
                />
              </div>
              <div className="my-4 flex flex-col">
                <label className="text-sm text-zinc-600 mb-1" htmlFor="content">
                  Content
                </label>
                <textarea
                  id="content"
                  placeholder="Content"
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost({ ...newPost, content: e.target.value })
                  }
                  required
                  className="border border-zinc-300 rounded-md p-3 outline-none transition duration-200 focus:ring focus:ring-zinc-300 h-32"
                />
              </div>
              <button
                type="submit"
                disabled={createLoading}
                className={`bg-indigo-600 text-white rounded-md p-2 my-4 cursor-pointer hover:bg-indigo-700 transition duration-200 ${
                  createLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {createLoading ? "Creating..." : "Create Note"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
