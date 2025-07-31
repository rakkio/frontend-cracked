import { FaShieldAlt, FaHeart } from 'react-icons/fa'

export default function AdBlockerWarning({ onDirectDownload }) {
    return (
        <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
                <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaShieldAlt className="text-orange-600 text-xl" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Ad Blocker Detected</h3>
                        <p className="text-gray-600 mb-3">
                            Please disable your ad blocker to support free downloads and ensure the best experience.
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-orange-600 mb-4">
                            <FaHeart className="text-red-500" />
                            <span>Help us keep downloads free!</span>
                        </div>
                        <button
                            onClick={onDirectDownload}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                        >
                            Continue Anyway
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
} 