import { FaRocket } from 'react-icons/fa'

export default function AdRedirectHeader() {
    return (
        <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                    <FaRocket className="text-2xl text-white" />
                </div>
                <div className="text-left">
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">
                        Download in Progress
                    </h1>
                    <p className="text-gray-600">
                        Preparing your download experience
                    </p>
                </div>
            </div>
        </div>
    )
} 