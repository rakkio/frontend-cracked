import React from 'react'

const ErrorState = ({ error, onRetry, onContinue }) => {
    const getErrorMessage = (error) => {
        if (error?.includes('URL not available')) {
            return {
                title: 'Download Link Unavailable',
                message: 'The download link could not be found. This might be a temporary issue.',
                suggestion: 'Please try downloading the app again from the main page.'
            }
        }
        if (error?.includes('Invalid download data')) {
            return {
                title: 'Invalid Download Data',
                message: 'The download information is corrupted or incomplete.',
                suggestion: 'Please try downloading the app again from the main page.'
            }
        }
        if (error?.includes('Unable to process')) {
            return {
                title: 'Download Processing Error',
                message: 'We encountered an issue while processing your download.',
                suggestion: 'Please try again or contact support if the problem persists.'
            }
        }
        if (error?.includes('No download information')) {
            return {
                title: 'No Download Information',
                message: 'No download information was found. You may have arrived here directly.',
                suggestion: 'Please go back to the app page and try downloading again.'
            }
        }
        
        return {
            title: 'Download Error',
            message: error || 'An unexpected error occurred while processing your download.',
            suggestion: 'Please try again or contact support if the problem persists.'
        }
    }

    const errorInfo = getErrorMessage(error)

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                {/* Error Icon */}
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>

                {/* Error Title */}
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    {errorInfo.title}
                </h1>

                {/* Error Message */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                    {errorInfo.message}
                </p>

                {/* Suggestion */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-blue-800">
                            {errorInfo.suggestion}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Try Again
                        </button>
                    )}
                    
                    {onContinue && (
                        <button
                            onClick={onContinue}
                            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                            Continue Anyway
                        </button>
                    )}
                    
                    <button
                        onClick={() => window.location.href = '/'}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Go Home
                    </button>
                </div>

                {/* Help Section */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">📋 How This Works</h3>
                    <div className="text-xs text-gray-600 space-y-2">
                        <p>• We show advertisements to keep downloads free</p>
                        <p>• After the countdown, your download will start automatically</p>
                        <p>• If you encounter issues, try refreshing the page</p>
                        <p>• For support, contact us through the main website</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ErrorState 