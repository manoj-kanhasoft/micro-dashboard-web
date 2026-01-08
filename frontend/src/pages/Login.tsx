import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Toast from "../components/Toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/leads", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password");
      setShowToast(true);
      return;
    }

    const success = login(username, password);
    if (success) {
      navigate("/leads");
    } else {
      setError("Invalid username or password");
      setShowToast(true);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-8 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div
                className="text-3xl font-bold"
                style={{ color: "#1e3a5f" }}
              >
                DASHBOARD
              </div>
              <div
                className="text-3xl font-bold"
                style={{ color: "#E63946" }}
              >
                LOGIN
              </div>
            </div>
            <h1 className="text-2xl font-bold" style={{ color: "#1e3a5f" }}>
              Welcome Back
            </h1>
            <p className="text-gray-600 mt-2">Please sign in to your account            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-2"
                style={{ color: "#1e3a5f" }}
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] text-sm"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
                style={{ color: "#1e3a5f" }}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] text-sm"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 rounded-lg font-medium text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: "#E63946" }}
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Default credentials:
              <br />
              <span className="font-semibold">Username:</span> admin
              <span className="mx-2">•</span>
              <span className="font-semibold">Password:</span> admin
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 relative">
        <div
          className="h-full w-full flex items-center justify-center"
          style={{ backgroundColor: "#1e3a5f" }}
        >
          <div className="text-center px-12">
            <div className="mb-6">
              <svg
                className="w-32 h-32 mx-auto"
                fill="none"
                stroke="white"
                viewBox="0 0 24 24"
                style={{ opacity: 0.3 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Sales leads.
            </h2>
            <p className="text-xl text-white/80">
              That's what we're good at.
            </p>
          </div>
        </div>
      </div>

      <Toast
        message={error}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type="error"
      />
    </div>
  );
};

export default Login;

