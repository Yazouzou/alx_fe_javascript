// ----------------------------
// Helper functions for storage
// ----------------------------
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    return JSON.parse(storedQuotes);
  }
  return [];
}

// ----------------------------
// Quotes array initialization
// ----------------------------
let quotes = loadQuotes();

if (quotes.length === 0) {
  quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Do or do not. There is no try.", category: "Wisdom" }
  ];
  saveQuotes();
}

// ----------------------------
// DOM elements
// ----------------------------
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const formContainer = document.getElementById("formContainer");
const importFileInput = document.getElementById("importFile");
const exportBtn = document.getElementById("exportQuotes");

// ----------------------------
// Show random quote
// ----------------------------
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

  // Save last viewed quote to sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// ----------------------------
// Create Add Quote Form dynamically
// ----------------------------
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

    saveQuotes(); // Save to localStorage

    inputText.value = "";
    inputCategory.value = "";

    showRandomQuote();
  });

  formContainer.appendChild(inputText);
  formContainer.appendChild(inputCategory);
  formContainer.appendChild(addButton);
}

// ----------------------------
// JSON Export
// ----------------------------
exportBtn.addEventListener("click", function () {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
});

// ----------------------------
// JSON Import
// ----------------------------
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert("Quotes imported successfully!");
    showRandomQuote();
  };

  fileReader.readAsText(event.target.files[0]);
}

importFileInput.addEventListener("change", importFromJsonFile);

// ----------------------------
// Event listeners
// ----------------------------
newQuoteBtn.addEventListener("click", showRandomQuote);

// ----------------------------
// Initialize
// ----------------------------
createAddQuoteForm();

// Show last viewed quote from sessionStorage if exists
const lastQuote = sessionStorage.getItem("lastQuote");
if (lastQuote) {
  const quote = JSON.parse(lastQuote);
  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <small>Category: ${quote.category}</small>
  `;
} else {
  showRandomQuote();
}
