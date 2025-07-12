import { useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    try {
      loginSchema.parse(formData);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0]] = err.message;
          }
        });
        return newErrors;
      }
      return {};
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        console.log('Login data:', formData);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Login error:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen w-full bg-brand-primary flex items-center justify-center px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-500 ease-out animate-slideUp hover:shadow-3xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 animate-fadeInDown">Welcome Back</h2>
            <p className="text-gray-600 animate-fadeInUp animation-delay-200">Sign in to your account</p>
          </div>

          <form className="space-y-6 animate-fadeInUp animation-delay-300" onSubmit={handleSubmit}>
            <div className="group">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-200 group-focus-within:text-brand-primary">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-300 ease-in-out transform focus:scale-105 ${
                  errors.email 
                    ? 'border-brand-accentRed focus:ring-brand-accentRed animate-shake' 
                    : 'border-gray-300 focus:ring-brand-primary hover:border-brand-primary'
                }`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="mt-1 text-sm text-brand-accentRed animate-slideInLeft">{errors.email}</p>}
            </div>

            <div className="group">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-200 group-focus-within:text-brand-primary">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-300 ease-in-out transform focus:scale-105 ${
                    errors.password 
                      ? 'border-brand-accentRed focus:ring-brand-accentRed animate-shake' 
                      : 'border-gray-300 focus:ring-brand-primary hover:border-brand-primary'
                  }`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-0 active:outline-none select-none"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-brand-accentRed animate-slideInLeft">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full font-semibold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 relative ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed scale-95'
                  : 'bg-brand-primary hover:bg-brand-primaryDark text-white hover:scale-105 hover:shadow-lg active:scale-95'
              }`}
            >
              <span className={`transition-opacity duration-200 ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </span>
              {isSubmitting && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span className="ml-2">Signing In...</span>
                </div>
              )}
            </button>
          </form>

          <div className="mt-6 text-center animate-fadeInUp animation-delay-500">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-brand-primary hover:text-brand-primaryDark font-semibold transition-all duration-200 hover:underline transform hover:scale-105 inline-block">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;