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
                            {advertisement?.crackmarket?.adFormat === 'direct_link' && advertisement?.crackmarket?.directLink ? (
                                <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                    </div>
                                    <h4 className="text-2xl font-bold text-gray-900 mb-4">{advertisement.name}</h4>
                                    <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-md mx-auto">{advertisement.description}</p>
                                    
                                    {/* Prominent Call-to-Action */}
                                    <div className="space-y-4">
                                        <a 
                                            href={advertisement.crackmarket.directLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                            onClick={() => {
                                                console.log('🔗 Ad link clicked:', advertisement.crackmarket.directLink)
                                                // Track click
                                                if (advertisement._id) {
                                                    fetch(`/api/advertisements/${advertisement._id}/click`, { method: 'POST' })
                                                        .catch(err => console.log('Click tracking failed:', err))
                                                }
                                            }}
                                        >
                                            🎆 Visit Our Sponsor 🎆
                                        </a>
                                        
                                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                            <span>Support our free service by visiting our sponsor</span>
                                        </div>
                                    </div>
                                    
                                    {/* Additional Info */}
                                    <div className="mt-6 p-4 bg-white/50 rounded-lg border border-gray-200">
                                        <p className="text-xs text-gray-500 mb-2">Advertisement Details:</p>
                                        <div className="flex justify-center space-x-4 text-xs">
                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                                                {advertisement.impressions || 0} views
                                            </span>
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                Zone: {advertisement.crackmarket?.zoneId || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : advertisement?.script ? (
                                <div className="w-full h-full">
                                    <div className="text-center mb-4">
                                        <h4 className="text-lg font-bold text-gray-900">{advertisement.name}</h4>
                                        <p className="text-gray-600">{advertisement.description}</p>
                                    </div>
                                    {/* Script ad container */}
                                    <div 
                                        className="w-full min-h-[200px] bg-white rounded-lg border border-gray-200 p-4"
                                        dangerouslySetInnerHTML={{ __html: `<script src="${advertisement.script}" async></script><div id="ad-container-${advertisement._id}" style="width: 100%; min-height: 200px; display: flex; align-items: center; justify-content: center; background: #f9fafb; border-radius: 8px;"><p style="color: #6b7280;">Loading advertisement...</p></div>` }}
                                    />
                                </div>
                            ) : advertisement?.crackmarket?.scriptUrl ? (
                                <div className="w-full h-full">
                                    <div className="text-center mb-4">
                                        <h4 className="text-lg font-bold text-gray-900">{advertisement.name}</h4>
                                        <p className="text-gray-600">{advertisement.description}</p>
                                    </div>
                                    {/* Crackmarket script ad container */}
                                    <div 
                                        className="w-full min-h-[200px] bg-white rounded-lg border border-gray-200 p-4"
                                        dangerouslySetInnerHTML={{ __html: `<script src="${advertisement.crackmarket.scriptUrl}" async></script><div id="crackmarket-ad-${advertisement._id}" style="width: 100%; min-height: 200px; display: flex; align-items: center; justify-content: center; background: #f9fafb; border-radius: 8px;"><p style="color: #6b7280;">Loading advertisement...</p></div>` }}
                                    />
                                </div>
                            ) : (
                                <div className="text-center p-8">
                                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">{advertisement?.name || 'Advertisement'}</h4>
                                    <p className="text-gray-600 mb-4">{advertisement?.description || 'Please view this advertisement to support our service'}</p>
                                    <p className="text-sm text-gray-500">Advertisement content loading...</p>
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