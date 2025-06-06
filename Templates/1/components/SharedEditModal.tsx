import React from 'react'
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react'

interface SharedEditModalProps {
  title: string
  subtitle?: string
  isOpen: boolean
  onClose: () => void
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  isSaving?: boolean
  successMessage?: string | null
  children: React.ReactNode
  footer?: React.ReactNode
}

export default function SharedEditModal({
  title,
  subtitle,
  isOpen,
  onClose,
  isLoading = false,
  error = null,
  onRetry,
  isSaving = false,
  successMessage = null,
  children,
  footer
}: SharedEditModalProps) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSaving}
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maroon-600"></div>
              <span className="ml-3 text-gray-600">Loading...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-red-800 font-medium">Error</h3>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </div>
              {onRetry && (
                <div className="mt-4">
                  <button 
                    onClick={onRetry}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Content - Only show if not loading and no error */}
        {!isLoading && !error && (
          <div className="p-6 space-y-8">
            {children}
          </div>
        )}

        {/* Modal Footer */}
        {!isLoading && !error && (
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            {footer}
            {successMessage && (
              <div className="flex items-center space-x-2 bg-green-50 border border-green-200 px-3 py-2 rounded-lg ml-auto">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800">{successMessage}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 