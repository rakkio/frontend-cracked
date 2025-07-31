import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'
import AdNetworksService from '@/services/AdNetworksService'

export function useAdRedirect() {
    const [countdown, setCountdown] = useState(15)
    const [advertisement, setAdvertisement] = useState(null)
    const [adLoaded, setAdLoaded] = useState(false)
    const [error, setError] = useState(null)
    const [pendingDownload, setPendingDownload] = useState(null)
    const [canSkip, setCanSkip] = useState(false)
    const [adBlockDetected, setAdBlockDetected] = useState(false)
    const [deviceType, setDeviceType] = useState('desktop')
    
    const router = useRouter()
    const searchParams = useSearchParams()
    const adContainerRef = useRef(null)
    const countdownIntervalRef = useRef(null)
    const scriptLoadedRef = useRef(false)

    // Device detection
    useEffect(() => {
        const detectDevice = () => {
            const userAgent = navigator.userAgent.toLowerCase()
            if (/android/.test(userAgent)) {
                setDeviceType('android')
            } else if (/iphone|ipad|ipod/.test(userAgent)) {
                setDeviceType('ios')
            } else if (/mac/.test(userAgent)) {
                setDeviceType('mac')
            } else if (/linux/.test(userAgent)) {
                setDeviceType('linux')
            } else {
                setDeviceType('windows')
            }
        }
        
        detectDevice()
    }, [])

    const detectAdBlocker = useCallback(() => {
        console.log('🔍 Detecting ad blockers...')
        setTimeout(() => {
            let isBlocked = false
            let extensionDetected = false
            
            // Method 1: Check for common ad blocker elements (less strict)
            const testAd = document.createElement('div')
            testAd.innerHTML = '&nbsp;'
            testAd.className = 'adsbox'
            testAd.style.position = 'absolute'
            testAd.style.left = '-10000px'
            document.body.appendChild(testAd)
            
            setTimeout(() => {
                // Only consider blocked if multiple conditions are met
                const heightBlocked = testAd.offsetHeight === 0
                const widthBlocked = testAd.offsetWidth === 0
                const displayBlocked = testAd.style.display === 'none'
                
                if (heightBlocked && widthBlocked) {
                    isBlocked = true
                    console.log('⚠️ Ad blocker detected via element test')
                }
                document.body.removeChild(testAd)
            }, 100)
            
            // Method 2: Check for ad blocker extensions (less strict)
            const extensions = ['chrome-extension://gighmmpiobklfepjocnamgkkbiglidom', 'chrome-extension://cjpalhdlnbpafiamejdnhcphjbkeiagm']
            let extensionCount = 0
            extensions.forEach(ext => {
                const img = new Image()
                img.onload = () => { 
                    extensionCount++
                    if (extensionCount >= 2) {
                        extensionDetected = true
                        console.log('⚠️ Ad blocker extension detected')
                    }
                }
                img.src = ext + '/icon.png'
            })
            
            // Method 3: Check user agent for Brave (less strict)
            const isBrave = navigator.brave !== undefined || 
                           navigator.userAgent.includes('Brave')
            
            if (isBrave) {
                console.log('⚠️ Brave browser detected (built-in ad blocker)')
            }
            
            // Temporarily disable ad blocker detection for testing
            const adBlockActive = false // (isBlocked && extensionDetected) || (isBlocked && isBrave) || (extensionDetected && isBrave)
            setAdBlockDetected(adBlockActive)
            
            if (adBlockActive) {
                console.log('🚫 Ad blocker is active')
            } else {
                console.log('✅ No ad blocker detected')
            }
        }, 100)
    }, [])

    // Separate functions without circular dependencies
    const trackAdClick = useCallback(async (adData) => {
        try {
            if (adData?._id) {
                await api.trackAdvertisementClick(adData._id)
            }
        } catch (error) {
            console.error('Failed to track ad click:', error)
        }
    }, [])

    const proceedWithDownload = useCallback(() => {
        try {
            console.log('📦 Proceeding with download...')
            const downloadData = pendingDownload || JSON.parse(sessionStorage.getItem('pendingDownload') || '{}')
            console.log('📋 Download data:', downloadData)
            
            if (!downloadData?.url) {
                console.error('❌ No download URL found')
                setError('Download URL not available. Please try again.')
                return
            }
            
            if (!downloadData?.appName) {
                console.error('❌ No app name found')
                setError('App information not available. Please try again.')
                return
            }
            
            // Validate URL format
            try {
                new URL(downloadData.url)
            } catch (urlError) {
                console.error('❌ Invalid URL format:', downloadData.url)
                setError('Invalid download URL. Please try again.')
                return
            }
            
            console.log('✅ Download data validated, starting download...')
            
            // Clear the pending download
            sessionStorage.removeItem('pendingDownload')
            
            // Create a temporary link and trigger download
            const link = document.createElement('a')
            link.href = downloadData.url
            link.download = downloadData.appName || 'download'
            link.target = '_blank' // Open in new tab as fallback
            link.rel = 'noopener noreferrer'
            
            // Add to DOM, click, and remove
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            
            console.log('✅ Download initiated for:', downloadData.appName)
            
            // Show success message briefly before redirect
            setError(null) // Clear any previous errors
            
            // Redirect back to the app page or home after a delay
            setTimeout(() => {
                try {
                    if (downloadData.appSlug) {
                        console.log('🔄 Redirecting to app page:', downloadData.appSlug)
                        router.push(`/app/${downloadData.appSlug}`)
                    } else {
                        console.log('🔄 Redirecting to home page')
                        router.push('/')
                    }
                } catch (redirectError) {
                    console.error('❌ Redirect error:', redirectError)
                    // Fallback to window.location
                    window.location.href = downloadData.appSlug ? `/app/${downloadData.appSlug}` : '/'
                }
            }, 3000) // Increased delay to show success message
            
        } catch (error) {
            console.error('❌ Download error:', error)
            setError('Unable to process your download. Please try again.')
            
            // Fallback: try to redirect anyway
            setTimeout(() => {
                try {
                    const downloadData = JSON.parse(sessionStorage.getItem('pendingDownload') || '{}')
                    if (downloadData.appSlug) {
                        router.push(`/app/${downloadData.appSlug}`)
                    } else {
                        router.push('/')
                    }
                } catch (fallbackError) {
                    console.error('❌ Fallback redirect error:', fallbackError)
                    window.location.href = '/'
                }
            }, 5000)
        }
    }, []) // Remove dependencies to prevent re-renders

    const startCountdown = useCallback(() => {
        console.log('⏰ Starting countdown with current value:', countdown)
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current)
        }
        
        countdownIntervalRef.current = setInterval(() => {
            setCountdown(prev => {
                console.log('⏰ Countdown tick:', prev)
                if (prev <= 1) {
                    console.log('⏰ Countdown finished')
                    clearInterval(countdownIntervalRef.current)
                    setCanSkip(true)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
    }, []) // Remove countdown dependency to prevent re-renders

    const loadAdScript = useCallback(async (scriptUrl) => {
        return new Promise((resolve, reject) => {
            if (scriptLoadedRef.current) {
                resolve()
                return
            }
            
            const script = document.createElement('script')
            script.src = scriptUrl
            script.async = true
            script.onload = () => {
                scriptLoadedRef.current = true
                setAdLoaded(true)
                resolve()
            }
            script.onerror = () => {
                console.error('Failed to load ad script')
                reject(new Error('Script loading failed'))
            }
            
            document.head.appendChild(script)
        })
    }, [])
    
    const loadRealAdNetworks = useCallback(async () => {
        if (!adContainerRef.current) {
            console.log('❌ Ad container not available')
            return { success: false, network: null }
        }
        
        // Priority order for ad networks (highest revenue first)
        const networkPriority = ['adsense', 'propellerads', 'adcash', 'hilltopads', 'popads']
        
        try {
            console.log('🔄 Trying real ad networks...')
            const result = await AdNetworksService.loadBestAvailableAd(
                adContainerRef.current, 
                networkPriority
            )
            
            if (result.success) {
                console.log('✅ Real ad network loaded:', result.network)
                // Track impression for revenue analytics
                await AdNetworksService.trackImpression(result.network, 'ad-redirect-' + Date.now())
                
                // Set longer countdown for real ads (more revenue)
                setCountdown(20)
            }
            
            return result
        } catch (error) {
            console.error('❌ Failed to load ad networks:', error)
            return { success: false, network: null }
        }
    }, [])

    const handleDirectDownload = useCallback(() => {
        try {
            console.log('📦 Starting direct download...')
            
            // Clear countdown if running
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current)
            }
            
            // If there's a direct link advertisement, redirect to it first
            if (advertisement?.crackmarket?.adFormat === 'direct_link' && advertisement?.crackmarket?.directLink) {
                console.log('🔗 Redirecting to ad link first:', advertisement.crackmarket.directLink)
                
                try {
                    // Track ad click
                    trackAdClick(advertisement)
                    
                    // Open ad in new tab and continue with download
                    window.open(advertisement.crackmarket.directLink, '_blank')
                    
                    // Small delay then proceed with download
                    setTimeout(() => {
                        proceedWithDownload()
                    }, 1000)
                } catch (adError) {
                    console.error('❌ Ad redirect error:', adError)
                    // Continue with download even if ad fails
                    proceedWithDownload()
                }
            } else {
                console.log('📦 No direct link ad, proceeding with download directly')
                proceedWithDownload()
            }
        } catch (error) {
            console.error('❌ Direct download error:', error)
            setError('Unable to process your download. Please try again.')
            
            // Fallback: try to proceed anyway
            setTimeout(() => {
                proceedWithDownload()
            }, 2000)
        }
    }, []) // Remove dependencies to prevent re-renders

    const loadAdvertisement = useCallback(async () => {
        try {
            console.log('🔄 Loading advertisement...')
            console.log('📦 Pending download:', pendingDownload)
            
            // Detect ad blockers first
            detectAdBlocker()
            
            // Try to load real ad networks first (for revenue)
            const adNetworkResult = await loadRealAdNetworks()
            
            if (adNetworkResult.success) {
                console.log('✅ Real ad network loaded:', adNetworkResult.network)
                // Real ad network loaded successfully
                setAdvertisement({
                    title: 'Advertisement',
                    description: 'Please wait for the advertisement to complete',
                    crackmarket: {
                        adFormat: 'script',
                        provider: adNetworkResult.network,
                        network: adNetworkResult.network
                    }
                })
                setAdLoaded(true)
                startCountdown()
                return
            }
            
            console.log('🔄 Trying API advertisements...')
            // Fallback to API advertisements
            try {
                console.log('📡 Calling API with params:', { type: 'download', placement: 'button_click' })
                const response = await api.getRandomAdvertisement({
                    type: 'download',
                    placement: 'button_click' // Cambiado para coincidir con tu publicidad
                })
                
                console.log('📊 API Response:', response)
                
                if (response.data && response.data.advertisement) {
                    console.log('✅ API advertisement loaded')
                    const adData = response.data.advertisement
                    console.log('📋 Advertisement data:', adData)
                    setAdvertisement(adData)
                    
                    // Set countdown based on advertisement duration
                    const adDuration = adData.settings?.countdown || 15
                    console.log('⏰ Advertisement countdown from DB:', adData.settings?.countdown)
                    console.log('⏰ Setting countdown to:', adDuration)
                    setCountdown(adDuration)
                    
                    // Load advertisement script or content
                    if (adData.crackmarket?.adFormat === 'script' && adData.crackmarket?.scriptUrl) {
                        try {
                            await loadAdScript(adData.crackmarket.scriptUrl)
                        } catch (scriptError) {
                            console.error('❌ Script loading failed:', scriptError)
                            setAdLoaded(true) // Continue without script
                        }
                    } else if (adData.crackmarket?.adFormat === 'direct_link') {
                        // For direct links, we'll redirect after countdown
                        console.log('🔗 Direct link advertisement loaded:', adData.crackmarket.directLink)
                        setAdLoaded(true)
                    } else {
                        // For other formats or no specific format, mark as loaded
                        setAdLoaded(true)
                    }
                    
                    // Start countdown after a small delay to ensure state is updated
                    setTimeout(() => {
                        console.log('⏰ Starting countdown with delay, current countdown value:', countdown)
                        startCountdown()
                    }, 100)
                    return
                }
            } catch (apiError) {
                console.error('❌ API advertisement error:', apiError)
            }
            
            console.log('⚠️ No advertisements available, using fallback')
            // No ads available, create a fallback ad
            setAdvertisement({
                title: 'Download Ready',
                description: 'Your download will start shortly',
                crackmarket: {
                    adFormat: 'fallback',
                    provider: 'CrackMarket'
                }
            })
            setAdLoaded(true)
            setCountdown(5) // Shorter countdown when no ads
            startCountdown()
        } catch (error) {
            console.error('❌ Error loading advertisement:', error)
            // If ad loading fails, still allow download but with shorter countdown
            setAdvertisement({
                title: 'Download Ready',
                description: 'Your download will start shortly',
                crackmarket: {
                    adFormat: 'fallback',
                    provider: 'CrackMarket'
                }
            })
            setCountdown(5)
            setAdLoaded(true)
            startCountdown()
        }
    }, []) // Remove dependencies to prevent infinite re-renders

    const handleEnhancedSkip = useCallback(() => {
        if (countdown > 5) {
            setCountdown(5)
        } else {
            handleDirectDownload()
        }
    }, []) // Remove dependencies to prevent re-renders

    // Initialize download data
    useEffect(() => {
        console.log('🚀 useAdRedirect hook initialized')
        
        const initializeDownload = () => {
            try {
                const storedDownload = sessionStorage.getItem('pendingDownload')
                console.log('📦 Stored download data:', storedDownload)
                
                if (!storedDownload) {
                    console.log('❌ No download information found')
                    setError('No download information found. Please try downloading again.')
                    
                    // Redirect to home after showing error
                    setTimeout(() => {
                        router.push('/')
                    }, 3000)
                    return
                }
                
                let downloadData
                try {
                    downloadData = JSON.parse(storedDownload)
                    console.log('📋 Parsed download data:', downloadData)
                } catch (parseError) {
                    console.error('❌ Invalid download data format:', parseError)
                    setError('Invalid download data format. Please try downloading again.')
                    
                    // Clear invalid data and redirect
                    sessionStorage.removeItem('pendingDownload')
                    setTimeout(() => {
                        router.push('/')
                    }, 3000)
                    return
                }
                
                // Validate required fields
                if (!downloadData.url) {
                    console.log('❌ Invalid download data - missing URL')
                    setError('Download URL not available. Please try downloading again.')
                    
                    // Clear invalid data and redirect
                    sessionStorage.removeItem('pendingDownload')
                    setTimeout(() => {
                        router.push('/')
                    }, 3000)
                    return
                }
                
                if (!downloadData.appName) {
                    console.log('❌ Invalid download data - missing app name')
                    setError('App information not available. Please try downloading again.')
                    
                    // Clear invalid data and redirect
                    sessionStorage.removeItem('pendingDownload')
                    setTimeout(() => {
                        router.push('/')
                    }, 3000)
                    return
                }
                
                // Validate URL format
                try {
                    new URL(downloadData.url)
                } catch (urlError) {
                    console.error('❌ Invalid URL format:', downloadData.url)
                    setError('Invalid download URL. Please try downloading again.')
                    
                    // Clear invalid data and redirect
                    sessionStorage.removeItem('pendingDownload')
                    setTimeout(() => {
                        router.push('/')
                    }, 3000)
                    return
                }
                
                console.log('✅ Download data validated:', downloadData.appName)
                setPendingDownload(downloadData)
                loadAdvertisement()
                
            } catch (error) {
                console.error('❌ Initialization error:', error)
                setError('Unable to process your download. Please try again.')
                
                // Fallback redirect
                setTimeout(() => {
                    router.push('/')
                }, 3000)
            }
        }
        
        // Delay initialization to avoid conflicts
        const timer = setTimeout(initializeDownload, 200)
        
        return () => {
            clearTimeout(timer)
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current)
            }
        }
    }, []) // Remove dependencies to prevent infinite re-renders

    return {
        // State
        countdown,
        advertisement,
        adLoaded,
        error,
        pendingDownload,
        canSkip,
        adBlockDetected,
        deviceType,
        
        // Refs
        adContainerRef,
        
        // Actions
        handleDirectDownload,
        handleEnhancedSkip,
        detectAdBlocker
    }
}
