'use client'

import { useEffect, useRef } from 'react'

export const MetroBackground = ({ children, className = '' }) => {
    const matrixRef = useRef(null)

    useEffect(() => {
        const canvas = matrixRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}"
        const matrixArray = matrix.split("")
        const fontSize = 10
        const columns = canvas.width / fontSize
        const drops = []

        for (let x = 0; x < columns; x++) {
            drops[x] = 1
        }

        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.04)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            
            ctx.fillStyle = '#0F0'
            ctx.font = fontSize + 'px arial'
            
            for (let i = 0; i < drops.length; i++) {
                const text = matrixArray[Math.floor(Math.random() * matrixArray.length)]
                ctx.fillStyle = '#00ff00'
                ctx.fillText(text, i * fontSize, drops[i] * fontSize)
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0
                }
                drops[i]++
            }
        }

        const interval = setInterval(draw, 35)

        const handleResize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        window.addEventListener('resize', handleResize)

        return () => {
            clearInterval(interval)
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <div className={`relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900/20 ${className}`}>
            {/* Matrix Rain Canvas */}
            <canvas 
                ref={matrixRef}
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ zIndex: 1 }}
            />
            
            {/* Scan Lines */}
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
                <div className="scan-lines opacity-30"></div>
            </div>
            
            {/* Floating Code Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 3 }}>
                <div className="absolute top-20 left-10 text-green-400/20 font-mono text-xs animate-float">
                    {'{"status": "connected"}'}
                </div>
                <div className="absolute top-40 right-20 text-red-400/20 font-mono text-xs animate-float-delayed">
                    {'[ENCRYPTED]'}
                </div>
                <div className="absolute bottom-32 left-1/4 text-blue-400/20 font-mono text-xs animate-float">
                    {'#!/bin/bash'}
                </div>
                <div className="absolute bottom-20 right-1/3 text-yellow-400/20 font-mono text-xs animate-float-delayed">
                    {'0x1337BEEF'}
                </div>
            </div>
            
            {/* Content */}
            <div className="relative" style={{ zIndex: 10 }}>
                {children}
            </div>
        </div>
    )
}