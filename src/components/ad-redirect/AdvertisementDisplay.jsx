import { FaEye, FaMousePointer } from 'react-icons/fa'

export default function AdvertisementDisplay({ advertisement, adLoaded, adContainerRef }) {
    const getAdTypeDisplay = () => {
        if (!advertisement?.crackmarket?.adFormat) return 'Advertisement'
        
        const formats = {
            'direct_link': 'Direct Link',
            'multitag': 'MultiTag',
            'onclick_popunder': 'PopUnder',
            'push_notifications': 'Push Notification',
            'in_page_push': 'In-Page Push',
            'vignette_banner': 'Vignette Banner',
            'interstitial': 'Interstitial'
        }
        
        return formats[advertisement.crackmarket.adFormat] || 'Advertisement'
    }

    const getAdStats = () => {
        return {
            impressions: advertisement?.impressions || 0,
            ctr: advertisement?.ctr || 0
        }
    }

    const adStats = getAdStats()

    return (
        <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                {/* Ad Header */}
                {advertisement && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">
                                {advertisement.name || 'Advertisement'}
                            </h3>
                            <span className="text-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full">
                                {getAdTypeDisplay()}
                            </span>
                        </div>
                        
                        {advertisement.description && (
                            <p className="text-gray-600 mb-4">{advertisement.description}</p>
                        )}
                        
                        <div className="flex items-center space-x-4 text-xs">
                            <span className="bg-green-600 text-white px-3 py-1 rounded-full flex items-center">
                                <FaEye className="mr-1" /> {adStats.impressions} views
                            </span>
                            <span className="bg-yellow-600 text-white px-3 py-1 rounded-full flex items-center">
                                <FaMousePointer className="mr-1" /> {adStats.ctr}% CTR
                            </span>
                        </div>
                    </div>
                )}

                {/* Ad Content Container */}
                <div className="min-h-[300px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    {!adLoaded ? (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <p className="text-gray-600">Loading advertisement...</p>
                        </div>
                    ) : (
                        <div 
                            ref={adContainerRef}
                            className="w-full h-full min-h-[300px] flex items-center justify-center"
                        >
                            {advertisement?.crackmarket?.adFormat === 'direct_link' ? (
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-600">Direct link advertisement loaded</p>
                                    <p className="text-sm text-gray-500 mt-2">Redirecting to partner page...</p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="text-gray-600">Advertisement content will appear here</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Ad Info Footer */}
                {advertisement && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Duration:</span>
                                <span className="ml-2 font-medium">{advertisement.settings?.countdown || 15}s</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Skippable:</span>
                                <span className={`ml-2 font-medium ${advertisement.settings?.closable ? "text-green-600" : "text-red-600"}`}>
                                    {advertisement.settings?.closable ? "Yes" : "No"}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
} 