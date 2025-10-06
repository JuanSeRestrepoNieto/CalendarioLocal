# Pruebas

Esta carpeta contiene todas las pruebas del proyecto CalendarioLocal.

## Estructura

```
tests/
├── unit/           # Pruebas unitarias
├── integration/    # Pruebas de integración
├── e2e/            # Pruebas end-to-end (opcional)
└── fixtures/       # Datos de prueba
```

## Tipos de Pruebas

### Pruebas Unitarias

Prueban componentes individuales de forma aislada.

Ejemplo:
```javascript
describe('EventManager', () => {
  test('should create an event', () => {
    const event = EventManager.createEvent({
      title: 'Test Event',
      date: new Date()
    });
    expect(event).toBeDefined();
    expect(event.title).toBe('Test Event');
  });
});
```

### Pruebas de Integración

Prueban la interacción entre múltiples componentes.

Ejemplo:
```javascript
describe('Event Creation Flow', () => {
  test('should create and save event', () => {
    const event = EventManager.createEvent({...});
    const saved = StorageManager.save('events', event);
    expect(saved).toBe(true);
  });
});
```

### Pruebas E2E

Prueban el flujo completo de la aplicación desde la perspectiva del usuario.

## Ejecutar Pruebas

```bash
# Todas las pruebas
npm test

# Pruebas específicas
npm test -- EventManager

# Modo watch
npm run test:watch

# Cobertura
npm run test:coverage
```

## Escribir Pruebas

### Mejores Prácticas

1. **Descriptivas**: Usa nombres claros para describir lo que prueba
2. **Independientes**: Cada prueba debe ser independiente
3. **Rápidas**: Las pruebas deben ejecutarse rápidamente
4. **Completas**: Cubrir casos normales y casos edge
5. **Mantenibles**: Código de prueba limpio y organizado

### Estructura de una Prueba

```javascript
describe('Nombre del módulo', () => {
  // Setup
  beforeEach(() => {
    // Preparación antes de cada prueba
  });

  // Teardown
  afterEach(() => {
    // Limpieza después de cada prueba
  });

  test('should do something', () => {
    // Arrange: Preparar datos
    const input = {...};

    // Act: Ejecutar acción
    const result = functionToTest(input);

    // Assert: Verificar resultado
    expect(result).toBe(expected);
  });
});
```

## Cobertura de Código

Objetivo: Mantener cobertura mínima del 80%

Áreas críticas deben tener 100% de cobertura:
- Lógica de negocio
- Manejo de datos
- Validaciones

## Fixtures

Los datos de prueba se encuentran en `/tests/fixtures/`

Ejemplo:
```javascript
// tests/fixtures/events.js
export const mockEvents = [
  {
    id: '1',
    title: 'Test Event 1',
    date: new Date('2024-12-15')
  },
  // ...
];
```

## Mocking

Usar mocks para:
- Servicios externos
- Almacenamiento
- Fechas y tiempos
- Funciones con efectos secundarios

## Debugging de Pruebas

```bash
# Ejecutar con debugging
npm run test:debug

# Ejecutar prueba específica en debug
npm run test:debug -- -t "nombre de la prueba"
```

## CI/CD

Las pruebas se ejecutan automáticamente en CI/CD antes de hacer merge.
Todas las pruebas deben pasar antes de fusionar código.
