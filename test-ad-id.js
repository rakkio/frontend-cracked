// Script de prueba para verificar que la API devuelve el ID de la publicidad
const API_BASE_URL = 'http://localhost:3000'

async function testAdvertisementID() {
    try {
        console.log('🧪 Testing advertisement ID...')
        
        // Test 1: Get a random advertisement
        console.log('📋 Test 1: Getting random advertisement')
        const adResponse = await fetch(`${API_BASE_URL}/api/v1/advertisements/random?type=download&placement=button_click`)
        const adData = await adResponse.json()
        
        console.log('📊 Full API Response:', JSON.stringify(adData, null, 2))
        
        if (!adData.success || !adData.data.advertisement) {
            console.log('❌ No advertisement found')
            return
        }
        
        const advertisement = adData.data.advertisement
        console.log('✅ Advertisement found:', advertisement.name)
        console.log('🆔 Advertisement ID:', advertisement._id)
        console.log('📋 Full advertisement object:', advertisement)
        
        // Test 2: Check if ID exists and is valid
        if (advertisement._id) {
            console.log('✅ Advertisement ID is present')
            console.log('📋 ID type:', typeof advertisement._id)
            console.log('📋 ID length:', advertisement._id.length)
        } else {
            console.log('❌ Advertisement ID is missing')
        }
        
        // Test 3: Simulate frontend state
        console.log('📋 Test 3: Simulating frontend state')
        const mockAdvertisement = advertisement
        console.log('📋 Mock advertisement:', mockAdvertisement)
        console.log('🆔 Mock advertisement ID:', mockAdvertisement._id)
        
        if (mockAdvertisement?._id) {
            console.log('✅ Mock advertisement has ID')
        } else {
            console.log('❌ Mock advertisement missing ID')
        }
        
    } catch (error) {
        console.error('❌ Error testing advertisement ID:', error)
    }
}

// Ejecutar la prueba
testAdvertisementID() 