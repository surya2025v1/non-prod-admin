"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { 
  CreditCard, 
  Heart, 
  DollarSign, 
  Calendar, 
  User, 
  Shield, 
  Check, 
  Info,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Banknote,
  Building2,
  Star,
  Users,
  Clock,
  Award,
  Target
} from "lucide-react"

export default function DonationPage() {
  const [step, setStep] = useState(1)
  const [donationAmount, setDonationAmount] = useState<string>("")
  const [customAmount, setCustomAmount] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<string>("credit")
  const [donationPurpose, setDonationPurpose] = useState<string>("general")
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    message: ""
  })

  const totalSteps = 3
  const progressPercentage = (step / totalSteps) * 100

  const handleDonationChange = (value: string) => {
    setDonationAmount(value)
    if (value !== "custom") {
      setCustomAmount("")
    }
  }

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1)
  }

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      alert("Thank you for your generous donation! Your contribution will help support our temple and community programs.")
    }, 3000)
  }

  const getAmount = () => {
    return donationAmount === "custom" ? customAmount : donationAmount
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return donationAmount && donationPurpose && (donationAmount !== "custom" || customAmount)
      case 2:
        return formData.firstName && formData.lastName && formData.email
      case 3:
        return paymentMethod
      default:
        return false
    }
  }

  const purposes = [
    { 
      value: "general", 
      label: "General Temple Fund", 
      description: "Support overall temple operations, maintenance, and daily activities",
      icon: "🏛️",
      impact: "Helps maintain the temple's daily operations and facilities"
    },
    { 
      value: "festivals", 
      label: "Festival Celebrations", 
      description: "Fund religious festivals, community celebrations, and special events",
      icon: "🎉",
      impact: "Enables beautiful festivals that bring our community together"
    },
    { 
      value: "education", 
      label: "Educational Programs", 
      description: "Support spiritual education, cultural classes, and youth programs",
      icon: "📚",
      impact: "Nurtures the next generation with spiritual and cultural knowledge"
    },
    { 
      value: "community", 
      label: "Community Services", 
      description: "Fund free meals, outreach programs, and community support",
      icon: "🤝",
      impact: "Provides essential services to those in need"
    },
    { 
      value: "construction", 
      label: "Temple Development", 
      description: "Contribute to temple expansion, renovations, and improvements",
      icon: "🏗️",
      impact: "Creates better facilities for worship and community activities"
    }
  ]

  const predefinedAmounts = [
    { amount: "25", popular: false, description: "Covers basic puja supplies" },
    { amount: "51", popular: false, description: "Supports one family meal" },
    { amount: "101", popular: true, description: "Funds educational materials" },
    { amount: "251", popular: false, description: "Sponsors a festival celebration" },
    { amount: "501", popular: false, description: "Supports monthly operations" },
    { amount: "1001", popular: false, description: "Major temple improvement" }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-saffron-25 to-white">
      {/* Background with proper layering */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <Image src="/placeholder.svg?height=600&width=1200" alt="Temple Background" fill className="object-cover" />
      </div>

      <div className="relative z-10 py-8">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Enhanced Header - More Compact */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-maroon-700 rounded-full shadow-xl mb-4">
              <Heart className="h-8 w-8 text-white" />
            </div>
            
            <div className="mb-4">
              <div className="w-20 h-0.5 bg-gold-400 mx-auto mb-2"></div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-maroon-700">
                Support Our Sacred Temple
              </h1>
              <div className="w-20 h-0.5 bg-gold-400 mx-auto"></div>
            </div>

            <p className="text-base md:text-lg text-gold-600 mb-2 font-sanskrit">
              दानवीरानां सर्वदा शुभास्ते
            </p>
            <p className="text-sm text-gold-700 mb-6 italic">
              "May the generous donors always be blessed"
            </p>

            <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Your generous contributions help us maintain the temple, conduct religious ceremonies, 
              and serve our community through various programs and initiatives.
            </p>
          </div>

          {/* Enhanced Progress Indicator - More Compact */}
          <div className="mb-8">
            <div className="max-w-lg mx-auto">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-maroon-700">Step {step} of {totalSteps}</span>
                <span className="text-sm text-gray-600">{Math.round(progressPercentage)}% Complete</span>
              </div>
              <Progress value={progressPercentage} className="h-2 mb-4" />
              
              <div className="flex items-center justify-center space-x-6">
                {[
                  { step: 1, label: "Amount & Purpose", icon: DollarSign },
                  { step: 2, label: "Your Information", icon: User },
                  { step: 3, label: "Payment Method", icon: CreditCard }
                ].map(({ step: stepNumber, label, icon: Icon }) => (
                  <div key={stepNumber} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                        step >= stepNumber 
                          ? 'bg-maroon-700 border-maroon-700 text-white shadow-lg' 
                          : step === stepNumber
                          ? 'border-maroon-700 text-maroon-700 bg-white shadow-md'
                          : 'border-gray-300 text-gray-400 bg-white'
                      }`}>
                        {step > stepNumber ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                      <span className={`mt-1 text-xs font-medium text-center max-w-20 ${
                        step >= stepNumber ? 'text-maroon-700' : 'text-gray-400'
                      }`}>
                        {label}
                      </span>
                    </div>
                    {stepNumber < totalSteps && (
                      <div className={`w-8 h-0.5 rounded-full mx-2 transition-all duration-300 ${
                        step > stepNumber ? 'bg-maroon-700' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Layout - Improved Mobile Responsiveness */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Main Form - Takes 3 columns on large screens */}
            <div className="lg:col-span-3 order-1">
              <Card className="shadow-2xl border border-gold-200 bg-white rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-maroon-700 to-maroon-800 text-white p-4 md:p-6">
                  <CardTitle className="text-xl md:text-2xl font-bold flex items-center">
                    {step === 1 && <><DollarSign className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6" />Choose Your Donation</>}
                    {step === 2 && <><User className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6" />Your Information</>}
                    {step === 3 && <><CreditCard className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6" />Payment Details</>}
                  </CardTitle>
                  <CardDescription className="text-gold-200 text-sm md:text-base mt-1">
                    {step === 1 && "Select an amount and purpose that resonates with your heart"}
                    {step === 2 && "Help us connect with you and send your donation receipt"}
                    {step === 3 && "Complete your generous contribution securely"}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-4 md:p-6">
                  <form onSubmit={handleSubmit}>
                    {/* Step 1: Donation Amount and Purpose */}
                    {step === 1 && (
                      <div className="space-y-4 md:space-y-6">
                        {/* Purpose Selection */}
                        <div>
                          <Label className="text-base md:text-lg font-bold text-maroon-700 mb-3 md:mb-4 block">
                            Choose Your Impact
                          </Label>
                          <RadioGroup
                            value={donationPurpose}
                            onValueChange={setDonationPurpose}
                            className="space-y-2 md:space-y-3"
                          >
                            {purposes.map((purpose) => (
                              <div key={purpose.value} className="relative">
                                <RadioGroupItem 
                                  value={purpose.value} 
                                  id={`purpose-${purpose.value}`} 
                                  className="peer sr-only" 
                                />
                                <Label 
                                  htmlFor={`purpose-${purpose.value}`} 
                                  className={`flex items-start p-3 md:p-4 border-2 rounded-lg md:rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                                    donationPurpose === purpose.value 
                                      ? 'border-maroon-700 bg-gradient-to-r from-maroon-50 to-orange-50 shadow-lg' 
                                      : 'bg-gradient-to-r from-saffron-25 to-gold-25 border-gold-200 hover:border-maroon-300'
                                  }`}
                                >
                                  <div className="text-lg md:text-2xl mr-2 md:mr-3 mt-1">{purpose.icon}</div>
                                  <div className="flex-1">
                                    <div className="font-bold text-maroon-700 text-sm md:text-base mb-1">{purpose.label}</div>
                                    <div className="text-gray-600 text-xs md:text-sm mb-2">{purpose.description}</div>
                                    <div className="flex items-center text-xs text-maroon-600">
                                      <Target className="h-3 w-3 mr-1" />
                                      <span className="font-medium">{purpose.impact}</span>
                                    </div>
                                  </div>
                                  <div className="ml-2 md:ml-3">
                                    <div className={`w-4 h-4 md:w-5 md:h-5 border-2 rounded-full transition-all duration-200 flex items-center justify-center ${
                                      donationPurpose === purpose.value 
                                        ? 'border-maroon-700 bg-maroon-700' 
                                        : 'border-gray-300'
                                    }`}>
                                      {donationPurpose === purpose.value && (
                                        <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-full"></div>
                                      )}
                                    </div>
                                  </div>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        {/* Amount Selection */}
                        <div>
                          <Label className="text-base md:text-lg font-bold text-maroon-700 mb-3 md:mb-4 block">
                            Select Donation Amount
                          </Label>
                          <RadioGroup
                            value={donationAmount}
                            onValueChange={handleDonationChange}
                            className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3"
                          >
                            {predefinedAmounts.map((item) => (
                              <div key={item.amount} className="relative">
                                <RadioGroupItem 
                                  value={item.amount} 
                                  id={`amount-${item.amount}`} 
                                  className="peer sr-only" 
                                />
                                <Label 
                                  htmlFor={`amount-${item.amount}`} 
                                  className={`flex flex-col items-center justify-center p-3 md:p-4 border-2 rounded-lg md:rounded-xl cursor-pointer transition-all duration-200 group relative min-h-[100px] md:min-h-[120px] ${
                                    donationAmount === item.amount 
                                      ? 'border-maroon-700 bg-maroon-50 shadow-xl' 
                                      : 'bg-white border-gray-300 hover:border-maroon-300 hover:shadow-lg'
                                  }`}
                                >
                                  {item.popular && (
                                    <Badge className="absolute -top-1 -right-1 bg-gold-500 text-white text-xs px-1 md:px-2 py-0.5">
                                      Popular
                                    </Badge>
                                  )}
                                  <DollarSign className={`h-5 w-5 md:h-6 md:w-6 mb-1 md:mb-2 transition-colors ${
                                    donationAmount === item.amount 
                                      ? 'text-maroon-700' 
                                      : 'text-gray-400 group-hover:text-maroon-600'
                                  }`} />
                                  <span className={`text-lg md:text-2xl font-bold mb-1 transition-colors ${
                                    donationAmount === item.amount 
                                      ? 'text-maroon-700' 
                                      : 'text-gray-900 group-hover:text-maroon-700'
                                  }`}>${item.amount}</span>
                                  <span className="text-xs text-gray-500 text-center leading-tight">{item.description}</span>
                                </Label>
                              </div>
                            ))}
                            <div className="relative">
                              <RadioGroupItem 
                                value="custom" 
                                id="amount-custom" 
                                className="peer sr-only" 
                              />
                              <Label 
                                htmlFor="amount-custom" 
                                className={`flex flex-col items-center justify-center p-3 md:p-4 border-2 rounded-lg md:rounded-xl cursor-pointer transition-all duration-200 group min-h-[100px] md:min-h-[120px] ${
                                  donationAmount === "custom" 
                                    ? 'border-maroon-700 bg-maroon-50 shadow-xl' 
                                    : 'bg-white border-gray-300 hover:border-maroon-300 hover:shadow-lg'
                                }`}
                              >
                                <Heart className={`h-5 w-5 md:h-6 md:w-6 mb-1 md:mb-2 transition-colors ${
                                  donationAmount === "custom" 
                                    ? 'text-maroon-700' 
                                    : 'text-gray-400 group-hover:text-maroon-600'
                                }`} />
                                <span className={`text-base md:text-xl font-bold mb-1 transition-colors ${
                                  donationAmount === "custom" 
                                    ? 'text-maroon-700' 
                                    : 'text-gray-900 group-hover:text-maroon-700'
                                }`}>Custom</span>
                                <span className="text-xs text-gray-500 text-center">Your choice</span>
                              </Label>
                            </div>
                          </RadioGroup>

                          {donationAmount === "custom" && (
                            <div className="mt-4 md:mt-6 bg-gradient-to-r from-saffron-50 to-gold-50 p-4 md:p-6 rounded-lg md:rounded-xl border-2 border-gold-200">
                              <Label htmlFor="customAmount" className="text-sm md:text-base font-bold text-maroon-700 mb-2 md:mb-3 block">
                                Enter Your Generous Amount
                              </Label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                                  <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-gray-400" />
                                </div>
                                <Input
                                  id="customAmount"
                                  type="number"
                                  min="1"
                                  step="1"
                                  className="pl-10 md:pl-12 h-12 md:h-14 text-lg md:text-xl font-bold border-gray-300 focus:border-maroon-500 focus:ring-maroon-500 bg-white rounded-lg"
                                  placeholder="Enter amount"
                                  value={customAmount}
                                  onChange={(e) => setCustomAmount(e.target.value)}
                                />
                              </div>
                              <p className="text-sm text-gray-600 mt-2">
                                Every amount makes a meaningful difference in our community.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Step 2: Personal Information */}
                    {step === 2 && (
                      <div className="space-y-5">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-5">
                          <div className="flex items-start">
                            <Info className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-blue-800">
                              <strong>Your information is secure:</strong> We use this information only to process your donation and send you a tax-deductible receipt. We never share your personal details.
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-sm font-semibold text-gray-800">
                              First Name *
                            </Label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-4 w-4 text-gray-400" />
                              </div>
                              <Input 
                                id="firstName" 
                                type="text" 
                                placeholder="Your first name" 
                                className="pl-10 h-12 border-gray-300 focus:border-maroon-500 focus:ring-maroon-500 bg-white rounded-lg"
                                value={formData.firstName}
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-sm font-semibold text-gray-800">
                              Last Name *
                            </Label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-4 w-4 text-gray-400" />
                              </div>
                              <Input 
                                id="lastName" 
                                type="text" 
                                placeholder="Your last name" 
                                className="pl-10 h-12 border-gray-300 focus:border-maroon-500 focus:ring-maroon-500 bg-white rounded-lg"
                                value={formData.lastName}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-semibold text-gray-800">
                            Email Address *
                          </Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-4 w-4 text-gray-400" />
                            </div>
                            <Input
                              id="email" 
                              type="email" 
                              placeholder="your.email@example.com" 
                              className="pl-10 h-12 border-gray-300 focus:border-maroon-500 focus:ring-maroon-500 bg-white rounded-lg"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              required
                            />
                          </div>
                          <p className="text-sm text-gray-600">We'll send your donation receipt to this email address</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm font-semibold text-gray-800">
                            Phone Number (Optional)
                          </Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Phone className="h-4 w-4 text-gray-400" />
                            </div>
                            <Input 
                              id="phone" 
                              type="tel" 
                              placeholder="(555) 123-4567" 
                              className="pl-10 h-12 border-gray-300 focus:border-maroon-500 focus:ring-maroon-500 bg-white rounded-lg"
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address" className="text-sm font-semibold text-gray-800">
                            Address (Optional)
                          </Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <MapPin className="h-4 w-4 text-gray-400" />
                            </div>
                            <Input 
                              id="address" 
                              type="text" 
                              placeholder="Your address for tax receipt" 
                              className="pl-10 h-12 border-gray-300 focus:border-maroon-500 focus:ring-maroon-500 bg-white rounded-lg"
                              value={formData.address}
                              onChange={(e) => setFormData({...formData, address: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message" className="text-sm font-semibold text-gray-800">
                            Special Message or Dedication (Optional)
                          </Label>
                          <Textarea 
                            id="message" 
                            placeholder="Share any special intentions, dedications, or messages for your donation..." 
                            className="min-h-20 border-gray-300 focus:border-maroon-500 focus:ring-maroon-500 bg-white rounded-lg resize-none"
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 3: Payment */}
                    {step === 3 && (
                      <div className="space-y-6">
                        <div>
                          <Label className="text-lg font-bold text-maroon-700 mb-4 block">
                            Choose Your Payment Method
                          </Label>
                          <RadioGroup
                            value={paymentMethod}
                            onValueChange={setPaymentMethod}
                            className="space-y-3"
                          >
                            <div className="relative">
                              <RadioGroupItem 
                                value="credit" 
                                id="payment-credit" 
                                className="peer sr-only" 
                              />
                              <Label 
                                htmlFor="payment-credit" 
                                className="flex items-center p-4 bg-white border-2 border-gray-300 rounded-xl cursor-pointer peer-checked:border-maroon-700 peer-checked:bg-maroon-50 peer-checked:shadow-lg hover:border-maroon-300 hover:shadow-md transition-all duration-200"
                              >
                                <CreditCard className="h-5 w-5 text-gray-600 mr-3" />
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900">Credit/Debit Card</div>
                                  <div className="text-gray-600 text-sm">Secure payment with Visa, MasterCard, American Express</div>
                                </div>
                                <Shield className="h-4 w-4 text-green-600" />
                              </Label>
                            </div>

                            <div className="relative">
                              <RadioGroupItem 
                                value="bank" 
                                id="payment-bank" 
                                className="peer sr-only" 
                              />
                              <Label 
                                htmlFor="payment-bank" 
                                className="flex items-center p-4 bg-white border-2 border-gray-300 rounded-xl cursor-pointer peer-checked:border-maroon-700 peer-checked:bg-maroon-50 peer-checked:shadow-lg hover:border-maroon-300 hover:shadow-md transition-all duration-200"
                              >
                                <Building2 className="h-5 w-5 text-gray-600 mr-3" />
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900">Bank Transfer</div>
                                  <div className="text-gray-600 text-sm">Direct bank transfer for larger donations</div>
                                </div>
                                <Clock className="h-4 w-4 text-blue-600" />
                              </Label>
                            </div>

                            <div className="relative">
                              <RadioGroupItem 
                                value="paypal" 
                                id="payment-paypal" 
                                className="peer sr-only" 
                              />
                              <Label 
                                htmlFor="payment-paypal" 
                                className="flex items-center p-4 bg-white border-2 border-gray-300 rounded-xl cursor-pointer peer-checked:border-maroon-700 peer-checked:bg-maroon-50 peer-checked:shadow-lg hover:border-maroon-300 hover:shadow-md transition-all duration-200"
                              >
                                <Banknote className="h-5 w-5 text-gray-600 mr-3" />
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900">PayPal</div>
                                  <div className="text-gray-600 text-sm">Pay securely with your PayPal account</div>
                                </div>
                                <Award className="h-4 w-4 text-orange-600" />
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        {paymentMethod === "credit" && (
                          <div className="bg-saffron-25 p-6 rounded-xl border-2 border-gold-200 space-y-4">
                            <h3 className="text-base font-bold text-maroon-700 mb-3">Secure Card Information</h3>
                            
                            <div className="space-y-2">
                              <Label htmlFor="cardNumber" className="text-sm font-semibold text-gray-800">
                                Card Number
                              </Label>
                              <Input 
                                id="cardNumber" 
                                type="text" 
                                placeholder="1234 5678 9012 3456" 
                                className="h-12 border-gray-300 focus:border-maroon-500 focus:ring-maroon-500 bg-white rounded-lg"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label htmlFor="expiry" className="text-sm font-semibold text-gray-800">
                                  Expiry Date
                                </Label>
                                <Input 
                                  id="expiry" 
                                  type="text" 
                                  placeholder="MM/YY" 
                                  className="h-12 border-gray-300 focus:border-maroon-500 focus:ring-maroon-500 bg-white rounded-lg"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="cvv" className="text-sm font-semibold text-gray-800">
                                  CVV
                                </Label>
                                <Input 
                                  id="cvv" 
                                  type="text" 
                                  placeholder="123" 
                                  className="h-12 border-gray-300 focus:border-maroon-500 focus:ring-maroon-500 bg-white rounded-lg"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="cardName" className="text-sm font-semibold text-gray-800">
                                Name on Card
                              </Label>
                              <Input 
                                id="cardName" 
                                type="text" 
                                placeholder="Full name as on card" 
                                className="h-12 border-gray-300 focus:border-maroon-500 focus:ring-maroon-500 bg-white rounded-lg"
                              />
                            </div>
                          </div>
                        )}

                        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                          <div className="flex items-start">
                            <Shield className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-green-800">
                              <strong>256-bit SSL Encryption:</strong> Your payment information is fully encrypted and secure. 
                              We never store your financial data on our servers. This donation is processed through our certified payment gateway.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Enhanced Navigation Buttons */}
                    <div className="flex justify-between pt-6 border-t border-gray-200 mt-6">
                      {step > 1 ? (
                        <Button 
                          type="button" 
                          onClick={handlePrevious}
                          variant="outline"
                          className="flex items-center px-6 py-3 text-base font-semibold border-maroon-700 text-maroon-700 hover:bg-maroon-50 rounded-lg transition-all duration-300 group"
                        >
                          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                          Previous Step
                        </Button>
                      ) : (
                        <div></div>
                      )}

                      {step < totalSteps ? (
                        <Button 
                          type="button" 
                          onClick={handleNext}
                          disabled={!isStepValid()}
                          className="flex items-center px-6 py-3 text-base font-semibold bg-maroon-700 hover:bg-maroon-800 text-white rounded-lg transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                        >
                          Continue to {step === 1 ? "Information" : "Payment"}
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      ) : (
                        <Button 
                          type="submit" 
                          disabled={!isStepValid() || isProcessing}
                          className="flex items-center px-6 py-3 text-base font-semibold bg-maroon-700 hover:bg-maroon-800 text-white rounded-lg transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                        >
                          {isProcessing ? (
                            <div className="flex items-center">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Processing Donation...
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Heart className="mr-2 h-4 w-4" />
                              Complete Donation
                            </div>
                          )}
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Sidebar - Mobile Responsive */}
            <div className="lg:col-span-1 space-y-4 order-2">
              <div className="lg:sticky lg:top-6 space-y-3 md:space-y-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
                {/* Donation Summary - Simplified for Mobile */}
                <Card className="shadow-xl border border-gold-200 bg-gradient-to-br from-saffron-25 to-gold-50 rounded-xl md:rounded-2xl overflow-hidden">
                  <CardHeader className="bg-maroon-700 text-white p-3 md:p-5">
                    <CardTitle className="text-base md:text-xl font-bold flex items-center">
                      <DollarSign className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                      Donation Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 md:p-5">
                    <div className="space-y-3 md:space-y-4">
                      <div className="flex justify-between items-center pb-2 md:pb-3 border-b border-gold-200">
                        <span className="text-sm md:text-base font-semibold text-gray-700">Amount:</span>
                        <span className="text-xl md:text-2xl font-bold text-maroon-700">
                          ${getAmount() || "0"}
                        </span>
                      </div>
                      
                      <div className="space-y-1 md:space-y-2">
                        <div className="flex flex-col md:flex-row md:justify-between">
                          <span className="text-gray-600 text-xs md:text-sm">Purpose:</span>
                          <Badge className="bg-maroon-100 text-maroon-800 px-2 py-1 rounded-full border border-maroon-200 text-xs w-fit mt-1 md:mt-0">
                            {purposes.find(p => p.value === donationPurpose)?.label || "General Fund"}
                          </Badge>
                        </div>
                        
                        {step >= 2 && formData.firstName && (
                          <div className="flex flex-col md:flex-row md:justify-between">
                            <span className="text-gray-600 text-xs md:text-sm">Donor:</span>
                            <span className="font-medium text-gray-800 text-xs md:text-sm">{formData.firstName} {formData.lastName}</span>
                          </div>
                        )}
                        
                        {step >= 3 && (
                          <div className="flex flex-col md:flex-row md:justify-between">
                            <span className="text-gray-600 text-xs md:text-sm">Payment:</span>
                            <span className="font-medium text-gray-800 text-xs md:text-sm capitalize">{paymentMethod}</span>
                          </div>
                        )}
                      </div>

                      <div className="bg-white p-2 md:p-3 rounded-lg border border-gold-200">
                        <div className="flex items-center text-green-700 mb-1">
                          <CheckCircle className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                          <span className="font-semibold text-xs md:text-sm">Tax Deductible</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          You will receive an official tax receipt via email within 24 hours.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Impact Information - Hidden on Mobile, Shown on Tablet+ */}
                <Card className="hidden md:block shadow-xl border border-gold-200 bg-white rounded-2xl overflow-hidden">
                  <CardHeader className="p-5">
                    <CardTitle className="text-lg font-bold text-maroon-700 flex items-center">
                      <Star className="mr-2 h-5 w-5" />
                      Your Donation Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-0">
                    <div className="space-y-3">
                      {donationPurpose && purposes.find(p => p.value === donationPurpose) && (
                        <div className="p-3 bg-gradient-to-r from-maroon-50 to-orange-50 rounded-lg border border-maroon-200">
                          <div className="text-xl mb-1">{purposes.find(p => p.value === donationPurpose)?.icon}</div>
                          <h4 className="font-bold text-maroon-700 mb-1 text-sm">{purposes.find(p => p.value === donationPurpose)?.label}</h4>
                          <p className="text-xs text-gray-700">{purposes.find(p => p.value === donationPurpose)?.impact}</p>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <Users className="h-4 w-4 text-maroon-600 mr-2 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700 text-xs">Support over 500 families in our community</p>
                        </div>
                        <div className="flex items-start">
                          <Heart className="h-4 w-4 text-maroon-600 mr-2 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700 text-xs">Fund daily temple services and ceremonies</p>
                        </div>
                        <div className="flex items-start">
                          <Star className="h-4 w-4 text-maroon-600 mr-2 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700 text-xs">Preserve spiritual traditions for future generations</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Help - Simplified for Mobile */}
                <Card className="shadow-xl border border-gold-200 bg-white rounded-xl md:rounded-2xl overflow-hidden">
                  <CardHeader className="p-3 md:p-5">
                    <CardTitle className="text-base md:text-lg font-bold text-maroon-700">
                      Need Help?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 md:p-5 pt-0">
                    <div className="space-y-2 md:space-y-3">
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 md:h-4 md:w-4 text-maroon-600 mr-2" />
                        <div>
                          <p className="font-medium text-gray-800 text-xs md:text-sm">(555) 123-4567</p>
                          <p className="text-xs text-gray-600">Donation Support</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-3 w-3 md:h-4 md:w-4 text-maroon-600 mr-2" />
                        <div>
                          <p className="font-medium text-gray-800 text-xs md:text-sm">donations@temple.org</p>
                          <p className="text-xs text-gray-600">Email Support</p>
                        </div>
                      </div>
                      <div className="pt-1 md:pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-600">
                          Available Monday-Friday, 9 AM - 6 PM for donation questions.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Mobile Impact Summary - Only Shown on Mobile */}
                <Card className="md:hidden shadow-xl border border-gold-200 bg-white rounded-xl overflow-hidden">
                  <CardContent className="p-3">
                    <h3 className="text-sm font-bold text-maroon-700 mb-2">Your Impact</h3>
                    {donationPurpose && purposes.find(p => p.value === donationPurpose) && (
                      <div className="flex items-center space-x-2">
                        <div className="text-lg">{purposes.find(p => p.value === donationPurpose)?.icon}</div>
                        <p className="text-xs text-gray-700">{purposes.find(p => p.value === donationPurpose)?.impact}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
