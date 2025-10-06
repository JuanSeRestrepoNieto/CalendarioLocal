/**
 * Utilidades para manejo de fechas
 */

/**
 * Format a date as a string suitable for a datetime-local input.
 * @param {Date|number|string} date - A Date or value accepted by the Date constructor to format.
 * @returns {string} A string in the format `YYYY-MM-DDTHH:MM` suitable for `input[type="datetime-local"]`.
 */
export function formatDateForInput(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Format a date into a human-readable Spanish locale string including time.
 * @param {Date|string|number} date - Date object or value accepted by the Date constructor.
 * @returns {string} A string formatted for the 'es-ES' locale with numeric year, long month name, numeric day, and two-digit hour and minute.
 */
export function formatDateDisplay(date) {
  const d = new Date(date);
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return d.toLocaleDateString('es-ES', options);
}

/**
 * Return the first day of the month for the given date.
 * @param {Date} date - Reference date used to determine the month.
 * @returns {Date} The Date representing the first day of the month of the provided date.
 */
export function getFirstDayOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Get the last day of the month for the given date.
 * @param {Date} date - Reference date whose month will be used to determine the last day.
 * @returns {Date} Date representing the last day of the month for the provided date.
 */
export function getLastDayOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * Return an array containing a Date object for each day of the month that contains the given date.
 * @param {Date} date - Reference date whose month will be enumerated.
 * @returns {Date[]} An array of Date objects for every day in that month, in ascending order.
 */
export function getMonthDays(date) {
  const firstDay = getFirstDayOfMonth(date);
  const lastDay = getLastDayOfMonth(date);
  const days = [];
  
  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }
  
  return days;
}