'use client'

import Link from 'next/link'
import { FaExclamationTriangle, FaHome, FaSearch, FaTerminal } from 'react-icons/fa'

export const CategoryNotFound = ({ categorySlug }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-red-900/20 relative">
            {/* Matrix Rain Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="matrix-rain opacity-20"></div>
            </div>
            
            {/* Scan Lines */}
            <div className="scan-lines absolute inset-0 pointer-events-none"></div>
            
            <div className="text-center space-y-8 relative z-10 max-w-2xl mx-auto px-4">
                {/* Terminal Window */}
                <div className="relative">
                    <div className="absolute inset-0 bg-red-500 blur-xl opacity-50 animate-pulse"></div>
                    <div className="relative bg-black/90 border-2 border-red-500 p-8 backdrop-blur-sm">
                        {/* Terminal corners */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500"></div>
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-500"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-500"></div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500"></div>
                        
                        {/* Terminal Header */}
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-red-500/30">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse delay-100"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse delay-200"></div>
                            </div>
                            <FaTerminal className="text-red-400 text-sm" />
                        </div>
                        
                        {/* Error Icon */}
                        <div className="relative mb-6">
                            <FaExclamationTriangle className="text-6xl text-red-500 mx-auto animate-pulse drop-shadow-lg" />
                            <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-400 rounded-full animate-ping"></div>
                        </div>
                        
                        {/* Error Message */}
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                                <FaTerminal className="text-green-400" />
                                <span className="text-green-400 font-mono text-sm">root@appscracked:~#</span>
                            </div>
                            
                            <h1 className="text-4xl font-bold text-white font-mono mb-2">
                                404 - CATEGORY NOT FOUND
                            </h1>
                            
                            <div className="text-red-400 font-mono text-lg space-y-2">
                                <div className="animate-typewriter">
                                     ERROR: Category "{categorySlug}" does not exist
                                </div>
                                <div className="animate-typewriter delay-500">
                                     Scanning database for alternatives...
                                </div>
                                <div className="animate-typewriter delay-1000">
                                     No matching records found
                                </div>
                            </div>
                            
                            <p className="text-gray-400 font-mono text-sm mt-4">
                                The category you're looking for might have been moved, deleted, or never existed.
                            </p>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/categories">
                                <button className="group bg-red-600 hover:bg-red-700 text-white px-6 py-3 font-mono font-bold transition-all duration-300 border-2 border-red-500 hover:border-red-400 hover:shadow-lg hover:shadow-red-500/50 flex items-center space-x-2">
                                    <FaSearch className="group-hover:animate-pulse" />
                                    <span>BROWSE CATEGORIES</span>
                                </button>
                            </Link>
                            
                            <Link href="/">
                                <button className="group bg-transparent hover:bg-green-600/20 text-green-400 hover:text-green-300 px-6 py-3 font-mono font-bold transition-all duration-300 border-2 border-green-500 hover:border-green-400 hover:shadow-lg hover:shadow-green-500/50 flex items-center space-x-2">
                                    <FaHome className="group-hover:animate-pulse" />
                                    <span>RETURN HOME</span>
                                </button>
                            </Link>
                        </div>
                        
                        {/* Loading dots animation */}
                        <div className="flex justify-center space-x-1 mt-6">
                            {[0, 1, 2].map((i) => (
                                <div 
                                    key={i}
                                    className="w-2 h-2 bg-red-500 rounded-full animate-pulse"
                                    style={{ animationDelay: `${i * 0.2}s` }}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Floating Code Elements */}
                <div className="absolute top-20 left-10 text-green-400/20 font-mono text-xs animate-float">
                    {'{"error": 404}'}
                </div>
                <div className="absolute top-40 right-20 text-red-400/20 font-mono text-xs animate-float-delayed">
                    {'[ACCESS_DENIED]'}
                </div>
                <div className="absolute bottom-32 left-1/4 text-blue-400/20 font-mono text-xs animate-float">
                    {'#!/usr/bin/404'}
                </div>
            </div>
        </div>
    )
}