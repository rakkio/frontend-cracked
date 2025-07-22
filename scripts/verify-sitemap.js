#!/usr/bin/env node

import { readFileSync } from 'fs'
import { join } from 'path'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://appscracked.com'
const DEV_URL = 'http://localhost:3000'

async function testSitemap(url) {
    console.log(`\n🔍 Testing sitemap at: ${url}`)
    
    try {
        const response = await fetch(`${url}/sitemap.xml`, {
            headers: {
                'User-Agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)'
            }
        })

        console.log(`📊 Status: ${response.status}`)
        console.log(`📋 Headers:`)
        for (const [key, value] of response.headers.entries()) {
            console.log(`   ${key}: ${value}`)
        }

        if (response.ok) {
            const content = await response.text()
            console.log(`📄 Content length: ${content.length} chars`)
            
            // Basic XML validation
            if (content.includes('<?xml') && content.includes('<urlset') && content.includes('</urlset>')) {
                console.log('✅ Basic XML structure is valid')
                
                // Count URLs
                const urlCount = (content.match(/<url>/g) || []).length
                console.log(`🔗 Found ${urlCount} URLs in sitemap`)
                
                // Check for required elements
                const hasLoc = content.includes('<loc>')
                const hasLastmod = content.includes('<lastmod>')
                const hasChangefreq = content.includes('<changefreq>')
                const hasPriority = content.includes('<priority>')
                
                console.log(`📍 Elements present:`)
                console.log(`   <loc>: ${hasLoc ? '✅' : '❌'}`)
                console.log(`   <lastmod>: ${hasLastmod ? '✅' : '❌'}`)
                console.log(`   <changefreq>: ${hasChangefreq ? '✅' : '❌'}`)
                console.log(`   <priority>: ${hasPriority ? '✅' : '❌'}`)
                
                return { success: true, urls: urlCount }
            } else {
                console.log('❌ Invalid XML structure')
                return { success: false, error: 'Invalid XML' }
            }
        } else {
            console.log(`❌ HTTP Error: ${response.status} ${response.statusText}`)
            return { success: false, error: `HTTP ${response.status}` }
        }
    } catch (error) {
        console.log(`❌ Error: ${error.message}`)
        return { success: false, error: error.message }
    }
}

async function testAlternateSitemap(url) {
    console.log(`\n🔍 Testing alternate sitemap API at: ${url}`)
    
    try {
        const response = await fetch(`${url}/api/sitemap`)
        console.log(`📊 Status: ${response.status}`)
        console.log(`📋 Content-Type: ${response.headers.get('content-type')}`)
        
        if (response.ok) {
            const content = await response.text()
            const urlCount = (content.match(/<url>/g) || []).length
            console.log(`🔗 Found ${urlCount} URLs in alternate sitemap`)
            return { success: true, urls: urlCount }
        } else {
            return { success: false, error: `HTTP ${response.status}` }
        }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

async function testRobotsTxt(url) {
    console.log(`\n🔍 Testing robots.txt at: ${url}`)
    
    try {
        const response = await fetch(`${url}/robots.txt`)
        console.log(`📊 Status: ${response.status}`)
        
        if (response.ok) {
            const content = await response.text()
            console.log(`📄 Content:`)
            console.log(content)
            
            const hasSitemap = content.includes('Sitemap:')
            console.log(`🗺️ References sitemap: ${hasSitemap ? '✅' : '❌'}`)
            
            return { success: true, hasSitemap }
        } else {
            return { success: false, error: `HTTP ${response.status}` }
        }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

async function main() {
    console.log('🚀 Sitemap Verification Script')
    console.log('================================')
    
    // Test development server first (if available)
    console.log('\n📡 Testing Development Server...')
    const devResults = await Promise.all([
        testSitemap(DEV_URL),
        testAlternateSitemap(DEV_URL),
        testRobotsTxt(DEV_URL)
    ])
    
    // Test production server
    console.log('\n🌐 Testing Production Server...')
    const prodResults = await Promise.all([
        testSitemap(BASE_URL),
        testAlternateSitemap(BASE_URL),
        testRobotsTxt(BASE_URL)
    ])
    
    // Summary
    console.log('\n📋 SUMMARY')
    console.log('===========')
    
    console.log(`\nDevelopment (${DEV_URL}):`)
    console.log(`   Main sitemap: ${devResults[0].success ? '✅' : '❌'} (${devResults[0].urls || 0} URLs)`)
    console.log(`   API sitemap:  ${devResults[1].success ? '✅' : '❌'} (${devResults[1].urls || 0} URLs)`)
    console.log(`   Robots.txt:   ${devResults[2].success ? '✅' : '❌'}`)
    
    console.log(`\nProduction (${BASE_URL}):`)
    console.log(`   Main sitemap: ${prodResults[0].success ? '✅' : '❌'} (${prodResults[0].urls || 0} URLs)`)
    console.log(`   API sitemap:  ${prodResults[1].success ? '✅' : '❌'} (${prodResults[1].urls || 0} URLs)`)
    console.log(`   Robots.txt:   ${prodResults[2].success ? '✅' : '❌'}`)
    
    // Recommendations
    console.log('\n💡 RECOMMENDATIONS')
    console.log('==================')
    
    if (!prodResults[0].success && !prodResults[1].success) {
        console.log('❗ Both sitemaps are failing on production!')
        console.log('   1. Check your deployment configuration')
        console.log('   2. Verify API endpoints are working')
        console.log('   3. Check server logs for errors')
    } else if (!prodResults[0].success) {
        console.log('⚠️  Main sitemap failing, but API sitemap works')
        console.log('   - Update Google Search Console to use /api/sitemap')
    } else if (!prodResults[1].success) {
        console.log('⚠️  API sitemap failing, but main sitemap works')
        console.log('   - Main sitemap should be sufficient')
    } else {
        console.log('✅ Both sitemaps working correctly!')
    }
    
    console.log('\n🔗 Google Search Console URLs to test:')
    console.log(`   ${BASE_URL}/sitemap.xml`)
    console.log(`   ${BASE_URL}/api/sitemap`)
    
    console.log('\n✨ Verification complete!')
}

main().catch(console.error) 