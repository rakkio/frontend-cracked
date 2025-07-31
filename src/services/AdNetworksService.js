/**
 * Ad Networks Integration Service
 * Supports multiple ad networks for revenue generation
 */

class AdNetworksService {
    constructor() {
        this.networks = {
            // Google AdSense
            adsense: {
                enabled: process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true',
                publisherId: process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID,
                adSlots: {
                    banner: process.env.NEXT_PUBLIC_ADSENSE_BANNER_SLOT,
                    interstitial: process.env.NEXT_PUBLIC_ADSENSE_INTERSTITIAL_SLOT
                }
            },
            // PropellerAds
            propellerads: {
                enabled: process.env.NEXT_PUBLIC_PROPELLER_ENABLED === 'true',
                zoneId: process.env.NEXT_PUBLIC_PROPELLER_ZONE_ID,
                publisherId: process.env.NEXT_PUBLIC_PROPELLER_PUBLISHER_ID
            },
            // PopAds
            popads: {
                enabled: process.env.NEXT_PUBLIC_POPADS_ENABLED === 'true',
                siteId: process.env.NEXT_PUBLIC_POPADS_SITE_ID
            },
            // AdCash
            adcash: {
                enabled: process.env.NEXT_PUBLIC_ADCASH_ENABLED === 'true',
                siteId: process.env.NEXT_PUBLIC_ADCASH_SITE_ID,
                zoneId: process.env.NEXT_PUBLIC_ADCASH_ZONE_ID
            },
            // HilltopAds
            hilltopads: {
                enabled: process.env.NEXT_PUBLIC_HILLTOP_ENABLED === 'true',
                siteId: process.env.NEXT_PUBLIC_HILLTOP_SITE_ID
            }
        }
    }

    /**
     * Load Google AdSense
     */
    async loadAdSense(container, adSlot = 'banner') {
        if (!this.networks.adsense.enabled) return false

        try {
            // Load AdSense script if not already loaded
            if (!window.adsbygoogle) {
                const script = document.createElement('script')
                script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
                script.async = true
                script.crossOrigin = 'anonymous'
                document.head.appendChild(script)

                // Wait for script to load
                await new Promise((resolve) => {
                    script.onload = resolve
                    setTimeout(resolve, 5000) // Timeout after 5 seconds
                })
            }

            // Create ad element
            const adElement = document.createElement('ins')
            adElement.className = 'adsbygoogle'
            adElement.style.display = 'block'
            adElement.setAttribute('data-ad-client', this.networks.adsense.publisherId)
            adElement.setAttribute('data-ad-slot', this.networks.adsense.adSlots[adSlot])
            adElement.setAttribute('data-ad-format', 'auto')
            adElement.setAttribute('data-full-width-responsive', 'true')

            container.appendChild(adElement)

            // Push ad
            if (window.adsbygoogle) {
                (window.adsbygoogle = window.adsbygoogle || []).push({})
            }

            return true
        } catch (error) {
            console.error('Failed to load AdSense:', error)
            return false
        }
    }

    /**
     * Load PropellerAds
     */
    async loadPropellerAds(container) {
        if (!this.networks.propellerads.enabled) return false

        try {
            const script = document.createElement('script')
            script.innerHTML = `
                (function(d,z,s){
                    s.src='https://'+d+'/400/'+z;
                    try{(document.body||document.documentElement).appendChild(s)}
                    catch(e){}
                })('${this.networks.propellerads.publisherId}.com',${this.networks.propellerads.zoneId},document.createElement('script'))
            `
            container.appendChild(script)
            return true
        } catch (error) {
            console.error('Failed to load PropellerAds:', error)
            return false
        }
    }

    /**
     * Load PopAds
     */
    async loadPopAds() {
        if (!this.networks.popads.enabled) return false

        try {
            const script = document.createElement('script')
            script.src = `https://c.popads.net/pop.js`
            script.onload = () => {
                if (window.pop_target) {
                    window.pop_target.site_id = this.networks.popads.siteId
                }
            }
            document.head.appendChild(script)
            return true
        } catch (error) {
            console.error('Failed to load PopAds:', error)
            return false
        }
    }

    /**
     * Load AdCash
     */
    async loadAdCash(container) {
        if (!this.networks.adcash.enabled) return false

        try {
            const script = document.createElement('script')
            script.innerHTML = `
                (function(s,u,z,p){
                    s.src=u,s.setAttribute('data-zone',z),p.appendChild(s);
                })(document.createElement('script'),'https://iclickcdn.com/tag.min.js',${this.networks.adcash.zoneId},document.head);
            `
            container.appendChild(script)
            return true
        } catch (error) {
            console.error('Failed to load AdCash:', error)
            return false
        }
    }

    /**
     * Load HilltopAds
     */
    async loadHilltopAds(container) {
        if (!this.networks.hilltopads.enabled) return false

        try {
            const script = document.createElement('script')
            script.src = `https://hilltopads.net/show.js`
            script.setAttribute('data-site-id', this.networks.hilltopads.siteId)
            container.appendChild(script)
            return true
        } catch (error) {
            console.error('Failed to load HilltopAds:', error)
            return false
        }
    }

    /**
     * Load the best available ad network
     */
    async loadBestAvailableAd(container, preferences = []) {
        const availableNetworks = Object.keys(this.networks).filter(
            network => this.networks[network].enabled
        )

        // Try preferred networks first
        for (const network of preferences) {
            if (availableNetworks.includes(network)) {
                const success = await this.loadNetwork(network, container)
                if (success) return { network, success: true }
            }
        }

        // Try remaining networks
        for (const network of availableNetworks) {
            if (!preferences.includes(network)) {
                const success = await this.loadNetwork(network, container)
                if (success) return { network, success: true }
            }
        }

        return { network: null, success: false }
    }

    /**
     * Load specific network
     */
    async loadNetwork(network, container) {
        switch (network) {
            case 'adsense':
                return await this.loadAdSense(container)
            case 'propellerads':
                return await this.loadPropellerAds(container)
            case 'popads':
                return await this.loadPopAds()
            case 'adcash':
                return await this.loadAdCash(container)
            case 'hilltopads':
                return await this.loadHilltopAds(container)
            default:
                return false
        }
    }

    /**
     * Track ad impression
     */
    async trackImpression(network, adId) {
        try {
            // Send impression data to your analytics
            await fetch('/api/analytics/ad-impression', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    network,
                    adId,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    referrer: document.referrer
                })
            })
        } catch (error) {
            console.error('Failed to track impression:', error)
        }
    }

    /**
     * Track ad click
     */
    async trackClick(network, adId) {
        try {
            // Send click data to your analytics
            await fetch('/api/analytics/ad-click', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    network,
                    adId,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    referrer: document.referrer
                })
            })
        } catch (error) {
            console.error('Failed to track click:', error)
        }
    }
}

export default new AdNetworksService()
