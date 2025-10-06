import EventManager from '../services/EventManager.js';
import { formatDateDisplay, getMonthDays, getFirstDayOfMonth } from '../utils/dateUtils.js';

/**
 * Calendar - Componente de calendario
 */
class Calendar {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentDate = new Date();
    this.events = [];
    this.init();
  }

  /**
   * Inicializa el calendario
   */
  init() {
    this.loadEvents();
    this.render();
    this.attachEventListeners();
  }

  /**
   * Carga los eventos desde el EventManager
   */
  loadEvents() {
    this.events = EventManager.getAllEvents();
  }

  /**
   * Renderiza el calendario
   */
  render() {
    const monthDays = getMonthDays(this.currentDate);
    const firstDayOfWeek = getFirstDayOfMonth(this.currentDate).getDay();
    
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const html = `
      <div class="calendar-header">
        <button id="prev-month" class="nav-button">&lt;</button>
        <h2 class="calendar-title">
          ${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}
        </h2>
        <button id="next-month" class="nav-button">&gt;</button>
      </div>
      <div class="calendar-weekdays">
        <div class="weekday">Dom</div>
        <div class="weekday">Lun</div>
        <div class="weekday">Mar</div>
        <div class="weekday">Mié</div>
        <div class="weekday">Jue</div>
        <div class="weekday">Vie</div>
        <div class="weekday">Sáb</div>
      </div>
      <div class="calendar-days">
        ${this.renderDays(monthDays, firstDayOfWeek)}
      </div>
    `;

    this.container.innerHTML = html;
  }

  /**
   * Renderiza los días del mes
   */
  renderDays(monthDays, firstDayOfWeek) {
    let html = '';
    
    // Días vacíos antes del primer día del mes
    for (let i = 0; i < firstDayOfWeek; i++) {
      html += '<div class="calendar-day empty"></div>';
    }

    // Días del mes
    monthDays.forEach(day => {
      const dayEvents = this.getEventsForDay(day);
      const isToday = this.isToday(day);
      const todayClass = isToday ? 'today' : '';
      
      html += `
        <div class="calendar-day ${todayClass}" data-date="${day.toISOString()}">
          <div class="day-number">${day.getDate()}</div>
          <div class="day-events">
            ${dayEvents.map(event => `
              <div class="event-indicator" title="${event.title}" data-event-id="${event.id}">
                ${event.title}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });

    return html;
  }

  /**
   * Obtiene los eventos para un día específico
   */
  getEventsForDay(day) {
    return this.events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day.getDate() &&
             eventDate.getMonth() === day.getMonth() &&
             eventDate.getFullYear() === day.getFullYear();
    });
  }

  /**
   * Verifica si una fecha es hoy
   */
  isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  /**
   * Adjunta los event listeners
   */
  attachEventListeners() {
    const prevButton = document.getElementById('prev-month');
    const nextButton = document.getElementById('next-month');

    if (prevButton) {
      prevButton.addEventListener('click', () => this.previousMonth());
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => this.nextMonth());
    }

    // Event listener para clicks en días
    this.container.addEventListener('click', (e) => {
      const dayElement = e.target.closest('.calendar-day');
      if (dayElement && !dayElement.classList.contains('empty')) {
        const date = dayElement.dataset.date;
        this.onDayClick(new Date(date));
      }

      // Event listener para clicks en eventos
      const eventElement = e.target.closest('.event-indicator');
      if (eventElement) {
        e.stopPropagation();
        const eventId = eventElement.dataset.eventId;
        this.onEventClick(eventId);
      }
    });

    // Escuchar cambios en eventos
    window.addEventListener('event:created', () => this.refresh());
    window.addEventListener('event:updated', () => this.refresh());
    window.addEventListener('event:deleted', () => this.refresh());
  }

  /**
   * Navega al mes anterior
   */
  previousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.refresh();
  }

  /**
   * Navega al mes siguiente
   */
  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.refresh();
  }

  /**
   * Refresca el calendario
   */
  refresh() {
    this.loadEvents();
    this.render();
    this.attachEventListeners();
  }

  /**
   * Callback cuando se hace click en un día
   */
  onDayClick(date) {
    const event = new CustomEvent('calendar:dayClick', { detail: { date } });
    window.dispatchEvent(event);
  }

  /**
   * Callback cuando se hace click en un evento
   */
  onEventClick(eventId) {
    const event = new CustomEvent('calendar:eventClick', { detail: { eventId } });
    window.dispatchEvent(event);
  }
}

export default Calendar;
