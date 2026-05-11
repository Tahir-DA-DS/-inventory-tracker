import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Re-using the Logo and Icon components.
// It would be a good idea to move these to a shared 'components' folder
// (e.g., client/src/components/common/EyeIcon.tsx, RLogo.tsx)
// to avoid duplication and keep your code DRY.
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

// UPDATED RLogo component to match the LoginPage's style
const RLogo = () => (
    <div className="flex items-center justify-center w-10 h-10 bg-purple-700 rounded-full text-white font-bold text-lg">
        R
    </div>
);


const SignupPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  // const { login } = useAuth(); // Uncomment if you decide to auto-login after signup

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    console.log('Signup attempt with:', { email, password });

    // --- SIMULATED SIGNUP SUCCESS ---
    // In Phase 1, this will be your actual API call to POST /auth/register.
    // After successful registration, typically you'd redirect to login or auto-login.
    alert('Account created successfully! Please log in.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content Area (Signup Form + Image) */}
      <div className="flex flex-grow">
        {/* Left Side: Signup Form */}
        <div className="w-full md:w-2/3 flex items-center justify-center bg-white p-8 sm:p-12 lg:p-16">
          <div className="max-w-sm w-full space-y-8">
            <div className="text-center">
              {/* UPDATED RLogo container for placement */}
              <div className="mb-[30px] flex justify-left items-center space-x-2">
                  <RLogo />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900">
                Create your account
              </h2>
              {/* Added font-rubik-mono for consistency */}
              <p className="mt-2 text-sm text-gray-600">
                Already have an account?{' '}
                {/* UPDATED link color */}
                <Link to="/login" className="font-medium text-purple-700 hover:text-purple-300">
                  Sign in now
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
                  autoComplete="new-password"
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

              {/* Confirm Password Input */}
              <div className="relative">
                <label htmlFor="confirm-password" className="sr-only">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </span>
              </div>

              {/* Signup Button */}
              <div>
                {/* UPDATED button color */}
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-700 hover:bg-purple-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sign up
                </button>
              </div>

              {/* The OR separator and SSO Link are typically not used on a signup page,
                  but if you need them, you can uncomment them and update their colors. */}
              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

            <div className="text-center">
                <Link to="/sso-signup" className="font-medium text-purple-700 hover:text-purple-300">
                  Sign up with SSO
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Image Section */}
        <div className="hidden md:block md:w-1/3 relative">
          <img
            src="src/assets/invent.jpg"
            alt="Inventory background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;