# Test Setup Guide

This guide provides instructions for setting up and running the test suite for CalendarioLocal.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

## Installation

1. Install dependencies:
```bash
npm install
```

This will install:
- Jest (v29.7.0) - Testing framework
- jest-environment-jsdom (v29.7.0) - DOM environment for tests

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Generate coverage report
```bash
npm run test:coverage
```

### Run specific test file
```bash
npm test -- dateUtils.test.js
```

### Run tests matching a pattern
```bash
npm test -- --testNamePattern="should create event"
```

## Test Structure