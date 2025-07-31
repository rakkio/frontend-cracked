// Script de prueba para verificar el countdown
console.log('🧪 Testing countdown functionality...')

// Simular el countdown del hook
let countdown = 15
let interval

function startCountdown() {
    console.log('⏰ Starting countdown with value:', countdown)
    
    if (interval) {
        clearInterval(interval)
    }
    
    interval = setInterval(() => {
        countdown = countdown - 1
        console.log('⏰ Countdown tick:', countdown)
        
        if (countdown <= 0) {
            console.log('⏰ Countdown finished')
            clearInterval(interval)
            return
        }
    }, 1000)
}

// Test 1: Countdown normal
console.log('📋 Test 1: Normal countdown')
countdown = 15
startCountdown()

// Test 2: Countdown con valor de DB
setTimeout(() => {
    console.log('📋 Test 2: Countdown from database')
    countdown = 5 // Simular valor de DB
    startCountdown()
}, 20000)

// Test 3: Verificar que no hay re-renders infinitos
console.log('📋 Test 3: Checking for infinite re-renders')
let renderCount = 0
const checkRenders = setInterval(() => {
    renderCount++
    console.log('🔄 Render count:', renderCount)
    
    if (renderCount > 10) {
        console.log('⚠️ Too many renders detected!')
        clearInterval(checkRenders)
    }
}, 1000) 