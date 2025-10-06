import EventManager from '../services/EventManager.js';
import { formatDateForInput, formatDateDisplay } from '../utils/dateUtils.js';

/**
 * EventForm - Componente de formulario para eventos
 */
class EventForm {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentEvent = null;
    this.init();
  }

  /**
   * Inicializa el formulario
   */
  init() {
    this.render();
    this.attachEventListeners();
  }

  /**
   * Renderiza el formulario
   */
  render() {
    const html = `
      <div class="event-form">
        <h3 id="form-title">${this.currentEvent ? 'Editar Evento' : 'Nuevo Evento'}</h3>
        <form id="event-form-element">
          <div class="form-group">
            <label for="event-title">Título *</label>
            <input 
              type="text" 
              id="event-title" 
              name="title" 
              required 
              value="${this.currentEvent ? this.currentEvent.title : ''}"
            />
          </div>

          <div class="form-group">
            <label for="event-date">Fecha y Hora *</label>
            <input 
              type="datetime-local" 
              id="event-date" 
              name="date" 
              required 
              value="${this.currentEvent ? formatDateForInput(this.currentEvent.date) : ''}"
            />
          </div>

          <div class="form-group">
            <label for="event-description">Descripción</label>
            <textarea 
              id="event-description" 
              name="description" 
              rows="3"
            >${this.currentEvent ? this.currentEvent.description : ''}</textarea>
          </div>

          <div class="form-group">
            <label for="event-category">Categoría</label>
            <select id="event-category" name="category">
              <option value="Personal" ${this.currentEvent?.category === 'Personal' ? 'selected' : ''}>Personal</option>
              <option value="Trabajo" ${this.currentEvent?.category === 'Trabajo' ? 'selected' : ''}>Trabajo</option>
              <option value="Estudio" ${this.currentEvent?.category === 'Estudio' ? 'selected' : ''}>Estudio</option>
              <option value="Otros" ${this.currentEvent?.category === 'Otros' ? 'selected' : ''}>Otros</option>
            </select>
          </div>

          <div class="form-group">
            <label>
              <input 
                type="checkbox" 
                id="event-reminder-enabled" 
                name="reminderEnabled"
                ${this.currentEvent?.reminder?.enabled ? 'checked' : ''}
              />
              Activar recordatorio
            </label>
          </div>

          <div class="form-group" id="reminder-time-group" style="display: ${this.currentEvent?.reminder?.enabled ? 'block' : 'none'}">
            <label for="event-reminder-time">Recordar con (minutos de anticipación)</label>
            <input 
              type="number" 
              id="event-reminder-time" 
              name="reminderTime" 
              min="1" 
              value="${this.currentEvent?.reminder?.time || 30}"
            />
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary">
              ${this.currentEvent ? 'Actualizar' : 'Crear'} Evento
            </button>
            ${this.currentEvent ? '<button type="button" id="delete-event-btn" class="btn btn-danger">Eliminar</button>' : ''}
            <button type="button" id="cancel-event-btn" class="btn btn-secondary">Cancelar</button>
          </div>
        </form>
      </div>

      <div class="event-list">
        <h3>Próximos Eventos</h3>
        <div id="events-list-container"></div>
      </div>
    `;

    this.container.innerHTML = html;
    this.renderEventsList();
  }

  /**
   * Renderiza la lista de eventos
   */
  renderEventsList() {
    const events = EventManager.getAllEvents()
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 10);

    const container = document.getElementById('events-list-container');
    
    if (events.length === 0) {
      container.innerHTML = '<p class="no-events">No hay eventos programados</p>';
      return;
    }

    const html = events.map(event => `
      <div class="event-item" data-event-id="${event.id}">
        <div class="event-item-header">
          <strong>${event.title}</strong>
          <span class="event-category ${event.category.toLowerCase()}">${event.category}</span>
        </div>
        <div class="event-item-date">${formatDateDisplay(event.date)}</div>
        ${event.description ? `<div class="event-item-description">${event.description}</div>` : ''}
      </div>
    `).join('');

    container.innerHTML = html;
  }

  /**
   * Adjunta los event listeners
   */
  attachEventListeners() {
    const form = document.getElementById('event-form-element');
    const cancelBtn = document.getElementById('cancel-event-btn');
    const deleteBtn = document.getElementById('delete-event-btn');
    const reminderCheckbox = document.getElementById('event-reminder-enabled');
    const reminderTimeGroup = document.getElementById('reminder-time-group');

    if (form) {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.handleCancel());
    }

    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => this.handleDelete());
    }

    if (reminderCheckbox) {
      reminderCheckbox.addEventListener('change', (e) => {
        reminderTimeGroup.style.display = e.target.checked ? 'block' : 'none';
      });
    }

    // Event listener para clicks en eventos de la lista
    const eventsContainer = document.getElementById('events-list-container');
    if (eventsContainer) {
      eventsContainer.addEventListener('click', (e) => {
        const eventItem = e.target.closest('.event-item');
        if (eventItem) {
          const eventId = eventItem.dataset.eventId;
          this.editEvent(eventId);
        }
      });
    }

    // Escuchar clicks en el calendario
    window.addEventListener('calendar:dayClick', (e) => {
      this.setDate(e.detail.date);
    });

    window.addEventListener('calendar:eventClick', (e) => {
      this.editEvent(e.detail.eventId);
    });
  }

  /**
   * Maneja el envío del formulario
   */
  handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const eventData = {
      title: formData.get('title'),
      date: new Date(formData.get('date')),
      description: formData.get('description'),
      category: formData.get('category'),
      reminder: formData.get('reminderEnabled') === 'on' ? {
        enabled: true,
        time: parseInt(formData.get('reminderTime')) || 30
      } : null
    };

    try {
      if (this.currentEvent) {
        EventManager.updateEvent(this.currentEvent.id, eventData);
        alert('Evento actualizado correctamente');
      } else {
        EventManager.createEvent(eventData);
        alert('Evento creado correctamente');
      }
      this.reset();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  }

  /**
   * Maneja la cancelación
   */
  handleCancel() {
    this.reset();
  }

  /**
   * Maneja la eliminación
   */
  handleDelete() {
    if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
      try {
        EventManager.deleteEvent(this.currentEvent.id);
        alert('Evento eliminado correctamente');
        this.reset();
      } catch (error) {
        alert('Error al eliminar: ' + error.message);
      }
    }
  }

  /**
   * Establece una fecha en el formulario
   */
  setDate(date) {
    this.currentEvent = null;
    this.render();
    this.attachEventListeners();
    document.getElementById('event-date').value = formatDateForInput(date);
  }

  /**
   * Carga un evento para editar
   */
  editEvent(eventId) {
    const event = EventManager.getEvent(eventId);
    if (event) {
      this.currentEvent = event;
      this.render();
      this.attachEventListeners();
    }
  }

  /**
   * Reinicia el formulario
   */
  reset() {
    this.currentEvent = null;
    this.render();
    this.attachEventListeners();
  }
}

export default EventForm;
