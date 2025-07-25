import Link from 'next/link'
import { FaSkull, FaRocket, FaGem, FaArrowRight, FaShieldAlt, FaBolt, FaGift, FaUsers, FaTerminal, FaCode } from 'react-icons/fa'
import TrustSignals from './TrustSignals'
import BrandLogo from '../ui/BrandLogo'

const HeroSection = ({ stats }) => {
  return (
    <section className="relative py-16 px-4 min-h-[90vh] flex items-center overflow-hidden" itemScope itemType="https://schema.org/WebSite">
      {/* Matrix Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-red-900/20"></div>
      <div className="absolute inset-0 bg-matrix-pattern opacity-10 animate-matrix-rain"></div>
      
      {/* Floating Code Elements */}
      <div className="absolute top-20 left-10 text-green-400/30 font-mono text-sm animate-float">
        <FaCode className="inline mr-2" />
        {`#!/bin/bash`}
      </div>
      <div className="absolute bottom-32 right-16 text-red-400/30 font-mono text-sm animate-float delay-500">
        {`[ROOT@CRACKED]#`}
      </div>
      <div className="absolute top-1/3 right-20 text-blue-400/30 font-mono text-sm animate-float delay-1000">
        {`sudo access --premium`}
      </div>
      
      <div className="container mx-auto text-center relative z-10 max-w-6xl">
        <header className="space-y-8">
          {/* Brand Logo */}
          <BrandLogo />
          
          {/* Terminal-style Headlines */}
          <div className="space-y-6">
            <div className="bg-black/80 border-2 border-red-500/50 rounded-lg p-6 max-w-4xl mx-auto backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-red-500/30">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <FaTerminal className="text-red-400 text-sm" />
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-mono leading-tight tracking-tight" itemProp="name">
                <span className="text-green-400">[ROOT@</span>
                <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
                  CRACKED
                </span>
                <span className="text-green-400">]# </span>
                <span className="text-white animate-typewriter">
                  FREE_APPS
                </span>
              </h1>
            </div>
            
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white/90 leading-tight">
              Download <span className="text-red-400 font-mono">&lt;PREMIUM&gt;</span> Software for <span className="text-green-400 font-mono">$0.00</span>
            </h2>
            
            <div className="flex flex-wrap justify-center gap-4 text-lg md:text-xl">
              <span className="px-4 py-2 bg-green-900/30 border border-green-500/50 rounded font-mono text-green-300">
                ✓ 10,000+ Apps
              </span>
              <span className="px-4 py-2 bg-red-900/30 border border-red-500/50 rounded font-mono text-red-300">
                ✓ Zero Cost
              </span>
              <span className="px-4 py-2 bg-blue-900/30 border border-blue-500/50 rounded font-mono text-blue-300">
                ✓ Instant Access
              </span>
              <span className="px-4 py-2 bg-purple-900/30 border border-purple-500/50 rounded font-mono text-purple-300">
                ✓ Virus-Free
              </span>
            </div>
          </div>
          
          {/* SEO Rich Description */}
          <div className="max-w-4xl mx-auto space-y-4 bg-gray-900/50 border border-gray-700/50 rounded-lg p-6 backdrop-blur-sm" itemProp="description">
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed font-light">
              Access the world's largest collection of <strong className="text-red-400 font-mono">[CRACKED_APPLICATIONS]</strong>, 
              <strong className="text-red-400 font-mono"> [PREMIUM_SOFTWARE]</strong>, and <strong className="text-red-400 font-mono">[MODDED_GAMES]</strong> 
              completely free. All downloads are tested, safe, and include full versions.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed font-mono">
               JOIN <strong className="text-green-400">2_MILLION_USERS</strong> who trust our platform for secure, fast downloads 
              of premium applications without subscriptions or licenses.
            </p>
          </div>
          
          {/* CTA Buttons Metro Style */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            <Link href="/apps" className="group">
              <div className="metro-tile metro-tile-large bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-300">
                <div className="metro-tile-content">
                  <FaRocket className="text-3xl mb-2 group-hover:rotate-12 transition-transform duration-300" />
                  <div className="text-lg font-bold">BROWSE APPS</div>
                  <div className="text-sm opacity-80">10,000+ Available</div>
                </div>
                <div className="metro-tile-badge">
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Link>
            
            <Link href="/categories" className="group">
              <div className="metro-tile metro-tile-large bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 border-2 border-red-500/50 hover:border-red-400 transform hover:scale-105 transition-all duration-300">
                <div className="metro-tile-content">
                  <FaGem className="text-3xl mb-2" />
                  <div className="text-lg font-bold">CATEGORIES</div>
                  <div className="text-sm opacity-80">Explore by Type</div>
                </div>
              </div>
            </Link>
          </div>
          
          {/* Trust Signals */}
          <TrustSignals />
        </header>
      </div>
    </section>
  )
}

export default HeroSection