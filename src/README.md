# Código Fuente

Esta carpeta contiene el código fuente de CalendarioLocal.

## Estructura

```
src/
├── components/     # Componentes reutilizables de UI
├── models/         # Modelos de datos
├── services/       # Servicios y lógica de negocio
├── utils/          # Utilidades y funciones auxiliares
├── config/         # Archivos de configuración
└── index.js        # Punto de entrada de la aplicación
```

## Convenciones

- Los nombres de archivos deben ser descriptivos
- Usar camelCase para nombres de archivos JavaScript
- Mantener los archivos pequeños y enfocados
- Cada archivo debe tener una responsabilidad única

## Desarrollo

Para agregar nueva funcionalidad:
1. Identifica el módulo apropiado
2. Crea o modifica los archivos necesarios
3. Agrega pruebas correspondientes en `/tests`
4. Actualiza la documentación si es necesario

## Importaciones

Seguir el orden:
1. Librerías externas
2. Módulos internos
3. Archivos locales

Ejemplo:
```javascript
// Librerías externas
import React from 'react';

// Módulos internos
import { EventManager } from './services/EventManager';

// Archivos locales
import './styles.css';
```
