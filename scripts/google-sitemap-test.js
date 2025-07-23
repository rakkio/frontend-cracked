#!/usr/bin/env node

const BASE_URL = 'https://crackmarket.xyz'

async function testGoogleCompatibility() {
    console.log('🔍 Google Search Console Sitemap Compatibility Test')
    console.log('==================================================')
    
    const tests = [
        {
            name: 'Main Sitemap',
            url: `${BASE_URL}/sitemap.xml`,
            userAgent: 'Googlebot/2.1 (+http://www.google.com/bot.html)'
        },
        {
            name: 'API Sitemap',
            url: `${BASE_URL}/api/sitemap`,
            userAgent: 'Googlebot/2.1 (+http://www.google.com/bot.html)'
        },
        {
            name: 'Robots.txt',
            url: `${BASE_URL}/robots.txt`,
            userAgent: 'Googlebot/2.1 (+http://www.google.com/bot.html)'
        }
    ]
    
    for (const test of tests) {
        console.log(`\n📊 Testing: ${test.name}`)
        console.log(`🔗 URL: ${test.url}`)
        
        try {
            const response = await fetch(test.url, {
                headers: {
                    'User-Agent': test.userAgent,
                    'Accept': test.name === 'Robots.txt' ? 'text/plain' : 'application/xml,text/xml,*/*',
                    'Accept-Encoding': 'gzip, deflate',
                    'Accept-Language': 'en-US,en;q=0.9'
                }
            })
            
            console.log(`✅ Status: ${response.status} ${response.statusText}`)
            
            const contentType = response.headers.get('content-type')
            console.log(`📋 Content-Type: ${contentType}`)
            
            const cacheControl = response.headers.get('cache-control')
            console.log(`⏰ Cache-Control: ${cacheControl}`)
            
            const content = await response.text()
            console.log(`📄 Content Length: ${content.length} characters`)
            
            // Validate XML structure for sitemaps
            if (test.name.includes('Sitemap')) {
                if (content.includes('<?xml version="1.0"') && content.includes('<urlset')) {
                    console.log('✅ Valid XML structure')
                    
                    // Count URLs
                    const urlMatches = content.match(/<url>/g)
                    const urlCount = urlMatches ? urlMatches.length : 0
                    console.log(`🔗 URLs found: ${urlCount}`)
                    
                    // Check required elements
                    const hasLoc = content.includes('<loc>')
                    const hasLastmod = content.includes('<lastmod>')
                    const hasChangefreq = content.includes('<changefreq>')
                    const hasPriority = content.includes('<priority>')
                    
                    console.log(`📍 Required elements:`)
                    console.log(`   <loc>: ${hasLoc ? '✅' : '❌'}`)
                    console.log(`   <lastmod>: ${hasLastmod ? '✅' : '❌'}`)
                    console.log(`   <changefreq>: ${hasChangefreq ? '✅' : '❌'}`)
                    console.log(`   <priority>: ${hasPriority ? '✅' : '❌'}`)
                    
                    // Validate URLs
                    const locMatches = content.match(/<loc>(.*?)<\/loc>/g)
                    if (locMatches) {
                        let validUrls = 0
                        let invalidUrls = 0
                        
                        for (const locMatch of locMatches.slice(0, 5)) { // Check first 5 URLs
                            const url = locMatch.replace(/<\/?loc>/g, '')
                            try {
                                new URL(url)
                                validUrls++
                            } catch {
                                invalidUrls++
                                console.log(`❌ Invalid URL: ${url}`)
                            }
                        }
                        
                        console.log(`🔍 URL validation (first 5): ${validUrls} valid, ${invalidUrls} invalid`)
                    }
                    
                } else {
                    console.log('❌ Invalid XML structure')
                    console.log('First 200 characters:')
                    console.log(content.substring(0, 200))
                }
            }
            
            // Validate robots.txt
            if (test.name === 'Robots.txt') {
                const hasSitemap = content.includes('Sitemap:')
                const hasUserAgent = content.includes('User-agent:')
                
                console.log(`🤖 Robots.txt validation:`)
                console.log(`   User-agent directive: ${hasUserAgent ? '✅' : '❌'}`)
                console.log(`   Sitemap directive: ${hasSitemap ? '✅' : '❌'}`)
                
                if (hasSitemap) {
                    const sitemapMatches = content.match(/Sitemap: (.*)/g)
                    console.log(`📋 Sitemap references:`)
                    sitemapMatches?.forEach(match => {
                        console.log(`   ${match}`)
                    })
                }
            }
            
        } catch (error) {
            console.log(`❌ Error: ${error.message}`)
        }
    }
    
    console.log('\n🎯 Google Search Console Instructions:')
    console.log('=====================================')
    console.log('1. Go to https://search.google.com/search-console')
    console.log('2. Add your property: https://crackmarket.xyz')
    console.log('3. Go to Sitemaps section')
    console.log('4. Add these sitemaps:')
    console.log('   - sitemap.xml')
    console.log('   - api/sitemap')
    console.log('5. Wait for Google to process (can take 24-48 hours)')
    
    console.log('\n✨ Test completed!')
}

testGoogleCompatibility().catch(console.error) 