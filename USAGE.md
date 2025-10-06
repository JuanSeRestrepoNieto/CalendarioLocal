# Guía de Uso - CalendarioLocal

## Inicio Rápido

Para usar CalendarioLocal, simplemente abre el archivo `index.html` en tu navegador web.

```bash
# Opción 1: Abrir directamente
open index.html  # macOS
xdg-open index.html  # Linux
start index.html  # Windows

# Opción 2: Usar un servidor HTTP local
python3 -m http.server 8080
# Luego abre http://localhost:8080 en tu navegador
```

## Características

### 📅 Vista de Calendario

- **Navegación mensual**: Usa los botones `<` y `>` para moverte entre meses
- **Vista de eventos**: Los eventos aparecen directamente en los días del calendario
- **Día actual**: El día actual está resaltado en azul claro
- **Click en día**: Haz click en cualquier día para crear un evento en esa fecha

### ✏️ Crear Eventos

1. Haz click en un día del calendario o completa el formulario manualmente
2. Rellena los campos:
   - **Título** (obligatorio): Nombre del evento
   - **Fecha y Hora** (obligatorio): Cuándo ocurrirá el evento
   - **Descripción** (opcional): Detalles adicionales
   - **Categoría**: Personal, Trabajo, Estudio u Otros
   - **Recordatorio** (opcional): Activa y configura un recordatorio
3. Haz click en "Crear Evento"

### 📝 Editar Eventos

- Haz click en un evento en el calendario o en la lista de "Próximos Eventos"
- Modifica los campos que necesites
- Haz click en "Actualizar Evento"

### 🗑️ Eliminar Eventos

- Edita el evento que deseas eliminar
- Haz click en el botón "Eliminar"
- Confirma la acción

### 📋 Lista de Próximos Eventos

- En el panel derecho se muestran los próximos eventos ordenados por fecha
- Haz click en cualquier evento de la lista para editarlo
- Los eventos muestran su categoría con un badge de color

## Categorías

Las categorías ayudan a organizar tus eventos:

- 🔵 **Personal**: Eventos personales
- 🔴 **Trabajo**: Eventos laborales
- 🟣 **Estudio**: Eventos académicos
- ⚫ **Otros**: Otros tipos de eventos

## Almacenamiento

Todos los eventos se guardan automáticamente en el **localStorage** de tu navegador:

- ✅ No requiere conexión a internet
- ✅ Los datos persisten entre sesiones
- ✅ Completamente privado y local
- ⚠️ Los datos están vinculados a tu navegador específico

## Recordatorios

Puedes configurar recordatorios para tus eventos:

1. Marca la casilla "Activar recordatorio"
2. Especifica cuántos minutos antes del evento quieres ser notificado
3. El sistema emitirá un evento cuando se active el recordatorio

## Compatibilidad

CalendarioLocal funciona en todos los navegadores modernos que soporten:
- ES6 Modules
- LocalStorage
- CustomEvents

Navegadores compatibles:
- Chrome/Edge 61+
- Firefox 60+
- Safari 11+
- Opera 48+

## Consejos

- **Respaldo**: Puedes exportar tus datos usando las herramientas de desarrollador del navegador (`localStorage.getItem('calendario_events')`)
- **Limpieza**: Para eliminar todos los eventos, limpia el localStorage del sitio
- **Responsive**: La interfaz se adapta a diferentes tamaños de pantalla

## Solución de Problemas

### Los eventos no se guardan
- Verifica que tu navegador permita el uso de localStorage
- Comprueba que no estés en modo incógnito/privado

### La aplicación no carga
- Asegúrate de estar usando un navegador compatible
- Verifica que todos los archivos estén en las ubicaciones correctas
- Abre la consola del navegador para ver posibles errores

### Los módulos no cargan
- Si ves errores de CORS, debes servir los archivos a través de un servidor HTTP
- No abras el archivo directamente con `file://` si usas módulos ES6
