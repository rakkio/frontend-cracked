# 💰 Ad Networks Setup Guide

Esta guía te ayudará a configurar las redes publicitarias para generar ingresos con CrackMarket.

## 🎯 Redes Publicitarias Soportadas

### 1. Google AdSense (Recomendado - Mayor Revenue)
- **Revenue**: ~$0.15 por impresión
- **Requisitos**: Sitio web aprobado por Google
- **Setup**:
  1. Crear cuenta en [Google AdSense](https://www.google.com/adsense/)
  2. Añadir tu sitio web y esperar aprobación
  3. Crear unidades de anuncios
  4. Configurar variables de entorno:
     ```env
     NEXT_PUBLIC_ADSENSE_ENABLED=true
     NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXXX
     NEXT_PUBLIC_ADSENSE_BANNER_SLOT=XXXXXXXXXX
     NEXT_PUBLIC_ADSENSE_INTERSTITIAL_SLOT=XXXXXXXXXX
     ```

### 2. PropellerAds (Fácil Aprobación)
- **Revenue**: ~$0.08 por impresión
- **Requisitos**: Mínimo tráfico, aprobación rápida
- **Setup**:
  1. Registrarse en [PropellerAds](https://propellerads.com/)
  2. Crear zona publicitaria
  3. Configurar variables:
     ```env
     NEXT_PUBLIC_PROPELLER_ENABLED=true
     NEXT_PUBLIC_PROPELLER_PUBLISHER_ID=XXXXXXX
     NEXT_PUBLIC_PROPELLER_ZONE_ID=XXXXXXX
     ```

### 3. AdCash
- **Revenue**: ~$0.06 por impresión
- **Requisitos**: Aprobación moderada
- **Setup**:
  1. Crear cuenta en [AdCash](https://www.adcash.com/)
  2. Configurar zona de anuncios
  3. Variables de entorno:
     ```env
     NEXT_PUBLIC_ADCASH_ENABLED=true
     NEXT_PUBLIC_ADCASH_SITE_ID=XXXXXXX
     NEXT_PUBLIC_ADCASH_ZONE_ID=XXXXXXX
     ```

### 4. HilltopAds
- **Revenue**: ~$0.05 por impresión
- **Requisitos**: Aprobación fácil
- **Setup**:
  1. Registrarse en [HilltopAds](https://hilltopads.net/)
  2. Crear sitio web
  3. Configurar:
     ```env
     NEXT_PUBLIC_HILLTOP_ENABLED=true
     NEXT_PUBLIC_HILLTOP_SITE_ID=XXXXXXX
     ```

### 5. PopAds
- **Revenue**: ~$0.03 por impresión
- **Requisitos**: Solo pop-ups, aprobación instantánea
- **Setup**:
  1. Crear cuenta en [PopAds](https://www.popads.net/)
  2. Añadir sitio web
  3. Configurar:
     ```env
     NEXT_PUBLIC_POPADS_ENABLED=true
     NEXT_PUBLIC_POPADS_SITE_ID=XXXXXXX
     ```

## 🚀 Configuración Rápida

1. **Copia el archivo de ejemplo**:
   ```bash
   cp env.example .env.local
   ```

2. **Edita las variables de entorno** con tus IDs reales

3. **Reinicia el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

## 📊 Optimización de Revenue

### Prioridad de Redes (Configurada Automáticamente)
1. **Google AdSense** - Mayor revenue, mejor calidad
2. **PropellerAds** - Buen balance revenue/aprobación
3. **AdCash** - Revenue moderado
4. **HilltopAds** - Backup confiable
5. **PopAds** - Último recurso

### Estrategias de Maximización
- **Múltiples Redes**: Configura varias redes como backup
- **Geo-targeting**: Diferentes redes funcionan mejor en diferentes países
- **A/B Testing**: El sistema automáticamente prueba la mejor red
- **Ad Blocker Detection**: Detecta y maneja usuarios con ad blockers

## 🔧 Funcionalidades Implementadas

### ✅ Sistema de Fallback Automático
- Si una red falla, automáticamente prueba la siguiente
- Garantiza que siempre se muestre algún anuncio

### ✅ Analytics de Revenue
- Tracking automático de impresiones y clicks
- Métricas de revenue por red publicitaria
- Reportes de performance

### ✅ Detección de Ad Blockers
- Detecta usuarios con ad blockers
- Muestra mensaje educativo
- Opción de continuar sin anuncios

### ✅ Optimización de UX
- Countdown más largo para anuncios reales (más revenue)
- Countdown corto cuando no hay anuncios
- Loading states profesionales

## 💡 Tips para Maximizar Ingresos

1. **Aplica a Google AdSense primero** - Es la red que más paga
2. **Configura múltiples redes** - Diversifica tus fuentes de ingreso
3. **Monitorea las métricas** - Revisa qué redes funcionan mejor
4. **Optimiza el tráfico** - Más descargas = más revenue
5. **Educa a los usuarios** - Explica por qué los anuncios son importantes

## 🎯 Revenue Estimado

Con **1000 descargas diarias**:
- **Solo AdSense**: ~$150/mes
- **Múltiples redes**: ~$200-300/mes
- **Con optimizaciones**: ~$400-500/mes

## 🔒 Consideraciones Legales

- Cumple con las políticas de cada red publicitaria
- Añade política de privacidad
- Informa sobre el uso de cookies
- Respeta las regulaciones locales (GDPR, etc.)

## 🆘 Troubleshooting

### Los anuncios no se muestran
1. Verifica las variables de entorno
2. Revisa la consola del navegador
3. Confirma que las cuentas estén aprobadas
4. Prueba con diferentes redes

### Revenue bajo
1. Optimiza el placement de anuncios
2. Aumenta el tiempo de visualización
3. Mejora la calidad del tráfico
4. Prueba diferentes formatos de anuncios

---

**¡Listo para generar ingresos! 💰**

El sistema está completamente configurado y optimizado para maximizar tus ganancias mientras mantienes una excelente experiencia de usuario.
