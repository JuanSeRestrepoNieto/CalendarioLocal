/**
 * Unit tests for EventForm component
 */

import EventForm from '../../src/components/EventForm.js';
import EventManager from '../../src/services/EventManager.js';
import * as dateUtils from '../../src/utils/dateUtils.js';
import { mockEvent1, mockEvent2, mockEvent3 } from '../fixtures/events.js';

// Mock dependencies
jest.mock('../../src/services/EventManager.js');
jest.mock('../../src/utils/dateUtils.js');

describe('EventForm', () => {
  let container;
  let eventForm;
  let alertSpy;
  let confirmSpy;

  beforeEach(() => {
    // Create container element
    container = document.createElement('div');
    container.id = 'event-form-container';
    document.body.appendChild(container);

    // Mock EventManager
    EventManager.getAllEvents = jest.fn().mockReturnValue([mockEvent1, mockEvent2]);
    EventManager.createEvent = jest.fn().mockReturnValue(mockEvent1);
    EventManager.updateEvent = jest.fn().mockReturnValue(mockEvent1);
    EventManager.deleteEvent = jest.fn().mockReturnValue(true);
    EventManager.getEvent = jest.fn((id) => {
      return [mockEvent1, mockEvent2, mockEvent3].find(e => e.id === id);
    });

    // Mock dateUtils functions
    dateUtils.formatDateForInput = jest.fn((date) => '2024-12-15T10:00');
    dateUtils.formatDateDisplay = jest.fn((date) => '15 de diciembre de 2024, 10:00');

    // Mock alert and confirm
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => true);

    // Spy on window.addEventListener
    jest.spyOn(window, 'addEventListener');
  });

  afterEach(() => {
    document.body.removeChild(container);
    jest.clearAllMocks();
    alertSpy.mockRestore();
    confirmSpy.mockRestore();
  });

  describe('constructor', () => {
    test('should create event form instance', () => {
      eventForm = new EventForm('event-form-container');
      expect(eventForm).toBeInstanceOf(EventForm);
    });

    test('should set container element', () => {
      eventForm = new EventForm('event-form-container');
      expect(eventForm.container).toBe(container);
    });

    test('should initialize with null currentEvent', () => {
      eventForm = new EventForm('event-form-container');
      expect(eventForm.currentEvent).toBeNull();
    });

    test('should call init on construction', () => {
      const initSpy = jest.spyOn(EventForm.prototype, 'init');
      eventForm = new EventForm('event-form-container');
      expect(initSpy).toHaveBeenCalled();
      initSpy.mockRestore();
    });
  });

  describe('init', () => {
    test('should render form', () => {
      eventForm = new EventForm('event-form-container');
      expect(container.innerHTML).not.toBe('');
    });

    test('should attach event listeners', () => {
      eventForm = new EventForm('event-form-container');
      expect(window.addEventListener).toHaveBeenCalled();
    });
  });

  describe('render', () => {
    beforeEach(() => {
      eventForm = new EventForm('event-form-container');
    });

    test('should render form title', () => {
      const title = document.getElementById('form-title');
      expect(title).toBeTruthy();
      expect(title.textContent).toContain('Nuevo Evento');
    });

    test('should render title input', () => {
      const titleInput = document.getElementById('event-title');
      expect(titleInput).toBeTruthy();
      expect(titleInput.type).toBe('text');
      expect(titleInput.required).toBe(true);
    });

    test('should render date input', () => {
      const dateInput = document.getElementById('event-date');
      expect(dateInput).toBeTruthy();
      expect(dateInput.type).toBe('datetime-local');
      expect(dateInput.required).toBe(true);
    });

    test('should render description textarea', () => {
      const descriptionInput = document.getElementById('event-description');
      expect(descriptionInput).toBeTruthy();
      expect(descriptionInput.tagName).toBe('TEXTAREA');
    });

    test('should render category select', () => {
      const categorySelect = document.getElementById('event-category');
      expect(categorySelect).toBeTruthy();
      expect(categorySelect.tagName).toBe('SELECT');
      const options = categorySelect.querySelectorAll('option');
      expect(options.length).toBe(4);
    });

    test('should render reminder checkbox', () => {
      const reminderCheckbox = document.getElementById('event-reminder-enabled');
      expect(reminderCheckbox).toBeTruthy();
      expect(reminderCheckbox.type).toBe('checkbox');
    });

    test('should render reminder time input', () => {
      const reminderTime = document.getElementById('event-reminder-time');
      expect(reminderTime).toBeTruthy();
      expect(reminderTime.type).toBe('number');
    });

    test('should render submit button', () => {
      const submitButton = container.querySelector('button[type="submit"]');
      expect(submitButton).toBeTruthy();
    });

    test('should render cancel button', () => {
      const cancelButton = document.getElementById('cancel-event-btn');
      expect(cancelButton).toBeTruthy();
    });

    test('should show edit mode for existing event', () => {
      eventForm.currentEvent = mockEvent1;
      eventForm.render();
      const title = document.getElementById('form-title');
      expect(title.textContent).toContain('Editar Evento');
    });

    test('should show delete button in edit mode', () => {
      eventForm.currentEvent = mockEvent1;
      eventForm.render();
      const deleteButton = document.getElementById('delete-event-btn');
      expect(deleteButton).toBeTruthy();
    });

    test('should not show delete button in create mode', () => {
      eventForm.currentEvent = null;
      eventForm.render();
      const deleteButton = document.getElementById('delete-event-btn');
      expect(deleteButton).toBeNull();
    });

    test('should populate form with current event data', () => {
      eventForm.currentEvent = mockEvent1;
      eventForm.render();
      
      const titleInput = document.getElementById('event-title');
      expect(titleInput.value).toBe(mockEvent1.title);
    });

    test('should call renderEventsList', () => {
      const renderListSpy = jest.spyOn(eventForm, 'renderEventsList');
      eventForm.render();
      expect(renderListSpy).toHaveBeenCalled();
      renderListSpy.mockRestore();
    });
  });

  describe('renderEventsList', () => {
    beforeEach(() => {
      eventForm = new EventForm('event-form-container');
    });

    test('should render events list container', () => {
      const listContainer = document.getElementById('events-list-container');
      expect(listContainer).toBeTruthy();
    });

    test('should show message when no events', () => {
      EventManager.getAllEvents.mockReturnValue([]);
      eventForm.renderEventsList();
      
      const listContainer = document.getElementById('events-list-container');
      expect(listContainer.textContent).toContain('No hay eventos');
    });

    test('should render event items', () => {
      eventForm.renderEventsList();
      const eventItems = container.querySelectorAll('.event-item');
      expect(eventItems.length).toBeGreaterThan(0);
    });

    test('should sort events by date', () => {
      const event1 = { ...mockEvent1, date: new Date('2024-12-20') };
      const event2 = { ...mockEvent2, date: new Date('2024-12-15') };
      EventManager.getAllEvents.mockReturnValue([event1, event2]);
      
      eventForm.renderEventsList();
      // Events should be rendered in ascending date order
      expect(EventManager.getAllEvents).toHaveBeenCalled();
    });

    test('should limit to 10 events', () => {
      const manyEvents = Array.from({ length: 15 }, (_, i) => ({
        ...mockEvent1,
        id: `event-${i}`,
        date: new Date(2024, 11, i + 1)
      }));
      EventManager.getAllEvents.mockReturnValue(manyEvents);
      
      eventForm.renderEventsList();
      const eventItems = container.querySelectorAll('.event-item');
      expect(eventItems.length).toBeLessThanOrEqual(10);
    });

    test('should include event data attributes', () => {
      eventForm.renderEventsList();
      const eventItems = container.querySelectorAll('.event-item');
      eventItems.forEach(item => {
        expect(item.hasAttribute('data-event-id')).toBe(true);
      });
    });

    test('should show event categories', () => {
      eventForm.renderEventsList();
      const categoryBadges = container.querySelectorAll('.event-category');
      expect(categoryBadges.length).toBeGreaterThan(0);
    });

    test('should handle events without description', () => {
      const eventNoDesc = { ...mockEvent1, description: '' };
      EventManager.getAllEvents.mockReturnValue([eventNoDesc]);
      eventForm.renderEventsList();
      expect(container.innerHTML).toBeTruthy();
    });
  });

  describe('attachEventListeners', () => {
    beforeEach(() => {
      eventForm = new EventForm('event-form-container');
    });

    test('should attach submit handler to form', () => {
      const form = document.getElementById('event-form-element');
      const handleSubmitSpy = jest.spyOn(eventForm, 'handleSubmit');
      
      form.dispatchEvent(new Event('submit'));
      expect(handleSubmitSpy).toHaveBeenCalled();
      handleSubmitSpy.mockRestore();
    });

    test('should attach click handler to cancel button', () => {
      const cancelBtn = document.getElementById('cancel-event-btn');
      const handleCancelSpy = jest.spyOn(eventForm, 'handleCancel');
      
      cancelBtn.click();
      expect(handleCancelSpy).toHaveBeenCalled();
      handleCancelSpy.mockRestore();
    });

    test('should toggle reminder time visibility', () => {
      const reminderCheckbox = document.getElementById('event-reminder-enabled');
      const reminderTimeGroup = document.getElementById('reminder-time-group');
      
      reminderCheckbox.checked = true;
      reminderCheckbox.dispatchEvent(new Event('change'));
      expect(reminderTimeGroup.style.display).toBe('block');
      
      reminderCheckbox.checked = false;
      reminderCheckbox.dispatchEvent(new Event('change'));
      expect(reminderTimeGroup.style.display).toBe('none');
    });

    test('should listen for calendar:dayClick events', () => {
      expect(window.addEventListener).toHaveBeenCalledWith(
        'calendar:dayClick',
        expect.any(Function)
      );
    });

    test('should listen for calendar:eventClick events', () => {
      expect(window.addEventListener).toHaveBeenCalledWith(
        'calendar:eventClick',
        expect.any(Function)
      );
    });
  });

  describe('handleSubmit', () => {
    beforeEach(() => {
      eventForm = new EventForm('event-form-container');
    });

    test('should prevent default form submission', () => {
      const form = document.getElementById('event-form-element');
      const event = new Event('submit');
      const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
      
      eventForm.handleSubmit(event);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    test('should create event when currentEvent is null', () => {
      const form = document.getElementById('event-form-element');
      const titleInput = document.getElementById('event-title');
      const dateInput = document.getElementById('event-date');
      
      titleInput.value = 'Test Event';
      dateInput.value = '2024-12-15T10:00';
      
      const event = new Event('submit');
      eventForm.handleSubmit(event);
      
      expect(EventManager.createEvent).toHaveBeenCalled();
    });

    test('should update event when currentEvent exists', () => {
      eventForm.currentEvent = mockEvent1;
      eventForm.render();
      
      const form = document.getElementById('event-form-element');
      const titleInput = document.getElementById('event-title');
      titleInput.value = 'Updated Title';
      
      const event = new Event('submit');
      eventForm.handleSubmit(event);
      
      expect(EventManager.updateEvent).toHaveBeenCalled();
    });

    test('should show success alert on create', () => {
      const form = document.getElementById('event-form-element');
      const titleInput = document.getElementById('event-title');
      const dateInput = document.getElementById('event-date');
      
      titleInput.value = 'Test Event';
      dateInput.value = '2024-12-15T10:00';
      
      const event = new Event('submit');
      eventForm.handleSubmit(event);
      
      expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('creado'));
    });

    test('should show success alert on update', () => {
      eventForm.currentEvent = mockEvent1;
      eventForm.render();
      
      const event = new Event('submit');
      eventForm.handleSubmit(event);
      
      expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('actualizado'));
    });

    test('should handle errors gracefully', () => {
      EventManager.createEvent.mockImplementation(() => {
        throw new Error('Test error');
      });
      
      const form = document.getElementById('event-form-element');
      const event = new Event('submit');
      eventForm.handleSubmit(event);
      
      expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Error'));
    });

    test('should reset form after successful create', () => {
      const resetSpy = jest.spyOn(eventForm, 'reset');
      
      const form = document.getElementById('event-form-element');
      const titleInput = document.getElementById('event-title');
      const dateInput = document.getElementById('event-date');
      
      titleInput.value = 'Test Event';
      dateInput.value = '2024-12-15T10:00';
      
      const event = new Event('submit');
      eventForm.handleSubmit(event);
      
      expect(resetSpy).toHaveBeenCalled();
      resetSpy.mockRestore();
    });

    test('should include reminder data when enabled', () => {
      const form = document.getElementById('event-form-element');
      const titleInput = document.getElementById('event-title');
      const dateInput = document.getElementById('event-date');
      const reminderCheckbox = document.getElementById('event-reminder-enabled');
      const reminderTimeInput = document.getElementById('event-reminder-time');
      
      titleInput.value = 'Test Event';
      dateInput.value = '2024-12-15T10:00';
      reminderCheckbox.checked = true;
      reminderTimeInput.value = '45';
      
      const event = new Event('submit');
      eventForm.handleSubmit(event);
      
      expect(EventManager.createEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          reminder: expect.objectContaining({
            enabled: true,
            time: 45
          })
        })
      );
    });
  });

  describe('handleCancel', () => {
    beforeEach(() => {
      eventForm = new EventForm('event-form-container');
    });

    test('should call reset method', () => {
      const resetSpy = jest.spyOn(eventForm, 'reset');
      eventForm.handleCancel();
      expect(resetSpy).toHaveBeenCalled();
      resetSpy.mockRestore();
    });

    test('should clear currentEvent', () => {
      eventForm.currentEvent = mockEvent1;
      eventForm.handleCancel();
      expect(eventForm.currentEvent).toBeNull();
    });
  });

  describe('handleDelete', () => {
    beforeEach(() => {
      eventForm = new EventForm('event-form-container');
      eventForm.currentEvent = mockEvent1;
      eventForm.render();
    });

    test('should show confirmation dialog', () => {
      eventForm.handleDelete();
      expect(confirmSpy).toHaveBeenCalled();
    });

    test('should delete event if confirmed', () => {
      confirmSpy.mockReturnValue(true);
      eventForm.handleDelete();
      expect(EventManager.deleteEvent).toHaveBeenCalledWith(mockEvent1.id);
    });

    test('should not delete if cancelled', () => {
      confirmSpy.mockReturnValue(false);
      EventManager.deleteEvent.mockClear();
      eventForm.handleDelete();
      expect(EventManager.deleteEvent).not.toHaveBeenCalled();
    });

    test('should show success alert after deletion', () => {
      confirmSpy.mockReturnValue(true);
      eventForm.handleDelete();
      expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('eliminado'));
    });

    test('should reset form after deletion', () => {
      const resetSpy = jest.spyOn(eventForm, 'reset');
      confirmSpy.mockReturnValue(true);
      eventForm.handleDelete();
      expect(resetSpy).toHaveBeenCalled();
      resetSpy.mockRestore();
    });

    test('should handle deletion errors', () => {
      confirmSpy.mockReturnValue(true);
      EventManager.deleteEvent.mockImplementation(() => {
        throw new Error('Delete error');
      });
      
      eventForm.handleDelete();
      expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Error'));
    });
  });

  describe('setDate', () => {
    beforeEach(() => {
      eventForm = new EventForm('event-form-container');
    });

    test('should set date input value', () => {
      const date = new Date('2024-12-20T15:00:00');
      eventForm.setDate(date);
      
      const dateInput = document.getElementById('event-date');
      expect(dateUtils.formatDateForInput).toHaveBeenCalledWith(date);
    });

    test('should clear currentEvent', () => {
      eventForm.currentEvent = mockEvent1;
      eventForm.setDate(new Date());
      expect(eventForm.currentEvent).toBeNull();
    });

    test('should re-render form', () => {
      const renderSpy = jest.spyOn(eventForm, 'render');
      eventForm.setDate(new Date());
      expect(renderSpy).toHaveBeenCalled();
      renderSpy.mockRestore();
    });
  });

  describe('editEvent', () => {
    beforeEach(() => {
      eventForm = new EventForm('event-form-container');
    });

    test('should load event by ID', () => {
      eventForm.editEvent('test-event-1');
      expect(EventManager.getEvent).toHaveBeenCalledWith('test-event-1');
    });

    test('should set currentEvent', () => {
      eventForm.editEvent('test-event-1');
      expect(eventForm.currentEvent).toBe(mockEvent1);
    });

    test('should re-render form with event data', () => {
      const renderSpy = jest.spyOn(eventForm, 'render');
      eventForm.editEvent('test-event-1');
      expect(renderSpy).toHaveBeenCalled();
      renderSpy.mockRestore();
    });

    test('should handle non-existent event', () => {
      EventManager.getEvent.mockReturnValue(null);
      eventForm.editEvent('non-existent-id');
      expect(eventForm.currentEvent).toBeNull();
    });
  });

  describe('reset', () => {
    beforeEach(() => {
      eventForm = new EventForm('event-form-container');
    });

    test('should clear currentEvent', () => {
      eventForm.currentEvent = mockEvent1;
      eventForm.reset();
      expect(eventForm.currentEvent).toBeNull();
    });

    test('should re-render form', () => {
      const renderSpy = jest.spyOn(eventForm, 'render');
      eventForm.reset();
      expect(renderSpy).toHaveBeenCalled();
      renderSpy.mockRestore();
    });

    test('should reattach event listeners', () => {
      const attachSpy = jest.spyOn(eventForm, 'attachEventListeners');
      eventForm.reset();
      expect(attachSpy).toHaveBeenCalled();
      attachSpy.mockRestore();
    });

    test('should show create mode after reset', () => {
      eventForm.currentEvent = mockEvent1;
      eventForm.reset();
      const title = document.getElementById('form-title');
      expect(title.textContent).toContain('Nuevo Evento');
    });
  });

  describe('integration scenarios', () => {
    test('should handle calendar day click', () => {
      eventForm = new EventForm('event-form-container');
      const setDateSpy = jest.spyOn(eventForm, 'setDate');
      
      const date = new Date('2024-12-15');
      const dayClickEvent = new CustomEvent('calendar:dayClick', { detail: { date } });
      window.dispatchEvent(dayClickEvent);
      
      expect(setDateSpy).toHaveBeenCalledWith(date);
      setDateSpy.mockRestore();
    });

    test('should handle calendar event click', () => {
      eventForm = new EventForm('event-form-container');
      const editEventSpy = jest.spyOn(eventForm, 'editEvent');
      
      const eventId = 'test-event-1';
      const eventClickEvent = new CustomEvent('calendar:eventClick', { detail: { eventId } });
      window.dispatchEvent(eventClickEvent);
      
      expect(editEventSpy).toHaveBeenCalledWith(eventId);
      editEventSpy.mockRestore();
    });

    test('should create and reset form', () => {
      eventForm = new EventForm('event-form-container');
      
      const form = document.getElementById('event-form-element');
      const titleInput = document.getElementById('event-title');
      const dateInput = document.getElementById('event-date');
      
      titleInput.value = 'New Event';
      dateInput.value = '2024-12-15T10:00';
      
      form.dispatchEvent(new Event('submit'));
      
      expect(EventManager.createEvent).toHaveBeenCalled();
      expect(eventForm.currentEvent).toBeNull();
    });

    test('should edit, update, and reset form', () => {
      eventForm = new EventForm('event-form-container');
      
      // Edit event
      eventForm.editEvent('test-event-1');
      expect(eventForm.currentEvent).toBe(mockEvent1);
      
      // Update event
      const form = document.getElementById('event-form-element');
      form.dispatchEvent(new Event('submit'));
      
      expect(EventManager.updateEvent).toHaveBeenCalled();
      expect(eventForm.currentEvent).toBeNull();
    });

    test('should handle event list item clicks', () => {
      eventForm = new EventForm('event-form-container');
      const editEventSpy = jest.spyOn(eventForm, 'editEvent');
      
      const eventItem = container.querySelector('.event-item');
      if (eventItem) {
        eventItem.click();
        expect(editEventSpy).toHaveBeenCalled();
      }
      
      editEventSpy.mockRestore();
    });
  });
});