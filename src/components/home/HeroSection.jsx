'use client'

import React from 'react'
import Link from 'next/link'
import { FaRocket, FaGem, FaTerminal, FaCode, FaShieldAlt, FaDownload, FaStar, FaUsers, FaCheckCircle, FaCrown, FaBolt } from 'react-icons/fa'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i} 
            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Glowing Border Lines */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse"></div>
      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-green-500 to-transparent animate-pulse"></div>
      <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-pulse"></div>

      {/* Floating Terminal Elements */}
      <div className="absolute top-20 left-10 text-blue-400/60 font-mono text-sm animate-pulse">
        <div className="flex items-center space-x-2 bg-black/80 border border-blue-500/30 px-4 py-2 rounded-lg backdrop-blur-sm">
          <FaCode className="text-blue-400" />
          <span>#!/bin/crack</span>
        </div>
      </div>
      
      <div className="absolute bottom-32 right-16 text-red-400/60 font-mono text-sm animate-pulse" style={{animationDelay: '1s'}}>
        <div className="flex items-center space-x-2 bg-black/80 border border-red-500/30 px-4 py-2 rounded-lg backdrop-blur-sm">
          <span>[ROOT@CRACKED]#</span>
        </div>
      </div>
      
      <div className="absolute top-1/3 right-20 text-green-400/60 font-mono text-sm animate-pulse" style={{animationDelay: '2s'}}>
        <div className="flex items-center space-x-2 bg-black/80 border border-green-500/30 px-4 py-2 rounded-lg backdrop-blur-sm">
          <FaShieldAlt className="text-green-400" />
          <span>sudo access --premium</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 text-center relative z-10 max-w-7xl">
        <div className="space-y-12">
          {/* Brand Header */}
          <div className="mt-16 mb-16">
            <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 px-8 py-4 rounded-full backdrop-blur-sm">
              <FaCrown className="text-yellow-400 text-2xl" />
              <h1 className="text-3xl md:text-5xl font-black text-white font-mono">
                <span className="text-blue-400">CRACK</span>
                <span className="text-red-400">MARKET</span>
              </h1>
              <FaBolt className="text-yellow-400 text-2xl" />
            </div>
          </div>

          {/* Main Terminal Window */}
          <div className="bg-black/90 border-2 border-blue-500/50 rounded-2xl p-8 md:p-12 max-w-6xl mx-auto relative overflow-hidden backdrop-blur-sm shadow-2xl">
            {/* Terminal Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-blue-500/30">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center space-x-3 text-blue-400">
                <FaTerminal className="text-lg" />
                <span className="font-mono text-sm">CRACK_TERMINAL_v3.0</span>
              </div>
            </div>

            {/* Main Headline */}
            <h2 className="text-4xl md:text-6xl lg:text-8xl font-black font-mono leading-tight mb-6">
              <span className="text-gray-300">[ROOT@</span>
              <span className="text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.5)] animate-pulse">
                CRACKED
              </span>
              <span className="text-gray-300">]# </span>
              <span className="text-white">
                PREMIUM_APPS
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-xl md:text-3xl text-gray-300 font-mono mb-8">
              Download <span className="text-red-400 bg-red-500/10 px-3 py-1 border border-red-500/30 rounded">PREMIUM</span> Software for <span className="text-green-400 bg-green-500/10 px-3 py-1 border border-green-500/30 rounded">FREE</span>
            </p>

            {/* Status Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 p-4 md:p-6 text-center hover:from-blue-600/30 hover:to-blue-800/30 transition-all duration-300 rounded-xl backdrop-blur-sm">
                <div className="text-blue-400 font-mono text-sm font-bold mb-2">APPS</div>
                <div className="text-white text-2xl md:text-3xl font-black">10K+</div>
              </div>
              <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 border border-red-500/30 p-4 md:p-6 text-center hover:from-red-600/30 hover:to-red-800/30 transition-all duration-300 rounded-xl backdrop-blur-sm">
                <div className="text-red-400 font-mono text-sm font-bold mb-2">COST</div>
                <div className="text-white text-2xl md:text-3xl font-black">$0.00</div>
              </div>
              <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/30 p-4 md:p-6 text-center hover:from-green-600/30 hover:to-green-800/30 transition-all duration-300 rounded-xl backdrop-blur-sm">
                <div className="text-green-400 font-mono text-sm font-bold mb-2">ACCESS</div>
                <div className="text-white text-2xl md:text-3xl font-black">INSTANT</div>
              </div>
              <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 p-4 md:p-6 text-center hover:from-purple-600/30 hover:to-purple-800/30 transition-all duration-300 rounded-xl backdrop-blur-sm">
                <div className="text-purple-400 font-mono text-sm font-bold mb-2">STATUS</div>
                <div className="text-white text-2xl md:text-3xl font-black">SECURE</div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gradient-to-r from-gray-800/30 to-gray-900/30 border border-gray-600/30 p-6 md:p-8 rounded-xl backdrop-blur-sm">
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-6">
                Access the world's largest collection of <strong className="text-red-400 font-mono bg-red-500/10 px-2 py-1 rounded">CRACKED_APPLICATIONS</strong>, 
                <strong className="text-red-400 font-mono bg-red-500/10 px-2 py-1 rounded"> PREMIUM_SOFTWARE</strong>, and <strong className="text-red-400 font-mono bg-red-500/10 px-2 py-1 rounded">MODDED_GAMES</strong> 
                completely free. All downloads are tested, safe, and include full versions.
              </p>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center items-center gap-6 text-sm md:text-base text-gray-300">
                <div className="flex items-center space-x-2">
                  <FaUsers className="text-green-400" />
                  <span><strong className="text-green-400">2_MILLION</strong> users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCheckCircle className="text-blue-400" />
                  <span><strong className="text-blue-400">100%</strong> verified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaStar className="text-yellow-400" />
                  <span><strong className="text-yellow-400">4.9/5</strong> rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 md:gap-8 justify-center items-center">
            <Link href="/apps" className="group w-full sm:w-auto">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 border border-blue-500 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black relative overflow-hidden rounded-xl shadow-2xl" style={{width: '280px', height: '180px'}}>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 relative z-10">
                  <FaRocket className="text-5xl md:text-6xl mb-2 group-hover:rotate-12 transition-transform duration-300 text-white" />
                  <div className="text-2xl md:text-3xl font-bold text-white mb-3">BROWSE APPS</div>
                  <div className="text-base md:text-lg text-blue-100">10,000+ Available</div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-800/20 group-hover:from-blue-500/20 group-hover:to-purple-800/40 transition-all duration-300"></div>
              </div>
            </Link>
            
            <Link href="/categories" className="group w-full sm:w-auto">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 hover:from-gray-700 hover:to-gray-800 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-black relative overflow-hidden rounded-xl shadow-2xl" style={{width: '280px', height: '180px'}}>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 relative z-10">
                  <FaGem className="text-5xl md:text-6xl mb-2 text-red-400" />
                  <div className="text-2xl md:text-3xl font-bold text-white mb-3">CATEGORIES</div>
                  <div className="text-base md:text-lg text-gray-300">Explore by Type</div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-gray-500/0 to-gray-500/10 group-hover:from-gray-500/10 group-hover:to-gray-500/20 transition-all duration-300"></div>
              </div>
            </Link>
          </div>

          {/* Bottom Stats */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm md:text-base text-gray-400 mt-16 mb-16">
            <div className="flex items-center space-x-2">
              <FaDownload className="text-green-400" />
              <span><strong className="text-green-400">50M+</strong> downloads</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaShieldAlt className="text-blue-400" />
              <span><strong className="text-blue-400">100%</strong> safe</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaBolt className="text-yellow-400" />
              <span><strong className="text-yellow-400">24/7</strong> access</span>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>
    </section>
  )
}
