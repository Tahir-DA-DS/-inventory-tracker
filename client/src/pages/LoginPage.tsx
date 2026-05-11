import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// You might want to move these icons to a separate component or utility file later
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.981 12C5.074 8.784 8.279 6.5 12 6.5c3.721 0 6.926 2.284 8.019 5.5.105.3.105.6 0 .9C18.926 15.216 15.721 17.5 12 17.5c-3.721 0-6.926-2.284-8.019-5.5a1.147 1.147 0 010-.9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6" />
  </svg>
);

const RLogo = () => (
    <div className="flex items-center justify-center w-10 h-10 bg-purple-700 rounded-full text-white font-bold text-lg">
        R
    </div>
);



const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt with:', { email, password });

    // --- SIMULATED LOGIN SUCCESS ---
    const fakeToken = 'super_secret_jwt_token_from_backend';
    const fakeUser = {
      id: 'usr_123',
      email: email,
      role: email === 'admin@example.com' ? 'ADMIN' : 'STAFF',
    };
    login(fakeToken, fakeUser);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content Area (Login Form + Image) */}
      <div className="flex flex-grow">
        {/* Left Side: Login Form */}
        <div className="w-full md:w-2/3 flex items-center justify-center bg-white p-8 sm:p-12 lg:p-16">
          <div className="max-w-sm w-full space-y-8">
            <div className="text-center">
              <div className="mb-[30px] flex justify-left items-center space-x-2">
                  <RLogo />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900">
                Welcome back!
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Don't have an account yet?{' '}
                <Link to="/signup" className="font-medium text-purple-700 hover:text-purple-300">
                  Sign up now
                </Link>
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </span>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-purple-700 hover:text-purple-300">
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Login Button */}
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-700 hover:bg-purple-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Log in
                </button>
              </div>

              {/* OR Separator */}
              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              {/* SSO Link */}
              <div className="text-center">
                <Link to="/sso-login" className="font-medium text-purple-700 hover:text-purple-300">
                  Log in with SSO
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Image Section (Hidden on small screens) */}
        {/* Using your provided image path: src/assets/invent.jpg */}
        <div className="hidden md:block md:w-1/3 relative"> {/* Removed bg-blue-900 */}
          <img
            src="src/assets/invent.jpg" // Your image path here
            alt="Inventory background"
            className="absolute inset-0 w-full h-full object-cover" // Ensure image covers the div
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;