'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'
import { FaSpinner, FaDownload, FaArrowRight, FaClock, FaCheckCircle, FaExclamationTriangle, FaSkull } from 'react-icons/fa'

export default function AdRedirectPage() {
    const [countdown, setCountdown] = useState(15)
    const [advertisement, setAdvertisement] = useState(null)
    const [adLoaded, setAdLoaded] = useState(false)
  const [error, setError] = useState(null)
    const [pendingDownload, setPendingDownload] = useState(null)
    const [canSkip, setCanSkip] = useState(false)
    
  const router = useRouter()
    const searchParams = useSearchParams()
    const adContainerRef = useRef(null)
    const countdownIntervalRef = useRef(null)
    const scriptLoadedRef = useRef(false)
    const [adBlockDetected, setAdBlockDetected] = useState(false)
    const [availableAds, setAvailableAds] = useState([])
    const [currentAdIndex, setCurrentAdIndex] = useState(0)
    
    useEffect(() => {
        console.log('=== Ad Redirect Page Loaded ===')
        
        // Pequeño delay para asegurar que sessionStorage esté disponible
        setTimeout(() => {
            // Get pending download from sessionStorage
            console.log('🔍 Checking sessionStorage for pending download...')
            const storedDownload = sessionStorage.getItem('pendingDownload')
            console.log('Raw sessionStorage data:', storedDownload)
            
            if (storedDownload) {
                try {
                    const downloadData = JSON.parse(storedDownload)
                    console.log('📦 Parsed download data:', downloadData)
                    
                    // Validar que los datos son válidos
                    if (!downloadData.url || !downloadData.appName) {
                        console.error('❌ Invalid download data structure')
                        setError('Invalid download data')
                        handleDirectDownload()
                        return
                    }
                    
                    setPendingDownload(downloadData)
                    console.log('✅ Download data set successfully')
                    
                    // Load advertisement data
                    loadAdvertisement()
                    
                } catch (e) {
                    console.error('❌ Failed to parse pending download:', e)
                    setError('Invalid download data format')
                    handleDirectDownload()
                    return
                }
            } else {
                console.error('❌ No pending download found in sessionStorage')
                console.log('Available sessionStorage keys:', Object.keys(sessionStorage))
                setError('No download information found')
                handleDirectDownload()
                return
            }
        }, 200) // 200ms delay to ensure sessionStorage is ready
        
        // Cleanup function
        return () => {
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current)
            }
        }
    }, [])
    
    const loadAdvertisement = async () => {
        console.log('🔄 Loading advertisement data...')
        
        // Detect ad blockers first
        detectAdBlock()
        
        try {
            // Try to get multiple advertisements as fallbacks
            const response = await api.getActiveAdvertisement({
                type: 'download',
                placement: 'button_click',
                page: '/app/' // Generic app page reference
            })
            
            console.log('Advertisement response:', response)
            
            if (!response?.data?.advertisement) {
                // Try to get other placements as fallback
                const fallbackPlacements = ['before_download', 'after_download', 'page_load']
                
                for (const placement of fallbackPlacements) {
                    try {
                        const fallbackResponse = await api.getActiveAdvertisement({
                            type: 'download',
                            placement: placement,
                            page: '/app/'
                        })
                        
                        if (fallbackResponse?.data?.advertisement) {
                            console.log(`✅ Found fallback ad with placement: ${placement}`)
                            const ad = fallbackResponse.data.advertisement
                            setAdvertisement(ad)
                            setAvailableAds([ad])
                            await handleAdvertisementType(ad)
                            return
                        }
                    } catch (fallbackError) {
                        console.log(`❌ Fallback placement ${placement} failed:`, fallbackError)
                    }
                }
                
                console.warn('No advertisement found with any placement, proceeding with direct download')
                handleDirectDownload()
                return
            }
            
            const ad = response.data.advertisement
            setAdvertisement(ad)
            setAvailableAds([ad]) // For now, single ad - can be extended to multiple
            
            console.log('🔍 Advertisement loaded:', {
                id: ad._id,
                name: ad.name,
                type: ad.type,
                crackmarketEnabled: ad.crackmarket?.enabled,
                adFormat: ad.crackmarket?.adFormat,
                hasDirectLink: !!ad.crackmarket?.directLink,
                hasScript: !!ad.script
            })
            
            // Track impression
            try {
                await api.trackAdvertisementImpression(ad._id)
                console.log('📊 Advertisement impression tracked')
            } catch (trackError) {
                console.warn('Failed to track impression:', trackError)
            }
            
            // Handle different advertisement types
            await handleAdvertisementType(ad)
            
        } catch (error) {
            console.error('❌ Error loading advertisement:', error)
            setError('Advertisement loading failed')
            handleDirectDownload()
        }
    }
    
    const handleAdvertisementType = async (ad) => {
        console.log('🎯 Handling advertisement type:', ad.crackmarket?.adFormat || ad.type)
        
        if (!ad.crackmarket?.enabled) {
            console.log('Crackmarket not enabled, using fallback')
            handleDirectDownload()
            return
        }
        
        switch (ad.crackmarket.adFormat) {
            case 'direct_link':
                await handleDirectLink(ad)
                break
                
            case 'multitag':
            case 'onclick_popunder':
            case 'push_notifications':
            case 'in_page_push':
            case 'vignette_banner':
            case 'interstitial':
                await handleScriptBasedAd(ad)
                break
                
            default:
                console.log('Unknown ad format, using script-based handler')
                await handleScriptBasedAd(ad)
                break
        }
    }
    
    const handleDirectLink = async (ad) => {
        console.log('🔗 Handling direct link advertisement')
        
        if (!ad.crackmarket?.directLink) {
            console.error('No direct link provided')
            setError('Invalid direct link advertisement')
            handleDirectDownload()
            return
        }
        
        console.log('Direct link URL:', ad.crackmarket.directLink)
        console.log('Advertisement settings:', ad.settings)
        
        // Use settings from advertisement
        const adCountdown = ad.settings?.countdown || 15
        const isClosable = ad.settings?.closable || false
        const autoClose = ad.settings?.autoClose || false
        const autoCloseDelay = ad.settings?.autoCloseDelay || 30
        
        console.log('Using countdown:', adCountdown, 'seconds')
        console.log('Closable:', isClosable, 'AutoClose:', autoClose)
        
        // Track click
        try {
            await api.trackAdvertisementClick(ad._id)
            console.log('📊 Advertisement click tracked')
        } catch (trackError) {
            console.warn('Failed to track click:', trackError)
        }
        
        // For direct links, open in new tab and proceed with download
        console.log('🎯 Direct link strategy: open ad in new tab, download after countdown')
        
        setAdLoaded(true)
        setCanSkip(isClosable) // Use closable setting
        setCountdown(adCountdown) // Use countdown from settings
        
        // Open advertisement in new tab
        window.open(ad.crackmarket.directLink, '_blank')
        
        // Start countdown for download using advertisement settings
        let directLinkCountdown = adCountdown
        const directLinkInterval = setInterval(() => {
            directLinkCountdown--
            setCountdown(directLinkCountdown)
            
            if (directLinkCountdown <= 0) {
                clearInterval(directLinkInterval)
                console.log('⏰ Direct link countdown finished, starting download')
                
                if (autoClose) {
                    console.log('🔄 Auto-close enabled, proceeding with download')
                    proceedWithDownload()
                } else {
                    console.log('⏸️ Auto-close disabled, waiting for user action')
                    // User needs to click the download button
                }
            }
        }, 1000)
    }
    
    const handleScriptBasedAd = async (ad) => {
        console.log('📜 Handling script-based advertisement')
        console.log('Advertisement settings:', ad.settings)
        
        if (!ad.script) {
            console.error('No script provided for advertisement')
            setError('Invalid script advertisement')
            handleDirectDownload()
            return
        }
        
        // Use settings from advertisement
        const adCountdown = ad.settings?.countdown || 15
        const isClosable = ad.settings?.closable || false
        const autoClose = ad.settings?.autoClose || false
        const verificationRequired = ad.settings?.verificationRequired !== false
        
        console.log('Using countdown:', adCountdown, 'seconds')
        console.log('Closable:', isClosable, 'AutoClose:', autoClose, 'Verification:', verificationRequired)
        
        try {
            await injectAdScript(ad)
            setAdLoaded(true)
            
            // Use countdown from advertisement settings
            setCountdown(adCountdown)
            setCanSkip(isClosable)
            
            // Allow skip after 5 seconds if closable
            if (isClosable) {
                setTimeout(() => {
                    setCanSkip(true)
                }, 5000)
            }
            
            // Start countdown using advertisement settings
            startCountdown(adCountdown, autoClose, verificationRequired)
            
        } catch (error) {
            console.error('❌ Error injecting ad script:', error)
            setError('Failed to load advertisement')
            handleDirectDownload()
        }
    }
    
    const injectAdScript = async (ad) => {
        console.log('💉 Injecting advertisement script...')
        
        if (!adContainerRef.current || scriptLoadedRef.current) {
            return
        }
        
        try {
            // Clear any existing content
            adContainerRef.current.innerHTML = ''
            
            // Check if script is a URL or HTML content
            const isScriptUrl = ad.script.trim().startsWith('http://') || ad.script.trim().startsWith('https://')
            
            if (isScriptUrl) {
                console.log('🔗 Loading external script:', ad.script)
                
                // Create script element for external script
                const scriptElement = document.createElement('script')
                scriptElement.src = ad.script
                scriptElement.async = true
                scriptElement.type = 'text/javascript'
                
                scriptElement.onload = () => {
                    console.log('✅ External script loaded successfully')
                    scriptLoadedRef.current = true
                }
                
                scriptElement.onerror = () => {
                    console.error('❌ Failed to load external script')
                    throw new Error('Failed to load external script')
                }
                
                adContainerRef.current.appendChild(scriptElement)
                
            } else {
                console.log('📝 Injecting HTML/JavaScript content')
                
                // Create container div
                const container = document.createElement('div')
                container.innerHTML = ad.script
                
                // Find and execute any script tags
                const scripts = container.getElementsByTagName('script')
                console.log(`Found ${scripts.length} script tags`)
                
                for (let i = 0; i < scripts.length; i++) {
                    const script = scripts[i]
                    const newScript = document.createElement('script')
                    
                    if (script.src) {
                        newScript.src = script.src
                        newScript.async = true
                    } else {
                        newScript.textContent = script.textContent
                    }
                    
                    // Copy attributes
                    Array.from(script.attributes).forEach(attr => {
                        newScript.setAttribute(attr.name, attr.value)
                    })
                    
                    container.appendChild(newScript)
                    script.remove()
                }
                
                adContainerRef.current.appendChild(container)
                scriptLoadedRef.current = true
                console.log('✅ HTML content injected successfully')
            }
            
        } catch (error) {
            console.error('❌ Error injecting script:', error)
            throw error
        }
    }
    
    const startCountdown = (initialTime, autoClose = false, verificationRequired = true) => {
        console.log('⏰ Starting countdown from:', initialTime, 'seconds')
        console.log('AutoClose:', autoClose, 'Verification required:', verificationRequired)
        
        countdownIntervalRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(countdownIntervalRef.current)
                    console.log('⏰ Countdown finished')
                    
                    if (autoClose) {
                        console.log('🔄 Auto-close enabled, proceeding with download')
                        proceedWithDownload()
                    } else {
                        console.log('⏸️ Auto-close disabled, user must click download button')
                        // Just stop countdown, user needs to click download button
                    }
                    return 0
                }
                return prev - 1
            })
        }, 1000)
    }
    
    const proceedWithDownload = async () => {
        console.log('🎯 Proceeding with download')
        
        if (pendingDownload) {
            console.log('Download URL:', pendingDownload.url)
            
            // Track conversion
            if (advertisement?._id) {
                try {
                    await api.trackAdvertisementConversion(advertisement._id)
                    console.log('📊 Advertisement conversion tracked')
                } catch (trackError) {
                    console.warn('Failed to track conversion:', trackError)
                }
            }
            
            // Clear sessionStorage
            sessionStorage.removeItem('pendingDownload')
            
            // Open download in new tab
            window.open(pendingDownload.url, '_blank')
            
            // Show success message
            setCountdown(0)
            
            // Redirect back to the app page after a delay
            setTimeout(() => {
                if (pendingDownload.appSlug) {
                    router.push(`/app/${pendingDownload.appSlug}`)
                } else {
                    console.warn('⚠️ No appSlug available, redirecting to apps page')
                    router.push('/apps')
                }
            }, 2000)
        } else {
            console.warn('No pending download found')
            setError('No download information found')
            setTimeout(() => {
                router.push('/apps')
            }, 2000)
        }
    }
    
    const handleDirectDownload = () => {
        console.log('🔄 Proceeding with direct download (no ads)')
        
        // Update UI to show direct download
        setError(null)
        setAdLoaded(true)
        setCountdown(3)
        
        setTimeout(() => {
            if (pendingDownload) {
                console.log('📥 Starting direct download:', pendingDownload.url)
                
                // Track direct download if possible
                try {
                    // Could track this as a direct download event
                    console.log('📊 Direct download initiated')
                } catch (trackError) {
                    console.warn('Failed to track direct download:', trackError)
                }
                
                // Start download
                window.open(pendingDownload.url, '_blank')
                sessionStorage.removeItem('pendingDownload')
                
                // Show success message
                setCountdown(0)
                
                // Redirect back to app page
                setTimeout(() => {
                    if (pendingDownload.appSlug) {
                        window.location.href = `/app/${pendingDownload.appSlug}`
                    } else {
                        console.warn('⚠️ No appSlug available, redirecting to apps page')
                        window.location.href = '/apps'
                    }
                }, 2000)
            } else {
                console.error('❌ No pending download data available')
                setTimeout(() => {
                    window.location.href = '/apps'
                }, 2000)
            }
        }, 3000)
    }
    
    const handleSkip = async () => {
        console.log('⏭️ User skipped advertisement')
        
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current)
        }
        
        // Track click if user interacted
        if (advertisement?._id) {
            try {
                await api.trackAdvertisementClick(advertisement._id)
                console.log('📊 Advertisement click tracked (skip)')
            } catch (trackError) {
                console.warn('Failed to track click:', trackError)
            }
        }
        
        // Try to load another advertisement instead of proceeding with download
        if (availableAds.length > 1 && currentAdIndex < availableAds.length - 1) {
            console.log('🔄 Loading next available advertisement...')
            const nextAdIndex = currentAdIndex + 1
            setCurrentAdIndex(nextAdIndex)
            const nextAd = availableAds[nextAdIndex]
            setAdvertisement(nextAd)
            await handleAdvertisementType(nextAd)
        } else {
            // Try to get a different advertisement from backend
            console.log('🔄 Trying to get different advertisement...')
            try {
                const response = await api.getActiveAdvertisement({
                    type: 'download',
                    placement: 'before_download', // Try different placement
                    page: '/app/'
                })
                
                if (response?.data?.advertisement && response.data.advertisement._id !== advertisement._id) {
                    console.log('✅ Found different advertisement')
                    const newAd = response.data.advertisement
                    setAdvertisement(newAd)
                    setAvailableAds([...availableAds, newAd])
                    setCurrentAdIndex(availableAds.length)
                    await handleAdvertisementType(newAd)
                } else {
                    console.log('ℹ️ No different advertisement available, proceeding with download')
                    proceedWithDownload()
                }
      } catch (error) {
                console.error('❌ Error loading different advertisement:', error)
                console.log('ℹ️ Proceeding with download due to error')
                proceedWithDownload()
            }
        }
    }
    
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
    
    // Anti-adblock detection
    const detectAdBlock = () => {
        console.log('🔍 Detecting ad blockers...')
        
        // Method 1: Try to create ad-like element
        const adElement = document.createElement('div')
        adElement.innerHTML = '&nbsp;'
        adElement.className = 'adsbox'
        adElement.style.position = 'absolute'
        adElement.style.left = '-10000px'
        document.body.appendChild(adElement)
        
        setTimeout(() => {
            const isBlocked = adElement.offsetHeight === 0 || 
                             adElement.offsetWidth === 0 || 
                             adElement.style.display === 'none' ||
                             adElement.style.visibility === 'hidden'
            
            document.body.removeChild(adElement)
            
            // Method 2: Check for known adblock extensions
            const adBlockExtensions = [
                'chrome-extension://gighmmpiobklfepjocnamgkkbiglidom', // AdBlock
                'chrome-extension://cfhdojbkjhnklbpkdaibdccddilifddb', // AdBlock Plus  
                'chrome-extension://cjpalhdlnbpafiamejdnhcphjbkeiagm', // uBlock Origin
            ]
            
            let extensionDetected = false
            adBlockExtensions.forEach(ext => {
                const img = new Image()
                img.onload = () => { extensionDetected = true }
                img.src = ext + '/icon.png'
            })
            
            // Method 3: Check user agent for Brave
            const isBrave = navigator.brave !== undefined || 
                           navigator.userAgent.includes('Brave')
            
            const adBlockActive = isBlocked || extensionDetected || isBrave
            
            console.log('🛡️ AdBlock detection results:', {
                elementBlocked: isBlocked,
                extensionDetected: extensionDetected,
                isBrave: isBrave,
                adBlockActive: adBlockActive
            })
            
            setAdBlockDetected(adBlockActive)
            
            if (adBlockActive) {
                console.log('🚨 AdBlock detected - using anti-adblock strategy')
            }
        }, 100)
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <FaSkull className="text-4xl text-red-500 animate-pulse mr-3" />
                        <h1 className="text-3xl font-bold text-white">Processing Download</h1>
                    </div>
                    <p className="text-gray-400">
                        {pendingDownload ? `Preparing: ${pendingDownload.appName}` : 'Loading...'}
                    </p>
                    {advertisement && (
                        <div className="mt-2">
                            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                                {getAdTypeDisplay()}
                            </span>
                        </div>
                    )}
                </div>
                
                <div className="max-w-6xl mx-auto">
                    {error ? (
                        /* Error State */
                        <div className="text-center">
                            <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-8 mb-6">
                                <FaExclamationTriangle className="text-4xl text-red-400 mx-auto mb-4" />
                                <h2 className="text-xl font-semibold text-red-300 mb-2">
                                    {error === 'No download information found' ? 'Session Error' : 'Advertisement Error'}
                                </h2>
                                <p className="text-red-200 mb-4">{error}</p>
                                {error === 'No download information found' ? (
                                    <p className="text-gray-400 text-sm">Please try downloading again from the app page...</p>
                                ) : (
                                    <p className="text-gray-400 text-sm">Proceeding with direct download...</p>
                                )}
                            </div>
                        </div>
                    ) : !advertisement && !adLoaded ? (
                        /* Loading State */
                        <div className="text-center">
                            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-12">
                                <FaSpinner className="text-4xl text-red-500 animate-spin mx-auto mb-4" />
                                <p className="text-gray-400">Loading advertisement...</p>
                            </div>
                        </div>
                    ) : adLoaded && !advertisement ? (
                        /* Direct Download State */
                        <div className="text-center">
                            <div className="bg-green-900/30 border border-green-500/50 rounded-xl p-8 mb-6">
                                <FaCheckCircle className="text-4xl text-green-400 mx-auto mb-4" />
                                <h2 className="text-xl font-semibold text-green-300 mb-2">Direct Download Ready</h2>
                                <p className="text-green-200 mb-4">No advertisements available - proceeding with direct download</p>
                                <p className="text-gray-400 text-sm">Your download will start automatically...</p>
                            </div>
                        </div>
                    ) : (
                        /* Advertisement Display */
                        <div>
                            {/* Anti-AdBlock Warning */}
                            {adBlockDetected && (
                                <div className="mb-6">
                                    <div className="bg-orange-900/30 border border-orange-500/50 rounded-xl p-4">
                                        <div className="flex items-center space-x-3">
                                            <FaExclamationTriangle className="text-orange-400 text-xl" />
                                            <div>
                                                <h3 className="text-orange-300 font-semibold">Ad Blocker Detected</h3>
                                                <p className="text-orange-200 text-sm">Please disable your ad blocker to support free downloads and ensure proper functionality.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                                {/* Advertisement Content */}
                                <div className="lg:col-span-3">
                                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
                                        {/* Header */}
                                        <div className="flex items-center justify-between p-6 border-b border-gray-700">
                                            <h2 className="text-xl font-semibold text-white">
                                                {advertisement.name || getAdTypeDisplay()}
                                            </h2>
                                            <div className="flex items-center space-x-2 text-gray-400">
                                                <FaClock className="text-sm" />
                                                <span className="text-sm">Supporting free downloads</span>
                                            </div>
                                        </div>
                                        
                                        {/* Ad Content */}
                                        <div className="p-6">
                                            {advertisement.crackmarket?.adFormat === 'direct_link' ? (
                                                /* Direct Link Display */
                                                <div className="text-center py-12">
                                                    <div className="mb-6">
                                                        <div className="text-6xl mb-4">🔗</div>
                                                        <h3 className="text-2xl font-bold text-white mb-2">Redirecting to Advertisement</h3>
                                                        <p className="text-gray-400">You will be redirected to our partner's page</p>
      </div>

                                                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 max-w-md mx-auto">
                                                        <p className="text-blue-200 text-sm">
                                                            After viewing the advertisement, you'll be able to return and your download will start automatically.
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                /* Script-based Ad Container */
                                                <div className="min-h-[400px]">
                                                    <div 
                                                        ref={adContainerRef} 
                                                        className="w-full min-h-[400px] relative"
                                                    >
                                                        {!adLoaded && (
                                                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-lg">
                                                                <div className="text-center">
                                                                    <FaSpinner className="text-3xl text-red-500 animate-spin mx-auto mb-4" />
                                                                    <p className="text-gray-400">Loading advertisement content...</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
     </div>

                                {/* Download Status Sidebar */}
                                <div className="lg:col-span-1">
                                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 sticky top-8">
                                        <h3 className="text-lg font-semibold text-white mb-4">Download Status</h3>
                                        
                                        {pendingDownload && (
                                            <div className="mb-6">
                                                <div className="text-sm text-gray-400 mb-2">Application:</div>
                                                <div className="text-white font-medium break-words">{pendingDownload.appName}</div>
                                            </div>
                                        )}
                                        
                                        {/* Countdown Display */}
                                        <div className="text-center mb-6">
                                            {countdown > 0 ? (
                                                <div>
                                                    <div className="text-4xl font-bold text-red-500 mb-2">{countdown}</div>
                                                    <p className="text-gray-400 text-sm">
                                                        {error ? 'Redirecting back...' :
                                                         !advertisement && adLoaded ? 'Download starts in...' :
                                                         advertisement?.crackmarket?.adFormat === 'direct_link' 
                                                            ? 'Redirecting in...' 
                                                            : 'Download starts in...'}
                                                    </p>
                                                </div>
                                            ) : (
     <div>
                                                    <FaCheckCircle className="text-4xl text-green-500 mx-auto mb-2" />
                                                    <p className="text-green-400 font-medium">
                                                        {error ? 'Redirecting...' : 'Ready to download!'}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Action Buttons */}
                                        <div className="space-y-3">
                                            {countdown > 0 && canSkip && advertisement?.crackmarket?.adFormat !== 'direct_link' && !error && (
                                                <button
                                                    onClick={handleSkip}
                                                    className="w-full px-4 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                                                >
                                                    <span>Skip & Try Another Ad</span>
                                                    <FaArrowRight />
                                                </button>
                                            )}
                                            
                                            {countdown === 0 && (
                                                <button
                                                    onClick={proceedWithDownload}
                                                    className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                                                >
                                                    <FaDownload />
                                                    <span>Download Now</span>
                                                </button>
                                            )}
                                            
                                            {/* Show manual download button if auto-close is disabled and countdown finished */}
                                            {countdown === 0 && advertisement?.settings?.autoClose === false && (
                                                <div className="text-xs text-blue-400 text-center bg-blue-500/10 px-3 py-2 rounded-lg">
                                                    💡 Click "Download Now" to proceed with your download
                                                </div>
                                            )}
                                            
                                            <div className="text-xs text-gray-500 text-center">
                                                {error ? 'Please try again if the issue persists' : 
                                                 'Advertisements help us provide free downloads'}
                                            </div>
                                        </div>
                                        
                                        {/* Ad Information */}
                                        {advertisement && (
                                            <div className="mt-6 pt-6 border-t border-gray-700">
                                                <h4 className="text-sm font-semibold text-gray-300 mb-3">Advertisement Info</h4>
                                                <div className="space-y-2 text-xs text-gray-400">
                                                    <div className="flex justify-between">
                                                        <span>Type:</span>
                                                        <span className="text-gray-300">{getAdTypeDisplay()}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Network:</span>
                                                        <span className="text-gray-300">CrackMarket.xyz</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Duration:</span>
                                                        <span className="text-gray-300">{advertisement.settings?.countdown || 15}s</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Skippable:</span>
                                                        <span className={advertisement.settings?.closable ? "text-green-300" : "text-red-300"}>
                                                            {advertisement.settings?.closable ? "Yes" : "No"}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Auto-Start:</span>
                                                        <span className={advertisement.settings?.autoClose ? "text-green-300" : "text-yellow-300"}>
                                                            {advertisement.settings?.autoClose ? "Yes" : "Manual"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Info Footer */}
                <div className="max-w-6xl mx-auto mt-8">
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
                        <h4 className="text-blue-400 font-semibold mb-3">📋 How This Works</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-200">
                            <div className="flex items-start space-x-2">
                                <span className="text-blue-400 font-bold">1.</span>
                                <span>Advertisement loads and displays content from our partners</span>
                            </div>
                            <div className="flex items-start space-x-2">
                                <span className="text-blue-400 font-bold">2.</span>
                                <span>Wait for countdown or skip after 5 seconds (when available)</span>
                            </div>
                            <div className="flex items-start space-x-2">
                                <span className="text-blue-400 font-bold">3.</span>
                                <span>Your download starts automatically when ready</span>
                            </div>
                        </div>
                        <div className="mt-4 text-xs text-blue-300 bg-blue-500/10 px-3 py-2 rounded-lg">
                            💡 <strong>Note:</strong> Different ad types may behave differently. Direct links will redirect you to partner pages, while script-based ads display content here.
                        </div>
                    </div>
                </div>
     </div>
    </div>
  )
}
