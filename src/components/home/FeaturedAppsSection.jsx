'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FiDownload, FiStar, FiMonitor, FiHardDrive, FiShield, FiZap } from 'react-icons/fi'
import { FaSkull, FaTerminal } from 'react-icons/fa'
import { useState } from 'react'

const FeaturedAppsSection = ({ featuredApps, loading }) => {
  const [hoveredApp, setHoveredApp] = useState(null)

  if (loading) {
    return (
      <section className="py-20 bg-gray-900 relative overflow-hidden">
        {/* Matrix Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="matrix-bg"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 terminal-text">
              <span className="text-red-500">[</span>SCANNING APPS<span className="text-red-500">]</span>
            </h2>
            <div className="flex justify-center items-center space-x-4 mb-8">
              <FaTerminal className="text-red-500 text-2xl animate-pulse" />
              <div className="text-green-400 font-mono text-lg">
                INITIALIZING_APP_DATABASE...
                <span className="animate-pulse text-red-500 ml-2">█</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="metro-tile animate-pulse" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="relative h-80">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-black opacity-90"></div>
                  <div className="absolute inset-0 scan-lines opacity-30"></div>
                  
                  <div className="relative z-10 p-6 h-full flex flex-col justify-center items-center">
                    <FaSkull className="text-4xl text-red-500 mb-4 animate-pulse" />
                    <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
                      <div className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full animate-loading-bar"></div>
                    </div>
                    <p className="text-gray-300 font-mono text-sm text-center">
                      LOADING_APP_{index + 1}
                    </p>
                  </div>
                  
                  {/* Corner Brackets */}
                  <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-red-400 opacity-60"></div>
                  <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-red-400 opacity-60"></div>
                  <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-red-400 opacity-60"></div>
                  <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-red-400 opacity-60"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-900 relative overflow-hidden">
      {/* Matrix Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="matrix-bg"></div>
      </div>
      
      {/* Floating Code Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-red-500/20 font-mono text-sm animate-float" style={{animationDelay: '0s'}}>{'<apps>'}</div>
        <div className="absolute top-40 right-20 text-red-500/20 font-mono text-sm animate-float" style={{animationDelay: '2s'}}>{'download()'}</div>
        <div className="absolute bottom-40 left-20 text-red-500/20 font-mono text-sm animate-float" style={{animationDelay: '4s'}}>{'[cracked]'}</div>
        <div className="absolute bottom-20 right-10 text-red-500/20 font-mono text-sm animate-float" style={{animationDelay: '6s'}}>{'</premium>'}</div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 terminal-text">
            <span className="text-red-500">[</span>TRENDING<span className="text-red-500">]</span>
            <br />
            <span className="text-red-500">CRACKED APPS</span>
          </h2>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto mb-8">
            Most downloaded premium applications this week. All apps are 100% free, fully cracked, and virus-scanned.
          </p>
          
          {/* Enhanced Status Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
            <div className="metro-tile-small group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-black opacity-90"></div>
              <div className="relative z-10 p-4 text-center">
                <FiShield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-green-400 font-mono text-sm font-bold">VIRUS FREE</div>
                <div className="text-gray-300 text-xs">100% Clean</div>
              </div>
            </div>
            
            <div className="metro-tile-small group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-black opacity-90"></div>
              <div className="relative z-10 p-4 text-center">
                <FiZap className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-blue-400 font-mono text-sm font-bold">INSTANT DL</div>
                <div className="text-gray-300 text-xs">No Wait Time</div>
              </div>
            </div>
            
            <div className="metro-tile-small group">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 to-black opacity-90"></div>
              <div className="relative z-10 p-4 text-center">
                <FaSkull className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-yellow-400 font-mono text-sm font-bold">FULL VER</div>
                <div className="text-gray-300 text-xs">Premium Unlocked</div>
              </div>
            </div>
          </div>
        </div>

        {featuredApps && featuredApps.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredApps.slice(0, 6).map((app, index) => (
                <div
                  key={app._id || index}
                  className="metro-tile group hover:scale-105 transition-all duration-500 cursor-pointer"
                  onMouseEnter={() => setHoveredApp(index)}
                  onMouseLeave={() => setHoveredApp(null)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-900 opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Enhanced Scan Lines */}
                  <div className="absolute inset-0 scan-lines opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                  
                  {/* Glitch Effect */}
                  <div className={`absolute inset-0 bg-red-500 transition-opacity duration-200 ${
                    hoveredApp === index ? 'opacity-10' : 'opacity-0'
                  }`}></div>
                  
                  {/* Hover Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-red-400/20 to-transparent transition-opacity duration-300 ${
                    hoveredApp === index ? 'opacity-100' : 'opacity-0'
                  }`}></div>
                  
                  <div className="relative z-10 p-6 h-full flex flex-col">
                    {/* App Icon with Enhanced Styling */}
                    <div className="mb-4 flex justify-center">
                      <div className="relative">
                        {app.icon ? (
                          <Image
                            src={app.icon}
                            alt={app.name}
                            width={64}
                            height={64}
                            className="rounded-lg shadow-lg border-2 border-red-500/30 group-hover:border-red-400 transition-colors duration-300"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center border-2 border-red-500/30 group-hover:border-red-400 transition-colors duration-300">
                            <FiMonitor className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        {/* Status Indicator */}
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* App Info */}
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-white mb-2 terminal-text line-clamp-2 group-hover:text-red-100 transition-colors duration-300">
                        <span className="text-red-400">[</span>{app.name}<span className="text-red-400">]</span>
                      </h3>
                      
                      <p className="text-gray-200 text-sm mb-4 line-clamp-2 group-hover:text-gray-100 transition-colors duration-300">
                        {app.description || `Download ${app.name} for free - Premium cracked version available`}
                      </p>
                      
                      {/* Enhanced App Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                        <div className="flex items-center bg-black/30 rounded px-2 py-1">
                          <FiStar className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-white font-mono">{app.rating || '4.5'}</span>
                        </div>
                        <div className="flex items-center bg-black/30 rounded px-2 py-1">
                          <FiDownload className="w-4 h-4 text-green-400 mr-1" />
                          <span className="text-white font-mono">{app.downloadCount || '1.2K'}</span>
                        </div>
                        <div className="flex items-center bg-black/30 rounded px-2 py-1">
                          <FiMonitor className="w-4 h-4 text-blue-400 mr-1" />
                          <span className="text-white text-xs font-mono">{app.operatingSystem || 'WIN'}</span>
                        </div>
                        <div className="flex items-center bg-black/30 rounded px-2 py-1">
                          <FiHardDrive className="w-4 h-4 text-purple-400 mr-1" />
                          <span className="text-white text-xs font-mono">{app.fileSize || '2.5GB'}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced Download Button */}
                    <Link href={`/app/${app.slug || app._id}`}>
                      <button className="w-full metro-button bg-black border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-3 font-bold transition-all duration-300 group-hover:shadow-lg group-hover:shadow-red-500/25 relative overflow-hidden">
                        {/* Button Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        
                        <div className="flex items-center justify-center space-x-2 relative z-10">
                          <FiDownload className="w-5 h-5" />
                          <span>DOWNLOAD</span>
                        </div>
                      </button>
                    </Link>
                  </div>
                  
                  {/* Enhanced Corner Brackets */}
                  <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-red-400 opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:border-red-300"></div>
                  <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-red-400 opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:border-red-300"></div>
                  <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-red-400 opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:border-red-300"></div>
                  <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-red-400 opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:border-red-300"></div>
                </div>
              ))}
            </div>
            
            {/* Enhanced View All Apps CTA */}
            <div className="text-center mt-16">
              <Link href="/apps">
                <button className="metro-button bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white px-12 py-4 text-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 relative overflow-hidden">
                  {/* Button Animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000"></div>
                  
                  <div className="flex items-center space-x-3 relative z-10">
                    <FaTerminal className="w-6 h-6" />
                    <span>VIEW ALL APPS</span>
                    <FiDownload className="w-6 h-6" />
                  </div>
                </button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="metro-tile mx-auto max-w-md">
              <div className="relative p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 to-black opacity-90"></div>
                <div className="absolute inset-0 scan-lines opacity-20"></div>
                
                <div className="relative z-10">
                  <FaSkull className="text-6xl text-gray-400 mx-auto mb-4" />
                  <div className="text-gray-400 text-xl mb-4 terminal-text">
                    <span className="text-red-500">[</span>NO APPS<span className="text-red-500">]</span>
                  </div>
                  <p className="text-gray-500 font-mono text-sm mb-6">
                    FEATURED_APPS: 0 | STATUS: EMPTY_DATABASE
                  </p>
                  <Link href="/apps">
                    <button className="metro-button bg-red-600 hover:bg-red-700 text-white px-6 py-3">
                      Browse All Apps
                    </button>
                  </Link>
                </div>
                
                {/* Corner Brackets */}
                <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-red-400 opacity-60"></div>
                <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-red-400 opacity-60"></div>
                <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-red-400 opacity-60"></div>
                <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-red-400 opacity-60"></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Enhanced Terminal Status */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-black border-2 border-red-500 rounded px-8 py-4 relative overflow-hidden">
            {/* Terminal Glow */}
            <div className="absolute inset-0 bg-red-500/5 animate-pulse"></div>
            
            <div className="relative z-10">
              <span className="text-green-400 font-mono text-lg">
                LOADING_COMPLETE | APPS_SCANNED: {featuredApps?.length || 0} | STATUS: READY_FOR_DOWNLOAD
                <span className="animate-pulse text-red-500 ml-2 text-xl">█</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedAppsSection