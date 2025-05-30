import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowRight, FiCheck, FiShield, FiClock, FiKey } from 'react-icons/fi';

const resetPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: { email: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Implement actual reset password logic here
      console.log('Reset password for:', values.email);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
    } catch (error) {
      setError('Failed to send reset email. Please try again.');
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 px-6">
        <div className="max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FiCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
            </p>
            
            <div className="bg-blue-50 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-3 text-blue-700">
                <FiClock className="w-5 h-5" />
                <span className="text-sm font-medium">The link will expire in 15 minutes</span>
              </div>
            </div>

            <div className="space-y-4">
              <Link
                to="/login"
                className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
              >
                <FiArrowRight className="mr-2 h-5 w-5" />
                Back to Sign In
              </Link>
              
              <button 
                onClick={() => setSuccess(false)}
                className="w-full py-3 px-4 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
              >
                Didn't receive the email? Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-primary-600 to-primary-700"></div>
        
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
            <p className="text-xl text-purple-100">Secure account recovery</p>
          </div>

          {/* Security Features */}
          <div className="space-y-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <FiShield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Secure Reset Process</h3>
                <p className="text-purple-100 leading-relaxed">Our password reset process uses industry-standard security protocols to protect your account.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <FiKey className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Email Verification</h3>
                <p className="text-purple-100 leading-relaxed">We'll send a secure link to your registered email address for identity verification.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <FiClock className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Time Limited Access</h3>
                <p className="text-purple-100 leading-relaxed">Reset links expire automatically for enhanced security of your account.</p>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="border-t border-purple-500 pt-6">
            <p className="text-sm text-purple-100 mb-3">Trusted by 10,000+ users worldwide</p>
            <div className="flex items-center space-x-6 text-purple-200">
              <div className="flex items-center space-x-2">
                <FiShield className="w-4 h-4" />
                <span className="text-sm font-medium">SSL Encrypted</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">⭐ 4.9/5 Security Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Reset Form */}
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
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-600">Enter your email address and we'll send you a link to reset your password</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
              <div className="w-5 h-5 text-red-500 flex-shrink-0">⚠️</div>
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Reset Form */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-8">
            <Formik
              initialValues={{ email: '' }}
              validationSchema={resetPasswordSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isValid, dirty }) => (
                <Form className="space-y-6">
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

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading || !(isValid && dirty)}
                    className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl text-base font-semibold shadow-lg transition-all duration-200 ${
                      isLoading || !(isValid && dirty)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-primary-600 text-white hover:from-purple-700 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform hover:scale-[1.02] active:scale-[0.98]'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending reset link...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        Send Reset Link
                        <FiArrowRight className="ml-2 h-5 w-5" />
                      </div>
                    )}
                  </button>
                </Form>
              )}
            </Formik>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3">
                <FiShield className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-sm font-semibold text-blue-900">Security Notice</div>
                  <div className="text-xs text-blue-700 mt-1">
                    For security reasons, reset links expire after 15 minutes. If you don't receive an email, please check your spam folder.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
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