/**
 * Utilidades para manejo de fechas
 */

/**
 * Formatea una fecha a string para input datetime-local
 * @param {Date} date - Fecha a formatear
 * @returns {string} - Fecha formateada
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
 * Formatea una fecha a string legible
 * @param {Date} date - Fecha a formatear
 * @returns {string} - Fecha formateada
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
 * Obtiene el primer día del mes
 * @param {Date} date - Fecha de referencia
 * @returns {Date} - Primer día del mes
 */
export function getFirstDayOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Obtiene el último día del mes
 * @param {Date} date - Fecha de referencia
 * @returns {Date} - Último día del mes
 */
export function getLastDayOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * Obtiene los días del mes en un array
 * @param {Date} date - Fecha de referencia
 * @returns {Array} - Array de fechas del mes
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
