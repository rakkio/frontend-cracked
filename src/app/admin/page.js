'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import StatsCard from '@/components/admin/StatsCard'
import { useAuth } from '@/contexts/AuthContext'
import { useAdminStats } from '@/hooks/useAdminStats'
import { useBannerStats } from '@/hooks/useBanners'
import { useRouter } from 'next/navigation'
import { 
  FaUsers, 
  FaMobileAlt, 
  FaDownload, 
  FaChartLine, 
  FaFolder, 
  FaSyncAlt,
  FaStar,
  FaFire,
  FaEye,
  FaCog,
  FaShieldAlt,
  FaUserShield,
  FaTachometerAlt,
  FaBullhorn,
  FaImage,
  FaMousePointer
} from 'react-icons/fa'

export default function AdminDashboard() {
    const { user } = useAuth()
    const router = useRouter()
    const { stats, loading, error, refresh, derivedMetrics } = useAdminStats()
    const { stats: bannerStats, loading: bannerLoading } = useBannerStats()

    return (
        <ProtectedRoute requireAdmin={true}>
            <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
                <div className="max-w-7xl mx-auto p-2 sm:p-4 space-y-4 sm:space-y-6">
                    
                    {/* Header - Windows Phone Style */}
                    <div className="flex items-center justify-between mb-4 sm:mb-8">
                        <div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-white mb-1 tracking-wide">
                                admin
                            </h1>
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-light text-blue-400 mb-4">
                                dashboard
                            </h2>
                            <p className="text-sm sm:text-base lg:text-lg font-light text-gray-300">
                                Welcome back, <span className="text-blue-400 font-normal">{user?.name || 'administrator'}</span>
                            </p>
                        </div>
                        <button
                            onClick={refresh}
                            disabled={loading}
                            className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 hover:bg-blue-500 text-white font-light text-xs sm:text-sm transition-all duration-200 flex flex-col items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform"
                            style={{ borderRadius: '0px' }}
                        >
                            <FaSyncAlt className={`text-base sm:text-xl mb-1 ${loading ? 'animate-spin' : ''}`} />
                            <span className="text-xs hidden sm:block">refresh</span>
                        </button>
                    </div>

                    {/* Error State - Windows Phone Style */}
                    {error && (
                        <div className="bg-red-600 p-6 mb-6" style={{ borderRadius: '0px' }}>
                            <div className="flex items-center space-x-3 text-white">
                                <FaShieldAlt className="text-2xl" />
                                <span className="font-light text-lg">system error</span>
                            </div>
                            <p className="text-red-100 mt-2 font-light">{error}</p>
                        </div>
                    )}

                    {/* Main Tiles Grid - Windows Phone Style */}
                    <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-2 auto-rows-[100px] sm:auto-rows-[120px]">
                        {/* Large Applications Tile */}
                        <div 
                            className="col-span-4 sm:col-span-6 lg:col-span-6 row-span-2 bg-blue-600 hover:bg-blue-500 p-4 sm:p-6 cursor-pointer transition-all duration-200 transform hover:scale-[1.02] flex flex-col justify-between"
                            onClick={() => router.push('/admin/apps')}
                            style={{ borderRadius: '0px' }}
                        >
                            <div>
                                <FaMobileAlt className="text-2xl sm:text-3xl lg:text-4xl text-white mb-2 sm:mb-3 opacity-90" />
                                <h3 className="text-white text-sm sm:text-base lg:text-lg font-extralight mb-1">applications</h3>
                                <p className="text-blue-100 text-xs sm:text-sm font-light">manage apps</p>
                            </div>
                            <div className="text-right">
                                <div className="text-white text-2xl sm:text-3xl lg:text-4xl font-ultralight">{loading ? '...' : stats.apps?.totalApps || '0'}</div>
                                <div className="text-blue-200 text-xs sm:text-sm font-light">{stats.apps?.activeApps || 0} active</div>
                            </div>
                        </div>

                        {/* Downloads Tile */}
                        <div 
                            className="col-span-2 sm:col-span-2 lg:col-span-3 bg-green-600 hover:bg-green-500 p-2 sm:p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between"
                            style={{ borderRadius: '0px' }}
                        >
                            <div>
                                <FaDownload className="text-lg sm:text-xl lg:text-2xl text-white mb-1 sm:mb-2 opacity-90" />
                                <h3 className="text-white text-xs sm:text-sm font-light">downloads</h3>
                            </div>
                            <div className="text-right">
                                <div className="text-white text-lg sm:text-xl lg:text-2xl font-light">{loading ? '...' : (stats.apps?.totalDownloads || '0')}</div>
                            </div>
                        </div>

                        {/* Categories Tile */}
                        <div 
                            className="col-span-2 sm:col-span-2 lg:col-span-3 bg-purple-600 hover:bg-purple-500 p-2 sm:p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between"
                            onClick={() => router.push('/admin/categories')}
                            style={{ borderRadius: '0px' }}
                        >
                            <div>
                                <FaFolder className="text-lg sm:text-xl lg:text-2xl text-white mb-1 sm:mb-2 opacity-90" />
                                <h3 className="text-white text-xs sm:text-sm font-light">categories</h3>
                            </div>
                            <div className="text-right">
                                <div className="text-white text-lg sm:text-xl lg:text-2xl font-light">{loading ? '...' : stats.categories?.totalCategories || '0'}</div>
                            </div>
                        </div>

                        {/* Banners Large Tile */}
                        <div 
                            className="col-span-4 sm:col-span-8 lg:col-span-6 bg-orange-600 hover:bg-orange-500 p-3 sm:p-4 cursor-pointer transition-all duration-200 flex items-center justify-between"
                            onClick={() => router.push('/admin/banners')}
                            style={{ borderRadius: '0px' }}
                        >
                            <div>
                                <FaBullhorn className="text-xl sm:text-2xl lg:text-3xl text-white mb-1 sm:mb-2 opacity-90" />
                                <h3 className="text-white text-sm sm:text-base lg:text-lg font-light">banner campaigns</h3>
                                <p className="text-orange-200 text-xs sm:text-sm">{bannerStats?.activeBanners || 0} active • {bannerStats?.avgCTR || 0}% ctr</p>
                            </div>
                            <div className="text-right">
                                <div className="text-white text-2xl sm:text-3xl lg:text-4xl font-light">{bannerLoading ? '...' : bannerStats?.totalBanners || '0'}</div>
                            </div>
                        </div>

                        {/* Users Tile */}
                        <div 
                            className="col-span-2 sm:col-span-4 lg:col-span-3 bg-red-600 hover:bg-red-500 p-2 sm:p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between"
                            onClick={() => router.push('/admin/users')}
                            style={{ borderRadius: '0px' }}
                        >
                            <div>
                                <FaUsers className="text-lg sm:text-xl lg:text-2xl text-white mb-1 sm:mb-2 opacity-90" />
                                <h3 className="text-white text-xs sm:text-sm font-light">users</h3>
                            </div>
                            <div className="text-right">
                                <div className="text-white text-lg sm:text-xl lg:text-2xl font-light">{loading ? '...' : stats.users?.totalUsers || '0'}</div>
                            </div>
                        </div>

                        {/* System Health Tile */}
                        <div 
                            className="col-span-2 sm:col-span-4 lg:col-span-3 bg-teal-600 hover:bg-teal-500 p-2 sm:p-4 transition-all duration-200 flex flex-col justify-between"
                            style={{ borderRadius: '0px' }}
                        >
                            <div>
                                <FaTachometerAlt className="text-lg sm:text-xl lg:text-2xl text-white mb-1 sm:mb-2 opacity-90" />
                                <h3 className="text-white text-xs sm:text-sm font-light">system</h3>
                            </div>
                            <div className="text-right">
                                <div className="text-white text-lg sm:text-xl lg:text-2xl font-light">{stats.overview?.contentHealth || 0}%</div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Metrics Tiles */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-2 auto-rows-[100px] sm:auto-rows-[120px]">
                        {/* Banner Impressions Wide Tile */}
                        <div 
                            className="col-span-1 sm:col-span-2 lg:col-span-4 bg-indigo-600 hover:bg-indigo-500 p-2 sm:p-4 transition-all duration-200 flex flex-col justify-between"
                            style={{ borderRadius: '0px' }}
                        >
                            <div>
                                <FaEye className="text-lg sm:text-xl lg:text-2xl text-white mb-1 sm:mb-2 opacity-90" />
                                <h3 className="text-white text-xs sm:text-sm font-light">impressions</h3>
                                <p className="text-indigo-200 text-xs hidden sm:block">banner views</p>
                            </div>
                            <div className="text-right">
                                <div className="text-white text-sm sm:text-base lg:text-lg font-light">{bannerLoading ? '...' : (bannerStats?.totalImpressions?.toLocaleString() || '0')}</div>
                            </div>
                        </div>

                        {/* Banner Clicks Tile */}
                        <div 
                            className="col-span-1 sm:col-span-2 lg:col-span-4 bg-emerald-600 hover:bg-emerald-500 p-2 sm:p-4 transition-all duration-200 flex flex-col justify-between"
                            style={{ borderRadius: '0px' }}
                        >
                            <div>
                                <FaMousePointer className="text-lg sm:text-xl lg:text-2xl text-white mb-1 sm:mb-2 opacity-90" />
                                <h3 className="text-white text-xs sm:text-sm font-light">clicks</h3>
                                <p className="text-emerald-200 text-xs hidden sm:block">banner clicks</p>
                            </div>
                            <div className="text-right">
                                <div className="text-white text-sm sm:text-base lg:text-lg font-light">{bannerLoading ? '...' : (bannerStats?.totalClicks?.toLocaleString() || '0')}</div>
                            </div>
                        </div>

                        {/* Rating Tile */}
                        <div 
                            className="col-span-1 sm:col-span-2 lg:col-span-4 bg-yellow-600 hover:bg-yellow-500 p-2 sm:p-4 transition-all duration-200 flex flex-col justify-between"
                            style={{ borderRadius: '0px' }}
                        >
                            <div>
                                <FaStar className="text-lg sm:text-xl lg:text-2xl text-white mb-1 sm:mb-2 opacity-90" />
                                <h3 className="text-white text-xs sm:text-sm font-light">rating</h3>
                                <p className="text-yellow-200 text-xs hidden sm:block">★ average</p>
                            </div>
                            <div className="text-right">
                                <div className="text-white text-sm sm:text-base lg:text-lg font-light">{loading ? '...' : (stats.apps?.avgRating ? stats.apps.avgRating.toFixed(1) : '0.0')}</div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions - Windows Phone Style */}
                    <div className="mb-6">
                        <h2 className="text-xl sm:text-2xl font-extralight text-white mb-1 tracking-wide">quick</h2>
                        <h3 className="text-base sm:text-lg font-light text-blue-400 mb-4 sm:mb-6">actions</h3>
                        
                        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-2 auto-rows-[120px] sm:auto-rows-[140px]">
                            {/* Add New App - Large Tile */}
                            <div 
                                onClick={() => router.push('/admin/apps/create')}
                                className="col-span-4 sm:col-span-6 lg:col-span-6 bg-red-600 hover:bg-red-500 p-3 sm:p-6 cursor-pointer transition-all duration-200 transform hover:scale-[1.02] flex flex-col justify-between"
                                style={{ borderRadius: '0px' }}
                            >
                                <div>
                                    <FaMobileAlt className="text-2xl sm:text-3xl lg:text-4xl text-white mb-2 sm:mb-3 opacity-90" />
                                    <h3 className="text-white text-sm sm:text-base lg:text-lg font-light">add new app</h3>
                                    <p className="text-red-100 text-xs sm:text-sm font-light hidden sm:block">create & publish</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-red-200 text-sm font-light">→</span>
                                </div>
                            </div>

                            {/* Create Banner Tile */}
                            <div 
                                onClick={() => router.push('/admin/banners/create')}
                                className="col-span-2 sm:col-span-2 lg:col-span-3 bg-pink-600 hover:bg-pink-500 p-2 sm:p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between"
                                style={{ borderRadius: '0px' }}
                            >
                                <div>
                                    <FaBullhorn className="text-lg sm:text-xl lg:text-2xl text-white mb-1 sm:mb-2 opacity-90" />
                                    <h3 className="text-white text-xs sm:text-sm font-light">create</h3>
                                    <h4 className="text-white text-xs sm:text-sm font-light">banner</h4>
                                </div>
                                <div className="text-right">
                                    <span className="text-pink-200 text-xs">+</span>
                                </div>
                            </div>

                            {/* Categories Tile */}
                            <div 
                                onClick={() => router.push('/admin/categories')}
                                className="col-span-2 sm:col-span-2 lg:col-span-3 bg-slate-600 hover:bg-slate-500 p-2 sm:p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between"
                                style={{ borderRadius: '0px' }}
                            >
                                <div>
                                    <FaFolder className="text-lg sm:text-xl lg:text-2xl text-white mb-1 sm:mb-2 opacity-90" />
                                    <h3 className="text-white text-xs sm:text-sm font-light">manage</h3>
                                    <h4 className="text-white text-xs sm:text-sm font-light">categories</h4>
                                </div>
                                <div className="text-right">
                                    <span className="text-slate-200 text-xs">•••</span>
                                </div>
                            </div>

                            {/* Advertisements Tile */}
                            <div 
                                onClick={() => router.push('/admin/advertisements')}
                                className="col-span-4 sm:col-span-4 lg:col-span-6 bg-orange-600 hover:bg-orange-500 p-2 sm:p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between"
                                style={{ borderRadius: '0px' }}
                            >
                                <div>
                                    <FaBullhorn className="text-xl sm:text-2xl lg:text-3xl text-white mb-1 sm:mb-2 opacity-90" />
                                    <h3 className="text-white text-sm sm:text-base lg:text-lg font-light">advertisements</h3>
                                    <p className="text-orange-200 text-xs sm:text-sm font-light hidden sm:block">manage ad scripts & analytics</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-orange-200 text-base sm:text-lg">📢</span>
                                </div>
                            </div>

                            {/* User Management Wide Tile */}
                            <div 
                                onClick={() => router.push('/admin/users')}
                                className="col-span-4 sm:col-span-8 lg:col-span-6 bg-green-600 hover:bg-green-500 p-3 sm:p-4 cursor-pointer transition-all duration-200 flex items-center justify-between"
                                style={{ borderRadius: '0px' }}
                            >
                                <div>
                                    <FaUsers className="text-xl sm:text-2xl lg:text-3xl text-white mb-1 sm:mb-2 opacity-90" />
                                    <h3 className="text-white text-sm sm:text-base lg:text-lg font-light">user management</h3>
                                    <p className="text-green-200 text-xs sm:text-sm hidden sm:block">accounts & permissions</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-green-200 text-base sm:text-lg">→</span>
                                </div>
                            </div>

                            {/* Settings Tile */}
                            <div 
                                className="col-span-2 sm:col-span-4 lg:col-span-3 bg-gray-600 hover:bg-gray-500 p-2 sm:p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between"
                                style={{ borderRadius: '0px' }}
                            >
                                <div>
                                    <FaCog className="text-lg sm:text-xl lg:text-2xl text-white mb-1 sm:mb-2 opacity-90" />
                                    <h3 className="text-white text-xs sm:text-sm font-light">system</h3>
                                    <h4 className="text-white text-xs sm:text-sm font-light">settings</h4>
                                </div>
                                <div className="text-right">
                                    <span className="text-gray-200 text-xs">⚙</span>
                                </div>
                            </div>

                            {/* Analytics Tile */}
                            <div 
                                className="col-span-2 sm:col-span-4 lg:col-span-3 bg-cyan-600 hover:bg-cyan-500 p-2 sm:p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between"
                                style={{ borderRadius: '0px' }}
                            >
                                <div>
                                    <FaChartLine className="text-lg sm:text-xl lg:text-2xl text-white mb-1 sm:mb-2 opacity-90" />
                                    <h3 className="text-white text-xs sm:text-sm font-light">analytics</h3>
                                    <h4 className="text-white text-xs sm:text-sm font-light">reports</h4>
                                </div>
                                <div className="text-right">
                                    <span className="text-cyan-200 text-xs">📊</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* System Overview - Windows Phone Style */}
                    <div className="mb-6">
                        <h2 className="text-xl sm:text-2xl font-extralight text-white mb-1 tracking-wide">system</h2>
                        <h3 className="text-base sm:text-lg font-light text-blue-400 mb-4 sm:mb-6">overview</h3>
                        
                        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-2 auto-rows-[100px] sm:auto-rows-[120px]">
                            {/* Content Health Large Tile */}
                            <div 
                                className="col-span-4 sm:col-span-8 lg:col-span-8 bg-lime-600 hover:bg-lime-500 p-3 sm:p-6 transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between"
                                style={{ borderRadius: '0px' }}
                            >
                                <div className="w-full sm:w-auto">
                                    <FaTachometerAlt className="text-2xl sm:text-3xl lg:text-4xl text-white mb-2 sm:mb-3 opacity-90" />
                                    <h3 className="text-white text-lg sm:text-xl lg:text-2xl font-extralight mb-1">content health</h3>
                                    <p className="text-lime-200 text-xs sm:text-sm font-light hidden sm:block">system performance</p>
                                    
                                    {/* Progress Bar */}
                                    <div className="w-full bg-lime-800 h-2 mt-2 sm:mt-3" style={{ borderRadius: '0px' }}>
                                        <div 
                                            className="bg-white h-2 transition-all duration-500"
                                            style={{ 
                                                width: `${stats.overview?.contentHealth || 0}%`,
                                                borderRadius: '0px'
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="text-right mt-2 sm:mt-0">
                                    <div className="text-white text-3xl sm:text-4xl lg:text-5xl font-ultralight">{stats.overview?.contentHealth || 0}%</div>
                                </div>
                            </div>

                            {/* Total Content Tile */}
                            <div 
                                className="col-span-2 sm:col-span-4 lg:col-span-4 bg-violet-600 hover:bg-violet-500 p-2 sm:p-4 transition-all duration-200 flex flex-col justify-between"
                                style={{ borderRadius: '0px' }}
                            >
                                <div>
                                    <h3 className="text-white text-xs sm:text-sm font-light">total content</h3>
                                    <p className="text-violet-200 text-xs hidden sm:block">apps + categories</p>
                                </div>
                                <div className="text-center mt-2 sm:mt-4">
                                    <div className="text-white text-2xl sm:text-3xl lg:text-4xl font-light">{stats.overview?.totalContent || 0}</div>
                                    <p className="text-violet-200 text-xs mt-1">items</p>
                                </div>
                            </div>

                            {/* Quality Rating Tile */}
                            <div 
                                className="col-span-2 sm:col-span-4 lg:col-span-6 bg-amber-600 hover:bg-amber-500 p-2 sm:p-4 transition-all duration-200 flex items-center justify-between"
                                style={{ borderRadius: '0px' }}
                            >
                                <div>
                                    <div className="flex mb-1 sm:mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar 
                                                key={i} 
                                                className={`text-sm sm:text-base lg:text-lg mr-1 ${i < Math.floor(stats.overview?.avgQuality || 0) ? 'text-white' : 'text-amber-800'}`}
                                            />
                                        ))}
                                    </div>
                                    <h3 className="text-white text-sm sm:text-base lg:text-lg font-light">average quality</h3>
                                    <p className="text-amber-200 text-xs sm:text-sm hidden sm:block">content rating</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-white text-2xl sm:text-3xl lg:text-4xl font-light">
                                        {stats.overview?.avgQuality ? stats.overview.avgQuality.toFixed(1) : '0.0'}
                                    </div>
                                </div>
                            </div>

                            {/* Live Status Tile */}
                            <div 
                                className="col-span-4 sm:col-span-8 lg:col-span-6 bg-rose-600 hover:bg-rose-500 p-3 sm:p-4 transition-all duration-200 flex flex-col justify-center items-center text-center"
                                style={{ borderRadius: '0px' }}
                            >
                                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full animate-pulse mb-2"></div>
                                <h3 className="text-white text-sm sm:text-base lg:text-lg font-light">system status</h3>
                                <p className="text-rose-200 text-xs sm:text-sm font-light">online</p>
                                <div className="text-rose-200 text-xs mt-1 hidden sm:block">
                                    {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
} 