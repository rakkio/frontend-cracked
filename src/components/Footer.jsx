'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  FaGithub, 
  FaDiscord, 
  FaTelegram, 
  FaTwitter, 
  FaShieldAlt, 
  FaTerminal, 
  FaCode, 
  FaLock, 
  FaServer, 
  FaDatabase,
  FaDownload,
  FaFire,
  FaHeart,
  FaSkull,
  FaRocket,
  FaStar
} from 'react-icons/fa'
import { api } from '@/lib/api'

export default function Footer() {
  const [stats, setStats] = useState({
    totalApps: 0,
    totalDownloads: 0,
    totalUsers: 0
  })

  useEffect(() => {
    // Fetch stats from API or set default values
    setStats({
      totalApps: 50000,
      totalDownloads: 100000,
      totalUsers: 1000000
    })
  }, [])

  const quickLinks = [
    { name: 'Popular Apps', href: '/popular', icon: '🔥' },
    { name: 'New Releases', href: '/new-releases', icon: '🆕' },
    { name: 'Categories', href: '/categories', icon: '📂' },
    { name: 'Top Rated', href: '/top-rated', icon: '⭐' },
  ]

  const supportLinks = [
    { name: 'How to Install', href: '/how-to-install', icon: '📋' },
    { name: 'Safety Guide', href: '/safety-guide', icon: '🛡️' },
    { name: 'FAQ', href: '/faq', icon: '❓' },
    { name: 'Contact', href: '/contact', icon: '📞' },
  ]

  const legalLinks = [
    { name: 'Terms of Service', href: '/legal/terms' },
    { name: 'Privacy Policy', href: '/legal/privacy' },
    { name: 'Disclaimer', href: '/legal/disclaimer' },
  ]

  const socialLinks = [
    { name: 'Telegram', href: '#', icon: FaTelegram, color: 'hover:text-blue-400 hover:shadow-blue-400/20' },
    { name: 'Discord', href: '#', icon: FaDiscord, color: 'hover:text-indigo-400 hover:shadow-indigo-400/20' },
    { name: 'Twitter', href: '#', icon: FaTwitter, color: 'hover:text-blue-300 hover:shadow-blue-300/20' },
    { name: 'GitHub', href: '#', icon: FaGithub, color: 'hover:text-gray-300 hover:shadow-gray-300/20' },
  ]

  const statsDisplay = [
    { label: 'Apps Available', value: '50K+', icon: FaDownload, color: 'from-blue-500 to-cyan-500' },
    { label: 'Daily Downloads', value: '100K+', icon: FaFire, color: 'from-orange-500 to-red-500' },
    { label: 'Active Users', value: '1M+', icon: FaHeart, color: 'from-pink-500 to-rose-500' },
    { label: 'Success Rate', value: '99.9%', icon: FaShieldAlt, color: 'from-green-500 to-emerald-500' },
  ]

  return (
    <>
      {/* Matrix Background */}
      <div className="relative bg-black border-t-2 border-red-500 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-red-900/10 to-transparent"></div>
        
        {/* Scan Lines */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent animate-pulse"></div>
        
        {/* Floating Code Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating-code text-red-500/10 text-xs font-mono">
            {['0x7C00', 'EOF', 'NULL', 'EXEC', 'ROOT'].map((code, i) => (
              <span key={i} className={`absolute animate-float-${i + 1}`} style={{
                left: `${10 + i * 20}%`,
                top: `${20 + i * 15}%`,
                animationDelay: `${i * 0.7}s`
              }}>
                {code}
              </span>
            ))}
          </div>
        </div>

        <div className="relative container mx-auto px-4 py-12">
          {/* Warning Banner */}
          <div className="mb-8 p-4 bg-red-900/20 border-2 border-red-500 backdrop-blur-sm relative">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-500"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-500"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-500"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-500"></div>
            
            <div className="flex items-center space-x-3">
              <FaShieldAlt className="text-red-500 text-xl animate-pulse" />
              <div>
                <p className="text-red-400 font-mono text-sm font-bold">
                  [WARNING] SECURITY NOTICE
                </p>
                <p className="text-gray-300 text-xs font-mono mt-1">
                  This site is for educational purposes only. Use responsibly and respect software licenses.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-red-500 font-mono text-lg font-bold flex items-center space-x-2">
                <FaTerminal className="text-red-500" />
                <span>[QUICK_ACCESS]</span>
              </h3>
              <div className="space-y-2">
                {[
                  { href: '/', label: 'Home' },
                  { href: '/categories', label: 'Categories' },
                  { href: '/latest', label: 'Latest Apps' },
                  { href: '/popular', label: 'Popular' },
                  { href: '/search', label: 'Search' }
                ].map((link) => (
                  <Link key={link.href} href={link.href} className="block group">
                    <div className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors duration-300 font-mono text-sm">
                      <span className="text-red-500 group-hover:text-red-400">
                        
                      </span>
                      <span>{link.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="text-red-500 font-mono text-lg font-bold flex items-center space-x-2">
                <FaCode className="text-red-500" />
                <span>[SUPPORT]</span>
              </h3>
              <div className="space-y-2">
                {[
                  { href: '/help', label: 'Help Center' },
                  { href: '/faq', label: 'FAQ' },
                  { href: '/contact', label: 'Contact' },
                  { href: '/report', label: 'Report Issue' },
                  { href: '/feedback', label: 'Feedback' }
                ].map((link) => (
                  <Link key={link.href} href={link.href} className="block group">
                    <div className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors duration-300 font-mono text-sm">
                      <span className="text-red-500 group-hover:text-red-400"></span>
                      <span>{link.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h3 className="text-red-500 font-mono text-lg font-bold flex items-center space-x-2">
                <FaLock className="text-red-500" />
                <span>[LEGAL]</span>
              </h3>
              <div className="space-y-2">
                {[
                  { href: '/privacy', label: 'Privacy Policy' },
                  { href: '/terms', label: 'Terms of Service' },
                  { href: '/dmca', label: 'DMCA' },
                  { href: '/disclaimer', label: 'Disclaimer' },
                  { href: '/cookies', label: 'Cookie Policy' }
                ].map((link) => (
                  <Link key={link.href} href={link.href} className="block group">
                    <div className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors duration-300 font-mono text-sm">
                      <span className="text-red-500 group-hover:text-red-400"></span>
                      <span>{link.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Social & Stats */}
            <div className="space-y-4">
              <h3 className="text-red-500 font-mono text-lg font-bold flex items-center space-x-2">
                <FaServer className="text-red-500" />
                <span>[NETWORK]</span>
              </h3>
              
              {/* Social Links */}
              <div className="flex space-x-3">
                {[
                  { icon: FaGithub, href: '#', label: 'GitHub' },
                  { icon: FaDiscord, href: '#', label: 'Discord' },
                  { icon: FaTelegram, href: '#', label: 'Telegram' },
                  { icon: FaTwitter, href: '#', label: 'Twitter' }
                ].map((social) => (
                  <a key={social.label} href={social.href} className="group relative">
                    <div className="w-10 h-10 bg-gray-900 border border-red-500/50 hover:border-red-500 flex items-center justify-center transition-all duration-300 hover:bg-red-500/10">
                      <social.icon className="text-red-500 hover:text-red-400 transition-colors" />
                    </div>
                  </a>
                ))}
              </div>

              {/* Stats */}
              <div className="space-y-3 mt-6">
                <div className="bg-gray-900/50 border border-red-500/30 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 font-mono text-xs">TOTAL_APPS:</span>
                    <span className="text-red-400 font-mono text-sm font-bold">
                      {stats.totalApps?.toLocaleString() || '---'}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-900/50 border border-red-500/30 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 font-mono text-xs">DOWNLOADS:</span>
                    <span className="text-red-400 font-mono text-sm font-bold">
                      {stats.totalDownloads?.toLocaleString() || '---'}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-900/50 border border-red-500/30 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 font-mono text-xs">USERS:</span>
                    <span className="text-red-400 font-mono text-sm font-bold">
                      {stats.totalUsers?.toLocaleString() || '---'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 pt-8 border-t border-red-500/30">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <FaDatabase className="text-red-500" />
                  <span className="text-gray-400 font-mono text-sm">
                    © 2024 APPS[CRACKED] - All rights reserved
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-gray-500 font-mono text-xs">
                <span>STATUS: ONLINE</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>UPTIME: 99.9%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(5deg); opacity: 0.7; }
        }
        
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-25px) rotate(-3deg); opacity: 0.6; }
        }
        
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
          50% { transform: translateY(-15px) rotate(2deg); opacity: 0.8; }
        }
        
        @keyframes float-4 {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-30px) rotate(-4deg); opacity: 0.5; }
        }
        
        @keyframes float-5 {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-18px) rotate(1deg); opacity: 0.6; }
        }
        
        .animate-float-1 { animation: float-1 6s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 7s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 5s ease-in-out infinite; }
        .animate-float-4 { animation: float-4 8s ease-in-out infinite; }
        .animate-float-5 { animation: float-5 6.5s ease-in-out infinite; }
      `}</style>
    </>
  )
}

