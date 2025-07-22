'use client'

import { useState, useEffect, useRef } from 'react'
import { useAdvertising } from '@/contexts/AdvertisingContext'
import { api } from '@/lib/api'
import { FaTimes, FaSpinner, FaExclamationTriangle, FaDownload } from 'react-icons/fa'

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

            // Get active advertisement for download placement
            const requestParams = {
                type: 'download',
                placement: 'before_download',  // Back to correct placement
                page: window.location.pathname
            }
            console.log('API request params:', requestParams)
            console.log('Searching for ads with placement: before_download')

            const response = await api.getActiveAdvertisement(requestParams)
            console.log('API response:', response)
            
            if (response?.success === false) {
                console.log('❌ API returned error:', response.message)
                console.log('💡 Make sure you have an active advertisement with:')
                console.log('   - type: "download"')
                console.log('   - placement: "before_download"') 
                console.log('   - isActive: true')
                setError('Failed to load advertisement. Proceeding with download...')
                return
            }

            if (response?.data?.advertisement) {
                const ad = response.data.advertisement
                console.log('Advertisement loaded:', ad)
                setAdvertisement(ad)

                // Track impression
                try {
                    await api.trackAdvertisementImpression(ad._id)
                    console.log('Impression tracked for ad:', ad._id)
                } catch (trackError) {
                    console.warn('Failed to track impression:', trackError)
                }
            } else {
                console.log('No advertisement available, proceeding with download')
                // No advertisement available, proceed with download
                const download = proceedWithDownload()
                if (download) {
                    triggerDownload(download)
                }
            }
        } catch (error) {
            console.error('Error loading advertisement:', error)
            setError('Failed to load advertisement')
            
            // Fallback: proceed with download after 3 seconds
            console.log('⏰ Will proceed with download in 3 seconds due to error...')
            setTimeout(() => {
                console.log('🎯 Proceeding with download due to advertisement error')
                const download = proceedWithDownload()
                if (download) {
                    // Close modal and trigger download
                    closeAdModal()
                    window.open(download.downloadUrl, '_blank')
                }
            }, 3000)
        } finally {
            setLoading(false)
        }
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
        if (!canProceed || !verificationPassed) return

        // Track conversion
        if (advertisement?._id) {
            try {
                await api.trackAdvertisementConversion(advertisement._id)
            } catch (trackError) {
                console.warn('Failed to track conversion:', trackError)
            }
        }

        const download = proceedWithDownload()
        if (download) {
            triggerDownload(download)
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
                            <p className="text-gray-300">Loading advertisement...</p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-12">
                            <FaExclamationTriangle className="text-4xl text-yellow-500 mx-auto mb-4" />
                            <p className="text-yellow-300 mb-4">{error}</p>
                            <button
                                onClick={closeAdModal}
                                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                                Continue to Download
                            </button>
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
                            <div className="flex items-center justify-between">
                                <div className="text-gray-300">
                                    {!scriptLoaded ? (
                                        <div className="flex items-center space-x-2">
                                            <FaSpinner className="animate-spin" />
                                            <span>Loading advertisement...</span>
                                        </div>
                                    ) : !verificationPassed ? (
                                        <div className="flex items-center space-x-2">
                                            <FaSpinner className="animate-spin" />
                                            <span>Verifying advertisement...</span>
                                        </div>
                                    ) : adTimer > 0 ? (
                                        <span>Please wait {adTimer} seconds before proceeding</span>
                                    ) : (
                                        <span>You can now proceed to download</span>
                                    )}
                                </div>

                                <button
                                    onClick={handleProceed}
                                    disabled={!canProceed || !verificationPassed}
                                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                                        canProceed && verificationPassed
                                            ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    {pendingDownload ? `Download ${pendingDownload.name}` : 'Proceed to Download'}
                                </button>
                            </div>

                            {/* Instructions */}
                            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                                <p className="text-gray-300 text-sm">
                                    <strong>Instructions:</strong> Please view the advertisement above for {advertisement.settings?.countdown || 15} seconds, 
                                    then click "Proceed to Download" to continue with your download.
                                    {advertisement.settings?.verificationRequired && (
                                        <span> The advertisement must be fully loaded before you can proceed.</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
} 