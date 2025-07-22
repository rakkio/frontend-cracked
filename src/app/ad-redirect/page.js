'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FaDownload, FaSpinner, FaClock, FaArrowRight, FaCheckCircle } from 'react-icons/fa'

export default function AdRedirectPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [countdown, setCountdown] = useState(15)
    const [adLoaded, setAdLoaded] = useState(false)
    const [downloadReady, setDownloadReady] = useState(false)
    const [pendingDownload, setPendingDownload] = useState(null)

    useEffect(() => {
        // Obtener información de descarga de sessionStorage
        const downloadData = sessionStorage.getItem('pendingDownload')
        if (downloadData) {
            try {
                const parsed = JSON.parse(downloadData)
                setPendingDownload(parsed)
                console.log('📥 Loaded pending download:', parsed)
            } catch (error) {
                console.error('Error parsing download data:', error)
                // Si no hay datos válidos, regresar al home
                router.push('/')
                return
            }
        } else {
            // Sin datos de descarga, regresar al home
            router.push('/')
            return
        }

        // Obtener URL de publicidad de query params
        const adUrl = searchParams.get('adUrl')
        if (adUrl) {
            console.log('🎯 Loading advertisement:', adUrl)
            // Simular carga de publicidad
            setTimeout(() => {
                setAdLoaded(true)
                console.log('✅ Advertisement loaded')
            }, 1000)
        }

        // Iniciar countdown
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    setDownloadReady(true)
                    clearInterval(timer)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [router, searchParams])

    const handleDownload = () => {
        if (!pendingDownload) return

        console.log('🎯 Starting download:', pendingDownload.appName)
        
        // Limpiar sessionStorage
        sessionStorage.removeItem('pendingDownload')
        
        // Abrir descarga
        if (pendingDownload.url) {
            window.open(pendingDownload.url, '_blank')
            console.log('✅ Download opened:', pendingDownload.url)
        }
        
        // Regresar a la página anterior o home
        setTimeout(() => {
            window.close() // Cerrar pestaña si es posible
            // Fallback: regresar al home
            router.push('/')
        }, 2000)
    }

    const handleSkip = () => {
        if (countdown > 5) {
            const newCountdown = Math.max(5, countdown - 10)
            setCountdown(newCountdown)
        } else {
            setDownloadReady(true)
            setCountdown(0)
        }
    }

    if (!pendingDownload) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 flex items-center justify-center">
                <div className="text-center text-white">
                    <FaSpinner className="animate-spin text-4xl mx-auto mb-4" />
                    <p>Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Preparing Download: {pendingDownload.appName}
                    </h1>
                    <p className="text-gray-400">
                        Please wait while we prepare your download...
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Advertisement Area */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-white">Advertisement</h2>
                                <div className="flex items-center space-x-2 text-blue-400">
                                    {adLoaded ? <FaCheckCircle /> : <FaSpinner className="animate-spin" />}
                                    <span className="text-sm">{adLoaded ? 'Loaded' : 'Loading...'}</span>
                                </div>
                            </div>
                            
                            {/* Advertisement Container */}
                            <div className="bg-gray-900 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
                                {searchParams.get('adUrl') ? (
                                    <iframe
                                        src={searchParams.get('adUrl')}
                                        className="w-full h-[400px] rounded-lg border-0"
                                        title="Advertisement"
                                        onLoad={() => setAdLoaded(true)}
                                    />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <div className="w-16 h-16 bg-gray-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
                                            <FaSpinner className="animate-spin text-2xl" />
                                        </div>
                                        <p>Loading advertisement content...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Download Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 sticky top-4">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    {downloadReady ? (
                                        <FaDownload className="text-white text-2xl" />
                                    ) : (
                                        <FaClock className="text-white text-2xl" />
                                    )}
                                </div>
                                
                                <h3 className="text-xl font-bold text-white mb-2">
                                    {downloadReady ? 'Ready to Download!' : 'Please Wait'}
                                </h3>
                                
                                {!downloadReady ? (
                                    <div className="mb-6">
                                        <div className="text-4xl font-bold text-red-500 mb-2">
                                            {countdown}
                                        </div>
                                        <p className="text-gray-400 text-sm">
                                            seconds remaining...
                                        </p>
                                        <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
                                            <div 
                                                className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-1000"
                                                style={{ width: `${((15 - countdown) / 15) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mb-6">
                                        <FaCheckCircle className="text-green-500 text-3xl mx-auto mb-2" />
                                        <p className="text-green-400 text-sm">
                                            Advertisement viewed successfully
                                        </p>
                                    </div>
                                )}

                                <button
                                    onClick={handleDownload}
                                    disabled={!downloadReady}
                                    className={`w-full px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 ${
                                        downloadReady
                                            ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white cursor-pointer hover:scale-105 shadow-lg'
                                            : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                                    }`}
                                >
                                    {downloadReady ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <FaDownload />
                                            <span>Download Now</span>
                                            <FaArrowRight />
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center space-x-2">
                                            <FaSpinner className="animate-spin" />
                                            <span>Please Wait</span>
                                        </div>
                                    )}
                                </button>

                                {!downloadReady && countdown > 5 && (
                                    <button
                                        onClick={handleSkip}
                                        className="w-full mt-3 px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors"
                                    >
                                        Skip 10 seconds ⏭️
                                    </button>
                                )}
                            </div>

                            {/* App Info */}
                            <div className="mt-6 pt-6 border-t border-gray-700">
                                <h4 className="text-sm font-semibold text-gray-300 mb-3">Download Info</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">App:</span>
                                        <span className="text-white">{pendingDownload.appName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Status:</span>
                                        <span className="text-green-400">Safe Download</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="mt-8 bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
                    <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs font-bold">i</span>
                        </div>
                        <div className="text-sm">
                            <h4 className="font-semibold text-blue-300 mb-2">How it works:</h4>
                            <ol className="text-blue-200 space-y-1 list-decimal list-inside">
                                <li>View the advertisement above (supports our free service)</li>
                                <li>Wait for the {countdown > 0 ? countdown : 15}-second countdown to complete</li>
                                <li>Click "Download Now" to start your download</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 