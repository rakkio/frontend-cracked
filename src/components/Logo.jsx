'use client'

import React from 'react'


 export default function Logo() {  
  return (
    <div className='flex items-center space-x-3 group'>
        <div>
            <h1 className='text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent'>
                Black Market
            </h1>
            <p className='text-xs md:text-sm text-gray-400 font-medium'>
                Underground Apps Hub
            </p>
        </div>
    </div>
  )
}
