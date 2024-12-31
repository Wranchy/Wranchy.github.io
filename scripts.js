// For reference on Drag and Drop API: 
// https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API

/****************
 * Configuration
 ****************/
// Define the categories you want
const categories = [
  { name: 'Physical appearance and character', dataCategory: 'appearance' },
  { name: 'Past life', dataCategory: 'past' },
  { name: 'Current life', dataCategory: 'current' },
];

// Define the words you want to place
const words = [
  { label: 'quite short',    category: 'appearance' },
  { label: 'seems to be very happy',   category: 'current' },
  { label: 'dark green eyes',    category: 'appearance' },
  { label: 'quite pretty', category: 'appearance' },
  { label: 'lives in the countryside in a particularly beautiful house',     category: 'current' },
  { label: 'extremely ambitious',    category: 'appearance' },
  { label: 'works mainly with farm animals',    category: 'current' },
  { label: 'trained to be a vet',   category: 'past' },
  { label: 'went to Edinburgh University',    category: 'past' },
  { label: 'travelled around Australia and New Zealand',    category: 'past' },
  { label: 'vern intellegent',   category: 'appearance' },
  { label: 'really friendly',    category: 'appearance' },
];

/***************
 * DOM Elements
 ***************/
const columnsContainer = document.getElementById('columns-container');
const wordsContainer   = document.getElementById('words-container');
const submitBtn        = document.getElementById('submit-btn');
const resultsDiv       = document.getElementById('results');

/********************************
 * Build Columns and Words in DOM
 ********************************/
// Build columns dynamically
categories.forEach(cat => {
  const colDiv = document.createElement('div');
  colDiv.classList.add('drop-column');
  colDiv.setAttribute('data-category', cat.dataCategory);

  const title = document.createElement('h2');
  title.textContent = cat.name;

  colDiv.appendChild(title);
  columnsContainer.appendChild(colDiv);
});

// Build words dynamically
words.forEach(word => {
  const wordDiv = document.createElement('div');
  wordDiv.classList.add('draggable-word');
  wordDiv.setAttribute('draggable', 'true');
  wordDiv.setAttribute('data-category', word.category);
  wordDiv.textContent = word.label;

  // Small error icon (top-right corner, hidden initially)
  const errorIcon = document.createElement('span');
  errorIcon.classList.add('error-icon');
  errorIcon.textContent = '✘';

  wordDiv.appendChild(errorIcon);
  wordsContainer.appendChild(wordDiv);
});

/***********************
 * Drag and Drop Events
 ***********************/
let draggedItem = null;

const draggableWords = document.querySelectorAll('.draggable-word');
const dropColumns    = document.querySelectorAll('.drop-column');

draggableWords.forEach(word => {
  word.addEventListener('dragstart', handleDragStart);
  word.addEventListener('dragend',   handleDragEnd);
});

dropColumns.forEach(column => {
  column.addEventListener('dragover',   handleDragOver);
  column.addEventListener('dragenter',  handleDragEnter);
  column.addEventListener('dragleave',  handleDragLeave);
  column.addEventListener('drop',       handleDrop);
});

function handleDragStart(e) {
  draggedItem = e.target;
  draggedItem.classList.add('dragging');
}

function handleDragEnd(e) {
  draggedItem.classList.remove('dragging');
  draggedItem = null;
}

function handleDragOver(e) {
  // Required to allow dropping
  e.preventDefault();
}

function handleDragEnter(e) {
  e.preventDefault();
}

function handleDragLeave(e) {
  // Optional for styling
}

function handleDrop(e) {
  e.preventDefault();

  // Ensure drop target is a column, not another word
  const dropTarget = e.target.closest('.drop-column');
  if (dropTarget) {
    dropTarget.appendChild(draggedItem);
  }
}

/*******************
 * Submit & Scoring
 *******************/
submitBtn.addEventListener('click', () => {
  let correctCount = 0;
  const totalWords = draggableWords.length;

  // Clear previous results
  resultsDiv.textContent = '';

  // Check each column
  dropColumns.forEach(column => {
    // Get the correct category from data-category
    const correctCategory = column.getAttribute('data-category');
    // Get all words dropped in this column
    const droppedWords = column.querySelectorAll('.draggable-word');

    droppedWords.forEach(word => {
      const errorIcon = word.querySelector('.error-icon');
      
      if (word.getAttribute('data-category') === correctCategory) {
        correctCount++;
        // Show correct border, hide error icon
        word.style.borderColor = 'green';
        errorIcon.style.display = 'none';
      } else {
        // Show incorrect border, display error icon
        word.style.borderColor = 'red';
        errorIcon.style.display = 'inline';
      }
    });
  });

  resultsDiv.textContent = `You got ${correctCount} out of ${totalWords} correct!`;
});
