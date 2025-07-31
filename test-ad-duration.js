// Script de prueba para verificar la duración de la publicidad
const API_BASE_URL = 'http://localhost:3000'

async function testAdvertisementDuration() {
    try {
        console.log('🧪 Testing advertisement duration...')
        
        // Test: Obtener publicidad aleatoria
        const response = await fetch(`${API_BASE_URL}/api/v1/advertisements/random?type=download&placement=button_click`)
        const data = await response.json()
        
        console.log('📊 API Response:', JSON.stringify(data, null, 2))
        
        if (data.success && data.data.advertisement) {
            const ad = data.data.advertisement
            console.log('✅ Advertisement found:', ad.name)
            console.log('🔗 Direct Link:', ad.crackmarket?.directLink)
            console.log('📊 Format:', ad.crackmarket?.adFormat)
            console.log('⏰ Countdown from DB:', ad.settings?.countdown)
            console.log('⏰ Countdown type:', typeof ad.settings?.countdown)
            
            // Test countdown logic
            const adDuration = ad.settings?.countdown || 15
            console.log('⏰ Final countdown value:', adDuration)
            
        } else {
            console.log('❌ No advertisement found')
        }
        
    } catch (error) {
        console.error('❌ Error testing API:', error)
    }
}

// Ejecutar la prueba
testAdvertisementDuration() 