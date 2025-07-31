import { FaAppStore, FaCheckCircle, FaShieldAlt, FaRocket } from 'react-icons/fa'

export const AppsHeader = ({ searchTerm, appsCount }) => {
    return (
        <section className="relative py-16 px-4 bg-white border-b border-gray-200">
            <div className="container mx-auto text-center max-w-4xl">
                <header className="space-y-8">
                    {/* Clean Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <FaAppStore className="text-3xl text-white" />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight" itemProp="name">
                            {searchTerm ? (
                                <>
                                    Search Results for{' '}
                                    <span className="text-blue-600">"{searchTerm}"</span>
                                </>
                            ) : (
                                'Premium Applications'
                            )}
                        </h1>
                        
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto" itemProp="description">
                            {searchTerm 
                                ? `${appsCount} ${appsCount === 1 ? 'application' : 'applications'} found`
                                : `Browse ${appsCount} premium applications with full features unlocked`
                            }
                        </p>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap justify-center gap-6 pt-8">
                        <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-full px-4 py-2">
                            <FaCheckCircle className="text-green-600" />
                            <span className="text-green-700 font-medium text-sm">Verified Safe</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2">
                            <FaShieldAlt className="text-blue-600" />
                            <span className="text-blue-700 font-medium text-sm">Malware Free</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-purple-50 border border-purple-200 rounded-full px-4 py-2">
                            <FaRocket className="text-purple-600" />
                            <span className="text-purple-700 font-medium text-sm">Fast Download</span>
                        </div>
                    </div>
                </header>
            </div>
        </section>
    )
}