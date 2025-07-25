import { FaSpinner } from 'react-icons/fa'

export const AppsLoading = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
            <div className="text-center space-y-4">
                <FaSpinner className="text-5xl text-red-500 animate-spin mx-auto" />
                <p className="text-gray-400 text-lg">Loading Premium Apps...</p>
            </div>
        </div>
    )
}