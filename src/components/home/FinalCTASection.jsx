import Link from 'next/link'
import { FiDownload, FiArrowRight, FiShield } from 'react-icons/fi'
import { useState, useEffect } from 'react'

const FinalCTASection = () => {
  const [terminalText, setTerminalText] = useState('')
  const fullText = 'READY TO ACCESS PREMIUM SOFTWARE FOR FREE?'
  
  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTerminalText(fullText.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
      }
    }, 100)
    
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Matrix Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="matrix-bg"></div>
      </div>
      
      {/* Glitch Lines */}
      <div className="absolute inset-0">
        <div className="glitch-line" style={{ top: '15%', animationDelay: '0s' }}></div>
        <div className="glitch-line" style={{ top: '45%', animationDelay: '3s' }}></div>
        <div className="glitch-line" style={{ top: '75%', animationDelay: '6s' }}></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="floating-code" style={{ top: '10%', left: '5%', animationDelay: '0s' }}>{'#!/bin/bash'}</div>
        <div className="floating-code" style={{ top: '25%', right: '8%', animationDelay: '2s' }}>{'sudo crack --all'}</div>
        <div className="floating-code" style={{ top: '60%', left: '10%', animationDelay: '4s' }}>{'> access_granted'}</div>
        <div className="floating-code" style={{ top: '80%', right: '12%', animationDelay: '6s' }}>{'[UNLIMITED]'}</div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Terminal Header */}
          <div className="mb-8">
            <div className="inline-block bg-gray-900 border border-red-500 rounded-lg p-6 max-w-3xl">
              <div className="flex items-center mb-4">
                <div className="flex space-x-2 mr-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-gray-400 font-mono text-sm">terminal@crackmarket.xyz</span>
              </div>
              <div className="text-left">
                <span className="text-green-400 font-mono">root@hacker:~$ </span>
                <span className="text-white font-mono typewriter">
                  {terminalText}
                  <span className="animate-pulse text-red-500">█</span>
                </span>
              </div>
            </div>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 terminal-text">
            <span className="text-red-500">[</span>JOIN THE<span className="text-red-500">]</span>
            <br />
            <span className="text-red-500">REVOLUTION</span>
          </h2>
          
          <p className="text-gray-300 text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed">
            Join millions of users who have discovered the power of free premium applications. 
            Start downloading today and unlock unlimited possibilities.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Link href="/apps" className="group">
              <button className="metro-button bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white px-8 py-4 text-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center space-x-3">
                  <FiDownload className="w-6 h-6 group-hover:animate-bounce" />
                  <span>START DOWNLOADING</span>
                  <FiArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </Link>
            
            <Link href="/categories" className="group">
              <button className="metro-button bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-8 py-4 text-xl font-bold transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <FiShield className="w-6 h-6" />
                  <span>BROWSE CATEGORIES</span>
                </div>
              </button>
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-gray-900 border border-red-500 rounded-lg p-6 hover:bg-gray-800 transition-colors">
              <div className="text-3xl font-bold text-red-500 mb-2">2M+</div>
              <div className="text-gray-300">Trusted Users</div>
            </div>
            <div className="bg-gray-900 border border-red-500 rounded-lg p-6 hover:bg-gray-800 transition-colors">
              <div className="text-3xl font-bold text-red-500 mb-2">21K+</div>
              <div className="text-gray-300">Premium Apps</div>
            </div>
            <div className="bg-gray-900 border border-red-500 rounded-lg p-6 hover:bg-gray-800 transition-colors">
              <div className="text-3xl font-bold text-red-500 mb-2">100%</div>
              <div className="text-gray-300">Virus Free</div>
            </div>
          </div>
          
          {/* Final Terminal Message */}
          <div className="mt-12">
            <div className="inline-block bg-black border border-green-500 rounded px-6 py-3">
              <span className="text-green-400 font-mono">
                WELCOME TO THE DARK SIDE OF SOFTWARE
                <span className="animate-pulse text-green-400 ml-2">█</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FinalCTASection