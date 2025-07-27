'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Logo from './header/Logo'
import Navigation from './header/Navigation'
import UserMenu from './header/UserMenu'
import MobileMenu from './header/MobileMenu'
import Search from './header/Search.jsx'
import MobileSearchButton from './header/MobileSearchButton.jsx'

export default function Header() {
    const [isMounted, setIsMounted] = useState(false)
    const { loading } = useAuth()
    
    useEffect(() => {
        setIsMounted(true)
    }, [])

    const handleSearchClick = () => {
        // Manejado por el componente Search
    }

    return (
        <>
            {/* Matrix Rain Background */}
            <div className="fixed top-0 left-0 w-full h-32 pointer-events-none z-0 overflow-hidden">
                <div className="matrix-rain opacity-20"></div>
            </div>

            <header className="sticky top-0 bg-black/45 backdrop-blur-md border-b-2 border-red-500 shadow-2xl z-50">
                {/* Efectos visuales */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent animate-pulse"></div>
                <div className="scan-lines"></div>
                
                {/* Elementos flotantes de código - Ocultos en móvil */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="floating-code text-red-500/20 text-xs font-mono hidden lg:block">
                        {['sudo access granted', 'root@system:~#', 'exploit.exe', 'bypass.dll'].map((code, i) => (
                            <span key={i} className={`absolute animate-float-${i + 1}`} style={{
                                left: `${20 + i * 25}%`,
                                top: `${10 + i * 15}%`,
                                animationDelay: `${i * 0.5}s`
                            }}>
                                {code}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="container mx-auto px-2 sm:px-4">
                    <div className="flex items-center justify-between h-14 sm:h-16">
                        {/* Logo - Completamente responsivo */}
                        <Logo />

                        {/* Barra de búsqueda - Oculta en móvil */}
                        <div className="hidden md:flex flex-1 max-w-xl lg:max-w-2xl mx-4 lg:mx-8 relative">
                           <Search onSearchClick={handleSearchClick} />
                        </div>

                        {/* Navegación - Oculta en móvil y tablet */}
                        <Navigation />

                        {/* Menú de usuario y controles móviles */}
                        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
                            {/* Botón de búsqueda para móvil */}
                            <div className="md:hidden">
                                <MobileSearchButton />
                            </div>

                            {/* Menú de usuario */}
                            <UserMenu />
                            {/* Menú móvil */}
                            <MobileMenu />
                        </div>
                    </div>
                </div>
            </header>

            <style jsx>{`
                .matrix-rain {
                    background: linear-gradient(0deg, transparent 24%, rgba(255, 0, 0, 0.05) 25%, rgba(255, 0, 0, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 0, 0, 0.05) 75%, rgba(255, 0, 0, 0.05) 76%, transparent 77%, transparent);
                    background-size: 50px 50px;
                    animation: matrix-fall 20s linear infinite;
                }
                
                @keyframes matrix-fall {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100vh); }
                }
                
                .scan-lines {
                    background: linear-gradient(90deg, transparent 98%, rgba(255, 0, 0, 0.1) 100%);
                    background-size: 3px 100%;
                    animation: scan 2s linear infinite;
                }
                
                @keyframes scan {
                    0% { background-position: 0 0; }
                    100% { background-position: 100% 0; }
                }
                
                @keyframes float-1 {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(2deg); }
                }
                
                @keyframes float-2 {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(-2deg); }
                }
                
                @keyframes float-3 {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-8px) rotate(1deg); }
                }
                
                @keyframes float-4 {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-12px) rotate(-1deg); }
                }
                
                .animate-float-1 { animation: float-1 3s ease-in-out infinite; }
                .animate-float-2 { animation: float-2 4s ease-in-out infinite; }
                .animate-float-3 { animation: float-3 3.5s ease-in-out infinite; }
                .animate-float-4 { animation: float-4 4.5s ease-in-out infinite; }
            `}</style>
        </>
    )
}
