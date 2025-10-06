/**
 * Unit tests for dateUtils
 */

import {
  formatDateForInput,
  formatDateDisplay,
  getFirstDayOfMonth,
  getLastDayOfMonth,
  getMonthDays
} from '../../src/utils/dateUtils.js';

describe('dateUtils', () => {
  describe('formatDateForInput', () => {
    test('should format date correctly for datetime-local input', () => {
      const date = new Date('2024-12-15T10:30:00');
      const result = formatDateForInput(date);
      expect(result).toBe('2024-12-15T10:30');
    });

    test('should pad single digit months and days with zeros', () => {
      const date = new Date('2024-01-05T09:05:00');
      const result = formatDateForInput(date);
      expect(result).toBe('2024-01-05T09:05');
    });

    test('should handle midnight time correctly', () => {
      const date = new Date('2024-12-15T00:00:00');
      const result = formatDateForInput(date);
      expect(result).toBe('2024-12-15T00:00');
    });

    test('should handle end of day time correctly', () => {
      const date = new Date('2024-12-15T23:59:00');
      const result = formatDateForInput(date);
      expect(result).toBe('2024-12-15T23:59');
    });

    test('should handle date strings as input', () => {
      const dateString = '2024-06-30T15:45:00';
      const result = formatDateForInput(dateString);
      expect(result).toBe('2024-06-30T15:45');
    });

    test('should handle timestamps as input', () => {
      const timestamp = new Date('2024-03-25T12:00:00').getTime();
      const result = formatDateForInput(timestamp);
      expect(result).toBe('2024-03-25T12:00');
    });

    test('should handle leap year dates', () => {
      const date = new Date('2024-02-29T08:30:00');
      const result = formatDateForInput(date);
      expect(result).toBe('2024-02-29T08:30');
    });

    test('should handle year boundaries', () => {
      const date = new Date('2024-12-31T23:59:00');
      const result = formatDateForInput(date);
      expect(result).toBe('2024-12-31T23:59');
    });
  });

  describe('formatDateDisplay', () => {
    test('should format date in Spanish locale', () => {
      const date = new Date('2024-12-15T10:30:00');
      const result = formatDateDisplay(date);
      expect(result).toMatch(/15/);
      expect(result).toMatch(/diciembre/i);
      expect(result).toMatch(/2024/);
      expect(result).toMatch(/10:30/);
    });

    test('should handle different months correctly', () => {
      const dates = [
        new Date('2024-01-15T10:00:00'),
        new Date('2024-06-15T10:00:00'),
        new Date('2024-12-15T10:00:00')
      ];
      
      dates.forEach(date => {
        const result = formatDateDisplay(date);
        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
      });
    });

    test('should include time in the display', () => {
      const date = new Date('2024-12-15T14:30:00');
      const result = formatDateDisplay(date);
      expect(result).toMatch(/14:30/);
    });

    test('should handle midnight display', () => {
      const date = new Date('2024-12-15T00:00:00');
      const result = formatDateDisplay(date);
      expect(result).toMatch(/00:00/);
    });

    test('should handle date strings as input', () => {
      const dateString = '2024-12-15T10:30:00';
      const result = formatDateDisplay(dateString);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });

  describe('getFirstDayOfMonth', () => {
    test('should return first day of current month', () => {
      const date = new Date('2024-12-15');
      const result = getFirstDayOfMonth(date);
      expect(result.getDate()).toBe(1);
      expect(result.getMonth()).toBe(11); // December is month 11
      expect(result.getFullYear()).toBe(2024);
    });

    test('should work for January', () => {
      const date = new Date('2024-01-25');
      const result = getFirstDayOfMonth(date);
      expect(result.getDate()).toBe(1);
      expect(result.getMonth()).toBe(0);
    });

    test('should work for December', () => {
      const date = new Date('2024-12-31');
      const result = getFirstDayOfMonth(date);
      expect(result.getDate()).toBe(1);
      expect(result.getMonth()).toBe(11);
    });

    test('should work for leap year February', () => {
      const date = new Date('2024-02-15');
      const result = getFirstDayOfMonth(date);
      expect(result.getDate()).toBe(1);
      expect(result.getMonth()).toBe(1);
    });

    test('should reset time to midnight', () => {
      const date = new Date('2024-12-15T15:30:45');
      const result = getFirstDayOfMonth(date);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
    });

    test('should not modify original date', () => {
      const date = new Date('2024-12-15');
      const originalDate = date.getDate();
      getFirstDayOfMonth(date);
      expect(date.getDate()).toBe(originalDate);
    });
  });

  describe('getLastDayOfMonth', () => {
    test('should return last day of December', () => {
      const date = new Date('2024-12-15');
      const result = getLastDayOfMonth(date);
      expect(result.getDate()).toBe(31);
      expect(result.getMonth()).toBe(11);
    });

    test('should return last day of February in leap year', () => {
      const date = new Date('2024-02-15');
      const result = getLastDayOfMonth(date);
      expect(result.getDate()).toBe(29);
    });

    test('should return last day of February in non-leap year', () => {
      const date = new Date('2023-02-15');
      const result = getLastDayOfMonth(date);
      expect(result.getDate()).toBe(28);
    });

    test('should handle 30-day months', () => {
      const date = new Date('2024-04-15');
      const result = getLastDayOfMonth(date);
      expect(result.getDate()).toBe(30);
    });

    test('should handle 31-day months', () => {
      const months = [0, 2, 4, 6, 7, 9, 11]; // Jan, Mar, May, Jul, Aug, Oct, Dec
      months.forEach(month => {
        const date = new Date(2024, month, 15);
        const result = getLastDayOfMonth(date);
        expect(result.getDate()).toBe(31);
      });
    });

    test('should not modify original date', () => {
      const date = new Date('2024-12-15');
      const originalDate = date.getDate();
      getLastDayOfMonth(date);
      expect(date.getDate()).toBe(originalDate);
    });

    test('should handle year boundaries', () => {
      const date = new Date('2024-12-01');
      const result = getLastDayOfMonth(date);
      expect(result.getDate()).toBe(31);
      expect(result.getMonth()).toBe(11);
      expect(result.getFullYear()).toBe(2024);
    });
  });

  describe('getMonthDays', () => {
    test('should return all days of December 2024', () => {
      const date = new Date('2024-12-15');
      const result = getMonthDays(date);
      expect(result).toHaveLength(31);
      expect(result[0].getDate()).toBe(1);
      expect(result[30].getDate()).toBe(31);
    });

    test('should return all days of February in leap year', () => {
      const date = new Date('2024-02-15');
      const result = getMonthDays(date);
      expect(result).toHaveLength(29);
    });

    test('should return all days of February in non-leap year', () => {
      const date = new Date('2023-02-15');
      const result = getMonthDays(date);
      expect(result).toHaveLength(28);
    });

    test('should return 30 days for April', () => {
      const date = new Date('2024-04-15');
      const result = getMonthDays(date);
      expect(result).toHaveLength(30);
    });

    test('should return Date objects', () => {
      const date = new Date('2024-12-15');
      const result = getMonthDays(date);
      result.forEach(day => {
        expect(day instanceof Date).toBe(true);
      });
    });

    test('should have sequential dates', () => {
      const date = new Date('2024-12-15');
      const result = getMonthDays(date);
      for (let i = 0; i < result.length; i++) {
        expect(result[i].getDate()).toBe(i + 1);
      }
    });

    test('should all belong to same month', () => {
      const date = new Date('2024-12-15');
      const result = getMonthDays(date);
      const month = date.getMonth();
      result.forEach(day => {
        expect(day.getMonth()).toBe(month);
      });
    });

    test('should all belong to same year', () => {
      const date = new Date('2024-12-15');
      const result = getMonthDays(date);
      const year = date.getFullYear();
      result.forEach(day => {
        expect(day.getFullYear()).toBe(year);
      });
    });

    test('should not modify original date', () => {
      const date = new Date('2024-12-15');
      const originalDate = date.getDate();
      getMonthDays(date);
      expect(date.getDate()).toBe(originalDate);
    });

    test('should handle January correctly', () => {
      const date = new Date('2024-01-15');
      const result = getMonthDays(date);
      expect(result).toHaveLength(31);
      expect(result[0].getMonth()).toBe(0);
    });

    test('should handle December correctly', () => {
      const date = new Date('2024-12-15');
      const result = getMonthDays(date);
      expect(result).toHaveLength(31);
      expect(result[0].getMonth()).toBe(11);
    });
  });
});