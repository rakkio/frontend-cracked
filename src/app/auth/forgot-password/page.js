'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
    FaEnvelope, 
    FaSpinner, 
    FaArrowLeft,
    FaKey
} from 'react-icons/fa'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        // Simulate API call - replace with actual implementation
        try {
            // await api.forgotPassword(email)
            setTimeout(() => {
                setSent(true)
                setLoading(false)
            }, 2000)
        } catch (err) {
            setError('Service temporarily unavailable. Please try again later.')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="max-w-md w-full mx-auto p-6">
                <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <FaKey className="text-4xl text-red-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-white mb-2">Forgot Password</h1>
                        <p className="text-gray-400">
                            Enter your email address and we&apos;ll send you a link to reset your password.
                        </p>
                    </div>

                    {sent ? (
                        <div className="text-center">
                            <div className="text-4xl mb-4">📧</div>
                            <h3 className="text-lg font-semibold text-white mb-2">Check Your Email</h3>
                            <p className="text-gray-400 mb-6">
                                We&apos;ve sent a password reset link to <strong>{email}</strong>
                            </p>
                            <p className="text-gray-500 text-sm mb-6">
                                Didn&apos;t receive the email? Check your spam folder or try again.
                            </p>
                            <Link href="/auth/login">
                                <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors">
                                    Back to Login
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="email" className="block text-gray-400 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="Enter your email"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !email}
                                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                                >
                                    {loading ? (
                                        <>
                                            <FaSpinner className="animate-spin mr-2" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Reset Link'
                                    )}
                                </button>
                            </form>

                            {/* Footer */}
                            <div className="mt-8 text-center">
                                <Link 
                                    href="/auth/login"
                                    className="flex items-center justify-center space-x-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <FaArrowLeft />
                                    <span>Back to Login</span>
                                </Link>
                            </div>

                            <div className="mt-6 text-center">
                                <p className="text-gray-500 text-sm">
                                    Don&apos;t have an account?{' '}
                                    <Link href="/auth/register" className="text-red-400 hover:text-red-300">
                                        Sign up
                                    </Link>
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
} 