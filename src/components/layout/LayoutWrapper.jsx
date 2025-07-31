'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from '../Footer'

export default function LayoutWrapper({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Close sidebar when route changes on mobile
    useEffect(() => {
        setSidebarOpen(false)
    }, [pathname])

    // Prevent body scroll when sidebar is open on mobile
    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [sidebarOpen])

    if (!isMounted) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-red-500 text-xl font-mono">Loading...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900/20 relative overflow-x-hidden">
            {/* Matrix Rain Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="matrix-rain opacity-10"></div>
            </div>

            {/* Scan Lines */}
            <div className="scan-lines fixed inset-0 pointer-events-none z-10"></div>

            {/* Layout Container */}
            <div className="relative z-20 min-h-screen flex flex-col lg:flex-row overflow-x-hidden">
                {/* Sidebar */}
                <Sidebar 
                    isOpen={sidebarOpen} 
                    onClose={() => setSidebarOpen(false)} 
                />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col lg:ml-0 overflow-x-hidden">
                    {/* Header */}
                    <Header 
                        onMenuClick={() => setSidebarOpen(true)}
                        sidebarOpen={sidebarOpen}
                    />

                    {/* Main Content */}
                    <main className="flex-1 relative overflow-x-hidden">
                        {/* Content Background */}
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
                        
                        {/* Content */}
                        <div className="relative z-10">
                            {children}
                        </div>
                    </main>

                    {/* Footer */}
                    <Footer />
                </div>

                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </div>
        </div>
    )
}
