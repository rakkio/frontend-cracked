import React from 'react'
import Link from 'next/link'
import { FaSkull, FaGithub, FaTelegram, FaDiscord, FaTwitter, FaShieldAlt, FaDownload, FaFire, FaHeart, FaStar, FaRocket } from 'react-icons/fa'

export default function Footer() {
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

  const stats = [
    { label: 'Apps Available', value: '50K+', icon: FaDownload, color: 'from-blue-500 to-cyan-500' },
    { label: 'Daily Downloads', value: '100K+', icon: FaFire, color: 'from-orange-500 to-red-500' },
    { label: 'Active Users', value: '1M+', icon: FaHeart, color: 'from-pink-500 to-rose-500' },
    { label: 'Success Rate', value: '99.9%', icon: FaShieldAlt, color: 'from-green-500 to-emerald-500' },
  ]

  return (
    <footer className='relative bg-gradient-to-t from-black via-gray-900 to-gray-800 border-t border-red-500/20 overflow-hidden'>
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.03)_1px,transparent_0)] [background-size:30px_30px] opacity-40"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-red-600/5 to-orange-600/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/5 to-red-600/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Stats Section */}
      <div className='relative border-b border-gray-800/50'>
        <div className='container mx-auto px-6 py-12'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            {stats.map((stat, index) => (
              <div key={index} className='text-center group cursor-pointer'>
                <div className='relative mb-6'>
                  <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-xl group-hover:shadow-2xl`}>
                    <stat.icon className='text-2xl text-white group-hover:animate-bounce' />
                  </div>
                  <div className={`absolute inset-0 w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${stat.color} blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500`}></div>
                </div>
                <div className='text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300'>
                  {stat.value}
                </div>
                <div className='text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 font-medium'>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className='container mx-auto px-6 py-16 relative z-10'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>
          {/* Brand Section */}
          <div className='lg:col-span-1'>
            <div className='flex items-center space-x-4 mb-8'>
              <div className='relative'>
                <div className='w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl shadow-red-500/30'>
                  <FaSkull className='text-white text-2xl animate-pulse' />
                </div>
                <div className='absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-400 to-orange-400 rounded-full flex items-center justify-center animate-bounce'>
                  <span className='text-xs text-white font-bold'>!</span>
                </div>
              </div>
              <div>
                <h3 className='text-2xl font-bold bg-gradient-to-r from-red-400 via-red-500 to-orange-500 bg-clip-text text-transparent'>
                  Black Market
                </h3>
                <p className='text-sm text-gray-400 font-medium'>Underground Apps Hub</p>
              </div>
            </div>
            <p className='text-gray-400 text-sm leading-relaxed mb-8 font-light'>
              Your ultimate destination for premium applications. Access the digital underground with confidence and cutting-edge security protocols.
            </p>
            <div className='flex space-x-4 mb-8'>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`p-3 bg-gray-800/40 rounded-xl text-gray-400 ${social.color} transition-all duration-300 hover:scale-110 transform hover:shadow-lg backdrop-blur-sm border border-gray-700/30 hover:border-gray-600/50`}
                  aria-label={social.name}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
            <div className='p-4 bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-2xl border border-red-500/20'>
              <div className='flex items-center space-x-2 mb-2'>
                <div className='w-3 h-3 bg-green-500 rounded-full animate-pulse'></div>
                <span className='text-green-400 text-sm font-medium'>System Status: Online</span>
              </div>
              <div className='text-xs text-gray-400'>
                Last updated: {new Date().toLocaleString()}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='text-white font-bold mb-6 flex items-center text-lg'>
              <div className='w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center mr-3'>
                <FaRocket className='text-white text-sm' />
              </div>
              Quick Access
            </h4>
            <ul className='space-y-3'>
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className='group flex items-center space-x-3 p-3 text-gray-400 hover:text-white transition-all duration-300 rounded-xl hover:bg-gray-800/30 border border-transparent hover:border-red-500/20'
                  >
                    <span className='text-lg group-hover:scale-110 transition-transform duration-300'>
                      {link.icon}
                    </span>
                    <span className='text-sm font-medium'>{link.name}</span>
                    <div className='ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-red-400'>
                      →
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className='text-white font-bold mb-6 flex items-center text-lg'>
              <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3'>
                <FaShieldAlt className='text-white text-sm' />
              </div>
              Support Hub
            </h4>
            <ul className='space-y-3'>
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className='group flex items-center space-x-3 p-3 text-gray-400 hover:text-white transition-all duration-300 rounded-xl hover:bg-gray-800/30 border border-transparent hover:border-blue-500/20'
                  >
                    <span className='text-lg group-hover:scale-110 transition-transform duration-300'>
                      {link.icon}
                    </span>
                    <span className='text-sm font-medium'>{link.name}</span>
                    <div className='ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-blue-400'>
                      →
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className='text-white font-bold mb-6 flex items-center text-lg'>
              <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3'>
                <FaStar className='text-white text-sm' />
              </div>
              Underground Updates
            </h4>
            <p className='text-gray-400 text-sm mb-6 leading-relaxed font-light'>
              Get exclusive access to the latest releases, premium tools, and underground software before anyone else.
            </p>
            <div className='space-y-4'>
              <div className='relative'>
                <input
                  type="email"
                  placeholder="Enter your secure email..."
                  className='w-full px-4 py-3 bg-gray-800/60 border border-gray-600/50 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 backdrop-blur-sm'
                />
                <button className='absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-300 text-xs font-bold hover:scale-105 shadow-lg hover:shadow-purple-500/30'>
                  JOIN
                </button>
              </div>
              <div className='flex items-center space-x-2 text-xs text-gray-500'>
                <FaShieldAlt className='text-green-400' />
                <span>Encrypted • No spam • Underground exclusive</span>
              </div>
            </div>
            
            {/* Special features */}
            <div className='mt-8 p-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-500/20'>
              <h5 className='text-purple-400 font-semibold text-sm mb-2'>💎 VIP Benefits:</h5>
              <ul className='text-xs text-gray-400 space-y-1'>
                <li>• Early access to premium apps</li>
                <li>• Exclusive cracking tutorials</li>
                <li>• Priority support channel</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className='relative border-t border-gray-800/50 bg-black/40 backdrop-blur-xl'>
        <div className='container mx-auto px-6 py-8'>
          <div className='flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0'>
            <div className='flex flex-wrap justify-center lg:justify-start gap-6 text-sm'>
              {legalLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className='text-gray-500 hover:text-red-400 transition-colors duration-300 hover:underline decoration-red-400/50'
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className='text-center lg:text-right'>
              <p className='text-sm text-gray-500 mb-2 font-medium'>
                © 2025 Black Market Hub. All rights reserved.
              </p>
              <p className='text-xs text-gray-600 flex items-center justify-center lg:justify-end space-x-2'>
                <FaSkull className='text-red-500 animate-pulse' />
                <span>Underground Apps Network - Educational & Research Purposes</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Warning Banner */}
      <div className='relative bg-gradient-to-r from-red-900/30 via-orange-900/30 to-red-900/30 border-t border-red-500/50 backdrop-blur-xl'>
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-transparent to-red-600/10 animate-pulse"></div>
        <div className='container mx-auto px-6 py-4 relative z-10'>
          <div className='flex items-center justify-center space-x-3 text-center'>
            <div className='flex items-center space-x-2'>
              <FaShieldAlt className='text-red-400 text-lg animate-bounce' />
              <div className='w-2 h-2 bg-red-500 rounded-full animate-ping'></div>
            </div>
            <p className='text-sm text-gray-300 font-medium'>
              <span className='text-red-400 font-bold'>⚠️ SECURITY ALERT:</span> 
              Always verify downloads through our secure channels. Your digital safety is our priority.
              <span className='text-orange-400 font-semibold ml-2'>Stay Underground, Stay Safe.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
