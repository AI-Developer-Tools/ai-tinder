# Testing Guide

## Setup

1. **Install dependencies** (first time only):
```bash
npm install
```

## Running Tests

### Run all tests:
```bash
npm test
```

### Run tests in watch mode (auto-rerun on file changes):
```bash
npm test:watch
```

### Run tests with coverage report:
```bash
npm test:coverage
```

## Test Coverage

The test suite includes the following test cases for the reject button feature:

1. **Initial State Tests**
   - Verifies correct number of cards are present initially

2. **Click Behavior Tests**
   - Verifies the first card is selected when reject button is clicked
   - Checks that the `card--rejected` class is added to the card

3. **Button State Tests**
   - Ensures all buttons are disabled during the animation
   - Verifies buttons are re-enabled after animation completes

4. **Card Removal Tests**
   - Tests that cards are removed from DOM after animation
   - Verifies multiple consecutive rejects work correctly

5. **Edge Case Tests**
   - Handles clicking reject when no cards are left
   - Detects and logs when deck becomes empty
   - Ensures animation event listener is only called once (prevents memory leaks)

## Test Results

After running `npm test`, you should see output similar to:
```
PASS  ./app.test.js
  Reject Button Functionality
    ✓ should have 3 cards initially
    ✓ should get the first card when reject button is clicked
    ✓ should disable all buttons during animation
    ✓ should add card--rejected class to the top card
    ✓ should remove card from DOM after animation ends
    ✓ should re-enable buttons after animation ends
    ✓ should handle multiple consecutive rejects
    ✓ should handle clicking reject when no cards are left
    ✓ should log message when deck becomes empty after reject
    ✓ animationend listener should be called only once

Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total
```

## Continuous Integration

To run tests in CI/CD pipelines, use:
```bash
npm test -- --ci --coverage
```

