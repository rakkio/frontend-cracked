'use client'

import { useState, useEffect, useRef } from 'react'
import { useAdvertising } from '@/contexts/AdvertisingContext'
import { api } from '@/lib/api'
import { FaTimes, FaSpinner, FaExclamationTriangle, FaDownload, FaInfoCircle, FaTerminal, FaShieldAlt } from 'react-icons/fa'

export default function AdModal() {
    const {
        isAdModalOpen,
        pendingDownload,
        adTimer,
        canProceed,
        closeAdModal,
        proceedWithDownload,
        markAdViewed
    } = useAdvertising()

    const [advertisement, setAdvertisement] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)  // Add error state
    const [adViewed, setAdViewed] = useState(false)
    const [scriptLoaded, setScriptLoaded] = useState(false)
    const [scriptError, setScriptError] = useState(false)
    const [verificationPassed, setVerificationPassed] = useState(false)
    const modalRef = useRef()
    const scriptContainerRef = useRef()

    // Debug: Log when modal state changes
    console.log('=== AdModal Render ===')
    console.log('isAdModalOpen:', isAdModalOpen)
    console.log('pendingDownload:', pendingDownload)
    console.log('advertisement:', advertisement)
    console.log('loading:', loading)

    // Load advertisement when modal opens
    useEffect(() => {
        console.log('=== useEffect [isAdModalOpen, pendingDownload, advertisement] ===')
        console.log('isAdModalOpen:', isAdModalOpen)
        console.log('pendingDownload:', pendingDownload) 
        console.log('advertisement:', advertisement)
        
        if (isAdModalOpen && pendingDownload && !advertisement && !loading && !error) {  // Don't retry if error
            console.log('📢 Calling loadAdvertisement()')
            loadAdvertisement()
        } else {
            console.log('🚫 Not calling loadAdvertisement because:')
            console.log('  - isAdModalOpen:', isAdModalOpen)
            console.log('  - pendingDownload:', !!pendingDownload)
            console.log('  - advertisement:', !!advertisement)
            console.log('  - loading:', loading)
            console.log('  - error:', !!error)  // Add error to logs
        }
    }, [isAdModalOpen, pendingDownload, advertisement, loading, error])  // Add error to dependencies

    // Load and inject script when advertisement is loaded
    useEffect(() => {
        console.log('=== useEffect [advertisement] triggered ===')
        console.log('advertisement exists:', !!advertisement)
        console.log('scriptLoaded:', scriptLoaded) 
        console.log('scriptError:', scriptError)
        
        if (advertisement && !scriptLoaded && !scriptError) {
            console.log('🎯 Calling loadAdScript()!')
            loadAdScript()
        } else {
            console.log('🚫 NOT calling loadAdScript because:')
            console.log('  - advertisement:', !!advertisement)
            console.log('  - scriptLoaded:', scriptLoaded)
            console.log('  - scriptError:', scriptError)
        }
    }, [advertisement, scriptLoaded, scriptError])  // Add dependencies

    // Clean up script when modal closes
    useEffect(() => {
        console.log('=== useEffect [isAdModalOpen] triggered ===')
        console.log('isAdModalOpen:', isAdModalOpen)
        
        if (!isAdModalOpen) {
            console.log('🧹 Modal closed, cleaning up...')
            cleanupScript()
            resetState()
        } else {
            console.log('✅ Modal is open, no cleanup needed')
        }
    }, [isAdModalOpen])

    const resetState = () => {
        console.log('🔄 resetState() called - resetting all states')
        setAdvertisement(null)
        setLoading(false)
        setError(null)
        setScriptLoaded(false)
        setScriptError(false)
        setVerificationPassed(false)
    }

    const loadAdvertisement = async () => {
        try {
            setLoading(true)
            setError(null)
            
            console.log('=== Loading Advertisement ===')
            console.log('Pending download:', pendingDownload)

            // Set a fallback timeout - if no response in 10 seconds, proceed with download
            const fallbackTimeout = setTimeout(() => {
                console.log('⏰ Advertisement loading timeout - proceeding with download...')
                handleFallbackDownload('Advertisement loading timeout')
            }, 10000)

            // Try multiple placements to find active ads
            const placements = ['before_download', 'button_click', 'after_download']
            let advertisement = null
            
            for (const placement of placements) {
                try {
                    const requestParams = {
                        type: 'download',
                        placement: placement,
                        page: window.location.pathname
                    }
                    console.log('API request params:', requestParams)
                    console.log(`Searching for ads with placement: ${placement}`)

                    // Add timeout to the API request
                    const controller = new AbortController()
                    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout per request

                    const response = await api.getActiveAdvertisement(requestParams)
                    clearTimeout(timeoutId)
                    console.log('API response:', response)
                    
                    if (response?.data?.advertisement) {
                        advertisement = response.data.advertisement
                        console.log(`✅ Found advertisement with placement: ${placement}`)
                        break
                    }
                } catch (error) {
                    console.log(`❌ No ads found for placement: ${placement} - ${error.message}`)
                    continue
                }
            }
            
            // Clear the fallback timeout since we got a response
            clearTimeout(fallbackTimeout)
            
            if (!advertisement) {
                console.log('❌ No advertisements found with any placement')
                console.log('💡 Make sure you have an active advertisement with:')
                console.log('   - type: "download"')
                console.log('   - placement: "before_download", "button_click", or "after_download"') 
                console.log('   - isActive: true')
                
                handleFallbackDownload('No active advertisements found')
                return
            }

            console.log('Advertisement loaded:', advertisement)
            setAdvertisement(advertisement)

            // Track impression
            try {
                await api.trackAdvertisementImpression(advertisement._id)
                console.log('Impression tracked for ad:', advertisement._id)
            } catch (trackError) {
                console.warn('Failed to track impression:', trackError)
            }
        } catch (error) {
            console.error('❌ Error loading advertisement:', error)
            handleFallbackDownload(`Advertisement loading error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleFallbackDownload = (reason) => {
        console.log(`🎯 Handling fallback download: ${reason}`)
        setError(`${reason} - Proceeding with download...`)
        
        // Show fallback message for 2 seconds then proceed
        setTimeout(() => {
            console.log('🎯 Proceeding with fallback download')
            const download = proceedWithDownload()
            if (download) {
                closeAdModal()
                window.open(download.downloadUrl, '_blank')
            }
        }, 2000)
    }

    const loadAdScript = () => {
        console.log('=== loadAdScript() called ===')
        console.log('advertisement exists:', !!advertisement)
        console.log('advertisement.script exists:', !!advertisement?.script)
        console.log('scriptContainerRef.current exists:', !!scriptContainerRef.current)
        
        if (!advertisement?.script || !scriptContainerRef.current) {
            console.log('❌ Missing requirements for script loading:')
            console.log('  - advertisement?.script:', !!advertisement?.script)
            console.log('  - scriptContainerRef.current:', !!scriptContainerRef.current)
            return
        }

        try {
            console.log('=== Loading Ad Script ===')
            console.log('Script content preview:', advertisement.script.substring(0, 100) + '...')
            
            // Clear container
            scriptContainerRef.current.innerHTML = ''

            // Check if script is just a URL or a complete script
            const isUrl = advertisement.script.startsWith('http://') || advertisement.script.startsWith('https://')
            
            if (isUrl) {
                console.log('🔗 Script is a URL, creating external script tag')
                
                // Create external script element
                const scriptElement = document.createElement('script')
                scriptElement.src = advertisement.script
                scriptElement.type = 'text/javascript'
                scriptElement.async = true
                
                scriptElement.onload = () => {
                    console.log('✅ External script loaded successfully')
                    setScriptLoaded(true)
                    startAdTimer()
                }
                
                scriptElement.onerror = () => {
                    console.error('❌ Failed to load external script')
                    setScriptError(true)
                }
                
                // Add to container
                scriptContainerRef.current.appendChild(scriptElement)
                console.log('📄 External script added to DOM')
                
            } else {
                console.log('📜 Script is HTML content, parsing for script tags')
                
                // Create container for the script
                const scriptContainer = document.createElement('div')
                scriptContainer.innerHTML = advertisement.script

                // Find and execute script tags
                const scripts = scriptContainer.getElementsByTagName('script')
                console.log('Found', scripts.length, 'script tags')

                if (scripts.length === 0) {
                    // No script tags, just insert content as HTML
                    scriptContainerRef.current.appendChild(scriptContainer)
                    console.log('✅ No script tags, inserted as HTML content')
                    setScriptLoaded(true)
                    startAdTimer()
                    return
                }

                // Execute each script
                let executedScripts = 0
                Array.from(scripts).forEach((oldScript, index) => {
                    const newScript = document.createElement('script')
                    
                    console.log(`Processing script ${index + 1}:`)
                    console.log('- Has src:', !!oldScript.src)
                    console.log('- Has content:', !!oldScript.textContent)
                    
                    // Copy attributes
                    Array.from(oldScript.attributes).forEach(attr => {
                        newScript.setAttribute(attr.name, attr.value)
                    })

                    if (oldScript.src) {
                        // External script - use onload
                        newScript.onload = () => {
                            console.log(`✅ External script ${index + 1} loaded`)
                            executedScripts++
                            if (executedScripts === scripts.length) {
                                setScriptLoaded(true)
                                startAdTimer()
                            }
                        }

                        newScript.onerror = () => {
                            console.error(`❌ External script ${index + 1} failed`)
                            setScriptError(true)
                        }

                        newScript.src = oldScript.src
                    } else {
                        // Inline script - execute immediately 
                        newScript.textContent = oldScript.textContent
                        console.log(`✅ Inline script ${index + 1} ready for execution`)
                        executedScripts++
                    }

                    // Add to container (this will execute inline scripts)
                    scriptContainerRef.current.appendChild(newScript)
                    console.log(`📄 Script ${index + 1} appended to DOM`)
                })

                // Add non-script content
                const nonScriptContent = scriptContainer.cloneNode(true)
                Array.from(nonScriptContent.getElementsByTagName('script')).forEach(script => {
                    script.remove()
                })
                
                if (nonScriptContent.innerHTML.trim()) {
                    scriptContainerRef.current.appendChild(nonScriptContent)
                    console.log('📄 Non-script content added')
                }

                // For inline scripts, consider them loaded immediately
                const inlineScripts = Array.from(scripts).filter(s => !s.src)
                if (inlineScripts.length > 0 && executedScripts >= inlineScripts.length) {
                    console.log('✅ All inline scripts executed, starting timer')
                    setScriptLoaded(true)
                    startAdTimer()
                }

                // Set timeout for external script loading
                if (Array.from(scripts).some(s => s.src)) {
                    setTimeout(() => {
                        if (!scriptLoaded && !scriptError) {
                            console.warn('⏰ Ad script loading timeout')
                            setScriptError(true)
                        }
                    }, 10000) // 10 second timeout
                }
            }

        } catch (error) {
            console.error('❌ Error injecting ad script:', error)
            setScriptError(true)
        }
    }

    const startAdTimer = () => {
        // Mark ad as viewed and start countdown
        const countdown = markAdViewed()
        
        // Check for verification if required
        if (advertisement?.settings?.verificationRequired) {
            checkAdVerification()
        } else {
            setVerificationPassed(true)
        }

        return countdown
    }

    // Auto-proceed when timer finishes
    useEffect(() => {
        if (canProceed && verificationPassed && adViewed && adTimer === 0) {
            console.log('🎯 Auto-proceeding with download after countdown...')
            
            // Small delay to show completion state
            setTimeout(() => {
                handleProceed()
            }, 1000)
        }
    }, [canProceed, verificationPassed, adViewed, adTimer])

    const checkAdVerification = () => {
        // Simple verification check - look for expected ad elements or behavior
        const verifyInterval = setInterval(() => {
            try {
                // Check if ad container has expected content
                const adContainer = scriptContainerRef.current
                if (adContainer) {
                    const hasVisibleElements = adContainer.children.length > 0
                    const hasInteractiveElements = adContainer.querySelectorAll('a, button, iframe').length > 0
                    
                    if (hasVisibleElements || hasInteractiveElements) {
                        setVerificationPassed(true)
                        clearInterval(verifyInterval)
                        return
                    }
                }

                // Check for global ad variables/functions (common in ad scripts)
                const commonAdGlobals = ['googletag', 'adnxs', 'pbjs', '__gads', '_gaq']
                const hasAdGlobals = commonAdGlobals.some(global => window[global])
                
                if (hasAdGlobals) {
                    setVerificationPassed(true)
                    clearInterval(verifyInterval)
                }
            } catch (error) {
                console.warn('Ad verification check failed:', error)
            }
        }, 1000)

        // Clear interval after 10 seconds
        setTimeout(() => {
            clearInterval(verifyInterval)
            if (!verificationPassed) {
                setVerificationPassed(true) // Allow proceed anyway
            }
        }, 10000)
    }

    const cleanupScript = () => {
        if (scriptContainerRef.current) {
            scriptContainerRef.current.innerHTML = ''
        }
        
        // Clean up potential global variables created by ad scripts
        try {
            // Remove common ad-related globals if they were added
            const adGlobalsToClean = ['_gvnydm', '_gmgcaxmp']
            adGlobalsToClean.forEach(global => {
                if (window[global] && typeof window[global] === 'function') {
                    try {
                        delete window[global]
                    } catch (e) {
                        window[global] = undefined
                    }
                }
            })
        } catch (error) {
            console.warn('Error cleaning up ad globals:', error)
        }
    }

    const handleProceed = async () => {
        if (!canProceed) return

        try {
            // Track click
            if (advertisement?._id) {
                await api.trackAdvertisementClick(advertisement._id)
                console.log('Click tracked for ad:', advertisement._id)
            }

            const download = proceedWithDownload()
            if (download) {
                closeAdModal()
                
                // 🎯 Use crackmarket.xyz direct link if available
                let finalUrl = download.downloadUrl
                
                if (advertisement?.crackmarket?.enabled && 
                    advertisement?.crackmarket?.adFormat === 'direct_link' && 
                    advertisement?.crackmarket?.directLink) {
                    finalUrl = advertisement.crackmarket.directLink
                    console.log('🎯 Using crackmarket direct link:', finalUrl)
                } else {
                    console.log('🎯 Using original download URL:', finalUrl)
                }
                
                window.open(finalUrl, '_blank')
                
                // Track conversion
                if (advertisement?._id) {
                    await api.trackAdvertisementConversion(advertisement._id)
                    console.log('Conversion tracked for ad:', advertisement._id)
                }
            }
        } catch (error) {
            console.error('Error in handleProceed:', error)
        }
    }

    const handleAdClick = async (event) => {
        // Track ad click if user interacts with the ad
        if (advertisement?._id) {
            try {
                await api.trackAdvertisementClick(advertisement._id)
            } catch (trackError) {
                console.warn('Failed to track click:', trackError)
            }
        }
    }

    const triggerDownload = (downloadData) => {
        if (downloadData.downloadUrl) {
            // Create temporary link for download
            const link = document.createElement('a')
            link.href = downloadData.downloadUrl
            link.download = downloadData.name || 'download'
            link.target = '_blank'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } else if (downloadData.slug) {
            // Navigate to app page if no direct download URL
            window.open(`/app/${downloadData.slug}`, '_blank')
        }
    }

    const canClose = advertisement?.settings?.closable || scriptError || error

    if (!isAdModalOpen) {
        console.log('❌ Modal not open, returning null')
        return null
    }

    console.log('✅ Modal is open, rendering modal')

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
            {/* Matrix Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="matrix-rain opacity-10"></div>
                <div className="scan-lines"></div>
            </div>

            <div 
                ref={modalRef}
                className="relative bg-black/95 border-2 border-red-500 max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl backdrop-blur-md"
            >
                {/* Corner Brackets */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-red-500"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-red-500"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-red-500"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-red-500"></div>

                {/* Scan Lines Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent animate-pulse"></div>

                {/* Header */}
                <div className="relative flex items-center justify-between p-6 border-b-2 border-red-500 bg-gradient-to-r from-red-900/20 to-transparent">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-500 blur-lg opacity-50"></div>
                            <div className="relative bg-black border border-red-500 p-2">
                                <FaTerminal className="text-red-500" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-red-400 font-mono">
                                [DOWNLOAD_PROTOCOL]
                            </h2>
                            <p className="text-gray-400 font-mono text-sm">
                                {loading ? 'INITIALIZING...' : 
                                 error ? 'ERROR_DETECTED' :
                                 advertisement ? 'AD_LOADED' : 
                                 'PREPARING_DOWNLOAD'}
                            </p>
                        </div>
                    </div>
                    
                    {canClose && (
                        <button
                            onClick={closeAdModal}
                            className="text-gray-400 hover:text-red-400 text-xl transition-colors p-2 border border-red-500/50 hover:border-red-500 hover:bg-red-500/10"
                        >
                            <FaTimes />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="relative p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
                    {loading && (
                        <div className="text-center py-16">
                            <div className="relative inline-block">
                                <div className="absolute inset-0 bg-red-500 blur-xl opacity-30 animate-pulse"></div>
                                <FaSpinner className="relative text-6xl text-red-500 animate-spin" />
                            </div>
                            <h3 className="text-2xl font-bold text-red-400 mb-4 mt-6 font-mono">
                                [LOADING_ADVERTISEMENT]
                            </h3>
                            <div className="space-y-2 text-gray-400 font-mono text-sm">
                                <p className="animate-pulse"> Connecting to ad server...</p>
                                <p className="animate-pulse" style={{animationDelay: '0.5s'}}> Fetching content...</p>
                                <p className="animate-pulse" style={{animationDelay: '1s'}}>Preparing display...</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-16">
                            <div className="relative inline-block mb-6">
                                <div className="absolute inset-0 bg-yellow-500 blur-xl opacity-30 animate-pulse"></div>
                                <FaExclamationTriangle className="relative text-6xl text-yellow-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-yellow-400 mb-4 font-mono">
                                [ERROR_DETECTED]
                            </h3>
                            <p className="text-yellow-300 mb-6 font-mono">{error}</p>
                            <div className="bg-red-900/20 border-2 border-red-500 p-6 mb-6">
                                <div className="flex items-start space-x-3">
                                    <FaShieldAlt className="text-red-500 mt-1" />
                                    <div className="text-left">
                                        <p className="text-red-300 font-mono text-sm mb-2">
                                            <strong>[SYSTEM_MESSAGE]</strong> Download will proceed automatically.
                                        </p>
                                        <p className="text-gray-300 font-mono text-xs">
                                            Advertisement system temporarily unavailable. Your download is not affected.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-400 font-mono text-sm animate-pulse">
                               Initiating download sequence...
                            </p>
                        </div>
                    )}

                    {scriptError && (
                        <div className="text-center py-16">
                            <div className="relative inline-block mb-6">
                                <div className="absolute inset-0 bg-yellow-500 blur-xl opacity-30 animate-pulse"></div>
                                <FaExclamationTriangle className="relative text-6xl text-yellow-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-yellow-400 mb-4 font-mono">
                                [SCRIPT_ERROR]
                            </h3>
                            <p className="text-yellow-300 mb-6 font-mono">Advertisement could not be loaded</p>
                            <button
                                onClick={handleProceed}
                                className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-mono font-bold border-2 border-red-500 hover:border-red-400 transition-all duration-300 transform hover:scale-105"
                            >
                                [CONTINUE_DOWNLOAD]
                            </button>
                        </div>
                    )}

                    {advertisement && !loading && !error && !scriptError && (
                        <div className="space-y-6">
                            {/* Advertisement Container */}
                            <div className="relative">
                                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500"></div>
                                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-500"></div>
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-500"></div>
                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500"></div>
                                
                                <div 
                                    ref={scriptContainerRef}
                                    onClick={handleAdClick}
                                    className="min-h-[300px] bg-gray-900/50 border border-red-500/30 overflow-hidden backdrop-blur-sm"
                                    style={{ minHeight: '300px' }}
                                />
                            </div>

                            {/* Timer and Proceed Section */}
                            <div className="space-y-6">
                                {/* Countdown Display */}
                                <div className="text-center bg-black/50 border border-red-500/30 p-6">
                                    {!scriptLoaded ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-center space-x-3">
                                                <FaSpinner className="animate-spin text-red-500 text-2xl" />
                                                <span className="text-red-400 font-mono text-lg">LOADING_ADVERTISEMENT...</span>
                                            </div>
                                            <div className="w-full bg-gray-800 h-2 overflow-hidden">
                                                <div className="w-full h-full bg-gradient-to-r from-red-500 to-orange-500 animate-pulse"></div>
                                            </div>
                                        </div>
                                    ) : !verificationPassed ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-center space-x-3">
                                                <FaSpinner className="animate-spin text-yellow-500 text-2xl" />
                                                <span className="text-yellow-400 font-mono text-lg">VERIFYING_CONTENT...</span>
                                            </div>
                                            <div className="w-full bg-gray-800 h-2 overflow-hidden">
                                                <div className="w-1/3 h-full bg-gradient-to-r from-yellow-500 to-orange-500 animate-pulse"></div>
                                            </div>
                                        </div>
                                    ) : adTimer > 0 ? (
                                        <div className="space-y-6">
                                            <div className="relative">
                                                <div className="text-8xl font-bold text-red-500 mb-4 font-mono">
                                                    {adTimer}
                                                </div>
                                                <div className="text-gray-300 text-xl font-mono">
                                                    SECONDS_REMAINING
                                                </div>
                                            </div>
                                            <div className="w-full bg-gray-800 h-4 overflow-hidden border border-red-500/30">
                                                <div 
                                                    className="bg-gradient-to-r from-red-500 to-orange-500 h-4 transition-all duration-1000 ease-linear"
                                                    style={{
                                                        width: `${((advertisement.settings?.countdown || 15) - adTimer) / (advertisement.settings?.countdown || 15) * 100}%`
                                                    }}
                                                />
                                            </div>
                                            <p className="text-gray-400 font-mono text-sm">
                                                Please wait while the advertisement loads...
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="text-6xl font-bold text-green-500 mb-4 font-mono">
                                                [READY]
                                            </div>
                                            <div className="text-gray-300 text-xl font-mono mb-4">
                                                DOWNLOAD_AUTHORIZED
                                            </div>
                                            <div className="flex items-center justify-center space-x-3">
                                                <FaSpinner className="animate-spin text-green-500" />
                                                <span className="text-green-400 font-mono">Preparing download...</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Download Button */}
                                <div className="text-center">
                                    <button
                                        onClick={handleProceed}
                                        disabled={!canProceed || !verificationPassed}
                                        className={`px-12 py-6 font-bold text-xl font-mono transition-all duration-300 transform border-2 ${
                                            canProceed && verificationPassed
                                                ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-black border-green-500 hover:border-green-400 cursor-pointer hover:scale-105 shadow-lg'
                                                : 'bg-gray-800 text-gray-500 border-gray-600 cursor-not-allowed opacity-50'
                                        }`}
                                    >
                                        {canProceed && verificationPassed ? (
                                            <div className="flex items-center space-x-3">
                                                <FaDownload />
                                                <span>[DOWNLOAD_{pendingDownload?.name?.toUpperCase() || 'NOW'}]</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-3">
                                                <FaSpinner className="animate-spin" />
                                                <span>[PLEASE_WAIT...]</span>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="bg-blue-900/20 border-2 border-blue-500/30 p-6">
                                <div className="flex items-start space-x-3">
                                    <FaInfoCircle className="text-blue-400 mt-1 flex-shrink-0" />
                                    <div className="font-mono text-sm">
                                        <p className="text-blue-300 font-bold mb-3">[DOWNLOAD_PROTOCOL]:</p>
                                        <ol className="text-blue-200 space-y-2">
                                            <li className="flex items-center space-x-2">
                                                <span className="text-blue-400">1.</span>
                                                <span>Advertisement loads and displays above</span>
                                            </li>
                                            <li className="flex items-center space-x-2">
                                                <span className="text-blue-400">2.</span>
                                                <span>Wait for the {advertisement.settings?.countdown || 15}-second countdown to complete</span>
                                            </li>
                                            <li className="flex items-center space-x-2">
                                                <span className="text-blue-400">3.</span>
                                                <span>Download starts automatically or click the download button</span>
                                            </li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .matrix-rain {
                    background: linear-gradient(0deg, transparent 24%, rgba(255, 0, 0, 0.05) 25%, rgba(255, 0, 0, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 0, 0, 0.05) 75%, rgba(255, 0, 0, 0.05) 76%, transparent 77%, transparent);
                    background-size: 30px 30px;
                    animation: matrix-fall 15s linear infinite;
                }
                
                @keyframes matrix-fall {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100vh); }
                }
                
                .scan-lines {
                    background: linear-gradient(90deg, transparent 98%, rgba(255, 0, 0, 0.1) 100%);
                    background-size: 4px 100%;
                    animation: scan 3s linear infinite;
                }
                
                @keyframes scan {
                    0% { background-position: 0 0; }
                    100% { background-position: 100% 0; }
                }
            `}</style>
        </div>
    )
}