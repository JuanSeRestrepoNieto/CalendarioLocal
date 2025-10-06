/**
 * Utilidades para manejo de fechas
 */

/**
 * Format a date as a string suitable for a HTML `datetime-local` input.
 * @param {Date} date - The date to format. Values accepted by the Date constructor are supported.
 * @returns {string} The date formatted as `YYYY-MM-DDTHH:MM`.
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
 * Format a date into a Spanish locale readable date and time string.
 * @param {Date|string|number} date - Date object or value accepted by the Date constructor.
 * @returns {string} A Spanish ('es-ES') locale-formatted date and time string with year, month (long), day, hour and minute.
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
 * Get the first day of the month for the given date.
 * @param {Date} date - Reference date.
 * @returns {Date} Date representing the first day of the month of the provided date.
 */
export function getFirstDayOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Return the last day of the month for the given date.
 * @param {Date} date - Reference date whose month is used to determine the last day.
 * @returns {Date} A Date representing the last day of the month of the provided date.
 */
export function getLastDayOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * Get an array of Date objects representing each day in the month of the given date.
 * @param {Date} date - Reference date whose month will be used to generate the days.
 * @returns {Date[]} An array of Date objects for every day in that month, in chronological order.
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