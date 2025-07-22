'use client'

import { useState, useEffect, useRef } from 'react'
import { useAdvertising } from '@/contexts/AdvertisingContext'
import { api } from '@/lib/api'
import { FaTimes, FaSpinner, FaExclamationTriangle, FaDownload, FaInfoCircle } from 'react-icons/fa'

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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div 
                ref={modalRef}
                className="bg-gray-900 border border-gray-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                        <FaDownload className="text-red-500" />
                        <h2 className="text-lg font-semibold text-white">
                            {loading ? 'Loading...' : 
                             error ? 'Advertisement Error' :
                             advertisement ? advertisement.name || 'Advertisement' : 
                             'Preparing Download'}
                        </h2>
                    </div>
                    
                    {canClose && (
                        <button
                            onClick={closeAdModal}
                            className="text-gray-400 hover:text-white text-xl transition-colors"
                        >
                            <FaTimes />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-6">
                    {loading && (
                        <div className="text-center py-12">
                            <FaSpinner className="animate-spin text-4xl text-red-500 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-3">Loading Advertisement...</h3>
                            <p className="text-gray-300 mb-4">Please wait while we prepare your download</p>
                            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 max-w-md mx-auto">
                                <p className="text-blue-300 text-sm">
                                    💡 <strong>Note:</strong> If no advertisement is available, your download will start automatically
                                </p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-12">
                            <div className="flex items-center justify-center mb-4">
                                <FaSpinner className="animate-spin text-3xl text-blue-500 mr-3" />
                                <FaExclamationTriangle className="text-4xl text-yellow-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-4">Preparing Your Download</h3>
                            <p className="text-yellow-300 mb-6">{error}</p>
                            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-4">
                                <p className="text-blue-300 text-sm mb-2">
                                    <strong>Don't worry!</strong> Your download will start automatically.
                                </p>
                                <p className="text-blue-200 text-xs">
                                    We're working to show you relevant content, but if none is available, 
                                    we'll proceed directly to your download.
                                </p>
                            </div>
                            <p className="text-sm text-gray-400 animate-pulse">
                                🔄 Your download will begin shortly...
                            </p>
                        </div>
                    )}

                    {scriptError && (
                        <div className="text-center py-12">
                            <FaExclamationTriangle className="text-4xl text-yellow-500 mx-auto mb-4" />
                            <p className="text-yellow-300 mb-4">Advertisement could not be loaded</p>
                            <button
                                onClick={handleProceed}
                                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                                Continue to Download
                            </button>
                        </div>
                    )}

                    {advertisement && !loading && !error && !scriptError && (
                        <div>
                            {/* Advertisement Container */}
                            <div 
                                ref={scriptContainerRef}
                                onClick={handleAdClick}
                                className="min-h-[300px] bg-gray-800 rounded-lg overflow-hidden mb-6"
                                style={{ minHeight: '300px' }}
                            />

                            {/* Timer and Proceed Button */}
                            <div className="space-y-4">
                                {/* Countdown Display */}
                                <div className="text-center">
                                    {!scriptLoaded ? (
                                        <div className="flex items-center justify-center space-x-2 py-4">
                                            <FaSpinner className="animate-spin text-blue-500" />
                                            <span className="text-gray-300">Loading advertisement...</span>
                                        </div>
                                    ) : !verificationPassed ? (
                                        <div className="flex items-center justify-center space-x-2 py-4">
                                            <FaSpinner className="animate-spin text-yellow-500" />
                                            <span className="text-gray-300">Verifying advertisement...</span>
                                        </div>
                                    ) : adTimer > 0 ? (
                                        <div className="py-6">
                                            <div className="mb-4">
                                                <div className="text-6xl font-bold text-red-500 mb-2">
                                                    {adTimer}
                                                </div>
                                                <div className="text-gray-300 text-lg">
                                                    seconds remaining
                                                </div>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                                                <div 
                                                    className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full transition-all duration-1000 ease-linear"
                                                    style={{
                                                        width: `${((advertisement.settings?.countdown || 15) - adTimer) / (advertisement.settings?.countdown || 15) * 100}%`
                                                    }}
                                                />
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                                Please wait while the advertisement loads...
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="py-6">
                                            <div className="text-4xl font-bold text-green-500 mb-2">
                                                ✓ Ready!
                                            </div>
                                            <div className="text-gray-300 text-lg mb-4">
                                                Your download will start automatically
                                            </div>
                                            <div className="flex items-center justify-center space-x-2">
                                                <FaSpinner className="animate-spin text-green-500" />
                                                <span className="text-green-400">Preparing download...</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Download Button */}
                                <div className="text-center">
                                    <button
                                        onClick={handleProceed}
                                        disabled={!canProceed || !verificationPassed}
                                        className={`px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform ${
                                            canProceed && verificationPassed
                                                ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white cursor-pointer hover:scale-105 shadow-lg'
                                                : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                                        }`}
                                    >
                                        {canProceed && verificationPassed ? (
                                            <div className="flex items-center space-x-2">
                                                <FaDownload />
                                                <span>Download {pendingDownload?.name || 'Now'}</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-2">
                                                <FaSpinner className="animate-spin" />
                                                <span>Please Wait...</span>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                                <div className="flex items-start space-x-2">
                                    <FaInfoCircle className="text-blue-400 mt-1 flex-shrink-0" />
                                    <div className="text-sm">
                                        <p className="text-blue-300 font-medium mb-1">How it works:</p>
                                        <ol className="text-blue-200 space-y-1">
                                            <li>1. Advertisement loads and displays above</li>
                                            <li>2. Wait for the {advertisement.settings?.countdown || 15}-second countdown to complete</li>
                                            <li>3. Download starts automatically or click the download button</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
} 