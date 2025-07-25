import Link from 'next/link'
import { FaRocket, FaGem, FaArrowRight, FaTerminal, FaCode, FaShieldAlt, FaDownload } from 'react-icons/fa'
import TrustSignals from './TrustSignals'
import BrandLogo from '../ui/BrandLogo'

const HeroSection = ({ stats }) => {
  return (
    <section 
      className="relative py-12 md:py-16 lg:py-20 px-4 min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden bg-black" 
      itemScope 
      itemType="https://schema.org/WebSite"
      aria-label="Hero section with app download information"
    >
      {/* Static Hacker Grid Background */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      {/* Red Accent Lines */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" aria-hidden="true"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" aria-hidden="true"></div>
      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-red-500 to-transparent" aria-hidden="true"></div>
      <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-red-500 to-transparent" aria-hidden="true"></div>
      
      {/* Floating Hacker Elements */}
      <div className="absolute top-16 md:top-20 left-4 md:left-10 text-green-400/40 font-mono text-xs md:text-sm animate-pulse" aria-hidden="true">
        <div className="flex items-center space-x-2 bg-black/80 border border-green-500/30 px-3 py-1 rounded">
          <FaCode className="text-green-400" />
          <span>#!/bin/bash</span>
        </div>
      </div>
      <div className="absolute bottom-24 md:bottom-32 right-8 md:right-16 text-red-400/40 font-mono text-xs md:text-sm animate-pulse" aria-hidden="true" style={{animationDelay: '1s'}}>
        <div className="flex items-center space-x-2 bg-black/80 border border-red-500/30 px-3 py-1 rounded">
          <span>[ROOT@CRACKED]#</span>
        </div>
      </div>
      <div className="absolute top-1/3 right-8 md:right-20 text-blue-400/40 font-mono text-xs md:text-sm animate-pulse" aria-hidden="true" style={{animationDelay: '2s'}}>
        <div className="flex items-center space-x-2 bg-black/80 border border-blue-500/30 px-3 py-1 rounded">
          <FaShieldAlt className="text-blue-400" />
          <span>sudo access --premium</span>
        </div>
      </div>
      
      <div className="container mx-auto text-center relative z-10 max-w-6xl">
        <header className="space-y-8 md:space-y-12">
          {/* Brand Logo */}
          <div className="mb-8 md:mb-12">
            <BrandLogo />
          </div>
          
          {/* Enhanced Terminal-style Headlines */}
          <div className="space-y-6 md:space-y-8">
            <div className="bg-black border-2 border-red-500 rounded-none p-6 md:p-8 max-w-5xl mx-auto relative overflow-hidden">
              {/* Terminal Header */}
              <div className="flex items-center justify-between mb-4 md:mb-6 pb-3 border-b-2 border-red-500/50">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-red-500 border border-red-400"></div>
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-yellow-500 border border-yellow-400"></div>
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-green-500 border border-green-400"></div>
                </div>
                <div className="flex items-center space-x-2 text-red-400">
                  <FaTerminal className="text-sm md:text-base" />
                  <span className="font-mono text-xs md:text-sm">TERMINAL_v2.1</span>
                </div>
              </div>
              
              {/* Scan Lines Effect */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="scan-lines opacity-20"></div>
              </div>
              
              <h1 className="text-2xl md:text-4xl lg:text-6xl xl:text-7xl font-black font-mono leading-tight tracking-tight relative z-10" itemProp="name">
                <span className="text-green-400">[ROOT@</span>
                <span className="text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                  CRACKED
                </span>
                <span className="text-green-400">]# </span>
                <span className="text-white animate-typewriter">
                  FREE_APPS
                </span>
              </h1>
            </div>
            
            <h2 className="text-lg md:text-2xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight px-4">
              Download <span className="text-red-400 font-mono bg-red-500/10 px-2 border border-red-500/30">&lt;PREMIUM&gt;</span> Software for <span className="text-green-400 font-mono bg-green-500/10 px-2 border border-green-500/30">$0.00</span>
            </h2>
            
            {/* Metro Status Tiles */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto px-4">
              <div className="bg-green-900/20 border-2 border-green-500 p-3 md:p-4 text-center hover:bg-green-900/30 transition-all duration-300">
                <div className="text-green-400 font-mono text-xs md:text-sm font-bold">APPS</div>
                <div className="text-white text-lg md:text-xl font-black">{stats?.totalApps || '10K+'}</div>
              </div>
              <div className="bg-red-900/20 border-2 border-red-500 p-3 md:p-4 text-center hover:bg-red-900/30 transition-all duration-300">
                <div className="text-red-400 font-mono text-xs md:text-sm font-bold">COST</div>
                <div className="text-white text-lg md:text-xl font-black">$0.00</div>
              </div>
              <div className="bg-blue-900/20 border-2 border-blue-500 p-3 md:p-4 text-center hover:bg-blue-900/30 transition-all duration-300">
                <div className="text-blue-400 font-mono text-xs md:text-sm font-bold">ACCESS</div>
                <div className="text-white text-lg md:text-xl font-black">INSTANT</div>
              </div>
              <div className="bg-purple-900/20 border-2 border-purple-500 p-3 md:p-4 text-center hover:bg-purple-900/30 transition-all duration-300">
                <div className="text-purple-400 font-mono text-xs md:text-sm font-bold">STATUS</div>
                <div className="text-white text-lg md:text-xl font-black">SECURE</div>
              </div>
            </div>
          </div>
          
          {/* Enhanced SEO Rich Description */}
          <div className="max-w-5xl mx-auto bg-black border-2 border-red-500/50 p-6 md:p-8 relative overflow-hidden" itemProp="description">
            {/* Corner Brackets */}
            <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-red-500"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-red-500"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-red-500"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-red-500"></div>
            
            <div className="space-y-4 relative z-10">
              <p className="text-base md:text-xl lg:text-2xl text-gray-200 leading-relaxed font-light">
                Access the world's largest collection of <strong className="text-red-400 font-mono bg-red-500/10 px-1">[CRACKED_APPLICATIONS]</strong>, 
                <strong className="text-red-400 font-mono bg-red-500/10 px-1"> [PREMIUM_SOFTWARE]</strong>, and <strong className="text-red-400 font-mono bg-red-500/10 px-1">[MODDED_GAMES]</strong> 
                completely free. All downloads are tested, safe, and include full versions.
              </p>
              <p className="text-sm md:text-lg text-gray-300 leading-relaxed font-mono">
                JOIN <strong className="text-green-400 bg-green-500/10 px-1">{stats?.totalUsers || '2_MILLION'}_USERS</strong> who trust our platform for secure, fast downloads 
                of premium applications without subscriptions or licenses.
              </p>
            </div>
          </div>
          
          {/* Enhanced Metro CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 md:gap-8 justify-center items-center pt-8 md:pt-12">
            <Link href="/apps" className="group w-full sm:w-auto">
              <div className="bg-red-600 border-2 border-red-500 hover:bg-red-700 hover:border-red-400 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black relative overflow-hidden" style={{width: '220px', height: '140px'}}>
                {/* Metro Tile Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 relative z-10">
                  <FaRocket className="text-3xl md:text-4xl mb-3 group-hover:rotate-12 transition-transform duration-300 text-white" />
                  <div className="text-lg md:text-xl font-bold text-white mb-1">BROWSE APPS</div>
                  <div className="text-xs md:text-sm text-red-100">{stats?.totalApps || '10,000+'}+ Available</div>
                </div>
                
                {/* Corner Accent */}
                <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-white/30"></div>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-800/20 group-hover:from-red-500/20 group-hover:to-red-800/40 transition-all duration-300"></div>
              </div>
            </Link>
            
            <Link href="/categories" className="group w-full sm:w-auto">
              <div className="bg-black border-2 border-red-500 hover:bg-gray-900 hover:border-red-400 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black relative overflow-hidden" style={{width: '220px', height: '140px'}}>
                {/* Metro Tile Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 relative z-10">
                  <FaGem className="text-3xl md:text-4xl mb-3 text-red-400" />
                  <div className="text-lg md:text-xl font-bold text-white mb-1">CATEGORIES</div>
                  <div className="text-xs md:text-sm text-gray-300">Explore by Type</div>
                </div>
                
                {/* Corner Accent */}
                <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-red-500/50"></div>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-500/10 group-hover:from-red-500/10 group-hover:to-red-500/20 transition-all duration-300"></div>
              </div>
            </Link>
          </div>
          
          {/* Trust Signals */}
          <div className="mt-12 md:mt-16">
            <TrustSignals />
          </div>
        </header>
      </div>
    </section>
  )
}

export default HeroSection