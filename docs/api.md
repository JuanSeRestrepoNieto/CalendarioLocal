# API de CalendarioLocal

## Visión General

Este documento describe la API interna de CalendarioLocal. Dado que es una aplicación local, la API está diseñada para el uso interno de los componentes de la aplicación.

## Módulos Principales

### EventManager

Gestiona la creación, lectura, actualización y eliminación de eventos.

#### Métodos

**createEvent(eventData)**
- Descripción: Crea un nuevo evento
- Parámetros:
  - `eventData` (Object): Datos del evento
    - `title` (String): Título del evento
    - `date` (Date): Fecha y hora del evento
    - `description` (String, opcional): Descripción del evento
    - `category` (String, opcional): Categoría del evento
    - `reminder` (Object, opcional): Configuración de recordatorio
- Retorna: `Object` - El evento creado con su ID

**getEvent(eventId)**
- Descripción: Obtiene un evento por su ID
- Parámetros:
  - `eventId` (String): ID del evento
- Retorna: `Object` - El evento solicitado o null si no existe

**updateEvent(eventId, eventData)**
- Descripción: Actualiza un evento existente
- Parámetros:
  - `eventId` (String): ID del evento
  - `eventData` (Object): Nuevos datos del evento
- Retorna: `Object` - El evento actualizado

**deleteEvent(eventId)**
- Descripción: Elimina un evento
- Parámetros:
  - `eventId` (String): ID del evento
- Retorna: `Boolean` - true si se eliminó correctamente

**listEvents(filters)**
- Descripción: Lista eventos según filtros
- Parámetros:
  - `filters` (Object, opcional): Filtros de búsqueda
    - `startDate` (Date): Fecha de inicio
    - `endDate` (Date): Fecha de fin
    - `category` (String): Categoría
- Retorna: `Array` - Lista de eventos

### StorageManager

Gestiona el almacenamiento local de datos.

#### Métodos

**save(key, data)**
- Descripción: Guarda datos en el almacenamiento local
- Parámetros:
  - `key` (String): Clave para identificar los datos
  - `data` (Any): Datos a guardar
- Retorna: `Boolean` - true si se guardó correctamente

**load(key)**
- Descripción: Carga datos del almacenamiento local
- Parámetros:
  - `key` (String): Clave de los datos
- Retorna: `Any` - Los datos guardados o null

**delete(key)**
- Descripción: Elimina datos del almacenamiento local
- Parámetros:
  - `key` (String): Clave de los datos
- Retorna: `Boolean` - true si se eliminó correctamente

**backup()**
- Descripción: Crea un respaldo de todos los datos
- Retorna: `Object` - Objeto con todos los datos

**restore(backupData)**
- Descripción: Restaura datos desde un respaldo
- Parámetros:
  - `backupData` (Object): Datos del respaldo
- Retorna: `Boolean` - true si se restauró correctamente

### ReminderManager

Gestiona los recordatorios de eventos.

#### Métodos

**setReminder(eventId, reminderConfig)**
- Descripción: Configura un recordatorio para un evento
- Parámetros:
  - `eventId` (String): ID del evento
  - `reminderConfig` (Object): Configuración del recordatorio
    - `time` (Number): Tiempo antes del evento (en minutos)
    - `enabled` (Boolean): Si el recordatorio está activo
- Retorna: `Object` - Configuración del recordatorio

**cancelReminder(eventId)**
- Descripción: Cancela el recordatorio de un evento
- Parámetros:
  - `eventId` (String): ID del evento
- Retorna: `Boolean` - true si se canceló correctamente

**checkReminders()**
- Descripción: Verifica y dispara recordatorios pendientes
- Retorna: `Array` - Lista de recordatorios disparados

## Modelos de Datos

### Event

```javascript
{
  id: String,              // ID único del evento
  title: String,           // Título del evento
  date: Date,              // Fecha y hora del evento
  description: String,     // Descripción (opcional)
  category: String,        // Categoría del evento
  reminder: {              // Configuración de recordatorio (opcional)
    time: Number,          // Tiempo antes (en minutos)
    enabled: Boolean       // Si está activo
  },
  createdAt: Date,         // Fecha de creación
  updatedAt: Date          // Fecha de última actualización
}
```

## Eventos del Sistema

La aplicación emite eventos del sistema que pueden ser escuchados:

- `event:created` - Cuando se crea un evento
- `event:updated` - Cuando se actualiza un evento
- `event:deleted` - Cuando se elimina un evento
- `reminder:triggered` - Cuando se dispara un recordatorio

## Errores

Los métodos lanzan errores en caso de fallos:

- `ValidationError` - Cuando los datos no son válidos
- `NotFoundError` - Cuando no se encuentra un recurso
- `StorageError` - Cuando falla el almacenamiento

## Ejemplos de Uso

```javascript
// Crear un evento
const event = EventManager.createEvent({
  title: "Reunión de equipo",
  date: new Date("2024-12-15T10:00:00"),
  description: "Reunión mensual del equipo",
  category: "Trabajo",
  reminder: {
    time: 30,
    enabled: true
  }
});

// Listar eventos
const events = EventManager.listEvents({
  startDate: new Date("2024-12-01"),
  endDate: new Date("2024-12-31")
});

// Actualizar un evento
EventManager.updateEvent(event.id, {
  title: "Reunión de equipo (Actualizada)"
});

// Eliminar un evento
EventManager.deleteEvent(event.id);
```
