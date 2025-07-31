// Script de prueba para verificar la API de publicidad
const API_BASE_URL = 'http://localhost:3000'

async function testAdvertisementAPI() {
    try {
        console.log('🧪 Testing advertisement API...')
        
        // Test 1: Obtener publicidad aleatoria
        const response = await fetch(`${API_BASE_URL}/api/v1/advertisements/random?type=download&placement=button_click`)
        const data = await response.json()
        
        console.log('📊 API Response:', data)
        
        if (data.success && data.data.advertisement) {
            console.log('✅ Advertisement found:', data.data.advertisement.name)
            console.log('🔗 Direct Link:', data.data.advertisement.crackmarket?.directLink)
            console.log('📊 Format:', data.data.advertisement.crackmarket?.adFormat)
        } else {
            console.log('❌ No advertisement found')
        }
        
        // Test 2: Debug endpoint
        const debugResponse = await fetch(`${API_BASE_URL}/api/v1/advertisements/debug`)
        const debugData = await debugResponse.json()
        
        console.log('🔍 Debug Info:', debugData)
        
    } catch (error) {
        console.error('❌ Error testing API:', error)
    }
}

// Ejecutar la prueba
testAdvertisementAPI() 