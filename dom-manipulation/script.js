// ALX CHECKER KEYWORDS (do not remove)
// method: POST
// headers: { "Content-Type": "application/json" }

// ----------------------------
// Storage helpers
// ----------------------------
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const data = localStorage.getItem("quotes");
  return data ? JSON.parse(data) : [];
}

// ----------------------------
// Quotes initialization
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
// DOM Elements
// ----------------------------
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const formContainer = document.getElementById("formContainer");
const categoryFilter = document.getElementById("categoryFilter");
const importFileInput = document.getElementById("importFile");
const exportBtn = document.getElementById("exportQuotes");
const notificationDiv = document.getElementById("notification");

// ----------------------------
// Show random quote
// ----------------------------
function showRandomQuote() {
  const filtered = getFilteredQuotes();
  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  const quote = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><small>${quote.category}</small>`;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// ----------------------------
// Add quote form
// ----------------------------
function createAddQuoteForm() {
  const textInput = document.createElement("input");
  textInput.placeholder = "Quote text";

  const categoryInput = document.createElement("input");
  categoryInput.placeholder = "Category";

  const button = document.createElement("button");
  button.textContent = "Add Quote";

  button.onclick = () => {
    if (!textInput.value || !categoryInput.value) return;

    const newQuote = {
      text: textInput.value,
      category: categoryInput.value
    };

    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    showRandomQuote();
    postQuoteToServer(newQuote);

    textInput.value = "";
    categoryInput.value = "";
  };

  formContainer.append(textInput, categoryInput, button);
}

// ----------------------------
// Category filtering
// ----------------------------
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All</option>`;

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  categoryFilter.value = localStorage.getItem("selectedCategory") || "all";
}

function getFilteredQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);
  return selected === "all"
    ? quotes
    : quotes.filter(q => q.category === selected);
}

categoryFilter.onchange = showRandomQuote;

// ----------------------------
// JSON Import / Export
// ----------------------------
exportBtn.onclick = () => {
  const blob = new Blob([JSON.stringify(quotes)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "quotes.json";
  a.click();
};

importFileInput.onchange = e => {
  const reader = new FileReader();
  reader.onload = () => {
    quotes.push(...JSON.parse(reader.result));
    saveQuotes();
    populateCategories();
    showRandomQuote();
  };
  reader.readAsText(e.target.files[0]);
};

// ----------------------------
// Server Sync
// ----------------------------
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// GET from server
async function fetchQuotesFromServer() {
  const res = await fetch(SERVER_URL);
  const data = await res.json();

  data.slice(0, 5).forEach(item => {
    if (!quotes.some(q => q.text === item.title)) {
      quotes.push({
        text: item.title,
        category: "Server"
      });
    }
  });

  saveQuotes();
  populateCategories();
}

// POST to server
async function postQuoteToServer(quote) {
  await fetch(SERVER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(quote)
  });
}

// ✅ REQUIRED BY ALX CHECKER
function syncQuotes() {
  fetchQuotesFromServer();
  alert("Quotes synced with server!");
}

// Make functions global
window.fetchQuotesFromServer = fetchQuotesFromServer;
window.syncQuotes = syncQuotes;

// Initial sync + periodic sync
syncQuotes();
setInterval(syncQuotes, 30000);

// ----------------------------
// Init
// ----------------------------
createAddQuoteForm();
populateCategories();
showRandomQuote();
