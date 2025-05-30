import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
});

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (values: { email: string }) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual forgot password logic here
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-primary-50 font-sans">
      <div className="bg-white py-14 px-10 sm:px-12 rounded-3xl border border-gray-200 shadow-2xl max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Reset your password</h2>
          <p className="text-base text-gray-500">Enter your email and we'll send you a reset link</p>
        </div>
        {submitted ? (
          <div className="text-center">
            <p className="text-green-600 font-semibold mb-4">If an account exists for that email, a reset link has been sent.</p>
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200">
              Return to sign in
            </Link>
          </div>
        ) : (
          <Formik
            initialValues={{ email: '' }}
            validationSchema={forgotPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isValid, dirty }) => (
              <Form className="space-y-6">
                <div>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className={`form-input block w-full px-4 py-3 rounded-lg border text-gray-900 bg-gray-50 focus:bg-white ${
                        errors.email && touched.email
                          ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } transition-colors duration-200`}
                      placeholder="Email address"
                    />
                    {errors.email && touched.email && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {errors.email && touched.email && (
                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.email}</p>
                  )}
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isLoading || !(isValid && dirty)}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow text-base font-semibold text-white 
                      ${isLoading || !(isValid && dirty)
                        ? 'bg-blue-200 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                      } transition-all duration-200`}
                  >
                    {isLoading ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : null}
                    {isLoading ? 'Sending reset link...' : 'Send reset link'}
                  </button>
                </div>
                <div className="text-center mt-8">
                  <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200">
                    Return to sign in
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
} 