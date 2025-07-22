# SOLID Architecture Implementation

Este documento describe cómo hemos implementado los principios SOLID en la arquitectura del frontend de la aplicación Apps Cracked.

## 🏗️ Principios SOLID Implementados

### 1. Single Responsibility Principle (SRP)

Cada componente y hook tiene una única responsabilidad bien definida:

#### **Custom Hooks**
- **`useCategories.js`**: Solo maneja la lógica de categorías (obtener, filtrar, buscar)
- **`useCategoryApps.js`**: Solo maneja aplicaciones específicas de una categoría
- Cada hook encapsula su propia lógica de estado y efectos secundarios

#### **Componentes**
- **`CategoryCard.jsx`**: Solo renderiza información de una categoría
- **`CategorySection.jsx`**: Solo maneja la visualización de una categoría con sus aplicaciones
- **`CategorySwiper.jsx`**: Solo maneja la funcionalidad de carrusel de categorías
- **`CategoriesWithApps.jsx`**: Solo orquesta múltiples secciones de categorías

### 2. Open/Closed Principle (OCP)

Los componentes están abiertos para extensión pero cerrados para modificación:

#### **CategoryCard Variants**
```javascript
// Extensible sin modificar el componente base
<CategoryCard variant="compact" />
<CategoryCard variant="large" />
<CategoryCard variant="default" />
```

#### **CategorySection Configuration**
```javascript
// Configurable sin modificar la implementación interna
<CategorySection 
  maxApps={8}
  showViewAll={true}
  variant="default"
/>
```

### 3. Liskov Substitution Principle (LSP)

Los componentes pueden ser sustituidos por sus variantes sin alterar el comportamiento:

#### **Intercambiables**
```javascript
// Cualquier variante funciona en el mismo contexto
const CardComponent = variant === 'large' ? LargeCategoryCard : CategoryCard
```

### 4. Interface Segregation Principle (ISP)

Los componentes solo reciben las props que necesitan:

#### **CategoryCard Props**
```javascript
// Solo las props necesarias, no interfaces gigantes
const CategoryCard = ({ 
  category, 
  onClick, 
  variant = 'default',
  showAppsCount = true,
  showProgressBar = false 
}) => { ... }
```

#### **CategorySection Props**
```javascript
// Interfaz específica para su responsabilidad
const CategorySection = ({ 
  category, 
  onAppClick,
  maxApps = 8,
  showViewAll = true,
  variant = 'default'
}) => { ... }
```

### 5. Dependency Inversion Principle (DIP)

Los componentes dependen de abstracciones, no de implementaciones concretas:

#### **Hooks Abstraction**
```javascript
// CategoriesWithApps depende de la abstracción useCategories
const { categories, loading, error, getTopCategories } = useCategories()

// No depende de la implementación específica de la API
```

#### **Callback Abstractions**
```javascript
// Los componentes reciben callbacks como abstracciones
<CategorySection onAppClick={handleAppClick} />

// No conocen la implementación específica de navegación
```

## 🔧 Arquitectura de Componentes

### Jerarquía de Responsabilidades

```
CategoriesWithApps (Orquestador principal)
├── useCategories() (Gestión de datos)
├── CategorySection (Sección individual)
│   ├── useCategoryApps() (Apps por categoría)
│   ├── Swiper (Para muchas apps)
│   ├── Grid (Para pocas apps)
│   └── AppCard (Tarjeta individual)
└── CategoryCard (Tarjeta de categoría)
```

### Flujo de Datos

1. **`useCategories`** obtiene categorías del backend
2. **`CategoriesWithApps`** filtra y organiza las categorías
3. **`CategorySection`** usa **`useCategoryApps`** para obtener apps de cada categoría
4. **`AppCard`** renderiza información individual de cada app

## 🎯 Beneficios de la Arquitectura

### **Mantenibilidad**
- Cada componente tiene una responsabilidad clara
- Fácil localizar y corregir errores
- Cambios aislados no afectan otras partes

### **Escalabilidad**
- Nuevos componentes se pueden agregar fácilmente
- Variantes y configuraciones sin modificar código existente
- Reutilización de lógica en diferentes contextos

### **Testabilidad**
- Componentes pequeños con responsabilidades específicas
- Fácil crear mocks de las dependencias
- Tests unitarios más precisos y rápidos

### **Reutilización**
- Componentes modulares reutilizables en diferentes páginas
- Hooks compartidos para lógica común
- Configurabilidad a través de props

## 📦 Estructura de Archivos

```
src/
├── hooks/
│   ├── useCategories.js      # SRP: Solo categorías
│   └── useCategoryApps.js    # SRP: Solo apps por categoría
├── components/
│   ├── CategoryCard.jsx      # SRP: Solo tarjeta de categoría
│   ├── CategorySection.jsx   # SRP: Solo sección con apps
│   ├── CategorySwiper.jsx    # SRP: Solo carrusel
│   └── CategoriesWithApps.jsx # SRP: Solo orquestación
└── lib/
    └── api.js               # SRP: Solo comunicación backend
```

## 🔄 Ejemplo de Extensión

Para agregar una nueva funcionalidad (ej: favoritos), simplemente:

1. **Crear hook específico**:
```javascript
// useFavorites.js - SRP
export const useFavorites = () => {
  // Lógica específica de favoritos
}
```

2. **Extender componentes existentes**:
```javascript
// CategoryCard.jsx - OCP
<CategoryCard 
  showFavoriteButton={true}
  onFavoriteClick={handleFavorite}
/>
```

3. **Inyectar dependencias**:
```javascript
// DIP - Pasar callback desde componente padre
<CategoriesWithApps 
  onFavoriteClick={handleFavorite}
/>
```

## 🚀 Mejores Prácticas Implementadas

### **Performance**
- `memo()` para evitar re-renders innecesarios
- `useCallback()` para optimizar callbacks
- Lazy loading de imágenes
- Paginación para grandes conjuntos de datos

### **Accesibilidad**
- Roles ARIA apropiados
- Navegación por teclado
- Labels descriptivos
- Estados de carga y error

### **SEO**
- HTML semántico (`<article>`, `<section>`, `<header>`)
- Atributos `alt` descriptivos
- Lazy loading apropiado
- Jerarquía de headings correcta

Esta arquitectura SOLID garantiza un código mantenible, escalable y robusto que puede crecer con los requisitos del proyecto. 