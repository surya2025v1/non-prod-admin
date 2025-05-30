import { useState } from 'react';
import { FiCreditCard, FiDownload, FiMail, FiX, FiCheck, FiClock, FiAlertCircle, FiTrendingUp, FiDollarSign, FiCalendar, FiShield, FiStar } from 'react-icons/fi';

interface Website {
  id: number;
  name: string;
  status: string;
  paidTill: string | null;
  paymentStatus: 'Paid' | 'Pending';
  amountDue: number;
}

interface PaymentHistory {
  id: number;
  website: string;
  date: string;
  amount: number;
  status: 'Success' | 'Failed';
  method: string;
  invoice: string;
}

interface PaymentDetailsModalProps {
  open: boolean;
  onClose: () => void;
  payment: PaymentHistory | null;
}

function PaymentDetailsModal({ open, onClose, payment }: PaymentDetailsModalProps) {
  if (!open || !payment) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative animate-fadeIn mx-4 border border-gray-100">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiCreditCard className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Details</h2>
          <p className="text-gray-600">Transaction information and invoice</p>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Website:</span>
            <span className="font-bold text-gray-900">{payment.website}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Date:</span>
            <span className="font-semibold text-gray-900">{payment.date}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Amount:</span>
            <span className="font-bold text-2xl text-primary-600">${payment.amount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Status:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              payment.status === 'Success' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {payment.status === 'Success' ? (
                <span className="flex items-center gap-1">
                  <FiCheck className="w-4 h-4" />
                  Success
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <FiAlertCircle className="w-4 h-4" />
                  Failed
                </span>
              )}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Method:</span>
            <span className="font-semibold text-gray-900">{payment.method}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Invoice #:</span>
            <span className="font-mono text-gray-900">{payment.invoice}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 transform hover:scale-105 shadow-lg">
            <FiDownload className="w-4 h-4" />
            Download
          </button>
          <button className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 font-semibold rounded-xl hover:from-blue-200 hover:to-blue-300 transition-all duration-200 transform hover:scale-105">
            <FiMail className="w-4 h-4" />
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
}

interface MakePaymentModalProps {
  open: boolean;
  onClose: () => void;
  website: string | null;
  amount: number;
}

function MakePaymentModal({ open, onClose, website, amount }: MakePaymentModalProps) {
  const [card, setCard] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [processing, setProcessing] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative animate-fadeIn mx-4 border border-gray-100">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiCreditCard className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Make Payment</h2>
          <p className="text-gray-600">Secure payment processing</p>
        </div>

        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 mb-6 text-center">
          <div className="text-lg font-semibold text-gray-700 mb-2">{website}</div>
          <div className="text-3xl font-bold text-primary-600">${amount}</div>
          <div className="text-sm text-gray-600 mt-2">Monthly subscription</div>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
            <div className="relative">
              <input 
                className="block w-full pl-4 pr-12 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                placeholder="1234 5678 9012 3456" 
                value={card} 
                onChange={e => setCard(e.target.value)} 
                maxLength={19} 
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <FiCreditCard className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
              <input 
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                placeholder="MM/YY" 
                value={expiry} 
                onChange={e => setExpiry(e.target.value)} 
                maxLength={5} 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">CVC</label>
              <input 
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                placeholder="123" 
                value={cvc} 
                onChange={e => setCvc(e.target.value)} 
                maxLength={4} 
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="saveCard"
              checked={saveCard} 
              onChange={e => setSaveCard(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="saveCard" className="text-sm font-medium text-gray-700">
              Save this card for future payments
            </label>
          </div>

          <button 
            type="button" 
            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold text-lg rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={processing} 
            onClick={onClose}
          >
            {processing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <FiCreditCard className="w-5 h-5" />
                Pay Now
              </>
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-500">
          <FiShield className="w-4 h-4" />
          Secured by 256-bit SSL encryption. Your card is never stored on our servers.
        </div>
      </div>
    </div>
  );
}

const mockWebsites: Website[] = [
  {
    id: 1,
    name: 'charansite.com',
    status: 'Published',
    paidTill: '2024-12-31',
    paymentStatus: 'Paid',
    amountDue: 0,
  },
  {
    id: 2,
    name: 'mynewsite.com',
    status: 'Draft',
    paidTill: null,
    paymentStatus: 'Pending',
    amountDue: 99,
  },
];

const mockHistory: PaymentHistory[] = [
  {
    id: 101,
    website: 'charansite.com',
    date: '2024-05-01',
    amount: 99,
    status: 'Success',
    method: 'Visa **** 4242',
    invoice: 'INV-20240501-001',
  },
  {
    id: 102,
    website: 'mynewsite.com',
    date: '2024-04-01',
    amount: 99,
    status: 'Failed',
    method: 'Visa **** 4242',
    invoice: 'INV-20240401-002',
  },
  {
    id: 103,
    website: 'charansite.com',
    date: '2024-03-01',
    amount: 99,
    status: 'Success',
    method: 'Mastercard **** 1234',
    invoice: 'INV-20240301-003',
  },
];

export default function PaymentsPage() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<string | null>(null);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistory | null>(null);

  const totalPaid = mockHistory.filter(p => p.status === 'Success').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = mockWebsites.filter(w => w.paymentStatus === 'Pending').reduce((sum, w) => sum + w.amountDue, 0);

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-primary-600 to-primary-700 rounded-3xl mx-8 mt-8 mb-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-white rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="text-white mb-8 lg:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Payment <span className="text-yellow-300">Management</span>
              </h1>
              <p className="text-xl text-green-100 mb-6 leading-relaxed">
                Track your subscriptions, manage payments, and download invoices with ease.
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">${totalPaid}</div>
                <div className="text-green-100 text-sm font-medium">Total Paid</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">${pendingAmount}</div>
                <div className="text-green-100 text-sm font-medium">Pending</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 pb-8 space-y-8">
        {/* Website Payment Status */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Website Subscriptions</h2>
              <p className="text-gray-600 mt-1">Manage your website payments and subscriptions</p>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 px-3 py-2 rounded-full">
              <FiStar className="w-4 h-4" />
              Premium Plan
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockWebsites.map(site => (
              <div key={site.id} className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-primary-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{site.name[0].toUpperCase()}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{site.name}</h3>
                    <p className="text-sm text-gray-600">{site.status}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {site.paymentStatus === 'Paid' ? (
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
                      <FiCheck className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="text-sm font-semibold text-green-700">Paid until</div>
                        <div className="text-sm text-green-600">{site.paidTill}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-xl">
                      <FiClock className="w-5 h-5 text-yellow-600" />
                      <div>
                        <div className="text-sm font-semibold text-yellow-700">Payment Due</div>
                        <div className="text-lg font-bold text-yellow-600">${site.amountDue}</div>
                      </div>
                    </div>
                  )}
                </div>

                {site.paymentStatus !== 'Paid' && (
                  <button 
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 transform hover:scale-105 shadow-lg"
                    onClick={() => { 
                      setSelectedWebsite(site.name); 
                      setSelectedAmount(site.amountDue); 
                      setShowPaymentModal(true); 
                    }}
                  >
                    <FiCreditCard className="w-4 h-4" />
                    Make Payment
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
                <p className="text-gray-600 mt-1">View and manage your transaction history</p>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-primary-600">
                <FiCalendar className="w-4 h-4" />
                Last 90 days
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Website</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Method</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockHistory.map(payment => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{payment.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{payment.website}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">${payment.amount}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{payment.method}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        payment.status === 'Success' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {payment.status === 'Success' ? (
                          <FiCheck className="w-3 h-3" />
                        ) : (
                          <FiAlertCircle className="w-3 h-3" />
                        )}
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        className="text-primary-600 hover:text-primary-700 font-semibold text-sm transition-colors"
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
        </div>
      </div>

      {/* Modals */}
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