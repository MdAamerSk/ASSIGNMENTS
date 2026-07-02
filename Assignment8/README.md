# LedgerLite: Personal Finance Tracker with Expense Analytics | Assignment 8

A comprehensive educational project demonstrating **advanced CSS design systems**, **responsive layouts**, **form validation**, **chart.js integration**, and **dynamic data visualization** with a fully functional personal finance tracker application.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Design System Architecture](#design-system-architecture)
   - [Design Tokens](#design-tokens)
   - [Theme System](#theme-system)
   - [Color Palette](#color-palette)
   - [Typography & Spacing](#typography--spacing)
3. [UI/UX Components](#uiux-components)
   - [Card Components](#card-components)
   - [Form Elements](#form-elements)
   - [Data Visualization](#data-visualization)
4. [Feature Implementation](#feature-implementation)
   - [Transaction Management](#transaction-management)
   - [Analytics Dashboard](#analytics-dashboard)
   - [Theme Switching](#theme-switching)
5. [Technical Implementation](#technical-implementation)

---

## 🎯 Project Overview

**LedgerLite** is a comprehensive financial tracking application that teaches advanced web development concepts through interactive demonstrations:

- **Section A:** Dashboard summary cards displaying real-time financial metrics
- **Section B:** Advanced form system with validation and transaction entry
- **Section C:** Transaction history with filtering, searching, and inline editing capabilities
- **Section D:** Analytics visualization using Chart.js for expense breakdown
- **Section E:** Settings panel for data management and theme preferences

**Tech Stack:**
- HTML5 (semantic structure with ARIA labels for accessibility)
- CSS3 (design tokens, custom properties, Flexbox/Grid, glassmorphism effects)
- Vanilla JavaScript (ES5 compatible, form validation, dynamic rendering)
- Chart.js 4.x (interactive data visualization library)

---

## Live Deployment Link

https://mdaamersk.github.io/ASSIGNMENTS/Assignment8/

---

## 🎨 Design System Architecture

Understanding a professional design system is crucial for building scalable, maintainable web applications. LedgerLite demonstrates how to create cohesive visual design through systematic tokens and themes.

### **Design Tokens**

**What are Design Tokens?**
Design tokens are the atomic units of design—reusable values that define spacing, colors, typography, and timing across your entire application. Instead of hardcoding values like `padding: 16px`, we use `var(--space-md)`, making changes global and maintainable.

**In our project, we define tokens at the `:root` level:**

```css
:root {
  /* Typography */
  --font-display: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;

  /* Spacing Scale (rem-based) */
  --space-xs: 0.25rem;   /* 4px */
  --space-sm: 0.5rem;    /* 8px */
  --space-md: 1rem;      /* 16px */
  --space-lg: 1.5rem;    /* 24px */
  --space-xl: 2rem;      /* 32px */
  --space-xxl: 3rem;     /* 48px */

  /* Border Radius Scale */
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-full: 9999px;

  /* Timing Functions (for animations) */
  --transition-fast: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  /* Glass-morphism blur effect */
  --glass-blur: 16px;
}
```

**Benefits of Token-Based Design:**
- ✅ **Consistency** — All spacing uses the same scale
- ✅ **Maintainability** — Change one token, update everywhere
- ✅ **Scalability** — Easy to add new tokens without refactoring
- ✅ **Accessibility** — Ensures minimum contrast ratios and touch targets
- ✅ **Performance** — CSS variables computed once, reused many times

**Real-world usage in components:**

```css
/* Before (hardcoded values) */
.card {
  padding: 16px;
  margin: 12px;
  border-radius: 14px;
  gap: 8px;
}

/* After (token-based) */
.card {
  padding: var(--space-lg);
  margin: var(--space-sm);
  border-radius: var(--radius-md);
  gap: var(--space-sm);
}
```

---

### **Theme System**

**What is a Theme System?**
A theme system allows users to switch between visual themes (light/dark) without rewriting CSS. Instead of creating separate stylesheets, we use CSS custom properties to define theme-specific values.

**In LedgerLite, we implement themes using `data-theme` attribute:**

```html
<!-- Dark Mode (default) -->
<html lang="en" data-theme="dark">

<!-- Light Mode -->
<html lang="en" data-theme="light">
```

**Dark Mode Theme Definition:**

```css
html[data-theme="dark"] {
  /* Background Colors */
  --bg-app: hsl(224, 25%, 8%);              /* Main background */
  --bg-surface: hsla(224, 25%, 12%, 0.65);  /* Surface with transparency */
  --bg-surface-solid: hsl(224, 25%, 12%);   /* Solid surface */

  /* Border Colors */
  --border-color: hsla(224, 25%, 22%, 0.4);      /* Subtle borders */
  --border-color-hover: hsla(224, 25%, 35%, 0.6);/* Emphasized borders on hover */

  /* Text Colors */
  --text-main: hsl(210, 40%, 98%);    /* Primary text (white-ish) */
  --text-muted: hsl(215, 20%, 65%);   /* Secondary text (gray) */
  --text-inverse: hsl(224, 25%, 12%); /* Text on dark backgrounds */

  /* Semantic Colors */
  --color-primary: hsl(258, 85%, 66%);           /* Purple accent */
  --color-primary-hover: hsl(258, 85%, 72%);
  --color-primary-glow: hsla(258, 85%, 66%, 0.15);

  --color-success: hsl(142, 72%, 40%);           /* Green for income */
  --color-success-hover: hsl(142, 72%, 46%);
  --color-success-glow: hsla(142, 72%, 40%, 0.12);

  --color-danger: hsl(350, 89%, 60%);            /* Red for expenses */
  --color-danger-hover: hsl(350, 89%, 66%);
  --color-danger-glow: hsla(350, 89%, 60%, 0.12);

  --color-info: hsl(199, 89%, 48%);              /* Blue for info */

  /* Shadow Scales */
  --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.15);
  --shadow-md: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 16px -6px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
```

**Light Mode Theme Definition:**

```css
html[data-theme="light"] {
  /* Background Colors */
  --bg-app: hsl(210, 40%, 96%);              /* Light gray background */
  --bg-surface: rgba(255, 255, 255, 0.7);   /* Semi-transparent white */
  --bg-surface-solid: hsl(0, 0%, 100%);     /* Pure white */

  /* Border Colors */
  --border-color: rgba(0, 0, 0, 0.08);      /* Very subtle dark borders */
  --border-color-hover: rgba(0, 0, 0, 0.15);/* More visible on hover */

  /* Text Colors */
  --text-main: hsl(224, 25%, 12%);          /* Dark text on light background */
  --text-muted: hsl(215, 16%, 45%);         /* Gray text */
  --text-inverse: hsl(210, 40%, 98%);       /* Light text on dark backgrounds */

  /* Semantic Colors (lighter for light mode) */
  --color-primary: hsl(258, 76%, 55%);
  --color-primary-hover: hsl(258, 76%, 48%);
  --color-primary-glow: hsla(258, 76%, 55%, 0.1);

  --color-success: hsl(142, 76%, 34%);
  --color-success-hover: hsl(142, 76%, 28%);
  --color-success-glow: hsla(142, 76%, 34%, 0.08);

  --color-danger: hsl(350, 80%, 48%);
  --color-danger-hover: hsl(350, 80%, 40%);
  --color-danger-glow: hsla(350, 80%, 48%, 0.08);

  --color-info: hsl(199, 89%, 42%);

  /* Shadow Scales (lighter for light backgrounds) */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 16px -6px rgba(0, 0, 0, 0.04);
  --shadow-lg: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
}
```

**JavaScript theme toggling:**

```javascript
// Get current theme from HTML element
var currentTheme = document.documentElement.getAttribute("data-theme");

// Toggle between themes
function toggleTheme() {
  var newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  
  // Optional: persist to localStorage
  localStorage.setItem("theme", newTheme);
}

// Apply saved theme on page load
var savedTheme = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", savedTheme);
```

**CSS automatically adapts to theme changes:**

```css
/* This component automatically uses the correct colors */
.button {
  background: var(--color-primary);    /* Changes based on theme */
  color: var(--text-main);              /* Changes based on theme */
  transition: background-color var(--transition-fast);
}

.button:hover {
  background: var(--color-primary-hover); /* Adaptive hover state */
}
```

---

### **Color Palette**

**Understanding HSL Color Space:**

HSL (Hue, Saturation, Lightness) is more intuitive than RGB for creating color systems:
- **Hue (0-360°)**: The color (red=0°, green=120°, blue=240°)
- **Saturation (0-100%)**: Color intensity (0%=gray, 100%=pure color)
- **Lightness (0-100%)**: Brightness (0%=black, 50%=pure, 100%=white)

```
Color Relationships in LedgerLite:

PRIMARY (Purple - for interactive elements)
├── hsl(258, 85%, 66%)   ← Main color
├── hsl(258, 85%, 72%)   ← Hover state (lightened)
└── hsla(258, 85%, 66%, 0.15) ← Glow effect (transparent)

SUCCESS (Green - for income/positive transactions)
├── hsl(142, 72%, 40%)   ← Main color
├── hsl(142, 72%, 46%)   ← Hover state (lightened)
└── hsla(142, 72%, 40%, 0.12) ← Glow effect

DANGER (Red - for expenses/negative transactions)
├── hsl(350, 89%, 60%)   ← Main color
├── hsl(350, 89%, 66%)   ← Hover state (lightened)
└── hsla(350, 89%, 60%, 0.12) ← Glow effect

INFO (Blue - for informational elements)
└── hsl(199, 89%, 48%)   ← Main color
```

**Color semantic meaning:**

```html
<!-- Income transaction (green) -->
<span class="amount-income">+$150.00</span>

<!-- Expense transaction (red) -->
<span class="amount-expense">-$45.99</span>

<!-- Primary action button (purple) -->
<button class="submit-btn">Add Transaction</button>

<!-- Success indicator (green) -->
<div class="color-success">✓ Saved</div>
```

---

### **Typography & Spacing**

**Font System:**

```css
/* Display Font: Used for headings and prominent text */
--font-display: 'Outfit', sans-serif;

/* Sans Font: Used for body text and UI elements */
--font-sans: 'Plus Jakarta Sans', sans-serif;
```

**Implementation:**

```css
h1, h2, h3 {
  font-family: var(--font-display);
  font-weight: 600;
  letter-spacing: -0.02em;  /* Tighter spacing for headings */
}

body, button, input {
  font-family: var(--font-sans);
  letter-spacing: 0;
}
```

**Spacing Scale (rem-based for accessibility):**

The spacing scale uses `rem` units, which scale based on the root font size (16px by default):

```
--space-xs:  0.25rem = 4px
--space-sm:  0.5rem  = 8px
--space-md:  1rem    = 16px
--space-lg:  1.5rem  = 24px
--space-xl:  2rem    = 32px
--space-xxl: 3rem    = 48px
```

**Real-world card component using spacing tokens:**

```css
.card {
  padding: var(--space-lg);           /* 24px padding */
  border-radius: var(--radius-lg);    /* 20px radius */
  border: 1px solid var(--border-color);
  margin-bottom: var(--space-lg);     /* 24px bottom margin */
  display: flex;
  gap: var(--space-md);               /* 16px between children */
}

.card-header {
  margin-bottom: var(--space-lg);     /* 24px below header */
  gap: var(--space-sm);               /* 8px between items */
}

.card-title {
  font-size: 0.8rem;
  margin-bottom: var(--space-xs);     /* 4px below title */
}
```

---

## 🎨 UI/UX Components

### **Card Components**

**Summary Cards** - Display key financial metrics:

```html
<div class="summary-section">
  <!-- Balance Card -->
  <div class="card summary-card balance-card">
    <div class="card-header">
      <span class="card-title">Total Balance</span>
      <div class="card-icon balance-icon">💰</div>
    </div>
    <div class="card-value">$2,450.50</div>
    <span class="card-meta">Updated today</span>
  </div>

  <!-- Income Card -->
  <div class="card summary-card income-card">
    <div class="card-header">
      <span class="card-title">Total Income</span>
      <div class="card-icon income-icon">📈</div>
    </div>
    <div class="card-value amount-income">+$5,200.00</div>
    <span class="card-meta">This month</span>
  </div>

  <!-- Expense Card -->
  <div class="card summary-card expense-card">
    <div class="card-header">
      <span class="card-title">Total Expenses</span>
      <div class="card-icon expense-icon">📉</div>
    </div>
    <div class="card-value amount-expense">-$2,750.50</div>
    <span class="card-meta">This month</span>
  </div>

  <!-- Count Card -->
  <div class="card summary-card transactions-count-card">
    <div class="card-header">
      <span class="card-title">Transactions</span>
      <div class="card-icon count-icon">#</div>
    </div>
    <div class="card-value">47</div>
    <span class="card-meta">Total recorded</span>
  </div>
</div>
```

**CSS Card Styling:**

```css
.card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(var(--glass-blur));
  transition: transform var(--transition-normal), 
              border-color var(--transition-normal), 
              box-shadow var(--transition-normal);
}

.card:hover {
  border-color: var(--border-color-hover);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);  /* Subtle lift effect */
}

/* Gradient overlays for visual hierarchy */
.balance-card {
  background: linear-gradient(135deg, var(--bg-surface), 
              hsla(258, 85%, 66%, 0.05));
}

.income-card {
  background: linear-gradient(135deg, var(--bg-surface), 
              hsla(142, 72%, 40%, 0.04));
}

.expense-card {
  background: linear-gradient(135deg, var(--bg-surface), 
              hsla(350, 89%, 60%, 0.04));
}
```

**Responsive Card Grid:**

```css
.summary-section {
  display: grid;
  grid-template-columns: 1fr;          /* 1 column on mobile */
  gap: var(--space-md);
}

@media (min-width: 576px) {
  .summary-section {
    grid-template-columns: repeat(2, 1fr);  /* 2 columns on tablet */
  }
}

@media (min-width: 1200px) {
  .summary-section {
    grid-template-columns: repeat(4, 1fr);  /* 4 columns on desktop */
  }
}
```

---

### **Form Elements**

**Transaction Form Structure:**

```html
<form id="transaction-form" class="card">
  <div class="card-header-simple">
    <h2>Add New Transaction</h2>
  </div>

  <div class="form-grid">
    <!-- Description Field -->
    <div class="form-group">
      <label for="transaction-title">Description</label>
      <input 
        type="text" 
        id="transaction-title" 
        name="title"
        placeholder="e.g., Grocery shopping"
        required
      >
      <span class="error-msg">Description is required</span>
    </div>

    <!-- Amount Field with Currency Prefix -->
    <div class="form-group">
      <label for="transaction-amount">Amount</label>
      <div class="amount-input-container">
        <span class="currency-prefix">$</span>
        <input 
          type="number" 
          id="transaction-amount" 
          name="amount"
          placeholder="0.00"
          step="0.01"
          min="0"
          required
        >
      </div>
      <span class="error-msg">Amount must be greater than 0</span>
    </div>

    <!-- Category Dropdown -->
    <div class="form-group">
      <label for="transaction-category">Category</label>
      <select id="transaction-category" name="category" required>
        <option value="">Select a category</option>
        <option value="food">Food & Dining</option>
        <option value="transport">Transportation</option>
        <option value="utilities">Utilities</option>
        <option value="entertainment">Entertainment</option>
        <option value="salary">Salary/Income</option>
        <option value="other">Other</option>
      </select>
      <span class="error-msg">Please select a category</span>
    </div>

    <!-- Type Selection -->
    <div class="form-group">
      <label for="transaction-type">Type</label>
      <select id="transaction-type" name="type" required>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
    </div>

    <!-- Date Field -->
    <div class="form-group full-width">
      <label for="transaction-date">Date</label>
      <input 
        type="date" 
        id="transaction-date" 
        name="date"
        required
      >
    </div>

    <!-- Notes Field -->
    <div class="form-group full-width">
      <label for="transaction-notes">Notes (Optional)</label>
      <textarea 
        id="transaction-notes" 
        name="notes"
        placeholder="Add any additional notes..."
        rows="3"
      ></textarea>
    </div>
  </div>

  <button type="submit" class="submit-btn">
    <span>Add Transaction</span>
  </button>
</form>
```

**Form Input Styling:**

```css
/* Base input styles */
input, select, textarea {
  width: 100%;
  background: var(--bg-app);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 10px 14px;
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 0.9rem;
  transition: all var(--transition-fast);
  outline: none;
}

/* Focus states (high contrast for accessibility) */
input:focus, select:focus, textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-glow);
}

/* Error states */
.form-group.error input,
.form-group.error select {
  border-color: var(--color-danger) !important;
  box-shadow: 0 0 0 3px var(--color-danger-glow) !important;
}

.form-group.error .error-msg {
  display: block;
  color: var(--color-danger);
  font-size: 0.7rem;
  margin-top: 4px;
}

/* Label styling */
label {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--text-muted);
  display: block;
  margin-bottom: var(--space-xs);
}

/* Submit button */
.submit-btn {
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: 12px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-top: var(--space-lg);
  transition: all var(--transition-fast);
  box-shadow: 0 4px 15px var(--color-primary-glow);
}

.submit-btn:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px var(--color-primary-glow);
}
```

---

### **Data Visualization**

**Transaction Table Structure:**

```html
<div class="card history-card">
  <div class="history-header">
    <h2>Transaction History</h2>

    <!-- Search & Filter Controls -->
    <div class="filters-container">
      <!-- Search Box -->
      <div class="search-box">
        <svg class="search-icon" viewBox="0 0 24 24">
          <!-- Search icon SVG -->
        </svg>
        <input 
          type="text" 
          id="search-input"
          placeholder="Search transactions..."
        >
      </div>

      <!-- Filter Tabs -->
      <div class="filter-tabs">
        <button class="filter-tab active" data-filter="all">All</button>
        <button class="filter-tab" data-filter="income">Income</button>
        <button class="filter-tab" data-filter="expense">Expenses</button>
      </div>
    </div>
  </div>

  <!-- Transactions Table -->
  <div class="table-container">
    <table class="transactions-table">
      <thead>
        <tr>
          <th>Description</th>
          <th>Category</th>
          <th class="align-right">Amount</th>
          <th class="align-right">Date</th>
          <th class="align-center">Actions</th>
        </tr>
      </thead>
      <tbody id="transactions-tbody">
        <!-- Dynamically populated -->
      </tbody>
    </table>
    <div class="empty-state">
      <div class="empty-state-icon">📭</div>
      <h3>No transactions</h3>
      <p>Add your first transaction to get started</p>
    </div>
  </div>
</div>
```

**Table Styling:**

```css
.transactions-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
}

.transactions-table th {
  background: var(--bg-surface);
  position: sticky;
  top: 0;
  padding: 12px var(--space-lg);
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-color);
  z-index: 2;
}

.transactions-table td {
  padding: 14px var(--space-lg);
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
}

.transactions-table tr:hover td {
  background: hsla(224, 25%, 35%, 0.04);
}

/* Category badges */
.category-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
  background: var(--border-color);
  color: var(--text-main);
  text-transform: capitalize;
}

/* Amount colors */
.amount-income {
  color: var(--color-success);
}

.amount-expense {
  color: var(--color-danger);
}
```

---

## 🔧 Feature Implementation

### **Transaction Management**

**CRUD Operations** (Create, Read, Update, Delete):

```javascript
// Storage key for local data persistence
var STORAGE_KEY = "ledger_transactions";

// Create - Add new transaction
function addTransaction(transactionData) {
  var transactions = getTransactions();
  
  var newTransaction = {
    id: Date.now(),  // Simple unique ID
    title: transactionData.title,
    amount: parseFloat(transactionData.amount),
    category: transactionData.category,
    type: transactionData.type,
    date: transactionData.date,
    notes: transactionData.notes || "",
    createdAt: new Date().toISOString()
  };

  transactions.push(newTransaction);
  saveTransactions(transactions);
  renderTransactions();
  updateStats();
  return newTransaction;
}

// Read - Retrieve all transactions
function getTransactions() {
  var stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Update - Modify existing transaction
function updateTransaction(id, updatedData) {
  var transactions = getTransactions();
  var transaction = transactions.find(function(t) { return t.id === id; });
  
  if (transaction) {
    Object.assign(transaction, updatedData);
    saveTransactions(transactions);
    renderTransactions();
    updateStats();
    return transaction;
  }
  return null;
}

// Delete - Remove transaction
function deleteTransaction(id) {
  var transactions = getTransactions();
  var filtered = transactions.filter(function(t) { return t.id !== id; });
  saveTransactions(filtered);
  renderTransactions();
  updateStats();
}

// Save to localStorage
function saveTransactions(transactions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}
```

**Form Validation:**

```javascript
function validateTransactionForm() {
  var form = document.getElementById("transaction-form");
  var title = form.querySelector("input[name='title']");
  var amount = form.querySelector("input[name='amount']");
  var category = form.querySelector("select[name='category']");
  
  var isValid = true;

  // Validate title
  if (!title.value.trim()) {
    markFormGroupError(title, "Title is required");
    isValid = false;
  } else {
    clearFormGroupError(title);
  }

  // Validate amount
  if (!amount.value || parseFloat(amount.value) <= 0) {
    markFormGroupError(amount, "Amount must be greater than 0");
    isValid = false;
  } else {
    clearFormGroupError(amount);
  }

  // Validate category
  if (!category.value) {
    markFormGroupError(category, "Please select a category");
    isValid = false;
  } else {
    clearFormGroupError(category);
  }

  return isValid;
}

function markFormGroupError(input, message) {
  var group = input.closest(".form-group");
  group.classList.add("error");
  var errorMsg = group.querySelector(".error-msg");
  if (errorMsg) {
    errorMsg.textContent = message;
    errorMsg.style.display = "block";
  }
}

function clearFormGroupError(input) {
  var group = input.closest(".form-group");
  group.classList.remove("error");
  var errorMsg = group.querySelector(".error-msg");
  if (errorMsg) {
    errorMsg.style.display = "none";
  }
}
```

---

### **Theme Switching**

**Dynamic Theme Toggle:**

```javascript
function initializeTheme() {
  // Check for saved preference or default to 'dark'
  var savedTheme = localStorage.getItem("userTheme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeButton(savedTheme);
}

function toggleTheme() {
  var currentTheme = document.documentElement.getAttribute("data-theme");
  var newTheme = currentTheme === "dark" ? "light" : "dark";
  
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("userTheme", newTheme);
  updateThemeButton(newTheme);
}

function updateThemeButton(theme) {
  var themeBtn = document.getElementById("theme-toggle-btn");
  if (theme === "dark") {
    themeBtn.innerHTML = "☀️"; // Show sun icon in dark mode
  } else {
    themeBtn.innerHTML = "🌙"; // Show moon icon in light mode
  }
}

/* CSS handles the visual theme transition */
body {
  transition: background-color var(--transition-normal),
              color var(--transition-normal);
}
```

---

## 🔧 Technical Implementation

### **localStorage for Data Persistence**

```javascript
// Save transactions to browser storage
function saveToBrowser(data) {
  try {
    localStorage.setItem("ledger_transactions", JSON.stringify(data));
  } catch (e) {
    if (e.name === "QuotaExceededError") {
      console.error("Storage limit exceeded");
    }
  }
}

// Load transactions from browser storage
function loadFromBrowser() {
  var data = localStorage.getItem("ledger_transactions");
  return data ? JSON.parse(data) : [];
}
```

**localStorage vs sessionStorage:**

| Feature | localStorage | sessionStorage |
|---------|---|---|
| **Persistence** | Survives page reload | Clears on tab close |
| **Scope** | Same-origin policy | Per tab |
| **Use Case** | User preferences, data | Temporary session data |
| **Size Limit** | ~5-10MB per domain | ~5-10MB per tab |

---

### **Form Validation Patterns**

**HTML5 Validation Attributes:**

```html
<!-- Type validation -->
<input type="email" required>
<input type="number" min="0" max="1000" step="0.01">
<input type="date" required>

<!-- Pattern validation -->
<input type="text" pattern="[A-Za-z\s]+" placeholder="Letters only">
<input type="tel" pattern="[0-9\-\+]{10,}" placeholder="Phone number">

<!-- Custom validation -->
<input 
  type="text" 
  id="username"
  minlength="3"
  maxlength="20"
  required
>
```

---

### **Responsive Layout Patterns**

**Mobile-First Grid Approach:**

```css
/* Start with 1 column on mobile */
.summary-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
}

/* 2 columns on small tablets */
@media (min-width: 576px) {
  .summary-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 4 columns on desktop */
@media (min-width: 1200px) {
  .summary-section {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Alternative: Using CSS Grid auto-fit */
.summary-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-lg);
}
```

---

## 📊 Learning Outcomes

After exploring this project, you'll understand:

1. ✅ How to design and implement a professional CSS design system
2. ✅ CSS custom properties (variables) for theme management
3. ✅ HSL color space and semantic color systems
4. ✅ Responsive design with mobile-first approach
5. ✅ Form validation and error state management
6. ✅ localStorage API for data persistence
7. ✅ Chart.js integration for data visualization
8. ✅ Event delegation and dynamic DOM manipulation
9. ✅ Glassmorphism design patterns
10. ✅ Accessibility considerations (ARIA labels, focus states)

---

## 🚀 How to Use

1. **Open `index.html`** in your browser
2. **Add transactions:**
   - Fill in the form with transaction details
   - Select category and type (income/expense)
   - Click "Add Transaction"
3. **View analytics:**
   - Check the expense breakdown chart
   - Monitor summary statistics
4. **Manage transactions:**
   - Search transactions using the search box
   - Filter by type (Income/Expenses)
   - Edit or delete individual transactions
5. **Toggle theme:**
   - Click the sun/moon button to switch themes
   - Your preference is saved automatically
6. **Inspect elements (F12):**
   - Examine the CSS custom properties
   - Understand the responsive layout system

---

## 📝 File Structure

```
Assignment8/
├── index.html      # Semantic HTML with embedded CSS & JS
├── README.md       # This comprehensive documentation
└── (All CSS and JavaScript are embedded in index.html)
```

---

## 💡 Key Takeaways

| Concept | Key Point |
|---------|-----------|
| **Design Tokens** | Atomic units of design for consistency and maintainability |
| **CSS Variables** | Custom properties enable dynamic theming without JavaScript |
| **HSL Color Space** | More intuitive than RGB for creating cohesive color systems |
| **Responsive Design** | Mobile-first approach with CSS Grid and media queries |
| **Form Validation** | HTML5 attributes + JavaScript for robust error handling |
| **localStorage API** | Client-side data persistence without a backend |
| **Chart.js** | Powerful data visualization library for interactive charts |
| **Glassmorphism** | Modern design technique using backdrop-filter and transparency |
| **Semantic HTML** | Improves accessibility and SEO through meaningful markup |
| **Event Delegation** | Efficient event handling for dynamic content |

---

## 🎯 Real-World Applications

This project demonstrates patterns used in production applications:

- **Fintech Apps:** Wave, FreshBooks, Wise use similar design systems
- **SaaS Dashboards:** Stripe, Shopify utilize token-based design
- **Analytics Platforms:** Mixpanel, Amplitude employ Chart.js for visualization
- **Finance Trackers:** YNAB, Mint incorporate localStorage for offline capability

---

## 📚 References

- [MDN: CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [MDN: localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [MDN: Form Validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
- [Design Tokens Best Practices](https://www.designtokens.org/)
- [Responsive Web Design Guide](https://web.dev/responsive-web-design-basics/)

---

**Created:** 2026 | **Assignment:** 8 | **Focus Areas:** Design Systems, Form Handling & Data Visualization
