/**
 * Unit tests for EventManager
 */

import EventManager from '../../src/services/EventManager.js';
import StorageManager from '../../src/services/StorageManager.js';
import { mockEvent1, mockEvent2, mockEvent3, createMockEvent } from '../fixtures/events.js';

// Mock StorageManager
jest.mock('../../src/services/StorageManager.js');

describe('EventManager', () => {
  let dispatchEventSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    StorageManager.save.mockReturnValue(true);
    StorageManager.load.mockReturnValue([]);
    
    // Spy on window.dispatchEvent
    dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');
  });

  afterEach(() => {
    dispatchEventSpy.mockRestore();
  });

  describe('generateId', () => {
    test('should generate unique IDs', () => {
      const id1 = EventManager.generateId();
      const id2 = EventManager.generateId();
      expect(id1).not.toBe(id2);
    });

    test('should generate string IDs', () => {
      const id = EventManager.generateId();
      expect(typeof id).toBe('string');
    });

    test('should generate non-empty IDs', () => {
      const id = EventManager.generateId();
      expect(id.length).toBeGreaterThan(0);
    });

    test('should generate consistent format IDs', () => {
      const id = EventManager.generateId();
      expect(id).toMatch(/^[a-z0-9]+$/);
    });

    test('should generate multiple unique IDs in sequence', () => {
      const ids = new Set();
      for (let i = 0; i < 100; i++) {
        ids.add(EventManager.generateId());
      }
      expect(ids.size).toBe(100);
    });
  });

  describe('validateEvent', () => {
    test('should validate correct event data', () => {
      const eventData = {
        title: 'Test Event',
        date: new Date()
      };
      expect(() => EventManager.validateEvent(eventData)).not.toThrow();
    });

    test('should throw error if title is missing', () => {
      const eventData = {
        date: new Date()
      };
      expect(() => EventManager.validateEvent(eventData)).toThrow('ValidationError');
      expect(() => EventManager.validateEvent(eventData)).toThrow('título es requerido');
    });

    test('should throw error if title is empty string', () => {
      const eventData = {
        title: '',
        date: new Date()
      };
      expect(() => EventManager.validateEvent(eventData)).toThrow('ValidationError');
    });

    test('should throw error if title is only whitespace', () => {
      const eventData = {
        title: '   ',
        date: new Date()
      };
      expect(() => EventManager.validateEvent(eventData)).toThrow('ValidationError');
    });

    test('should throw error if date is missing', () => {
      const eventData = {
        title: 'Test Event'
      };
      expect(() => EventManager.validateEvent(eventData)).toThrow('ValidationError');
      expect(() => EventManager.validateEvent(eventData)).toThrow('fecha');
    });

    test('should throw error if date is not a Date object', () => {
      const eventData = {
        title: 'Test Event',
        date: '2024-12-15'
      };
      expect(() => EventManager.validateEvent(eventData)).toThrow('ValidationError');
    });

    test('should throw error if date is invalid Date', () => {
      const eventData = {
        title: 'Test Event',
        date: new Date('invalid')
      };
      expect(() => EventManager.validateEvent(eventData)).toThrow('ValidationError');
    });

    test('should accept valid title with date', () => {
      const eventData = {
        title: 'Valid Event Title',
        date: new Date('2024-12-15T10:00:00')
      };
      expect(() => EventManager.validateEvent(eventData)).not.toThrow();
    });

    test('should accept title with special characters', () => {
      const eventData = {
        title: 'Event: Meeting @ 10:00 - Discuss #project',
        date: new Date()
      };
      expect(() => EventManager.validateEvent(eventData)).not.toThrow();
    });

    test('should accept title with unicode characters', () => {
      const eventData = {
        title: 'Reunión café con José',
        date: new Date()
      };
      expect(() => EventManager.validateEvent(eventData)).not.toThrow();
    });
  });

  describe('createEvent', () => {
    test('should create event with required fields', () => {
      const eventData = {
        title: 'Test Event',
        date: new Date('2024-12-15T10:00:00')
      };

      const event = EventManager.createEvent(eventData);

      expect(event).toHaveProperty('id');
      expect(event.title).toBe('Test Event');
      expect(event.date).toEqual(eventData.date);
      expect(event).toHaveProperty('createdAt');
      expect(event).toHaveProperty('updatedAt');
    });

    test('should create event with all fields', () => {
      const eventData = {
        title: 'Complete Event',
        date: new Date('2024-12-15T10:00:00'),
        description: 'Event description',
        category: 'Trabajo',
        reminder: {
          enabled: true,
          time: 30
        }
      };

      const event = EventManager.createEvent(eventData);

      expect(event.title).toBe('Complete Event');
      expect(event.description).toBe('Event description');
      expect(event.category).toBe('Trabajo');
      expect(event.reminder).toEqual(eventData.reminder);
    });

    test('should set default values for optional fields', () => {
      const eventData = {
        title: 'Minimal Event',
        date: new Date()
      };

      const event = EventManager.createEvent(eventData);

      expect(event.description).toBe('');
      expect(event.category).toBe('Personal');
      expect(event.reminder).toBeNull();
    });

    test('should save event to storage', () => {
      const eventData = {
        title: 'Test Event',
        date: new Date()
      };

      EventManager.createEvent(eventData);

      expect(StorageManager.save).toHaveBeenCalledWith(
        EventManager.STORAGE_KEY,
        expect.arrayContaining([
          expect.objectContaining({ title: 'Test Event' })
        ])
      );
    });

    test('should emit event:created event', () => {
      const eventData = {
        title: 'Test Event',
        date: new Date()
      };

      EventManager.createEvent(eventData);

      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'event:created',
          detail: expect.objectContaining({ title: 'Test Event' })
        })
      );
    });

    test('should throw error for invalid event data', () => {
      const eventData = {
        title: '',
        date: new Date()
      };

      expect(() => EventManager.createEvent(eventData)).toThrow('ValidationError');
    });

    test('should add event to existing events', () => {
      StorageManager.load.mockReturnValue([mockEvent1]);

      const eventData = {
        title: 'New Event',
        date: new Date()
      };

      EventManager.createEvent(eventData);

      expect(StorageManager.save).toHaveBeenCalledWith(
        EventManager.STORAGE_KEY,
        expect.arrayContaining([
          mockEvent1,
          expect.objectContaining({ title: 'New Event' })
        ])
      );
    });

    test('should set createdAt and updatedAt timestamps', () => {
      const beforeCreate = new Date();
      
      const eventData = {
        title: 'Test Event',
        date: new Date()
      };

      const event = EventManager.createEvent(eventData);
      const afterCreate = new Date();

      expect(event.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
      expect(event.createdAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
      expect(event.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
      expect(event.updatedAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
    });

    test('should handle category variations', () => {
      const categories = ['Personal', 'Trabajo', 'Estudio', 'Otros'];
      
      categories.forEach(category => {
        const event = EventManager.createEvent({
          title: `${category} Event`,
          date: new Date(),
          category
        });
        expect(event.category).toBe(category);
      });
    });
  });

  describe('getAllEvents', () => {
    test('should return empty array when no events exist', () => {
      StorageManager.load.mockReturnValue(null);
      const events = EventManager.getAllEvents();
      expect(events).toEqual([]);
    });

    test('should return all events from storage', () => {
      const mockEvents = [mockEvent1, mockEvent2, mockEvent3];
      StorageManager.load.mockReturnValue(mockEvents);

      const events = EventManager.getAllEvents();

      expect(events).toEqual(mockEvents);
      expect(StorageManager.load).toHaveBeenCalledWith(EventManager.STORAGE_KEY);
    });

    test('should return empty array if storage returns null', () => {
      StorageManager.load.mockReturnValue(null);
      const events = EventManager.getAllEvents();
      expect(events).toEqual([]);
    });

    test('should return empty array if storage returns undefined', () => {
      StorageManager.load.mockReturnValue(undefined);
      const events = EventManager.getAllEvents();
      expect(events).toEqual([]);
    });

    test('should call StorageManager.load with correct key', () => {
      EventManager.getAllEvents();
      expect(StorageManager.load).toHaveBeenCalledWith('calendario_events');
    });

    test('should handle single event', () => {
      StorageManager.load.mockReturnValue([mockEvent1]);
      const events = EventManager.getAllEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toEqual(mockEvent1);
    });

    test('should handle multiple events', () => {
      StorageManager.load.mockReturnValue([mockEvent1, mockEvent2, mockEvent3]);
      const events = EventManager.getAllEvents();
      expect(events).toHaveLength(3);
    });
  });

  describe('getEvent', () => {
    beforeEach(() => {
      StorageManager.load.mockReturnValue([mockEvent1, mockEvent2, mockEvent3]);
    });

    test('should return event by ID', () => {
      const event = EventManager.getEvent('test-event-1');
      expect(event).toEqual(mockEvent1);
    });

    test('should return null for non-existent ID', () => {
      const event = EventManager.getEvent('non-existent-id');
      expect(event).toBeNull();
    });

    test('should return null for undefined ID', () => {
      const event = EventManager.getEvent(undefined);
      expect(event).toBeNull();
    });

    test('should return null for null ID', () => {
      const event = EventManager.getEvent(null);
      expect(event).toBeNull();
    });

    test('should return correct event among multiple', () => {
      const event = EventManager.getEvent('test-event-2');
      expect(event).toEqual(mockEvent2);
      expect(event.id).toBe('test-event-2');
    });

    test('should return first match if duplicate IDs exist', () => {
      const duplicateEvent = { ...mockEvent1, id: 'test-event-1' };
      StorageManager.load.mockReturnValue([mockEvent1, duplicateEvent]);
      
      const event = EventManager.getEvent('test-event-1');
      expect(event).toEqual(mockEvent1);
    });

    test('should handle empty events array', () => {
      StorageManager.load.mockReturnValue([]);
      const event = EventManager.getEvent('test-event-1');
      expect(event).toBeNull();
    });
  });

  describe('updateEvent', () => {
    beforeEach(() => {
      StorageManager.load.mockReturnValue([mockEvent1, mockEvent2, mockEvent3]);
    });

    test('should update existing event', () => {
      const updates = {
        title: 'Updated Title',
        description: 'Updated description'
      };

      const updatedEvent = EventManager.updateEvent('test-event-1', updates);

      expect(updatedEvent.title).toBe('Updated Title');
      expect(updatedEvent.description).toBe('Updated description');
      expect(updatedEvent.id).toBe('test-event-1');
    });

    test('should throw error for non-existent event', () => {
      expect(() => {
        EventManager.updateEvent('non-existent-id', { title: 'New Title' });
      }).toThrow('NotFoundError');
    });

    test('should preserve unchanged fields', () => {
      const updates = { title: 'New Title' };
      const updatedEvent = EventManager.updateEvent('test-event-1', updates);

      expect(updatedEvent.date).toEqual(mockEvent1.date);
      expect(updatedEvent.category).toBe(mockEvent1.category);
    });

    test('should update updatedAt timestamp', () => {
      const beforeUpdate = new Date();
      const updates = { title: 'New Title' };
      const updatedEvent = EventManager.updateEvent('test-event-1', updates);
      const afterUpdate = new Date();

      expect(updatedEvent.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime());
      expect(updatedEvent.updatedAt.getTime()).toBeLessThanOrEqual(afterUpdate.getTime());
    });

    test('should not modify event ID', () => {
      const updates = { id: 'different-id', title: 'New Title' };
      const updatedEvent = EventManager.updateEvent('test-event-1', updates);
      expect(updatedEvent.id).toBe('test-event-1');
    });

    test('should validate updated event data', () => {
      const updates = { date: new Date('2024-12-20') };
      expect(() => {
        EventManager.updateEvent('test-event-1', updates);
      }).not.toThrow();
    });

    test('should throw error if updated date is invalid', () => {
      const updates = { date: 'invalid-date' };
      expect(() => {
        EventManager.updateEvent('test-event-1', updates);
      }).toThrow('ValidationError');
    });

    test('should save updated events to storage', () => {
      const updates = { title: 'Updated Title' };
      EventManager.updateEvent('test-event-1', updates);

      expect(StorageManager.save).toHaveBeenCalledWith(
        EventManager.STORAGE_KEY,
        expect.arrayContaining([
          expect.objectContaining({ id: 'test-event-1', title: 'Updated Title' })
        ])
      );
    });

    test('should emit event:updated event', () => {
      const updates = { title: 'Updated Title' };
      EventManager.updateEvent('test-event-1', updates);

      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'event:updated',
          detail: expect.objectContaining({ title: 'Updated Title' })
        })
      );
    });

    test('should update multiple fields at once', () => {
      const updates = {
        title: 'New Title',
        description: 'New Description',
        category: 'Estudio',
        reminder: { enabled: true, time: 60 }
      };

      const updatedEvent = EventManager.updateEvent('test-event-1', updates);

      expect(updatedEvent.title).toBe('New Title');
      expect(updatedEvent.description).toBe('New Description');
      expect(updatedEvent.category).toBe('Estudio');
      expect(updatedEvent.reminder).toEqual({ enabled: true, time: 60 });
    });

    test('should handle partial updates', () => {
      const originalDescription = mockEvent1.description;
      const updates = { title: 'Only Title Changed' };
      
      const updatedEvent = EventManager.updateEvent('test-event-1', updates);
      
      expect(updatedEvent.title).toBe('Only Title Changed');
      expect(updatedEvent.description).toBe(originalDescription);
    });
  });

  describe('deleteEvent', () => {
    beforeEach(() => {
      StorageManager.load.mockReturnValue([mockEvent1, mockEvent2, mockEvent3]);
    });

    test('should delete existing event', () => {
      const result = EventManager.deleteEvent('test-event-1');
      expect(result).toBe(true);
    });

    test('should throw error for non-existent event', () => {
      expect(() => {
        EventManager.deleteEvent('non-existent-id');
      }).toThrow('NotFoundError');
    });

    test('should remove event from storage', () => {
      EventManager.deleteEvent('test-event-2');

      expect(StorageManager.save).toHaveBeenCalledWith(
        EventManager.STORAGE_KEY,
        expect.not.arrayContaining([mockEvent2])
      );
    });

    test('should keep other events intact', () => {
      EventManager.deleteEvent('test-event-2');

      expect(StorageManager.save).toHaveBeenCalledWith(
        EventManager.STORAGE_KEY,
        expect.arrayContaining([mockEvent1, mockEvent3])
      );
    });

    test('should emit event:deleted event', () => {
      EventManager.deleteEvent('test-event-1');

      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'event:deleted',
          detail: mockEvent1
        })
      );
    });

    test('should handle deletion of last event', () => {
      StorageManager.load.mockReturnValue([mockEvent1]);
      
      const result = EventManager.deleteEvent('test-event-1');
      
      expect(result).toBe(true);
      expect(StorageManager.save).toHaveBeenCalledWith(
        EventManager.STORAGE_KEY,
        []
      );
    });

    test('should delete correct event by ID', () => {
      EventManager.deleteEvent('test-event-3');

      const savedEvents = StorageManager.save.mock.calls[0][1];
      expect(savedEvents).toHaveLength(2);
      expect(savedEvents.find(e => e.id === 'test-event-3')).toBeUndefined();
    });
  });

  describe('listEvents', () => {
    beforeEach(() => {
      StorageManager.load.mockReturnValue([mockEvent1, mockEvent2, mockEvent3]);
    });

    test('should return all events without filters', () => {
      const events = EventManager.listEvents();
      expect(events).toHaveLength(3);
    });

    test('should filter by startDate', () => {
      const filters = {
        startDate: new Date('2024-12-16')
      };

      const events = EventManager.listEvents(filters);
      
      expect(events).toHaveLength(2); // mockEvent2 and mockEvent3
      expect(events.some(e => e.id === 'test-event-1')).toBe(false);
    });

    test('should filter by endDate', () => {
      const filters = {
        endDate: new Date('2024-12-17')
      };

      const events = EventManager.listEvents(filters);
      
      expect(events).toHaveLength(1); // only mockEvent1
    });

    test('should filter by date range', () => {
      const filters = {
        startDate: new Date('2024-12-16'),
        endDate: new Date('2024-12-19')
      };

      const events = EventManager.listEvents(filters);
      
      expect(events).toHaveLength(1); // only mockEvent3
    });

    test('should filter by category', () => {
      const filters = {
        category: 'Personal'
      };

      const events = EventManager.listEvents(filters);
      
      expect(events).toHaveLength(1);
      expect(events[0].category).toBe('Personal');
    });

    test('should combine multiple filters', () => {
      const filters = {
        startDate: new Date('2024-12-16'),
        category: 'Estudio'
      };

      const events = EventManager.listEvents(filters);
      
      expect(events).toHaveLength(1);
      expect(events[0].id).toBe('test-event-3');
    });

    test('should return empty array if no events match', () => {
      const filters = {
        category: 'NonExistentCategory'
      };

      const events = EventManager.listEvents(filters);
      expect(events).toEqual([]);
    });

    test('should handle empty filters object', () => {
      const events = EventManager.listEvents({});
      expect(events).toHaveLength(3);
    });

    test('should not modify original events array', () => {
      const originalLength = mockEvent1.title.length;
      EventManager.listEvents({ category: 'Trabajo' });
      expect(mockEvent1.title.length).toBe(originalLength);
    });
  });

  describe('emitEvent', () => {
    test('should dispatch custom event', () => {
      const eventData = { id: 'test', title: 'Test' };
      EventManager.emitEvent('test:event', eventData);

      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'test:event',
          detail: eventData
        })
      );
    });

    test('should include event data in detail', () => {
      const data = { custom: 'data', value: 123 };
      EventManager.emitEvent('custom:event', data);

      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: data
        })
      );
    });

    test('should create CustomEvent instance', () => {
      EventManager.emitEvent('test:event', {});

      const calledWith = dispatchEventSpy.mock.calls[0][0];
      expect(calledWith instanceof CustomEvent).toBe(true);
    });
  });
});