// Quotes array
const quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do or do not. There is no try.", category: "Wisdom" }
];

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const formContainer = document.getElementById("formContainer");

// Show random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.innerHTML = "";

  const quoteText = document.createElement("p");
  quoteText.textContent = `"${quote.text}"`;

  const quoteCategory = document.createElement("small");
  quoteCategory.textContent = `Category: ${quote.category}`;

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

// Create Add Quote Form dynamically
function createAddQuoteForm() {
  const inputText = document.createElement("input");
  inputText.type = "text";
  inputText.placeholder = "Enter a new quote";
  inputText.id = "newQuoteText";

  const inputCategory = document.createElement("input");
  inputCategory.type = "text";
  inputCategory.placeholder = "Enter quote category";
  inputCategory.id = "newQuoteCategory";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";

  addButton.addEventListener("click", function () {
    const quoteText = inputText.value.trim();
    const quoteCategory = inputCategory.value.trim();

    if (quoteText === "" || quoteCategory === "") {
      alert("Please fill in both fields.");
      return;
    }

    quotes.push({
      text: quoteText,
      category: quoteCategory
    });

    inputText.value = "";
    inputCategory.value = "";

    showRandomQuote();
  });

  formContainer.appendChild(inputText);
  formContainer.appendChild(inputCategory);
  formContainer.appendChild(addButton);
}

// Event listener
newQuoteBtn.addEventListener("click", showRandomQuote);

// Initialize
createAddQuoteForm();
showRandomQuote();
