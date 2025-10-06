import StorageManager from './StorageManager.js';

/**
 * EventManager - Gestiona la creación, lectura, actualización y eliminación de eventos
 */
class EventManager {
  static STORAGE_KEY = 'calendario_events';

  /**
   * Genera un ID único para un evento
   * @returns {string} - ID único
   */
  static generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Valida los datos de un evento
   * @param {Object} eventData - Datos del evento
   * @throws {Error} - Si los datos no son válidos
   */
  static validateEvent(eventData) {
    if (!eventData.title || eventData.title.trim() === '') {
      throw new Error('ValidationError: El título es requerido');
    }
    if (!eventData.date || !(eventData.date instanceof Date)) {
      throw new Error('ValidationError: La fecha debe ser un objeto Date válido');
    }
  }

  /**
   * Crea un nuevo evento
   * @param {Object} eventData - Datos del evento
   * @returns {Object} - El evento creado con su ID
   */
  static createEvent(eventData) {
    this.validateEvent(eventData);

    const event = {
      id: this.generateId(),
      title: eventData.title,
      date: eventData.date,
      description: eventData.description || '',
      category: eventData.category || 'Personal',
      reminder: eventData.reminder || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const events = this.getAllEvents();
    events.push(event);
    StorageManager.save(this.STORAGE_KEY, events);

    // Emitir evento del sistema
    this.emitEvent('event:created', event);

    return event;
  }

  /**
   * Obtiene todos los eventos
   * @returns {Array} - Lista de todos los eventos
   */
  static getAllEvents() {
    return StorageManager.load(this.STORAGE_KEY) || [];
  }

  /**
   * Obtiene un evento por su ID
   * @param {string} eventId - ID del evento
   * @returns {Object|null} - El evento solicitado o null si no existe
   */
  static getEvent(eventId) {
    const events = this.getAllEvents();
    return events.find(event => event.id === eventId) || null;
  }

  /**
   * Actualiza un evento existente
   * @param {string} eventId - ID del evento
   * @param {Object} eventData - Nuevos datos del evento
   * @returns {Object} - El evento actualizado
   */
  static updateEvent(eventId, eventData) {
    const events = this.getAllEvents();
    const index = events.findIndex(event => event.id === eventId);

    if (index === -1) {
      throw new Error('NotFoundError: Evento no encontrado');
    }

    const updatedEvent = {
      ...events[index],
      ...eventData,
      id: eventId,
      updatedAt: new Date()
    };

    if (eventData.date) {
      this.validateEvent(updatedEvent);
    }

    events[index] = updatedEvent;
    StorageManager.save(this.STORAGE_KEY, events);

    // Emitir evento del sistema
    this.emitEvent('event:updated', updatedEvent);

    return updatedEvent;
  }

  /**
   * Elimina un evento
   * @param {string} eventId - ID del evento
   * @returns {boolean} - true si se eliminó correctamente
   */
  static deleteEvent(eventId) {
    const events = this.getAllEvents();
    const index = events.findIndex(event => event.id === eventId);

    if (index === -1) {
      throw new Error('NotFoundError: Evento no encontrado');
    }

    const deletedEvent = events[index];
    events.splice(index, 1);
    StorageManager.save(this.STORAGE_KEY, events);

    // Emitir evento del sistema
    this.emitEvent('event:deleted', deletedEvent);

    return true;
  }

  /**
   * Lista eventos según filtros
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Array} - Lista de eventos filtrados
   */
  static listEvents(filters = {}) {
    let events = this.getAllEvents();

    if (filters.startDate) {
      events = events.filter(event => 
        new Date(event.date) >= filters.startDate
      );
    }

    if (filters.endDate) {
      events = events.filter(event => 
        new Date(event.date) <= filters.endDate
      );
    }

    if (filters.category) {
      events = events.filter(event => 
        event.category === filters.category
      );
    }

    return events;
  }

  /**
   * Emite un evento del sistema
   * @param {string} eventName - Nombre del evento
   * @param {*} data - Datos del evento
   */
  static emitEvent(eventName, data) {
    const event = new CustomEvent(eventName, { detail: data });
    window.dispatchEvent(event);
  }
}

export default EventManager;
