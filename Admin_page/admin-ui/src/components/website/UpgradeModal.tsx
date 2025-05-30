import { useState } from 'react';
import { FiX, FiCheck, FiCreditCard, FiLock } from 'react-icons/fi';

const plans = [
  {
    name: 'Basic',
    price: 29,
    period: 'month',
    features: [
      '1 Website',
      'Basic Templates',
      '5GB Storage',
      'Email Support',
      'Basic Analytics'
    ],
    recommended: false
  },
  {
    name: 'Professional',
    price: 79,
    period: 'month',
    features: [
      '3 Websites',
      'Premium Templates',
      '20GB Storage',
      'Priority Support',
      'Advanced Analytics',
      'Custom Domain',
      'SEO Tools'
    ],
    recommended: true
  },
  {
    name: 'Enterprise',
    price: 199,
    period: 'month',
    features: [
      'Unlimited Websites',
      'Custom Templates',
      '100GB Storage',
      '24/7 Support',
      'Advanced Analytics',
      'Multiple Domains',
      'API Access',
      'White Label Option'
    ],
    recommended: false
  }
];

export default function UpgradeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [selectedPlan, setSelectedPlan] = useState(plans[1]); // Default to Professional
  const [paymentStep, setPaymentStep] = useState<'plan' | 'payment'>('plan');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle payment processing here
    // For demo, just show success and close
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 relative animate-fadeIn overflow-y-auto max-h-[90vh]">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500"
          onClick={onClose}
          aria-label="Close"
        >
          <FiX size={20} />
        </button>

        {paymentStep === 'plan' ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Choose Your Plan</h2>
            <p className="text-gray-500 text-center mb-8">Select the perfect plan for your needs</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-xl border-2 p-6 transition-all duration-200 cursor-pointer
                    ${selectedPlan.name === plan.name 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-primary-300'
                    }
                    ${plan.recommended ? 'ring-2 ring-primary-500 ring-offset-2' : ''}
                  `}
                  onClick={() => setSelectedPlan(plan)}
                >
                  {plan.recommended && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Recommended
                    </span>
                  )}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-500">/{plan.period}</span>
                    </div>
                    <ul className="space-y-3 text-left">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-gray-600">
                          <FiCheck className="text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setPaymentStep('payment')}
                className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition flex items-center gap-2"
              >
                Continue to Payment
                <FiCreditCard />
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Complete Your Payment</h2>
            <p className="text-gray-500 text-center mb-8">
              Selected Plan: <span className="font-semibold text-gray-700">{selectedPlan.name}</span> - 
              ${selectedPlan.price}/{selectedPlan.period}
            </p>

            <div className="max-w-md mx-auto">
              <div className="flex gap-4 mb-6">
                <button
                  className={`flex-1 py-2 rounded-lg border-2 font-medium transition-colors
                    ${paymentMethod === 'card' 
                      ? 'border-primary-500 bg-primary-50 text-primary-700' 
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  onClick={() => setPaymentMethod('card')}
                >
                  Credit Card
                </button>
                <button
                  className={`flex-1 py-2 rounded-lg border-2 font-medium transition-colors
                    ${paymentMethod === 'upi' 
                      ? 'border-primary-500 bg-primary-50 text-primary-700' 
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  UPI
                </button>
              </div>

              {paymentMethod === 'card' ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="form-input w-full"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      maxLength={19}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="form-input w-full"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="form-input w-full"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="form-input w-full"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        maxLength={3}
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2"
                    >
                      <FiLock className="text-white" />
                      Pay ${selectedPlan.price}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-center mb-4">Scan the QR code with your UPI app</p>
                    <div className="w-48 h-48 mx-auto bg-white p-2 rounded-lg">
                      {/* Replace with actual QR code */}
                      <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400">QR Code</span>
                      </div>
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-4">
                      UPI ID: example@upi
                    </p>
                  </div>
                  <button
                    onClick={handleSubmit}
                    className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2"
                  >
                    I've Paid
                  </button>
                </div>
              )}

              <div className="mt-6 text-center">
                <button
                  onClick={() => setPaymentStep('plan')}
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  ← Back to Plans
                </button>
              </div>
            </div>
          </>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          <p className="flex items-center justify-center gap-2">
            <FiLock className="text-gray-400" />
            Secure payment powered by Stripe
          </p>
          <p className="mt-2">All plans include a 14-day money-back guarantee</p>
        </div>
      </div>
    </div>
  );
} 