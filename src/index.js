import Calendar from './components/Calendar.js';
import EventForm from './components/EventForm.js';

/**
 * Aplicación principal CalendarioLocal
 */
class CalendarioLocal {
  constructor() {
    this.calendar = null;
    this.eventForm = null;
  }

  /**
   * Inicializa la aplicación
   */
  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.calendar = new Calendar('calendar-container');
      this.eventForm = new EventForm('event-form-container');
      
      console.log('CalendarioLocal inicializado correctamente');
    });
  }
}

// Inicializar la aplicación
const app = new CalendarioLocal();
app.init();

export default CalendarioLocal;
