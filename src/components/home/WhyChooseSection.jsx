import { FiShield, FiZap, FiDollarSign, FiUsers, FiMonitor, FiRefreshCw } from 'react-icons/fi'
import { BiInfinite } from 'react-icons/bi'
import { RiVirusFill } from 'react-icons/ri'

const WhyChooseSection = () => {
  const features = [
    {
      icon: FiShield,
      title: '100% Safe & Tested',
      description: 'Every application is thoroughly scanned for viruses and malware. Our security team ensures all downloads are completely safe.',
      color: 'from-red-500 to-red-700',
      delay: '0s'
    },
    {
      icon: FiZap,
      title: 'Lightning Fast Downloads',
      description: 'Our high-speed servers ensure maximum download speeds. No waiting, no throttling - just instant access.',
      color: 'from-red-600 to-red-800',
      delay: '0.2s'
    },
    {
      icon: FiDollarSign,
      title: 'Always Free',
      description: 'No subscriptions, no hidden fees, no premium accounts. Access thousands of premium applications without spending a penny.',
      color: 'from-red-700 to-red-900',
      delay: '0.4s'
    },
    {
      icon: FiUsers,
      title: 'Trusted Community',
      description: 'Join over 2 million users worldwide who trust our platform for safe, reliable downloads of cracked applications.',
      color: 'from-red-500 to-red-700',
      delay: '0.6s'
    },
    {
      icon: FiMonitor,
      title: 'All Platforms',
      description: 'Windows, Mac, Android, or iOS applications - we have everything covered. Cross-platform compatibility guaranteed.',
      color: 'from-red-600 to-red-800',
      delay: '0.8s'
    },
    {
      icon: FiRefreshCw,
      title: 'Latest Versions',
      description: 'We constantly update our database with the newest versions. Get access to the latest features and improvements.',
      color: 'from-red-700 to-red-900',
      delay: '1s'
    }
  ]

  return (
    <section className="py-20 bg-gray-900 relative overflow-hidden">
      {/* Matrix Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="matrix-bg"></div>
      </div>
      
      {/* Floating Code Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="floating-code" style={{ top: '10%', left: '5%', animationDelay: '0s' }}>{'{ hack: true }'}</div>
        <div className="floating-code" style={{ top: '20%', right: '10%', animationDelay: '2s' }}>{'[CRACKED]'}</div>
        <div className="floating-code" style={{ top: '60%', left: '8%', animationDelay: '4s' }}>{'> download.exe'}</div>
        <div className="floating-code" style={{ top: '80%', right: '15%', animationDelay: '6s' }}>{'0x1337'}</div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 terminal-text">
            <span className="text-red-500">[</span>WHY CHOOSE<span className="text-red-500">]</span>
            <br />
            <span className="text-red-500">CRACKMARKET.XYZ</span>
          </h2>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
            The most trusted platform for downloading premium software applications completely free
          </p>
          
          {/* Terminal Line */}
          <div className="mt-8 flex justify-center">
            <div className="bg-black border border-red-500 rounded px-6 py-2">
              <span className="text-green-400 font-mono">
               INITIALIZING SECURITY PROTOCOLS...
                <span className="animate-pulse text-red-500 ml-2">█</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                key={index}
                className="metro-tile group hover:scale-105 transition-all duration-500 cursor-pointer"
                style={{ animationDelay: feature.delay }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                {/* Scan Lines */}
                <div className="absolute inset-0 scan-lines opacity-20"></div>
                
                {/* Glitch Effect */}
                <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
                
                <div className="relative z-10 p-8">
                  <div className="mb-6">
                    <IconComponent className="w-16 h-16 text-white group-hover:animate-pulse" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 terminal-text">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-200 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Status Indicator */}
                  <div className="mt-6 flex items-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
                    <span className="text-green-400 font-mono text-sm">ACTIVE</span>
                  </div>
                </div>
                
                {/* Corner Brackets */}
                <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-red-400 opacity-60 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-red-400 opacity-60 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-red-400 opacity-60 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-red-400 opacity-60 group-hover:opacity-100 transition-opacity"></div>
              </div>
            )
          })}
        </div>
        
        {/* Bottom Terminal */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-black border border-red-500 rounded px-6 py-3">
            <span className="text-green-400 font-mono">
               SECURITY_SCAN: COMPLETE | THREAT_LEVEL: ZERO | STATUS: OPERATIONAL
              <span className="animate-pulse text-red-500 ml-2">█</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyChooseSection