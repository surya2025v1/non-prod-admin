import { useState, useEffect } from 'react';
import { 
  FiCreditCard, FiDownload, FiMail, FiX, FiCheck, FiClock, FiAlertCircle, 
  FiTrendingUp, FiDollarSign, FiCalendar, FiShield, FiStar, FiFilter,
  FiSearch, FiMoreHorizontal, FiRefreshCw, FiArrowUpRight, FiArrowDownRight,
  FiPieChart, FiBarChart, FiActivity, FiTarget, FiZap, FiGift,
  FiCheckCircle, FiXCircle, FiInfo, FiFileText, FiCopy, FiEye
} from 'react-icons/fi';

interface Website {
  id: number;
  name: string;
  status: string;
  paidTill: string | null;
  paymentStatus: 'Paid' | 'Pending' | 'Due Soon' | 'Overdue';
  amountDue: number;
  nextPaymentDate?: string;
  planType: 'Basic' | 'Premium' | 'Enterprise';
  monthlyAmount: number;
}

interface PaymentHistory {
  id: number;
  website: string;
  date: string;
  amount: number;
  status: 'Success' | 'Failed' | 'Pending' | 'Refunded';
  method: string;
  invoice: string;
  description: string;
  transactionId: string;
}

interface AnalyticsData {
  totalSpent: number;
  monthlyAverage: number;
  successRate: number;
  activeSubscriptions: number;
  nextPayment: { amount: number; date: string; website: string } | null;
  yearlyData: { month: string; amount: number; transactions: number }[];
}

// Enhanced Payment Details Modal
function PaymentDetailsModal({ open, onClose, payment }: {
  open: boolean;
  onClose: () => void;
  payment: PaymentHistory | null;
}) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!open || !payment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative animate-fadeIn border border-gray-100">
        
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
              <FiFileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
              <p className="text-gray-600">Invoice #{payment.invoice}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Status Banner */}
          <div className={`p-4 rounded-2xl border-2 ${
            payment.status === 'Success' 
              ? 'bg-green-50 border-green-200 text-green-800'
              : payment.status === 'Failed'
              ? 'bg-red-50 border-red-200 text-red-800'
              : payment.status === 'Pending'
              ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <div className="flex items-center gap-3">
              {payment.status === 'Success' && <FiCheckCircle className="w-6 h-6" />}
              {payment.status === 'Failed' && <FiXCircle className="w-6 h-6" />}
              {payment.status === 'Pending' && <FiClock className="w-6 h-6" />}
              {payment.status === 'Refunded' && <FiRefreshCw className="w-6 h-6" />}
              <div>
                <div className="font-semibold text-lg">Payment {payment.status}</div>
                <div className="text-sm opacity-80">{payment.description}</div>
              </div>
            </div>
          </div>

          {/* Payment Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Website</label>
                <div className="text-lg font-semibold text-gray-900 mt-1">{payment.website}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Amount</label>
                <div className="text-3xl font-bold text-green-600 mt-1">${payment.amount}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Payment Method</label>
                <div className="text-lg text-gray-900 mt-1">{payment.method}</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Transaction Date</label>
                <div className="text-lg text-gray-900 mt-1">{new Date(payment.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Transaction ID</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">{payment.transactionId}</code>
                  <button
                    onClick={() => copyToClipboard(payment.transactionId)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title="Copy Transaction ID"
                  >
                    <FiCopy className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                {copied && <div className="text-xs text-green-600 mt-1">Copied!</div>}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button className="flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg flex-1">
              <FiDownload className="w-4 h-4" />
              Download Invoice
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-6 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200 flex-1">
              <FiMail className="w-4 h-4" />
              Email Invoice
            </button>
            {payment.status === 'Success' && (
              <button className="flex items-center justify-center gap-2 py-3 px-4 bg-orange-100 text-orange-700 font-semibold rounded-xl hover:bg-orange-200 transition-all duration-200">
                <FiRefreshCw className="w-4 h-4" />
                Request Refund
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Make Payment Modal with better form validation and UX
function MakePaymentModal({ open, onClose, website, amount }: {
  open: boolean;
  onClose: () => void;
  website: string | null;
  amount: number;
}) {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    nameOnCard: '',
    billingAddress: '',
    saveCard: false
  });
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.cardNumber || formData.cardNumber.length < 16) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }
    if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    }
    if (!formData.cvc || formData.cvc.length < 3) {
      newErrors.cvc = 'Please enter a valid CVC';
    }
    if (!formData.nameOnCard.trim()) {
      newErrors.nameOnCard = 'Please enter the name on card';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    setProcessing(false);
    onClose();
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative animate-fadeIn border border-gray-100">
        
        {/* Header */}
        <div className="text-center p-8 border-b border-gray-100">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiCreditCard className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Secure Payment</h2>
          <p className="text-gray-600">Complete your subscription payment</p>
        </div>

        {/* Payment Summary */}
        <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 mx-6 mt-6 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700 font-medium">Website:</span>
            <span className="font-semibold text-gray-900">{website}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700 font-medium">Plan:</span>
            <span className="font-semibold text-gray-900">Premium Monthly</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-green-200">
            <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
            <span className="text-2xl font-bold text-green-600">${amount}</span>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Name on Card *</label>
            <input 
              type="text"
              className={`block w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                errors.nameOnCard ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="John Doe"
              value={formData.nameOnCard}
              onChange={(e) => setFormData({ ...formData, nameOnCard: e.target.value })}
            />
            {errors.nameOnCard && <p className="text-red-500 text-xs mt-1">{errors.nameOnCard}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number *</label>
            <div className="relative">
              <input 
                type="text"
                className={`block w-full pl-4 pr-12 py-3 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                  errors.cardNumber ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) => setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })}
                maxLength={19}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <FiCreditCard className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date *</label>
              <input 
                type="text"
                className={`block w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                  errors.expiryDate ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: formatExpiryDate(e.target.value) })}
                maxLength={5}
              />
              {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">CVC *</label>
              <input 
                type="text"
                className={`block w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                  errors.cvc ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="123"
                value={formData.cvc}
                onChange={(e) => setFormData({ ...formData, cvc: e.target.value.replace(/\D/g, '') })}
                maxLength={4}
              />
              {errors.cvc && <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Billing Address</label>
            <input 
              type="text"
              className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              placeholder="123 Main Street, City, State, ZIP"
              value={formData.billingAddress}
              onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="saveCard"
              checked={formData.saveCard} 
              onChange={(e) => setFormData({ ...formData, saveCard: e.target.checked })}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="saveCard" className="text-sm font-medium text-gray-700">
              Save this card for future payments
            </label>
          </div>

          <button 
            type="submit"
            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={processing}
          >
            {processing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Payment...
              </>
            ) : (
              <>
                <FiShield className="w-5 h-5" />
                Pay ${amount} Securely
              </>
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 px-6 pb-6 text-xs text-gray-500">
          <FiShield className="w-4 h-4" />
          256-bit SSL encryption. Your payment information is secure and never stored.
        </div>
      </div>
    </div>
  );
}

// Enhanced mock data with more realistic information
const mockWebsites: Website[] = [
  {
    id: 1,
    name: 'charansite.com',
    status: 'Published',
    paidTill: '2024-12-31',
    paymentStatus: 'Paid',
    amountDue: 0,
    nextPaymentDate: '2024-12-31',
    planType: 'Premium',
    monthlyAmount: 99,
  },
  {
    id: 2,
    name: 'mynewsite.com',
    status: 'Draft',
    paidTill: null,
    paymentStatus: 'Overdue',
    amountDue: 99,
    nextPaymentDate: '2024-01-15',
    planType: 'Premium',
    monthlyAmount: 99,
  },
  {
    id: 3,
    name: 'businesssite.com',
    status: 'Published',
    paidTill: '2024-02-15',
    paymentStatus: 'Due Soon',
    amountDue: 199,
    nextPaymentDate: '2024-02-15',
    planType: 'Enterprise',
    monthlyAmount: 199,
  },
];

const mockHistory: PaymentHistory[] = [
  {
    id: 101,
    website: 'charansite.com',
    date: '2024-01-01T10:30:00',
    amount: 99,
    status: 'Success',
    method: 'Visa •••• 4242',
    invoice: 'INV-20240101-001',
    description: 'Premium Plan - Monthly Subscription',
    transactionId: 'txn_1OaB2CDefGhI345',
  },
  {
    id: 102,
    website: 'mynewsite.com',
    date: '2024-01-15T14:22:00',
    amount: 99,
    status: 'Failed',
    method: 'Visa •••• 4242',
    invoice: 'INV-20240115-002',
    description: 'Premium Plan - Monthly Subscription',
    transactionId: 'txn_1OaB2CDefGhI346',
  },
  {
    id: 103,
    website: 'businesssite.com',
    date: '2024-01-20T09:15:00',
    amount: 199,
    status: 'Success',
    method: 'Mastercard •••• 1234',
    invoice: 'INV-20240120-003',
    description: 'Enterprise Plan - Monthly Subscription',
    transactionId: 'txn_1OaB2CDefGhI347',
  },
  {
    id: 104,
    website: 'charansite.com',
    date: '2023-12-01T16:45:00',
    amount: 99,
    status: 'Success',
    method: 'Visa •••• 4242',
    invoice: 'INV-20231201-004',
    description: 'Premium Plan - Monthly Subscription',
    transactionId: 'txn_1OaB2CDefGhI348',
  },
  {
    id: 105,
    website: 'businesssite.com',
    date: '2023-11-20T11:30:00',
    amount: 199,
    status: 'Refunded',
    method: 'Mastercard •••• 1234',
    invoice: 'INV-20231120-005',
    description: 'Enterprise Plan - Refund processed',
    transactionId: 'txn_1OaB2CDefGhI349',
  },
];

// Analytics calculation
const calculateAnalytics = (): AnalyticsData => {
  const successfulPayments = mockHistory.filter(p => p.status === 'Success');
  const totalSpent = successfulPayments.reduce((sum, p) => sum + p.amount, 0);
  const monthlyAverage = totalSpent / 12; // Assuming 12 months of data
  const successRate = (successfulPayments.length / mockHistory.length) * 100;
  const activeSubscriptions = mockWebsites.filter(w => w.paymentStatus === 'Paid').length;
  
  const nextPaymentSite = mockWebsites
    .filter(w => w.nextPaymentDate)
    .sort((a, b) => new Date(a.nextPaymentDate!).getTime() - new Date(b.nextPaymentDate!).getTime())[0];
  
  const nextPayment = nextPaymentSite ? {
    amount: nextPaymentSite.monthlyAmount,
    date: nextPaymentSite.nextPaymentDate!,
    website: nextPaymentSite.name
  } : null;

  const yearlyData = [
    { month: 'Jan', amount: 298, transactions: 3 },
    { month: 'Feb', amount: 197, transactions: 2 },
    { month: 'Mar', amount: 298, transactions: 3 },
    { month: 'Apr', amount: 99, transactions: 1 },
    { month: 'May', amount: 298, transactions: 3 },
    { month: 'Jun', amount: 197, transactions: 2 },
    { month: 'Jul', amount: 298, transactions: 3 },
    { month: 'Aug', amount: 298, transactions: 3 },
    { month: 'Sep', amount: 197, transactions: 2 },
    { month: 'Oct', amount: 298, transactions: 3 },
    { month: 'Nov', amount: 199, transactions: 2 },
    { month: 'Dec', amount: 99, transactions: 1 },
  ];

  return {
    totalSpent,
    monthlyAverage,
    successRate,
    activeSubscriptions,
    nextPayment,
    yearlyData
  };
};

export default function PaymentsPage() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<string | null>(null);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);

  const analytics = calculateAnalytics();
  
  // Filter payment history
  const filteredHistory = mockHistory.filter(payment => {
    const matchesSearch = payment.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.invoice.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50" style={{ position: 'relative', zIndex: 1 }}>
      {/* Enhanced Header with Floating Elements */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-700 rounded-2xl md:rounded-3xl mx-4 md:mx-8 mt-4 md:mt-8 mb-6 md:mb-8 shadow-2xl">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 right-12 w-32 h-32 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-8 left-12 w-24 h-24 bg-white rounded-full animate-bounce"></div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/3 left-1/4 w-20 h-20 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        </div>

        <div className="relative px-6 md:px-8 py-8 md:py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="text-white mb-8 lg:mb-0 max-w-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                  <FiCreditCard className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  Payment Management
                </h1>
              </div>
              <p className="text-lg lg:text-xl text-blue-100 mb-6 leading-relaxed">
                Monitor subscriptions, track payments, and manage billing across all your websites with our comprehensive payment dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group flex items-center justify-center gap-3 px-8 py-4 bg-white text-blue-700 rounded-2xl font-bold text-lg shadow-xl transition-all duration-200 transform hover:scale-105 hover:shadow-2xl hover:bg-yellow-50">
                  <FiDownload className="w-6 h-6 group-hover:rotate-12 transition-transform duration-200" />
                  Export Data
                </button>
                <button className="flex items-center justify-center gap-3 bg-blue-500/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold text-lg border border-white/20 hover:bg-blue-400/30 transition-all duration-200">
                  <FiZap className="w-6 h-6" />
                  Quick Pay
                </button>
              </div>
            </div>
            
            {/* Enhanced Quick Stats */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1 lg:gap-6 w-full lg:w-auto">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <FiDollarSign className="w-6 h-6 text-white" />
                  <div className="text-3xl font-bold text-white">${analytics.totalSpent.toLocaleString()}</div>
                </div>
                <div className="text-blue-100 text-sm font-medium">Total Spent</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <FiTrendingUp className="w-6 h-6 text-white" />
                  <div className="text-3xl font-bold text-white">{analytics.activeSubscriptions}</div>
                </div>
                <div className="text-blue-100 text-sm font-medium">Active Plans</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="px-4 md:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Spent */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <FiDollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">
                <FiArrowUpRight className="w-4 h-4" />
                +12.3%
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">${analytics.totalSpent.toLocaleString()}</div>
            <div className="text-sm text-gray-600 font-medium">Total Spent</div>
          </div>

          {/* Monthly Average */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <FiTrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">
                <FiArrowUpRight className="w-4 h-4" />
                +8.1%
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">${Math.round(analytics.monthlyAverage)}</div>
            <div className="text-sm text-gray-600 font-medium">Monthly Average</div>
          </div>

          {/* Success Rate */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                <FiTarget className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">
                <FiCheck className="w-4 h-4" />
                Excellent
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{Math.round(analytics.successRate)}%</div>
            <div className="text-sm text-gray-600 font-medium">Success Rate</div>
          </div>

          {/* Active Subscriptions */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <FiActivity className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-blue-600 text-sm font-medium bg-blue-50 px-2 py-1 rounded-full">
                <FiStar className="w-4 h-4" />
                Active
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{analytics.activeSubscriptions}</div>
            <div className="text-sm text-gray-600 font-medium">Active Plans</div>
          </div>
        </div>

        {/* Enhanced Next Payment Alert */}
        {analytics.nextPayment && (
          <div className="bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 border border-yellow-200 rounded-2xl p-6 mb-8 shadow-lg backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FiClock className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Upcoming Payment</h3>
                  <p className="text-gray-700 text-lg">
                    <span className="font-bold text-orange-600">${analytics.nextPayment.amount}</span> due for{' '}
                    <span className="font-semibold text-gray-900">{analytics.nextPayment.website}</span> on{' '}
                    <span className="font-medium">{new Date(analytics.nextPayment.date).toLocaleDateString()}</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setSelectedWebsite(analytics.nextPayment!.website);
                  setSelectedAmount(analytics.nextPayment!.amount);
                  setShowPaymentModal(true);
                }}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold rounded-2xl hover:from-yellow-700 hover:to-orange-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <FiCreditCard className="w-5 h-5" />
                Pay Now
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Website Subscriptions Grid */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Subscription Overview</h2>
              <p className="text-gray-600 text-lg">Monitor and manage your website subscriptions</p>
            </div>
            <div className="flex items-center gap-4 mt-4 lg:mt-0">
              <div className="flex items-center gap-2 text-sm font-bold text-green-600 bg-green-50 px-4 py-2 rounded-xl border border-green-200">
                <FiStar className="w-4 h-4" />
                {analytics.activeSubscriptions} Active
              </div>
              <button className="flex items-center gap-2 px-6 py-2 bg-blue-100 text-blue-700 font-semibold rounded-xl hover:bg-blue-200 transition-all duration-200 border border-blue-200">
                <FiPieChart className="w-4 h-4" />
                Analytics
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockWebsites.map(site => (
              <div key={site.id} className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{site.name[0].toUpperCase()}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{site.name}</h3>
                      <p className="text-sm text-gray-600">{site.planType} Plan</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                    site.planType === 'Enterprise' 
                      ? 'bg-purple-100 text-purple-700'
                      : site.planType === 'Premium'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {site.planType}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className={`flex items-center gap-3 p-4 rounded-xl border-2 ${
                    site.paymentStatus === 'Paid' 
                      ? 'bg-green-50 border-green-200'
                      : site.paymentStatus === 'Due Soon'
                      ? 'bg-yellow-50 border-yellow-200'
                      : site.paymentStatus === 'Overdue'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    {site.paymentStatus === 'Paid' && <FiCheckCircle className="w-6 h-6 text-green-600" />}
                    {site.paymentStatus === 'Due Soon' && <FiClock className="w-6 h-6 text-yellow-600" />}
                    {site.paymentStatus === 'Overdue' && <FiAlertCircle className="w-6 h-6 text-red-600" />}
                    {site.paymentStatus === 'Pending' && <FiClock className="w-6 h-6 text-gray-600" />}
                    <div className="flex-1">
                      <div className={`text-sm font-semibold ${
                        site.paymentStatus === 'Paid' 
                          ? 'text-green-700'
                          : site.paymentStatus === 'Due Soon'
                          ? 'text-yellow-700'
                          : site.paymentStatus === 'Overdue'
                          ? 'text-red-700'
                          : 'text-gray-700'
                      }`}>
                        {site.paymentStatus === 'Paid' ? 'Active' : site.paymentStatus}
                      </div>
                      {site.paidTill ? (
                        <div className="text-xs text-gray-600">Until {new Date(site.paidTill).toLocaleDateString()}</div>
                      ) : (
                        <div className="text-lg font-bold text-red-600">${site.amountDue}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Monthly Cost:</span>
                      <span className="font-semibold text-gray-900">${site.monthlyAmount}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {site.paymentStatus !== 'Paid' ? (
                    <button 
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                      onClick={() => { 
                        setSelectedWebsite(site.name); 
                        setSelectedAmount(site.amountDue); 
                        setShowPaymentModal(true); 
                      }}
                    >
                      <FiCreditCard className="w-4 h-4" />
                      Pay Now
                    </button>
                  ) : (
                    <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-green-100 text-green-700 font-semibold rounded-xl hover:bg-green-200 transition-all duration-200 border border-green-200">
                      <FiEye className="w-4 h-4" />
                      View Details
                    </button>
                  )}
                  <button className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
                    <FiMoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Payment History */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment History</h2>
                <p className="text-gray-600 text-lg">Complete transaction history and invoice management</p>
              </div>
              
              {/* Enhanced Search and Filters */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm w-64"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm font-medium"
                >
                  <option value="All">All Status</option>
                  <option value="Success">✅ Success</option>
                  <option value="Failed">❌ Failed</option>
                  <option value="Pending">⏳ Pending</option>
                  <option value="Refunded">🔄 Refunded</option>
                </select>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium shadow-sm"
                >
                  <FiFilter className="w-4 h-4" />
                  Filters
                </button>
              </div>
            </div>
            
            {/* Enhanced Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
                <div className="text-2xl font-bold text-green-600">{mockHistory.filter(p => p.status === 'Success').length}</div>
                <div className="text-sm text-green-700 font-medium">Successful</div>
              </div>
              <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
                <div className="text-2xl font-bold text-red-600">{mockHistory.filter(p => p.status === 'Failed').length}</div>
                <div className="text-sm text-red-700 font-medium">Failed</div>
              </div>
              <div className="bg-yellow-50 rounded-xl p-4 text-center border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-600">{mockHistory.filter(p => p.status === 'Pending').length}</div>
                <div className="text-sm text-yellow-700 font-medium">Pending</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{mockHistory.filter(p => p.status === 'Refunded').length}</div>
                <div className="text-sm text-blue-700 font-medium">Refunded</div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Transaction</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Website</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Method</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Date</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredHistory.map(payment => (
                  <tr key={payment.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900">#{payment.invoice}</div>
                        <div className="text-sm text-gray-600">{payment.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-xs">{payment.website[0].toUpperCase()}</span>
                        </div>
                        <span className="font-medium text-gray-900">{payment.website}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-gray-900">${payment.amount}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{payment.method}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
                        payment.status === 'Success' 
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : payment.status === 'Failed'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : payment.status === 'Pending'
                          ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {payment.status === 'Success' && <FiCheckCircle className="w-3 h-3" />}
                        {payment.status === 'Failed' && <FiXCircle className="w-3 h-3" />}
                        {payment.status === 'Pending' && <FiClock className="w-3 h-3" />}
                        {payment.status === 'Refunded' && <FiRefreshCw className="w-3 h-3" />}
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        className="px-4 py-2 bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 hover:text-blue-700 font-semibold text-sm transition-all duration-200 rounded-xl hover:border-blue-300 shadow-sm"
                        onClick={() => { 
                          setSelectedPayment(payment); 
                          setShowDetailsModal(true); 
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredHistory.length === 0 && (
            <div className="text-center py-16 px-8">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-blue-100 rounded-full flex items-center justify-center mx-auto shadow-xl">
                  <FiCreditCard className="w-12 h-12 text-gray-400" />
                </div>
                {/* Floating elements */}
                <div className="absolute top-0 right-1/4 w-4 h-4 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute bottom-2 left-1/4 w-3 h-3 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No transactions found</h3>
              <p className="text-gray-600 mb-6 leading-relaxed max-w-md mx-auto">
                {searchTerm || statusFilter !== 'All'
                  ? 'Try adjusting your search criteria or filters to find transactions'
                  : 'Your payment history will appear here once you make transactions'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Modals */}
      <MakePaymentModal 
        open={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
        website={selectedWebsite} 
        amount={selectedAmount} 
      />
      <PaymentDetailsModal 
        open={showDetailsModal} 
        onClose={() => setShowDetailsModal(false)} 
        payment={selectedPayment} 
      />
    </div>
  );
} 