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

    const proceedWithDownload = useCallback(async () => {
        try {
            console.log('📦 Proceeding with download verification...')
            const downloadData = pendingDownload || JSON.parse(sessionStorage.getItem('pendingDownload') || '{}')
            console.log('📝 Download data:', downloadData)
            
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
            
            // MANDATORY: Verify advertisement was viewed - NO BYPASS ALLOWED
            if (!advertisement?._id) {
                console.error('❌ CRITICAL: No advertisement ID - download blocked!')
                setError('Advertisement verification failed. Please refresh the page and try again.')
                
                // Force redirect back to try again
                setTimeout(() => {
                    if (downloadData.appSlug) {
                        router.push(`/app/${downloadData.appSlug}`)
                    } else {
                        router.push('/')
                    }
                }, 3000)
                return
            }
            
            console.log('🔐 Verifying advertisement view...')
            console.log('📝 Advertisement ID:', advertisement._id)
            
            try {
                console.log('📡 Sending verification request...')
                const requestData = {
                    adId: advertisement._id,
                    downloadToken: `download_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    downloadUrl: downloadData.url,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent
                }
                console.log('📝 Request data:', requestData)
                
                // Try to verify with backend first
                const response = await api.post('/advertisements/verify-view', requestData)
                console.log('📊 Verification response:', response)
                
                if (response.data?.success) {
                    console.log('✅ Download unlocked via backend verification')
                    
                    // Clear the pending download
                    sessionStorage.removeItem('pendingDownload')
                    
                    // Create a temporary link and trigger download
                    const link = document.createElement('a')
                    link.href = downloadData.url
                    link.download = downloadData.appName || 'download'
                    link.target = '_blank'
                    link.rel = 'noopener noreferrer'
                    
                    // Add to DOM, click, and remove
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    
                    console.log('✅ Download initiated for:', downloadData.appName)
                    
                    // Show success message briefly before redirect
                    setError(null)
                    
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
                            window.location.href = downloadData.appSlug ? `/app/${downloadData.appSlug}` : '/'
                        }
                    }, 3000)
                    
                } else {
                    console.error('❌ Backend verification failed - trying client-side verification')
                    
                    // Fallback: Client-side verification with stricter checks
                    const adViewTime = Date.now() - (advertisement.loadTime || Date.now())
                    const minimumViewTime = (advertisement.settings?.countdown || 5) * 1000 // Convert to milliseconds
                    
                    console.log('🕰️ Ad view time:', adViewTime, 'ms')
                    console.log('🕰️ Minimum required time:', minimumViewTime, 'ms')
                    
                    if (adViewTime >= minimumViewTime && canSkip) {
                        console.log('✅ Client-side verification passed - download unlocked')
                        
                        // Track the impression locally
                        try {
                            await api.post('/advertisements/track-impression', {
                                adId: advertisement._id,
                                viewTime: adViewTime,
                                timestamp: new Date().toISOString()
                            })
                        } catch (trackError) {
                            console.warn('⚠️ Failed to track impression:', trackError)
                        }
                        
                        // Clear the pending download
                        sessionStorage.removeItem('pendingDownload')
                        
                        // Create a temporary link and trigger download
                        const link = document.createElement('a')
                        link.href = downloadData.url
                        link.download = downloadData.appName || 'download'
                        link.target = '_blank'
                        link.rel = 'noopener noreferrer'
                        
                        // Add to DOM, click, and remove
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                        
                        console.log('✅ Download initiated for:', downloadData.appName)
                        
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
                                window.location.href = downloadData.appSlug ? `/app/${downloadData.appSlug}` : '/'
                            }
                        }, 3000)
                        
                    } else {
                        console.error('❌ Client-side verification failed - insufficient view time or countdown not finished')
                        setError('Please wait for the advertisement to complete before downloading.')
                        return
                    }
                }
                
            } catch (verifyError) {
                console.error('❌ Verification error:', verifyError)
                setError('Unable to verify advertisement view. Please wait for the countdown to finish.')
                return
            }
            
        } catch (error) {
            console.error('❌ Download error:', error)
            setError('Unable to process your download. Please try again.')
        }
    }, [advertisement, pendingDownload, canSkip, router])

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
            console.log('📜 Attempting to load script:', scriptUrl)
            
            if (scriptLoadedRef.current) {
                console.log('✅ Script already loaded')
                resolve()
                return
            }
            
            // Clean up any existing scripts first
            const existingScripts = document.querySelectorAll(`script[src="${scriptUrl}"]`)
            existingScripts.forEach(script => script.remove())
            
            const script = document.createElement('script')
            script.src = scriptUrl
            script.async = true
            script.type = 'text/javascript'
            
            script.onload = () => {
                console.log('✅ Script loaded successfully:', scriptUrl)
                scriptLoadedRef.current = true
                setAdLoaded(true)
                
                // Try to initialize the ad if there's a container
                setTimeout(() => {
                    if (adContainerRef.current) {
                        console.log('🎯 Ad container found, script should initialize')
                    }
                }, 1000)
                
                resolve()
            }
            
            script.onerror = (error) => {
                console.error('❌ Failed to load ad script:', scriptUrl, error)
                setAdLoaded(true) // Mark as loaded anyway to continue
                reject(new Error(`Script loading failed: ${scriptUrl}`))
            }
            
            // Add script to head
            document.head.appendChild(script)
            console.log('📜 Script element added to DOM')
            
            // Fallback timeout
            setTimeout(() => {
                if (!scriptLoadedRef.current) {
                    console.log('⚠️ Script loading timeout, marking as loaded anyway')
                    setAdLoaded(true)
                    resolve()
                }
            }, 5000)
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

    const loadAdvertisement = useCallback(async () => {
        try {
            console.log('📡 Loading advertisement...')
            
            // First detect ad blockers
            detectAdBlocker()
            
            console.log('🔄 Trying real ad networks first...')
            // Try real ad networks first for revenue
            const adNetworkResult = await loadRealAdNetworks()
            if (adNetworkResult.success) {
                console.log('✅ Real ad network loaded successfully')
                setAdvertisement({
                    title: 'Advertisement',
                    description: 'Please view this advertisement to support our service',
                    loadTime: Date.now(),
                    crackmarket: {
                        adFormat: 'network',
                        provider: adNetworkResult.network
                    }
                })
                setAdLoaded(true)
                setCountdown(15) // Standard countdown for network ads
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
                    console.log('📝 Advertisement data:', adData)
                    console.log('🆔 Advertisement ID:', adData._id)
                    
                    // Add load time for verification
                    adData.loadTime = Date.now()
                    console.log('🕰️ Advertisement load time set:', adData.loadTime)
                    
                    setAdvertisement(adData)
                    
                    // Set countdown based on advertisement duration
                    const adDuration = adData.settings?.countdown || 15
                    console.log('⏰ Advertisement countdown from DB:', adData.settings?.countdown)
                    console.log('⏰ Setting countdown to:', adDuration)
                    setCountdown(adDuration)
                    
                    // Load advertisement script or content - prioritize crackmarket format
                    if (adData.crackmarket?.adFormat === 'direct_link' && adData.crackmarket?.directLink) {
                        // For direct links, no script loading needed
                        console.log('🔗 Direct link advertisement detected:', adData.crackmarket.directLink)
                        console.log('📝 Ad format is direct_link, no script loading required')
                        setAdLoaded(true)
                    } else if (adData.crackmarket?.adFormat === 'script' && adData.crackmarket?.scriptUrl) {
                        console.log('📜 Loading crackmarket script:', adData.crackmarket.scriptUrl)
                        try {
                            await loadAdScript(adData.crackmarket.scriptUrl)
                            console.log('✅ Crackmarket script loaded successfully')
                        } catch (scriptError) {
                            console.error('❌ Script loading failed:', scriptError)
                            setAdLoaded(true) // Continue without script
                        }
                    } else if (adData.script && !adData.crackmarket?.adFormat) {
                        // Only load script if no crackmarket format is specified
                        console.log('📜 Loading script advertisement:', adData.script)
                        try {
                            await loadAdScript(adData.script)
                            console.log('✅ Script advertisement loaded successfully')
                        } catch (scriptError) {
                            console.error('❌ Script loading failed:', scriptError)
                            setAdLoaded(true) // Continue without script
                        }
                    } else {
                        // For other formats or no specific format, mark as loaded
                        console.log('📝 No script needed, marking as loaded')
                        console.log('📝 Ad data format:', adData.crackmarket?.adFormat || 'none')
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
            const fallbackAd = {
                title: 'Download Ready',
                description: 'Your download will start shortly',
                loadTime: Date.now(),
                crackmarket: {
                    adFormat: 'fallback',
                    provider: 'CrackMarket'
                }
            }
            console.log('🕰️ Fallback ad load time set:', fallbackAd.loadTime)
            setAdvertisement(fallbackAd)
            setAdLoaded(true)
            setCountdown(5) // Shorter countdown when no ads
            startCountdown()
        } catch (error) {
            console.error('❌ Error loading advertisement:', error)
            // If ad loading fails, still allow download but with shorter countdown
            const errorFallbackAd = {
                title: 'Download Ready',
                description: 'Your download will start shortly',
                loadTime: Date.now(),
                crackmarket: {
                    adFormat: 'fallback',
                    provider: 'CrackMarket'
                }
            }
            console.log('🕰️ Error fallback ad load time set:', errorFallbackAd.loadTime)
            setAdvertisement(errorFallbackAd)
            setCountdown(5)
            setAdLoaded(true)
            startCountdown()
        }
    }, []) // Remove dependencies to prevent infinite re-renders

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

    // Handle direct download with ad verification
    const handleDirectDownload = useCallback(async () => {
        console.log('📥 Starting download process...')
        console.log('📝 Advertisement state:', advertisement)
        console.log('🕰️ Advertisement load time:', advertisement?.loadTime)
        
        if (!advertisement) {
            console.log('❌ No advertisement loaded, blocking download')
            setError('Advertisement verification failed. Please refresh and try again.')
            return
        }
        
                 // Calculate viewing time
         const currentTime = Date.now()
         const adLoadTime = advertisement.loadTime || currentTime
         const viewingTime = currentTime - adLoadTime
         const minimumViewTime = 5000 // 5 seconds minimum (reduced from 10)
        
        console.log('🕰️ Current time:', currentTime)
        console.log('🕰️ Ad load time:', adLoadTime)
        console.log('🕰️ Viewing time:', viewingTime, 'ms')
        console.log('🕰️ Minimum required:', minimumViewTime, 'ms')
        
        try {
            // First try backend verification if we have an ad ID
            if (advertisement._id) {
                console.log('📡 Attempting backend verification...')
                try {
                    const verificationData = {
                        adId: advertisement._id,
                        downloadToken: pendingDownload?.token || 'direct',
                        downloadUrl: pendingDownload?.url,
                        userAgent: navigator.userAgent,
                        referrer: document.referrer,
                        viewingTime: viewingTime,
                        deviceType: deviceType,
                        timestamp: currentTime
                    }
                    
                    console.log('📝 Verification data:', verificationData)
                    
                                         const response = await api.post('/advertisements/verify-view', verificationData)
                     console.log('📊 Backend verification response:', response)
                     
                     if (response.data?.success || response.success) {
                         console.log('✅ Backend verification successful')
                         await initiateDownload()
                         return
                     } else {
                         console.log('⚠️ Backend verification failed:', response.message || response.data?.message)
                         console.log('🔄 Falling back to client-side verification')
                     }
                } catch (backendError) {
                    console.error('❌ Backend verification error:', backendError)
                    console.log('🔄 Falling back to client-side verification')
                }
            }
            
            // Fallback to client-side verification
            console.log('💻 Performing client-side verification...')
            
                         // Check if countdown has finished
             if (!canSkip) {
                 console.log('❌ Countdown not finished, blocking download')
                 setError('Please wait for the countdown to finish before downloading.')
                 return
             }
             
             // If countdown finished, allow download regardless of viewing time
             console.log('✅ Countdown finished, allowing download')
             await initiateDownload()
             return
            
            console.log('✅ Client-side verification passed')
            await initiateDownload()
            
        } catch (error) {
            console.error('❌ Download verification error:', error)
            setError('Download verification failed. Please try again.')
        }
    }, [advertisement, pendingDownload, canSkip, deviceType])
    
    // Initiate the actual download
    const initiateDownload = useCallback(async () => {
        console.log('🚀 Initiating download...')
        
        if (!pendingDownload?.url) {
            console.log('❌ No download URL available')
            setError('Download URL not available. Please try again.')
            return
        }
        
        try {
                         // Track impression if we have an ad ID
             if (advertisement?._id) {
                 try {
                     await api.post(`/advertisements/${advertisement._id}/impression`, {
                         action: 'download_initiated',
                         metadata: {
                             appName: pendingDownload.appName,
                             downloadUrl: pendingDownload.url,
                             deviceType: deviceType
                         }
                     })
                     console.log('📊 Impression tracked successfully')
                 } catch (trackingError) {
                     console.error('⚠️ Impression tracking failed:', trackingError)
                     // Don't block download for tracking failures
                 }
             }
            
            // Start the download
            console.log('📥 Starting download:', pendingDownload.url)
            
            // Create download link
            const link = document.createElement('a')
            link.href = pendingDownload.url
            link.download = pendingDownload.filename || pendingDownload.appName || 'download'
            link.target = '_blank'
            link.rel = 'noopener noreferrer'
            
            // Trigger download
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            
            console.log('✅ Download initiated successfully')
            
            // Clear download data
            sessionStorage.removeItem('pendingDownload')
            
            // Redirect after download
            setTimeout(() => {
                if (pendingDownload.returnUrl) {
                    router.push(pendingDownload.returnUrl)
                } else {
                    router.push('/')
                }
            }, 2000)
            
        } catch (error) {
            console.error('❌ Download initiation error:', error)
            setError('Failed to start download. Please try again.')
        }
    }, [pendingDownload, advertisement, deviceType, router])
    
    // Enhanced skip function with verification
    const handleEnhancedSkip = useCallback(async () => {
        console.log('⏭️ Enhanced skip requested')
        
        if (!canSkip) {
            console.log('❌ Skip not allowed yet')
            setError('Please wait for the countdown to finish.')
            return
        }
        
        await handleDirectDownload()
    }, [canSkip, handleDirectDownload])

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
