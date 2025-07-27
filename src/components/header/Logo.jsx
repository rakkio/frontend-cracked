'use client'

import Link from 'next/link'
import { FaTerminal } from 'react-icons/fa'

export default function Logo() {
    return (
        <Link href="/" className="flex items-center group relative flex-shrink-0 ">
            <div className="relative">
                <div className="absolute inset-0 bg-red-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-black border-2 border-red-500 transform group-hover:scale-110 transition-transform p-2 sm:p-2.5">
                    <FaTerminal className="text-red-500 text-lg sm:text-xl" />
                </div>
            </div>
            <div className="relative ml-2 sm:ml-3 mt-6">
                <h1 className="font-bold bg-gradient-to-r from-red-500 via-red-400 to-orange-500 bg-clip-text text-transparent text-lg sm:text-xl md:text-2xl">
                    <span className="hidden sm:inline">CRACK</span>
                    <span className="sm:hidden">C</span>
                    <span className="text-red-500">[</span>
                    <span className="hidden sm:inline">MARKET</span>
                    <span className="sm:hidden">M</span>
                    <span className="text-red-500">]</span>
                </h1>
            </div>
        </Link>
    )
}