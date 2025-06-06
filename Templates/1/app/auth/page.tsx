"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Heart, 
  Shield,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

// API base URL for authentication endpoints
const API_BASE_URL = "http://localhost:8001"

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  
  // Form validation states
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [emailValid, setEmailValid] = useState<boolean | null>(null)
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login')
  const [showResetPassword, setShowResetPassword] = useState(false)
  const loginEmailRef = useRef<HTMLInputElement>(null)
  const loginPasswordRef = useRef<HTMLInputElement>(null)
  const signupFirstNameRef = useRef<HTMLInputElement>(null)
  const signupLastNameRef = useRef<HTMLInputElement>(null)
  const signupEmailRef = useRef<HTMLInputElement>(null)
  const signupPasswordRef = useRef<HTMLInputElement>(null)
  const signupConfirmPasswordRef = useRef<HTMLInputElement>(null)
  const resetEmailRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 8
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value
    if (email) {
      setEmailValid(validateEmail(email))
    } else {
      setEmailValid(null)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value
    if (password) {
      setPasswordValid(validatePassword(password))
    } else {
      setPasswordValid(null)
    }
  }

  // Clear errors/success on tab switch
  const handleTabChange = (tab: 'login' | 'signup') => {
    setActiveTab(tab)
    setErrors({})
    setSuccess(null)
    setShowResetPassword(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    setSuccess(null)
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userid: loginEmailRef.current?.value,
          password: loginPasswordRef.current?.value,
        })
      })
      const data = await res.json()
      console.log(data) // Debug: log the API response
      if (res.ok && (data.success || data.access_token)) {
        sessionStorage.setItem('isSuccess', 'true')
        sessionStorage.setItem('user', JSON.stringify(data.user || {}))
        if (data.access_token) sessionStorage.setItem('token', data.access_token)
        if (data.user?.role) sessionStorage.setItem('role', data.user.role)
        if (data.user?.username) sessionStorage.setItem('username', data.user.username)
        if (data.user?.id) sessionStorage.setItem('id', data.user.id)
        
        // Dispatch custom event to notify navbar of auth state change
        window.dispatchEvent(new CustomEvent('authStateChanged'))
        
        // Redirect based on user role
        const userRole = data.user?.role?.toLowerCase()
        console.log('User role detected:', userRole)
        if (userRole === 'admin' || userRole === 'editor') {
          console.log('Redirecting to /admin')
          router.push('/admin')
          console.log('router.push(/admin) called')
        } else {
          console.log('Redirecting to /profile')
          router.push('/profile')
          console.log('router.push(/profile) called')
        }
      } else {
        setErrors({ login: data.message || 'Login failed' })
      }
    } catch (err) {
      console.error('Login error:', err)
      setErrors({ login: 'Network error' })
    }
    setIsLoading(false)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreeToTerms) {
      setErrors({ terms: 'Please agree to the terms and conditions' })
      setSuccess(null)
      return
    }
    if (signupPasswordRef.current?.value !== signupConfirmPasswordRef.current?.value) {
      setErrors({ signup: 'Passwords do not match' })
      setSuccess(null)
      return
    }
    setIsLoading(true)
    setErrors({})
    setSuccess(null)
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: signupFirstNameRef.current?.value,
          last_name: signupLastNameRef.current?.value,
          email: signupEmailRef.current?.value,
          password: signupPasswordRef.current?.value,
        })
      })
      const data = await res.json()
      console.log('Signup response:', data) // Debug: log the API response
      
      if (res.ok && data.success) {
        sessionStorage.setItem('isSuccess', 'true')
        sessionStorage.setItem('user', JSON.stringify(data.user || {}))
        setSuccess('Welcome to our spiritual community! Account created successfully.')
        
        // Dispatch custom event to notify navbar of auth state change
        window.dispatchEvent(new CustomEvent('authStateChanged'))
        
        // Clear all form fields after successful signup
        if (signupFirstNameRef.current) signupFirstNameRef.current.value = ''
        if (signupLastNameRef.current) signupLastNameRef.current.value = ''
        if (signupEmailRef.current) signupEmailRef.current.value = ''
        if (signupPasswordRef.current) signupPasswordRef.current.value = ''
        if (signupConfirmPasswordRef.current) signupConfirmPasswordRef.current.value = ''
        
        // Reset validation states
        setEmailValid(null)
        setPasswordValid(null)
        
        // Reset terms checkbox
        setAgreeToTerms(false)
      } else {
        // Handle specific error cases
        if (res.status === 409) {
          setErrors({ signup: 'Email address is already registered. Please try to sign in instead.' })
        } else if (res.status === 422) {
          setErrors({ signup: 'Please check your input fields and try again.' })
        } else {
          setErrors({ signup: data.message || 'Signup failed. Please try again.' })
        }
      }
    } catch (err) {
      console.error('Signup error:', err)
      setErrors({ signup: 'Network error. Please check your connection and try again.' })
    }
    setIsLoading(false)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    setSuccess(null)
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: resetEmailRef.current?.value,
        })
      })
      const data = await res.json()
      console.log('Reset password response:', data) // Debug: log the API response
      
      if (res.ok && data.success) {
        setSuccess('Reset password link has been sent to your email address.')
        // Clear the email field
        if (resetEmailRef.current) resetEmailRef.current.value = ''
        // Optionally go back to login after a delay
        setTimeout(() => {
          setShowResetPassword(false)
          setSuccess(null)
        }, 3000)
      } else {
        setErrors({ reset: data.message || 'Failed to send reset link. Please try again.' })
      }
    } catch (err) {
      console.error('Reset password error:', err)
      setErrors({ reset: 'Network error. Please check your connection and try again.' })
    }
    setIsLoading(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-saffron-25 to-white">
      {/* Background with proper layering */}
      <div className="fixed inset-0 opacity-5">
        <Image src="/placeholder.svg?height=600&width=1200" alt="Temple Background" fill className="object-cover" />
      </div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left Side - Welcome Section */}
          <div className="hidden lg:flex flex-col justify-center space-y-8 px-8">
            <div className="text-center lg:text-left">
              {/* Temple Logo */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-maroon-700 rounded-full shadow-xl mb-6">
                <span className="text-gray-300 font-bold text-2xl">॥</span>
              </div>
              
              {/* Welcome Header */}
              <div className="mb-6">
                <div className="w-16 h-1 bg-gold-400 mb-2"></div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2 text-maroon-700">
                  Sacred Temple
                </h1>
                <div className="w-16 h-1 bg-gold-400"></div>
              </div>

              <p className="text-lg md:text-xl text-gold-600 mb-4 font-sanskrit">
                सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः
              </p>
              <p className="text-sm md:text-base text-gold-700 mb-8 italic">
                "May all beings be happy, may all beings be free from illness"
              </p>

              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Join our spiritual community and embark on a journey of divine connection, 
                cultural preservation, and personal growth.
              </p>
              
              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Access to temple services</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Community events & programs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Spiritual guidance & support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Forms */}
          <div className="flex flex-col justify-center">
            {/* Mobile Header */}
            <div className="text-center mb-8 lg:hidden">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-maroon-700 rounded-full shadow-lg mb-4">
                <span className="text-gray-300 font-bold text-xl">॥</span>
              </div>
              <h1 className="text-3xl font-bold text-maroon-700 mb-2">Sacred Temple</h1>
              <p className="text-gray-600">Join our spiritual community</p>
            </div>

            {/* Main Auth Card */}
            <div className="bg-white rounded-2xl shadow-2xl border border-gold-200 overflow-hidden">
              <Tabs defaultValue="login" className="w-full">
                <div className="px-6 pt-6">
                  <TabsList className="grid w-full grid-cols-2 h-14 bg-saffron-50 rounded-xl p-1 border border-gold-200">
                    <TabsTrigger 
                      value="login" 
                      className="text-gray-600 data-[state=active]:bg-maroon-700 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-semibold transition-all duration-300 h-12"
                      onClick={() => handleTabChange('login')}
                    >
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger 
                      value="signup" 
                      className="text-gray-600 data-[state=active]:bg-maroon-700 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-semibold transition-all duration-300 h-12"
                      onClick={() => handleTabChange('signup')}
                    >
                      Create Account
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Login Tab */}
                <TabsContent value="login" className="mt-0">
                  <div className="p-6 pt-8">
                    {!showResetPassword ? (
                      <>
                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-bold text-maroon-700 mb-2">Welcome Back</h2>
                          <p className="text-gray-600">Enter your credentials to access your account</p>
                        </div>
                        
                        {/* Error/Success Alert for Login */}
                        {(errors.login || success) && (
                          <Alert className={`mb-4 ${errors.login ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                            {errors.login ? (
                              <>
                                <AlertCircle className="h-5 w-5 text-red-600" />
                                <AlertDescription className="text-red-600">{errors.login}</AlertDescription>
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <AlertDescription className="text-green-700">{success}</AlertDescription>
                              </>
                            )}
                          </Alert>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                          <div className="space-y-2">
                            <Label htmlFor="loginEmail" className="text-sm font-semibold text-gray-800">
                              Email Address
                            </Label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                              </div>
                              <Input 
                                id="loginEmail" 
                                type="email" 
                                placeholder="your.email@example.com" 
                                className="pl-12 pr-12 h-14 border-gray-300 focus:border-maroon-500 focus:ring-maroon-500 bg-white text-gray-900 rounded-lg text-base" 
                                onChange={handleEmailChange}
                                required
                                ref={loginEmailRef}
                              />
                              {emailValid !== null && (
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                  {emailValid ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                  ) : (
                                    <AlertCircle className="h-5 w-5 text-red-500" />
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="loginPassword" className="text-sm font-semibold text-gray-800">
                                Password
                              </Label>
                              <button 
                                type="button"
                                onClick={() => setShowResetPassword(true)}
                                className="text-sm text-maroon-600 hover:text-maroon-700 hover:underline font-medium transition-colors"
                              >
                                Forgot password?
                              </button>
                            </div>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                              </div>
                              <Input
                                id="loginPassword"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="pl-12 pr-12 h-14 border-gray-300 focus:border-maroon-500 focus:ring-maroon-500 bg-white text-gray-900 rounded-lg text-base"
                                onChange={handlePasswordChange}
                                required
                                ref={loginPasswordRef}
                              />
                              <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                {showPassword ? (
                                  <EyeOff className="h-5 w-5" />
                                ) : (
                                  <Eye className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                          </div>

                          <Button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full h-14 bg-maroon-700 hover:bg-maroon-800 text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
                          >
                            {isLoading ? (
                              <div className="flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Signing In...
                              </div>
                            ) : (
                              <div className="flex items-center justify-center">
                                Sign In
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                              </div>
                            )}
                          </Button>
                        </form>
                      </>
                    ) : (
                      <>
                        {/* Reset Password Form */}
                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-bold text-maroon-700 mb-2">Reset Password</h2>
                          <p className="text-gray-600">Enter your email address to receive a password reset link</p>
                        </div>
                        
                        {/* Error/Success Alert for Reset Password */}
                        {(errors.reset || success) && (
                          <Alert className={`mb-4 ${errors.reset ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                            {errors.reset ? (
                              <>
                                <AlertCircle className="h-5 w-5 text-red-600" />
                                <AlertDescription className="text-red-600">{errors.reset}</AlertDescription>
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <AlertDescription className="text-green-700">{success}</AlertDescription>
                              </>
                            )}
                          </Alert>
                        )}

                        <form onSubmit={handleResetPassword} className="space-y-6">
                          <div className="space-y-2">
                            <Label htmlFor="resetEmail" className="text-sm font-semibold text-gray-800">
                              Email Address
                            </Label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                              </div>
                              <Input 
                                id="resetEmail" 
                                type="email" 
                                placeholder="your.email@example.com" 
                                className="pl-12 h-14 border-gray-300 focus:border-maroon-500 focus:ring-maroon-500 bg-white text-gray-900 rounded-lg text-base" 
                                required
                                ref={resetEmailRef}
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <Button 
                              type="submit" 
                              disabled={isLoading}
                              className="w-full h-14 bg-maroon-700 hover:bg-maroon-800 text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
                            >
                              {isLoading ? (
                                <div className="flex items-center justify-center">
                                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                  Sending Reset Link...
                                </div>
                              ) : (
                                <div className="flex items-center justify-center">
                                  Send Reset Link
                                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </div>
                              )}
                            </Button>
                            
                            <Button 
                              type="button" 
                              onClick={() => {
                                setShowResetPassword(false)
                                setErrors({})
                                setSuccess(null)
                              }}
                              variant="outline"
                              className="w-full h-12 border-maroon-200 text-maroon-700 hover:bg-maroon-50 font-medium rounded-lg transition-all duration-300"
                            >
                              Back to Sign In
                            </Button>
                          </div>
                        </form>
                      </>
                    )}
                  </div>
                </TabsContent>

                {/* Signup Tab */}
                <TabsContent value="signup" className="mt-0">
                  <div className="p-6 pt-8">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-maroon-700 mb-2">Join Our Community</h2>
                      <p className="text-gray-600">Create an account to access all temple services</p>
                    </div>

                    {/* Error/Success Alert for Signup */}
                    {(errors.signup || success) && (
                      <Alert className={`mb-4 ${errors.signup ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                        {errors.signup ? (
                          <>
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <AlertDescription className="text-red-600">{errors.signup}</AlertDescription>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <AlertDescription className="text-green-700">{success}</AlertDescription>
                          </>
                        )}
                      </Alert>
                    )}

                    <form onSubmit={handleSignup} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-sm font-semibold text-gray-800">
                            First Name
                          </Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input 
                              id="firstName" 
                              type="text" 
                              placeholder="First name" 
                              className="pl-12 h-14 border-gray-300 focus:border-maroon-500 focus:ring-maroon-500 bg-white text-gray-900 rounded-lg text-base" 
                              required
                              ref={signupFirstNameRef}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-sm font-semibold text-gray-800">
                            Last Name
                          </Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input 
                              id="lastName" 
                              type="text" 
                              placeholder="Last name" 
                              className="pl-12 h-14 border-gray-300 focus:border-maroon-500 focus:ring-maroon-500 bg-white text-gray-900 rounded-lg text-base" 
                              required
                              ref={signupLastNameRef}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signupEmail" className="text-sm font-semibold text-gray-800">
                          Email Address
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input 
                            id="signupEmail" 
                            type="email" 
                            placeholder="your.email@example.com" 
                            className="pl-12 pr-12 h-14 border-gray-300 focus:border-maroon-500 focus:ring-maroon-500 bg-white text-gray-900 rounded-lg text-base" 
                            onChange={handleEmailChange}
                            required
                            ref={signupEmailRef}
                          />
                          {emailValid !== null && (
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                              {emailValid ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <AlertCircle className="h-5 w-5 text-red-500" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signupPassword" className="text-sm font-semibold text-gray-800">
                          Password
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            id="signupPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            className="pl-12 pr-12 h-14 border-gray-300 focus:border-maroon-500 focus:ring-maroon-500 bg-white text-gray-900 rounded-lg text-base"
                            onChange={handlePasswordChange}
                            required
                            ref={signupPasswordRef}
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        {passwordValid !== null && !passwordValid && (
                          <p className="text-sm text-red-600">Password must be at least 8 characters long</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-800">
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            className="pl-12 pr-12 h-14 border-gray-300 focus:border-maroon-500 focus:ring-maroon-500 bg-white text-gray-900 rounded-lg text-base"
                            required
                            ref={signupConfirmPasswordRef}
                          />
                          <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <Checkbox 
                            id="terms" 
                            checked={agreeToTerms}
                            onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                            className="mt-1 border-gray-300 data-[state=checked]:bg-maroon-700 data-[state=checked]:border-maroon-700"
                          />
                          <Label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
                            I agree to the{" "}
                            <Link href="#" className="text-maroon-600 hover:text-maroon-700 hover:underline font-medium">
                              Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link href="#" className="text-maroon-600 hover:text-maroon-700 hover:underline font-medium">
                              Privacy Policy
                            </Link>
                          </Label>
                        </div>
                        {errors.terms && (
                          <Alert className="border-red-200 bg-red-50">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-600">
                              {errors.terms}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>

                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full h-14 bg-maroon-700 hover:bg-maroon-800 text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Creating Account...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            Create Account
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                          </div>
                        )}
                      </Button>
                    </form>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Footer */}
            <div className="text-center mt-8 text-sm text-gray-600">
              <p>
                By signing in, you become part of our spiritual community dedicated to{" "}
                <span className="text-maroon-600 font-medium">peace, compassion, and spiritual growth</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
