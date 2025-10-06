/**
 * StorageManager - Gestiona el almacenamiento local de datos
 */
class StorageManager {
  /**
   * Guarda datos en el almacenamiento local
   * @param {string} key - Clave para identificar los datos
   * @param {*} data - Datos a guardar
   * @returns {boolean} - true si se guardó correctamente
   */
  static save(key, data) {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
      return true;
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
      throw new Error('StorageError');
    }
  }

  /**
   * Carga datos del almacenamiento local
   * @param {string} key - Clave de los datos
   * @returns {*} - Los datos guardados o null
   */
  static load(key) {
    try {
      const serializedData = localStorage.getItem(key);
      if (serializedData === null) {
        return null;
      }
      return JSON.parse(serializedData);
    } catch (error) {
      console.error('Error al cargar desde localStorage:', error);
      return null;
    }
  }

  /**
   * Elimina datos del almacenamiento local
   * @param {string} key - Clave de los datos
   * @returns {boolean} - true si se eliminó correctamente
   */
  static delete(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error al eliminar de localStorage:', error);
      return false;
    }
  }

  /**
   * Crea un respaldo de todos los datos
   * @returns {Object} - Objeto con todos los datos
   */
  static backup() {
    try {
      const backup = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        backup[key] = localStorage.getItem(key);
      }
      return backup;
    } catch (error) {
      console.error('Error al crear respaldo:', error);
      throw new Error('StorageError');
    }
  }

  /**
   * Restaura datos desde un respaldo
   * @param {Object} backupData - Datos del respaldo
   * @returns {boolean} - true si se restauró correctamente
   */
  static restore(backupData) {
    try {
      localStorage.clear();
      for (const key in backupData) {
        if (backupData.hasOwnProperty(key)) {
          localStorage.setItem(key, backupData[key]);
        }
      }
      return true;
    } catch (error) {
      console.error('Error al restaurar respaldo:', error);
      throw new Error('StorageError');
    }
  }
}

export default StorageManager;
