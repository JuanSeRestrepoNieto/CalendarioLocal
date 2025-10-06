/**
 * Unit tests for StorageManager
 */

import StorageManager from '../../src/services/StorageManager.js';

describe('StorageManager', () => {
  let localStorageMock;

  beforeEach(() => {
    // Create a mock localStorage
    localStorageMock = (() => {
      let store = {};
      return {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => {
          store[key] = value.toString();
        }),
        removeItem: jest.fn((key) => {
          delete store[key];
        }),
        clear: jest.fn(() => {
          store = {};
        }),
        key: jest.fn((index) => {
          const keys = Object.keys(store);
          return keys[index] || null;
        }),
        get length() {
          return Object.keys(store).length;
        }
      };
    })();

    global.localStorage = localStorageMock;
    console.error = jest.fn(); // Suppress error logs in tests
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('save', () => {
    test('should save string data to localStorage', () => {
      const result = StorageManager.save('test-key', 'test-value');
      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', '"test-value"');
    });

    test('should save object data to localStorage', () => {
      const data = { name: 'Test', value: 123 };
      const result = StorageManager.save('test-key', data);
      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify(data)
      );
    });

    test('should save array data to localStorage', () => {
      const data = [1, 2, 3, 4, 5];
      const result = StorageManager.save('test-key', data);
      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    test('should save null value', () => {
      const result = StorageManager.save('test-key', null);
      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', 'null');
    });

    test('should save boolean values', () => {
      StorageManager.save('test-true', true);
      StorageManager.save('test-false', false);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test-true', 'true');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test-false', 'false');
    });

    test('should save number values', () => {
      StorageManager.save('test-number', 42);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test-number', '42');
    });

    test('should save complex nested objects', () => {
      const data = {
        user: {
          name: 'John',
          settings: {
            theme: 'dark',
            notifications: true
          }
        },
        events: [1, 2, 3]
      };
      const result = StorageManager.save('complex-key', data);
      expect(result).toBe(true);
    });

    test('should handle storage errors', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage full');
      });

      expect(() => StorageManager.save('test-key', 'data')).toThrow('StorageError');
      expect(console.error).toHaveBeenCalled();
    });

    test('should handle circular reference errors', () => {
      const circular = { name: 'test' };
      circular.self = circular;

      expect(() => StorageManager.save('circular-key', circular)).toThrow();
    });

    test('should overwrite existing data', () => {
      StorageManager.save('test-key', 'value1');
      StorageManager.save('test-key', 'value2');
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(2);
    });
  });

  describe('load', () => {
    test('should load string data from localStorage', () => {
      localStorageMock.setItem('test-key', '"test-value"');
      const result = StorageManager.load('test-key');
      expect(result).toBe('test-value');
    });

    test('should load object data from localStorage', () => {
      const data = { name: 'Test', value: 123 };
      localStorageMock.setItem('test-key', JSON.stringify(data));
      const result = StorageManager.load('test-key');
      expect(result).toEqual(data);
    });

    test('should load array data from localStorage', () => {
      const data = [1, 2, 3, 4, 5];
      localStorageMock.setItem('test-key', JSON.stringify(data));
      const result = StorageManager.load('test-key');
      expect(result).toEqual(data);
    });

    test('should return null for non-existent key', () => {
      const result = StorageManager.load('non-existent-key');
      expect(result).toBeNull();
    });

    test('should return null for malformed JSON', () => {
      localStorageMock.setItem('bad-key', 'not valid json');
      const result = StorageManager.load('bad-key');
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });

    test('should load boolean values correctly', () => {
      localStorageMock.setItem('test-true', 'true');
      localStorageMock.setItem('test-false', 'false');
      expect(StorageManager.load('test-true')).toBe(true);
      expect(StorageManager.load('test-false')).toBe(false);
    });

    test('should load number values correctly', () => {
      localStorageMock.setItem('test-number', '42');
      expect(StorageManager.load('test-number')).toBe(42);
    });

    test('should load null value correctly', () => {
      localStorageMock.setItem('test-null', 'null');
      expect(StorageManager.load('test-null')).toBeNull();
    });

    test('should handle complex nested objects', () => {
      const data = {
        user: {
          name: 'John',
          settings: {
            theme: 'dark'
          }
        }
      };
      localStorageMock.setItem('complex-key', JSON.stringify(data));
      const result = StorageManager.load('complex-key');
      expect(result).toEqual(data);
    });

    test('should handle empty string', () => {
      localStorageMock.setItem('empty-key', '""');
      const result = StorageManager.load('empty-key');
      expect(result).toBe('');
    });

    test('should handle storage read errors', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('Read error');
      });
      const result = StorageManager.load('test-key');
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    test('should delete data from localStorage', () => {
      localStorageMock.setItem('test-key', '"test-value"');
      const result = StorageManager.delete('test-key');
      expect(result).toBe(true);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('test-key');
    });

    test('should handle deletion of non-existent key', () => {
      const result = StorageManager.delete('non-existent-key');
      expect(result).toBe(true);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('non-existent-key');
    });

    test('should handle storage deletion errors', () => {
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error('Delete error');
      });
      const result = StorageManager.delete('test-key');
      expect(result).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });

    test('should delete multiple keys independently', () => {
      localStorageMock.setItem('key1', '"value1"');
      localStorageMock.setItem('key2', '"value2"');
      StorageManager.delete('key1');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('key1');
      expect(StorageManager.load('key2')).toBe('value2');
    });
  });

  describe('backup', () => {
    test('should create backup of all localStorage data', () => {
      localStorageMock.setItem('key1', '"value1"');
      localStorageMock.setItem('key2', '"value2"');
      localStorageMock.setItem('key3', '"value3"');

      const backup = StorageManager.backup();
      expect(backup).toEqual({
        key1: '"value1"',
        key2: '"value2"',
        key3: '"value3"'
      });
    });

    test('should return empty object when localStorage is empty', () => {
      const backup = StorageManager.backup();
      expect(backup).toEqual({});
    });

    test('should handle single item backup', () => {
      localStorageMock.setItem('only-key', '"only-value"');
      const backup = StorageManager.backup();
      expect(backup).toEqual({ 'only-key': '"only-value"' });
    });

    test('should handle backup errors', () => {
      localStorageMock.key.mockImplementation(() => {
        throw new Error('Backup error');
      });
      expect(() => StorageManager.backup()).toThrow('StorageError');
      expect(console.error).toHaveBeenCalled();
    });

    test('should include all types of data in backup', () => {
      localStorageMock.setItem('string-key', '"string"');
      localStorageMock.setItem('number-key', '42');
      localStorageMock.setItem('object-key', '{"name":"test"}');
      localStorageMock.setItem('array-key', '[1,2,3]');

      const backup = StorageManager.backup();
      expect(Object.keys(backup)).toHaveLength(4);
    });

    test('should not modify localStorage during backup', () => {
      localStorageMock.setItem('test-key', '"test-value"');
      StorageManager.backup();
      expect(localStorageMock.getItem('test-key')).toBe('"test-value"');
    });
  });

  describe('restore', () => {
    test('should restore data to localStorage', () => {
      const backupData = {
        key1: '"value1"',
        key2: '"value2"',
        key3: '"value3"'
      };

      const result = StorageManager.restore(backupData);
      expect(result).toBe(true);
      expect(localStorageMock.clear).toHaveBeenCalled();
      expect(localStorageMock.setItem).toHaveBeenCalledWith('key1', '"value1"');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('key2', '"value2"');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('key3', '"value3"');
    });

    test('should clear existing data before restore', () => {
      localStorageMock.setItem('existing-key', '"existing-value"');
      
      const backupData = { 'new-key': '"new-value"' };
      StorageManager.restore(backupData);

      expect(localStorageMock.clear).toHaveBeenCalled();
    });

    test('should handle empty backup', () => {
      const result = StorageManager.restore({});
      expect(result).toBe(true);
      expect(localStorageMock.clear).toHaveBeenCalled();
    });

    test('should handle restore errors', () => {
      localStorageMock.clear.mockImplementation(() => {
        throw new Error('Restore error');
      });

      const backupData = { 'key': '"value"' };
      expect(() => StorageManager.restore(backupData)).toThrow('StorageError');
      expect(console.error).toHaveBeenCalled();
    });

    test('should restore only owned properties', () => {
      const parent = { inherited: 'value' };
      const backupData = Object.create(parent);
      backupData.own = '"own-value"';

      StorageManager.restore(backupData);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('own', '"own-value"');
      expect(localStorageMock.setItem).not.toHaveBeenCalledWith('inherited', 'value');
    });

    test('should handle setItem errors during restore', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('SetItem error');
      });

      const backupData = { 'key': '"value"' };
      expect(() => StorageManager.restore(backupData)).toThrow('StorageError');
    });

    test('should restore all data types', () => {
      const backupData = {
        'string-key': '"string"',
        'number-key': '42',
        'object-key': '{"name":"test"}',
        'array-key': '[1,2,3]'
      };

      StorageManager.restore(backupData);
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(4);
    });
  });

  describe('integration scenarios', () => {
    test('should handle save and load cycle', () => {
      const data = { test: 'data', number: 123 };
      StorageManager.save('cycle-key', data);
      const loaded = StorageManager.load('cycle-key');
      expect(loaded).toEqual(data);
    });

    test('should handle backup and restore cycle', () => {
      StorageManager.save('key1', 'value1');
      StorageManager.save('key2', 'value2');
      
      const backup = StorageManager.backup();
      StorageManager.delete('key1');
      StorageManager.restore(backup);
      
      expect(StorageManager.load('key1')).toBe('value1');
      expect(StorageManager.load('key2')).toBe('value2');
    });

    test('should handle multiple operations in sequence', () => {
      StorageManager.save('key1', 'value1');
      expect(StorageManager.load('key1')).toBe('value1');
      
      StorageManager.save('key1', 'value2');
      expect(StorageManager.load('key1')).toBe('value2');
      
      StorageManager.delete('key1');
      expect(StorageManager.load('key1')).toBeNull();
    });
  });
});