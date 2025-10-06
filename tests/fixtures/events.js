/**
 * Mock event data for testing
 */

export const mockEvent1 = {
  id: 'test-event-1',
  title: 'Team Meeting',
  date: new Date('2024-12-15T10:00:00'),
  description: 'Weekly team sync',
  category: 'Trabajo',
  reminder: {
    enabled: true,
    time: 30
  },
  createdAt: new Date('2024-12-01T08:00:00'),
  updatedAt: new Date('2024-12-01T08:00:00')
};

export const mockEvent2 = {
  id: 'test-event-2',
  title: 'Dentist Appointment',
  date: new Date('2024-12-20T14:30:00'),
  description: 'Regular checkup',
  category: 'Personal',
  reminder: null,
  createdAt: new Date('2024-12-02T09:00:00'),
  updatedAt: new Date('2024-12-02T09:00:00')
};

export const mockEvent3 = {
  id: 'test-event-3',
  title: 'Study Session',
  date: new Date('2024-12-18T16:00:00'),
  description: 'JavaScript advanced concepts',
  category: 'Estudio',
  reminder: {
    enabled: true,
    time: 60
  },
  createdAt: new Date('2024-12-03T10:00:00'),
  updatedAt: new Date('2024-12-03T10:00:00')
};

export const mockEvents = [mockEvent1, mockEvent2, mockEvent3];

export const createMockEvent = (overrides = {}) => ({
  id: 'mock-id-' + Date.now(),
  title: 'Mock Event',
  date: new Date(),
  description: '',
  category: 'Personal',
  reminder: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
});