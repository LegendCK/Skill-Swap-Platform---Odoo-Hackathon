import { useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      signupSchema.parse(formData);
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
        console.log('Signup data:', formData);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Signup error:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen w-full bg-brand-secondary flex items-center justify-center px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-500 ease-out animate-slideUp hover:shadow-3xl">

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 animate-fadeInDown">Create Account</h2>
            <p className="text-gray-600 animate-fadeInUp animation-delay-200">Join our skill-sharing community</p>
          </div>

          <form className="space-y-6 animate-fadeInUp animation-delay-300" onSubmit={handleSubmit}>

            <div className="group">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-200 group-focus-within:text-brand-secondary">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-300 ease-in-out transform focus:scale-105 ${
                  errors.name 
                    ? 'border-brand-accentRed focus:ring-brand-accentRed animate-shake' 
                    : 'border-gray-300 focus:ring-brand-secondary hover:border-brand-secondary'
                }`}
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="mt-1 text-sm text-brand-accentRed animate-slideInLeft">{errors.name}</p>}
            </div>

            <div className="group">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-200 group-focus-within:text-brand-secondary">
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
                    : 'border-gray-300 focus:ring-brand-secondary hover:border-brand-secondary'
                }`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="mt-1 text-sm text-brand-accentRed animate-slideInLeft">{errors.email}</p>}
            </div>

            <div className="group">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-200 group-focus-within:text-brand-secondary">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-300 ease-in-out transform focus:scale-105 ${
                  errors.password 
                    ? 'border-brand-accentRed focus:ring-brand-accentRed animate-shake' 
                    : 'border-gray-300 focus:ring-brand-secondary hover:border-brand-secondary'
                }`}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="mt-1 text-sm text-brand-accentRed animate-slideInLeft">{errors.password}</p>}
            </div>

            <div className="group">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-200 group-focus-within:text-brand-secondary">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-300 ease-in-out transform focus:scale-105 ${
                  errors.confirmPassword 
                    ? 'border-brand-accentRed focus:ring-brand-accentRed animate-shake' 
                    : 'border-gray-300 focus:ring-brand-secondary hover:border-brand-secondary'
                }`}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-brand-accentRed animate-slideInLeft">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full font-semibold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:ring-offset-2 relative ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed scale-95'
                  : 'bg-brand-secondary hover:bg-brand-secondaryDark text-white hover:scale-105 hover:shadow-lg active:scale-95'
              }`}
            >
              <span className={`transition-opacity duration-200 ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </span>
              {isSubmitting && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span className="ml-2">Creating Account...</span>
                </div>
              )}
            </button>
          </form>

          <div className="mt-6 text-center animate-fadeInUp animation-delay-500">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-secondary hover:text-brand-secondaryDark font-semibold transition-all duration-200 hover:underline transform hover:scale-105 inline-block">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;