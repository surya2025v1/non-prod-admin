import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import type { SignupFormData } from '../../types/auth';
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiArrowRight, FiCheck, FiShield, FiUsers, FiTrendingUp, FiGift } from 'react-icons/fi';

const signupSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (values: SignupFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Implement actual signup logic here
      console.log('Signup values:', values);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
    } catch (error) {
      setError('Failed to create account. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheck className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created Successfully!</h2>
            <p className="text-gray-600 mb-6">Welcome to WebsiteBuilder Pro. You can now sign in to your account.</p>
            <Link
              to="/login"
              className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-200 transform hover:scale-[1.02]"
            >
              Sign In Now
              <FiArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side - Branding & Value Proposition */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-primary-600 to-primary-700"></div>
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-20 h-20 bg-white rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-white rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-40 right-10 w-16 h-16 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
          {/* Logo & Brand */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-3">
                <span className="text-2xl font-bold text-primary-600">W</span>
              </div>
              <span className="text-2xl font-bold">WebsiteBuilder Pro</span>
            </div>
            <p className="text-xl text-green-100">Join thousands of successful businesses</p>
          </div>

          {/* Special Offer */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
            <div className="flex items-center mb-3">
              <FiGift className="w-6 h-6 text-yellow-300 mr-2" />
              <span className="text-lg font-semibold text-yellow-300">Limited Time Offer</span>
            </div>
            <p className="text-white mb-2">Get your first month FREE when you sign up today!</p>
            <p className="text-green-100 text-sm">✨ No credit card required • Cancel anytime</p>
          </div>

          {/* Value Propositions */}
          <div className="space-y-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <FiCheck className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Free Templates</h3>
                <p className="text-green-100 leading-relaxed">Access to 500+ professional templates across all industries.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <FiTrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Built-in Analytics</h3>
                <p className="text-green-100 leading-relaxed">Track visitor behavior and optimize your website performance.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <FiShield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">24/7 Support</h3>
                <p className="text-green-100 leading-relaxed">Expert support team ready to help you succeed.</p>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="border-t border-green-500 pt-6">
            <p className="text-sm text-green-100 mb-3">Join 10,000+ happy customers</p>
            <div className="flex items-center space-x-6 text-green-200">
              <div className="flex items-center space-x-2">
                <FiUsers className="w-4 h-4" />
                <span className="text-sm font-medium">10k+ Websites</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">⭐ 4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mr-3">
                <span className="text-2xl font-bold text-white">W</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">WebsiteBuilder Pro</span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
            <p className="text-gray-600">Start building your professional website today</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
              <div className="w-5 h-5 text-red-500 flex-shrink-0">⚠️</div>
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Signup Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <Formik
              initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
              validationSchema={signupSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isValid, dirty }) => (
                <Form className="space-y-6">
                  {/* Username Field */}
                  <div>
                    <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        className={`block w-full pl-10 pr-4 py-3 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 ${
                          errors.username && touched.username 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300 bg-gray-50 focus:bg-white'
                        }`}
                        placeholder="Choose a username"
                      />
                    </div>
                    {errors.username && touched.username && (
                      <p className="mt-2 text-sm text-red-600 font-medium">{errors.username}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        className={`block w-full pl-10 pr-4 py-3 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 ${
                          errors.email && touched.email 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300 bg-gray-50 focus:bg-white'
                        }`}
                        placeholder="Enter your email address"
                      />
                    </div>
                    {errors.email && touched.email && (
                      <p className="mt-2 text-sm text-red-600 font-medium">{errors.email}</p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        className={`block w-full pl-10 pr-12 py-3 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 ${
                          errors.password && touched.password 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300 bg-gray-50 focus:bg-white'
                        }`}
                        placeholder="Create a strong password"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                          style={{ 
                            backgroundColor: '#f3f4f6 !important', 
                            padding: '0 !important',
                            border: 'none !important',
                            width: '2rem !important',
                            height: '2rem !important',
                            color: '#4b5563 !important',
                            borderRadius: '9999px !important'
                          }}
                          tabIndex={-1}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    {errors.password && touched.password && (
                      <p className="mt-2 text-sm text-red-600 font-medium">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        className={`block w-full pl-10 pr-12 py-3 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 ${
                          errors.confirmPassword && touched.confirmPassword 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300 bg-gray-50 focus:bg-white'
                        }`}
                        placeholder="Confirm your password"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                          style={{ 
                            backgroundColor: '#f3f4f6 !important', 
                            padding: '0 !important',
                            border: 'none !important',
                            width: '2rem !important',
                            height: '2rem !important',
                            color: '#4b5563 !important',
                            borderRadius: '9999px !important'
                          }}
                          tabIndex={-1}
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    {errors.confirmPassword && touched.confirmPassword && (
                      <p className="mt-2 text-sm text-red-600 font-medium">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Terms & Conditions */}
                  <div className="flex items-start">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                    />
                    <label htmlFor="terms" className="ml-3 block text-sm text-gray-700 leading-relaxed">
                      I agree to the{' '}
                      <Link to="/terms" className="text-primary-600 hover:text-primary-500 font-medium">
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-primary-600 hover:text-primary-500 font-medium">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading || !(isValid && dirty)}
                    className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl text-base font-semibold shadow-lg transition-all duration-200 ${
                      isLoading || !(isValid && dirty)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-600 to-primary-600 text-white hover:from-green-700 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform hover:scale-[1.02] active:scale-[0.98]'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating account...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        Create Account
                        <FiArrowRight className="ml-2 h-5 w-5" />
                      </div>
                    )}
                  </button>
                </Form>
              )}
            </Formik>

            {/* Divider */}
            <div className="my-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500 font-medium">Or sign up with</span>
                </div>
              </div>
            </div>

            {/* Social Signup */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled
                className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors cursor-not-allowed opacity-60"
              >
                <img 
                  src="https://developers.google.com/identity/images/g-logo.png" 
                  alt="Google" 
                  className="w-5 h-5 mr-2" 
                />
                Google
              </button>
              <button
                type="button"
                disabled
                className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors cursor-not-allowed opacity-60"
              >
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" 
                  alt="Microsoft" 
                  className="w-5 h-5 mr-2" 
                />
                Microsoft
              </button>
            </div>
            
            <p className="mt-3 text-center text-xs text-gray-400">
              Social signup coming soon
            </p>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-semibold text-primary-600 hover:text-primary-500 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 