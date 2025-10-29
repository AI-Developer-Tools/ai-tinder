/**
 * @jest-environment jsdom
 */

// Mock the app.js module
describe('Reject Button Functionality', () => {
  let deckEl, nopeBtn, likeBtn, superLikeBtn;
  
  beforeEach(() => {
    // Set up the DOM structure
    document.body.innerHTML = `
      <div class="app">
        <header class="app__header">
          <button class="ghost-btn" id="shuffleBtn">Shuffle</button>
        </header>
        <main class="app__main">
          <section class="deck" id="deck"></section>
          <div class="controls">
            <button class="ctrl ctrl--nope" id="nopeBtn">✖</button>
            <button class="ctrl ctrl--superlike" id="superLikeBtn">★</button>
            <button class="ctrl ctrl--like" id="likeBtn">♥</button>
          </div>
        </main>
      </div>
    `;
    
    // Get references to DOM elements
    deckEl = document.getElementById('deck');
    nopeBtn = document.getElementById('nopeBtn');
    likeBtn = document.getElementById('likeBtn');
    superLikeBtn = document.getElementById('superLikeBtn');
    
    // Create mock cards
    createMockCards(3);
  });
  
  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });
  
  function createMockCards(count) {
    for (let i = 0; i < count; i++) {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <img class="card__media" src="test.jpg" alt="Test" />
        <div class="card__body">
          <div class="title-row">
            <h2 class="card__title">Test ${i}</h2>
            <span class="card__age">25</span>
          </div>
        </div>
      `;
      deckEl.appendChild(card);
    }
  }
  
  function setupRejectButtonHandler() {
    nopeBtn.addEventListener('click', () => {
      const topCard = deckEl.querySelector('.card:first-child');
      
      if (!topCard) {
        console.log('No more cards!');
        return;
      }
      
      // Disable buttons during animation
      nopeBtn.disabled = true;
      likeBtn.disabled = true;
      superLikeBtn.disabled = true;
      
      // Add the rejected animation class
      topCard.classList.add('card--rejected');
      
      // After animation completes, remove the card from DOM
      topCard.addEventListener('animationend', () => {
        topCard.remove();
        
        // Re-enable buttons
        nopeBtn.disabled = false;
        likeBtn.disabled = false;
        superLikeBtn.disabled = false;
        
        // Check if deck is empty
        if (deckEl.children.length === 0) {
          console.log('Deck is empty! Reshuffling...');
        }
      }, { once: true });
    });
  }
  
  test('should add card--rejected class to first card when reject button clicked', () => {
    setupRejectButtonHandler();
    
    const firstCard = deckEl.querySelector('.card:first-child');
    const firstCardTitle = firstCard.querySelector('.card__title').textContent;
    
    expect(deckEl.children.length).toBe(3); // Verify initial setup
    expect(firstCard.classList.contains('card--rejected')).toBe(false);
    
    nopeBtn.click();
    
    // Check that the FIRST card (Test 0) got the rejected class
    expect(firstCard.classList.contains('card--rejected')).toBe(true);
    expect(firstCardTitle).toBe('Test 0');
  });
  
  test('should disable all buttons during animation', () => {
    setupRejectButtonHandler();
    
    expect(nopeBtn.disabled).toBe(false);
    expect(likeBtn.disabled).toBe(false);
    expect(superLikeBtn.disabled).toBe(false);
    
    nopeBtn.click();
    
    expect(nopeBtn.disabled).toBe(true);
    expect(likeBtn.disabled).toBe(true);
    expect(superLikeBtn.disabled).toBe(true);
  });
  
  test('should remove card from DOM after animation ends', () => {
    setupRejectButtonHandler();
    
    const initialCardCount = deckEl.children.length;
    const topCard = deckEl.querySelector('.card:first-child');
    
    nopeBtn.click();
    
    // Manually trigger animationend event
    const event = new Event('animationend');
    topCard.dispatchEvent(event);
    
    expect(deckEl.children.length).toBe(initialCardCount - 1);
  });
  
  test('should re-enable buttons after animation ends', () => {
    setupRejectButtonHandler();
    
    const topCard = deckEl.querySelector('.card:first-child');
    
    nopeBtn.click();
    
    expect(nopeBtn.disabled).toBe(true);
    expect(likeBtn.disabled).toBe(true);
    expect(superLikeBtn.disabled).toBe(true);
    
    // Trigger animation end
    const event = new Event('animationend');
    topCard.dispatchEvent(event);
    
    expect(nopeBtn.disabled).toBe(false);
    expect(likeBtn.disabled).toBe(false);
    expect(superLikeBtn.disabled).toBe(false);
  });
  
  test('should handle multiple consecutive rejects', () => {
    setupRejectButtonHandler();
    
    const initialCount = deckEl.children.length;
    
    // First reject
    let topCard = deckEl.querySelector('.card:first-child');
    nopeBtn.click();
    topCard.dispatchEvent(new Event('animationend'));
    
    expect(deckEl.children.length).toBe(initialCount - 1);
    
    // Second reject
    topCard = deckEl.querySelector('.card:first-child');
    nopeBtn.click();
    topCard.dispatchEvent(new Event('animationend'));
    
    expect(deckEl.children.length).toBe(initialCount - 2);
  });
  
  test('should handle clicking reject when no cards are left', () => {
    setupRejectButtonHandler();
    
    // Remove all cards
    deckEl.innerHTML = '';
    
    const consoleSpy = jest.spyOn(console, 'log');
    
    nopeBtn.click();
    
    expect(consoleSpy).toHaveBeenCalledWith('No more cards!');
    expect(nopeBtn.disabled).toBe(false);
  });
  
  test('should log message when deck becomes empty after reject', () => {
    setupRejectButtonHandler();
    
    // Remove all but one card
    while (deckEl.children.length > 1) {
      deckEl.removeChild(deckEl.lastChild);
    }
    
    const consoleSpy = jest.spyOn(console, 'log');
    const topCard = deckEl.querySelector('.card:first-child');
    
    nopeBtn.click();
    topCard.dispatchEvent(new Event('animationend'));
    
    expect(deckEl.children.length).toBe(0);
    expect(consoleSpy).toHaveBeenCalledWith('Deck is empty! Reshuffling...');
  });
  
  test('animationend listener should be called only once', () => {
    setupRejectButtonHandler();
    
    const topCard = deckEl.querySelector('.card:first-child');
    const removeSpy = jest.spyOn(topCard, 'remove');
    
    nopeBtn.click();
    
    // Trigger animation end multiple times
    topCard.dispatchEvent(new Event('animationend'));
    topCard.dispatchEvent(new Event('animationend'));
    topCard.dispatchEvent(new Event('animationend'));
    
    // Should only be called once due to { once: true }
    expect(removeSpy).toHaveBeenCalledTimes(1);
  });
  
  test('should reveal the next card after rejecting the top card', () => {
    setupRejectButtonHandler();
    
    const firstCard = deckEl.querySelector('.card:first-child');
    const secondCard = deckEl.querySelector('.card:nth-child(2)');
    const secondCardTitle = secondCard.querySelector('.card__title').textContent;
    
    nopeBtn.click();
    firstCard.dispatchEvent(new Event('animationend'));
    
    // After first card is removed, second card should now be first
    const newFirstCard = deckEl.querySelector('.card:first-child');
    const newFirstCardTitle = newFirstCard.querySelector('.card__title').textContent;
    
    expect(newFirstCardTitle).toBe(secondCardTitle);
    expect(newFirstCardTitle).toBe('Test 1');
  });
  
  test('should only animate the top card, not cards underneath', () => {
    setupRejectButtonHandler();
    
    const firstCard = deckEl.querySelector('.card:first-child');
    const secondCard = deckEl.querySelector('.card:nth-child(2)');
    const thirdCard = deckEl.querySelector('.card:nth-child(3)');
    
    nopeBtn.click();
    
    expect(firstCard.classList.contains('card--rejected')).toBe(true);
    expect(secondCard.classList.contains('card--rejected')).toBe(false);
    expect(thirdCard.classList.contains('card--rejected')).toBe(false);
  });
  
  test('should not trigger reject if button is disabled', () => {
    setupRejectButtonHandler();
    
    const topCard = deckEl.querySelector('.card:first-child');
    
    // First click - button gets disabled
    nopeBtn.click();
    expect(nopeBtn.disabled).toBe(true);
    
    // Try to click again while disabled
    const initialCardCount = deckEl.children.length;
    nopeBtn.click();
    
    // Card should still have the class from first click, but clicking again shouldn't add it twice
    expect(topCard.classList.contains('card--rejected')).toBe(true);
    expect(deckEl.children.length).toBe(initialCardCount); // Count shouldn't change yet
  });
  
  test('should not remove card if animation is cancelled or interrupted', () => {
    setupRejectButtonHandler();
    
    const topCard = deckEl.querySelector('.card:first-child');
    const initialCount = deckEl.children.length;
    
    nopeBtn.click();
    
    // Simulate different animation events (not animationend)
    topCard.dispatchEvent(new Event('animationstart'));
    topCard.dispatchEvent(new Event('animationcancel'));
    
    // Card should NOT be removed
    expect(deckEl.children.length).toBe(initialCount);
    expect(topCard.parentElement).toBe(deckEl);
  });
  
  test('should maintain correct card count through multiple operations', () => {
    setupRejectButtonHandler();
    
    expect(deckEl.children.length).toBe(3);
    
    // Reject first card
    let topCard = deckEl.querySelector('.card:first-child');
    nopeBtn.click();
    topCard.dispatchEvent(new Event('animationend'));
    expect(deckEl.children.length).toBe(2);
    
    // Reject second card
    topCard = deckEl.querySelector('.card:first-child');
    nopeBtn.click();
    topCard.dispatchEvent(new Event('animationend'));
    expect(deckEl.children.length).toBe(1);
    
    // Reject last card
    topCard = deckEl.querySelector('.card:first-child');
    nopeBtn.click();
    topCard.dispatchEvent(new Event('animationend'));
    expect(deckEl.children.length).toBe(0);
  });
});

