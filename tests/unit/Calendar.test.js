/**
 * Unit tests for Calendar component
 */

import Calendar from '../../src/components/Calendar.js';
import EventManager from '../../src/services/EventManager.js';
import * as dateUtils from '../../src/utils/dateUtils.js';
import { mockEvent1, mockEvent2, mockEvent3 } from '../fixtures/events.js';

// Mock dependencies
jest.mock('../../src/services/EventManager.js');
jest.mock('../../src/utils/dateUtils.js');

describe('Calendar', () => {
  let container;
  let calendar;
  let dispatchEventSpy;

  beforeEach(() => {
    // Create container element
    container = document.createElement('div');
    container.id = 'calendar-container';
    document.body.appendChild(container);

    // Mock EventManager
    EventManager.getAllEvents = jest.fn().mockReturnValue([mockEvent1, mockEvent2]);

    // Mock dateUtils functions
    dateUtils.formatDateDisplay = jest.fn((date) => date.toISOString());
    dateUtils.getMonthDays = jest.fn((date) => {
      const days = [];
      const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(date.getFullYear(), date.getMonth(), i));
      }
      return days;
    });
    dateUtils.getFirstDayOfMonth = jest.fn((date) => {
      return new Date(date.getFullYear(), date.getMonth(), 1);
    });

    // Spy on window.dispatchEvent
    dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');
    
    // Spy on window.addEventListener
    jest.spyOn(window, 'addEventListener');
  });

  afterEach(() => {
    document.body.removeChild(container);
    jest.clearAllMocks();
    dispatchEventSpy.mockRestore();
  });

  describe('constructor', () => {
    test('should create calendar instance', () => {
      calendar = new Calendar('calendar-container');
      expect(calendar).toBeInstanceOf(Calendar);
    });

    test('should set container element', () => {
      calendar = new Calendar('calendar-container');
      expect(calendar.container).toBe(container);
    });

    test('should initialize with current date', () => {
      calendar = new Calendar('calendar-container');
      expect(calendar.currentDate).toBeInstanceOf(Date);
    });

    test('should initialize with empty events array', () => {
      calendar = new Calendar('calendar-container');
      expect(Array.isArray(calendar.events)).toBe(true);
    });

    test('should call init on construction', () => {
      const initSpy = jest.spyOn(Calendar.prototype, 'init');
      calendar = new Calendar('calendar-container');
      expect(initSpy).toHaveBeenCalled();
      initSpy.mockRestore();
    });
  });

  describe('init', () => {
    test('should load events', () => {
      calendar = new Calendar('calendar-container');
      expect(EventManager.getAllEvents).toHaveBeenCalled();
    });

    test('should render calendar', () => {
      calendar = new Calendar('calendar-container');
      expect(container.innerHTML).not.toBe('');
    });

    test('should attach event listeners', () => {
      calendar = new Calendar('calendar-container');
      expect(window.addEventListener).toHaveBeenCalled();
    });
  });

  describe('loadEvents', () => {
    test('should load events from EventManager', () => {
      calendar = new Calendar('calendar-container');
      calendar.loadEvents();
      expect(EventManager.getAllEvents).toHaveBeenCalled();
      expect(calendar.events).toEqual([mockEvent1, mockEvent2]);
    });

    test('should handle empty events', () => {
      EventManager.getAllEvents.mockReturnValue([]);
      calendar = new Calendar('calendar-container');
      expect(calendar.events).toEqual([]);
    });

    test('should update events array', () => {
      EventManager.getAllEvents.mockReturnValue([mockEvent1]);
      calendar = new Calendar('calendar-container');
      expect(calendar.events).toHaveLength(1);
      
      EventManager.getAllEvents.mockReturnValue([mockEvent1, mockEvent2, mockEvent3]);
      calendar.loadEvents();
      expect(calendar.events).toHaveLength(3);
    });
  });

  describe('render', () => {
    beforeEach(() => {
      calendar = new Calendar('calendar-container');
    });

    test('should render calendar header', () => {
      expect(container.querySelector('.calendar-header')).toBeTruthy();
    });

    test('should render month navigation buttons', () => {
      const prevButton = document.getElementById('prev-month');
      const nextButton = document.getElementById('next-month');
      expect(prevButton).toBeTruthy();
      expect(nextButton).toBeTruthy();
    });

    test('should render calendar title with month and year', () => {
      const title = container.querySelector('.calendar-title');
      expect(title).toBeTruthy();
      expect(title.textContent).toContain(calendar.currentDate.getFullYear().toString());
    });

    test('should render weekday headers', () => {
      const weekdays = container.querySelectorAll('.weekday');
      expect(weekdays).toHaveLength(7);
    });

    test('should render calendar days container', () => {
      const daysContainer = container.querySelector('.calendar-days');
      expect(daysContainer).toBeTruthy();
    });

    test('should call renderDays', () => {
      const renderDaysSpy = jest.spyOn(calendar, 'renderDays');
      calendar.render();
      expect(renderDaysSpy).toHaveBeenCalled();
      renderDaysSpy.mockRestore();
    });

    test('should use dateUtils functions', () => {
      calendar.render();
      expect(dateUtils.getMonthDays).toHaveBeenCalled();
      expect(dateUtils.getFirstDayOfMonth).toHaveBeenCalled();
    });
  });

  describe('renderDays', () => {
    beforeEach(() => {
      calendar = new Calendar('calendar-container');
    });

    test('should return HTML string', () => {
      const monthDays = [new Date(2024, 11, 1), new Date(2024, 11, 2)];
      const html = calendar.renderDays(monthDays, 0);
      expect(typeof html).toBe('string');
    });

    test('should render empty days before first day of month', () => {
      const monthDays = [new Date(2024, 11, 1)];
      const firstDayOfWeek = 3; // Wednesday
      const html = calendar.renderDays(monthDays, firstDayOfWeek);
      const emptyCount = (html.match(/empty/g) || []).length;
      expect(emptyCount).toBe(firstDayOfWeek);
    });

    test('should render day numbers', () => {
      const monthDays = [new Date(2024, 11, 1), new Date(2024, 11, 2)];
      const html = calendar.renderDays(monthDays, 0);
      expect(html).toContain('class="day-number"');
    });

    test('should mark today with special class', () => {
      const today = new Date();
      calendar.currentDate = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthDays = dateUtils.getMonthDays(calendar.currentDate);
      const html = calendar.renderDays(monthDays, 0);
      expect(html).toContain('today');
    });

    test('should render events for days', () => {
      const eventDate = new Date(mockEvent1.date);
      calendar.currentDate = new Date(eventDate.getFullYear(), eventDate.getMonth(), 1);
      const monthDays = dateUtils.getMonthDays(calendar.currentDate);
      calendar.events = [mockEvent1];
      
      const html = calendar.renderDays(monthDays, 0);
      expect(html).toContain('event-indicator');
    });

    test('should include event data attributes', () => {
      const eventDate = new Date(mockEvent1.date);
      calendar.currentDate = new Date(eventDate.getFullYear(), eventDate.getMonth(), 1);
      const monthDays = dateUtils.getMonthDays(calendar.currentDate);
      calendar.events = [mockEvent1];
      
      const html = calendar.renderDays(monthDays, 0);
      expect(html).toContain('data-event-id');
    });

    test('should handle multiple events on same day', () => {
      const date = new Date('2024-12-15T10:00:00');
      const event1 = { ...mockEvent1, date, id: 'event1' };
      const event2 = { ...mockEvent2, date, id: 'event2' };
      
      calendar.events = [event1, event2];
      calendar.currentDate = new Date(2024, 11, 1);
      const monthDays = dateUtils.getMonthDays(calendar.currentDate);
      
      const html = calendar.renderDays(monthDays, 0);
      const eventMatches = html.match(/event-indicator/g) || [];
      expect(eventMatches.length).toBeGreaterThan(1);
    });
  });

  describe('getEventsForDay', () => {
    beforeEach(() => {
      calendar = new Calendar('calendar-container');
    });

    test('should return events for specific day', () => {
      const eventDate = new Date(mockEvent1.date);
      calendar.events = [mockEvent1, mockEvent2];
      
      const events = calendar.getEventsForDay(eventDate);
      expect(events).toContainEqual(mockEvent1);
    });

    test('should return empty array if no events for day', () => {
      calendar.events = [mockEvent1];
      const differentDate = new Date('2025-01-01');
      
      const events = calendar.getEventsForDay(differentDate);
      expect(events).toEqual([]);
    });

    test('should match events by date, month, and year', () => {
      const date1 = new Date('2024-12-15T10:00:00');
      const date2 = new Date('2024-12-15T14:00:00');
      const event1 = { ...mockEvent1, date: date1 };
      const event2 = { ...mockEvent2, date: date2 };
      
      calendar.events = [event1, event2];
      const events = calendar.getEventsForDay(new Date('2024-12-15'));
      
      expect(events).toHaveLength(2);
    });

    test('should not match events from different months', () => {
      const date1 = new Date('2024-12-15');
      const date2 = new Date('2024-11-15');
      
      calendar.events = [{ ...mockEvent1, date: date1 }];
      const events = calendar.getEventsForDay(date2);
      
      expect(events).toEqual([]);
    });

    test('should handle events with time component', () => {
      const date = new Date('2024-12-15T23:59:59');
      calendar.events = [{ ...mockEvent1, date }];
      
      const events = calendar.getEventsForDay(new Date('2024-12-15T00:00:00'));
      expect(events).toHaveLength(1);
    });
  });

  describe('isToday', () => {
    beforeEach(() => {
      calendar = new Calendar('calendar-container');
    });

    test('should return true for today', () => {
      const today = new Date();
      expect(calendar.isToday(today)).toBe(true);
    });

    test('should return false for different date', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(calendar.isToday(yesterday)).toBe(false);
    });

    test('should return false for different month', () => {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      expect(calendar.isToday(lastMonth)).toBe(false);
    });

    test('should return false for different year', () => {
      const lastYear = new Date();
      lastYear.setFullYear(lastYear.getFullYear() - 1);
      expect(calendar.isToday(lastYear)).toBe(false);
    });

    test('should ignore time component', () => {
      const today = new Date();
      const todayDifferentTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
      expect(calendar.isToday(todayDifferentTime)).toBe(true);
    });
  });

  describe('attachEventListeners', () => {
    beforeEach(() => {
      calendar = new Calendar('calendar-container');
    });

    test('should attach click listener to previous button', () => {
      const prevButton = document.getElementById('prev-month');
      const clickEvent = new Event('click');
      const previousMonthSpy = jest.spyOn(calendar, 'previousMonth');
      
      prevButton.dispatchEvent(clickEvent);
      expect(previousMonthSpy).toHaveBeenCalled();
      previousMonthSpy.mockRestore();
    });

    test('should attach click listener to next button', () => {
      const nextButton = document.getElementById('next-month');
      const clickEvent = new Event('click');
      const nextMonthSpy = jest.spyOn(calendar, 'nextMonth');
      
      nextButton.dispatchEvent(clickEvent);
      expect(nextMonthSpy).toHaveBeenCalled();
      nextMonthSpy.mockRestore();
    });

    test('should listen for event:created', () => {
      expect(window.addEventListener).toHaveBeenCalledWith(
        'event:created',
        expect.any(Function)
      );
    });

    test('should listen for event:updated', () => {
      expect(window.addEventListener).toHaveBeenCalledWith(
        'event:updated',
        expect.any(Function)
      );
    });

    test('should listen for event:deleted', () => {
      expect(window.addEventListener).toHaveBeenCalledWith(
        'event:deleted',
        expect.any(Function)
      );
    });

    test('should handle day clicks', () => {
      const dayElement = container.querySelector('.calendar-day:not(.empty)');
      if (dayElement) {
        const onDayClickSpy = jest.spyOn(calendar, 'onDayClick');
        dayElement.click();
        expect(onDayClickSpy).toHaveBeenCalled();
        onDayClickSpy.mockRestore();
      }
    });
  });

  describe('previousMonth', () => {
    beforeEach(() => {
      calendar = new Calendar('calendar-container');
      calendar.currentDate = new Date(2024, 11, 15); // December 2024
    });

    test('should navigate to previous month', () => {
      calendar.previousMonth();
      expect(calendar.currentDate.getMonth()).toBe(10); // November
    });

    test('should handle year boundary', () => {
      calendar.currentDate = new Date(2024, 0, 15); // January 2024
      calendar.previousMonth();
      expect(calendar.currentDate.getMonth()).toBe(11); // December
      expect(calendar.currentDate.getFullYear()).toBe(2023);
    });

    test('should call refresh', () => {
      const refreshSpy = jest.spyOn(calendar, 'refresh');
      calendar.previousMonth();
      expect(refreshSpy).toHaveBeenCalled();
      refreshSpy.mockRestore();
    });
  });

  describe('nextMonth', () => {
    beforeEach(() => {
      calendar = new Calendar('calendar-container');
      calendar.currentDate = new Date(2024, 10, 15); // November 2024
    });

    test('should navigate to next month', () => {
      calendar.nextMonth();
      expect(calendar.currentDate.getMonth()).toBe(11); // December
    });

    test('should handle year boundary', () => {
      calendar.currentDate = new Date(2024, 11, 15); // December 2024
      calendar.nextMonth();
      expect(calendar.currentDate.getMonth()).toBe(0); // January
      expect(calendar.currentDate.getFullYear()).toBe(2025);
    });

    test('should call refresh', () => {
      const refreshSpy = jest.spyOn(calendar, 'refresh');
      calendar.nextMonth();
      expect(refreshSpy).toHaveBeenCalled();
      refreshSpy.mockRestore();
    });
  });

  describe('refresh', () => {
    beforeEach(() => {
      calendar = new Calendar('calendar-container');
    });

    test('should reload events', () => {
      EventManager.getAllEvents.mockClear();
      calendar.refresh();
      expect(EventManager.getAllEvents).toHaveBeenCalled();
    });

    test('should re-render calendar', () => {
      const initialHTML = container.innerHTML;
      calendar.currentDate = new Date(2024, 10, 1);
      calendar.refresh();
      expect(container.innerHTML).not.toBe(initialHTML);
    });

    test('should reattach event listeners', () => {
      const attachSpy = jest.spyOn(calendar, 'attachEventListeners');
      calendar.refresh();
      expect(attachSpy).toHaveBeenCalled();
      attachSpy.mockRestore();
    });
  });

  describe('onDayClick', () => {
    beforeEach(() => {
      calendar = new Calendar('calendar-container');
      dispatchEventSpy.mockClear();
    });

    test('should dispatch calendar:dayClick event', () => {
      const date = new Date('2024-12-15');
      calendar.onDayClick(date);
      
      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'calendar:dayClick',
          detail: expect.objectContaining({ date })
        })
      );
    });

    test('should include date in event detail', () => {
      const date = new Date('2024-12-20T10:00:00');
      calendar.onDayClick(date);
      
      const eventCall = dispatchEventSpy.mock.calls[0][0];
      expect(eventCall.detail.date).toBe(date);
    });
  });

  describe('onEventClick', () => {
    beforeEach(() => {
      calendar = new Calendar('calendar-container');
      dispatchEventSpy.mockClear();
    });

    test('should dispatch calendar:eventClick event', () => {
      const eventId = 'test-event-id';
      calendar.onEventClick(eventId);
      
      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'calendar:eventClick',
          detail: expect.objectContaining({ eventId })
        })
      );
    });

    test('should include eventId in event detail', () => {
      const eventId = 'event-123';
      calendar.onEventClick(eventId);
      
      const eventCall = dispatchEventSpy.mock.calls[0][0];
      expect(eventCall.detail.eventId).toBe(eventId);
    });
  });

  describe('integration scenarios', () => {
    test('should update calendar when event is created', () => {
      calendar = new Calendar('calendar-container');
      const refreshSpy = jest.spyOn(calendar, 'refresh');
      
      const createEvent = new CustomEvent('event:created', { detail: mockEvent1 });
      window.dispatchEvent(createEvent);
      
      expect(refreshSpy).toHaveBeenCalled();
      refreshSpy.mockRestore();
    });

    test('should update calendar when event is updated', () => {
      calendar = new Calendar('calendar-container');
      const refreshSpy = jest.spyOn(calendar, 'refresh');
      
      const updateEvent = new CustomEvent('event:updated', { detail: mockEvent1 });
      window.dispatchEvent(updateEvent);
      
      expect(refreshSpy).toHaveBeenCalled();
      refreshSpy.mockRestore();
    });

    test('should update calendar when event is deleted', () => {
      calendar = new Calendar('calendar-container');
      const refreshSpy = jest.spyOn(calendar, 'refresh');
      
      const deleteEvent = new CustomEvent('event:deleted', { detail: mockEvent1 });
      window.dispatchEvent(deleteEvent);
      
      expect(refreshSpy).toHaveBeenCalled();
      refreshSpy.mockRestore();
    });

    test('should navigate through months correctly', () => {
      calendar = new Calendar('calendar-container');
      const initialMonth = calendar.currentDate.getMonth();
      
      calendar.nextMonth();
      expect(calendar.currentDate.getMonth()).toBe((initialMonth + 1) % 12);
      
      calendar.previousMonth();
      expect(calendar.currentDate.getMonth()).toBe(initialMonth);
    });

    test('should render events after loading', () => {
      const eventDate = new Date('2024-12-15');
      const testEvent = { ...mockEvent1, date: eventDate };
      EventManager.getAllEvents.mockReturnValue([testEvent]);
      
      calendar = new Calendar('calendar-container');
      calendar.currentDate = new Date(2024, 11, 1);
      calendar.refresh();
      
      const eventIndicators = container.querySelectorAll('.event-indicator');
      expect(eventIndicators.length).toBeGreaterThan(0);
    });
  });
});