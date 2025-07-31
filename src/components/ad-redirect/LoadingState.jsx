import { FaSpinner } from 'react-icons/fa'

export default function LoadingState() {
    return (
        <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaSpinner className="text-2xl text-blue-600 animate-spin" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Preparing Download</h3>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                </div>
                <p className="text-gray-600">Setting up your download experience...</p>
            </div>
        </div>
    )
} 