# TaskFlow - Developer Dashboard | Assignment 7

A comprehensive educational project demonstrating **HTML structure**, **browser rendering pipeline**, and **event propagation** with an interactive task manager application.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Browser Rendering Pipeline](#browser-rendering-pipeline)
   - [HTML Parsing](#html-parsing)
   - [Tokenization](#tokenization)
   - [DOM Tree](#dom-tree)
   - [CSSOM Tree](#cssom-tree)
   - [Render Tree](#render-tree)
   - [Layout & Paint](#layout--paint)
3. [Event Propagation](#event-propagation)
   - [Event Capturing](#event-capturing-phase)
   - [Event Bubbling](#event-bubbling-phase)
   - [Event Delegation](#event-delegation)
4. [Project Features](#project-features)
5. [Technical Implementation](#technical-implementation)

---

## 🎯 Project Overview

**TaskFlow** is a multi-phase developer learning tool that teaches fundamental web concepts through interactive demonstrations:

- **Section A:** Interactive carousel showing the 6-step browser rendering pipeline
- **Section B:** Event propagation sandbox with nested containers to visualize capturing, target, and bubbling phases
- **Section C:** Fully functional task manager with CRUD operations using semantic HTML and vanilla JavaScript

**Tech Stack:**
- HTML5 (semantic structure with ARIA labels)
- CSS3 (CSS variables for theming, Flexbox/Grid layouts)
- Vanilla JavaScript (ES5 compatible, event-driven architecture)

---

## Live Deployment Link

https://mdaamersk.github.io/ASSIGNMENTS/Assignment7/

## 🔄 Browser Rendering Pipeline

When you type a URL and press Enter, your browser undergoes a complex 6-step process to transform HTML/CSS code into pixels on your screen. Understanding this pipeline is crucial for web performance optimization.

### **Step 1: HTML Parsing**

**What happens:**
- The browser receives raw **bytes** of HTML from the network stream
- These bytes are decoded into **characters** based on the character encoding declared in the `<meta charset>` tag
- The parser reads the character stream sequentially

**In our project:**
```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  ...
</head>
<body>
  <header class="app-header">...</header>
  ...
</body>
</html>
```

The browser's **HTML parser** processes this raw text and understands that:
- `<!DOCTYPE html>` defines HTML5 document type
- `<meta charset="UTF-8">` specifies character encoding
- Tags represent semantic structure

**Key Concept:** Parsing is **incremental** — the browser doesn't wait for the entire document to load before starting. It parses and renders as it receives data, which is why `<script>` tag placement matters.

---

### **Step 2: Tokenization**

**What happens:**
- The parser converts the character stream into **tokens** — small, meaningful units
- Each token represents an HTML construct: StartTag, EndTag, Attribute, Character data

**Tokenization rules (HTML5 spec):**
- `<header>` → **StartTag token** with name="header"
- `class="app-header"` → **Attribute token** with name="class", value="app-header"
- `</header>` → **EndTag token** with name="header"
- `TaskFlow` (text) → **Character token**

**Example from our code:**
```
Raw Input:  <header class="app-header"><h1>TaskFlow</h1></header>

Tokens:
1. StartTag: name="header", attributes={class="app-header"}
2. StartTag: name="h1"
3. Character: "TaskFlow"
4. EndTag: name="h1"
5. EndTag: name="header"
```

**Why this matters:** Tokenization is the bridge between raw text and structured data. It validates syntax and prepares data for tree construction.

---

### **Step 3: DOM Tree**

**What happens:**
- Tokens are converted into **Node objects** and linked together hierarchically
- Creates the **Document Object Model (DOM)** — a tree representation of the document

**DOM Node types in our project:**
- **Document** (root)
  - **Element Nodes**: `<html>`, `<body>`, `<header>`, `<section>`, `<button>`
  - **Text Nodes**: "TaskFlow", "Add Task"
  - **Attribute Nodes**: attached to elements

**Visual DOM Tree structure:**
```
document
└── html (data-theme="light")
    ├── head
    │   ├── meta (charset="UTF-8")
    │   ├── title
    │   └── link (stylesheet)
    └── body
        ├── header.app-header
        │   └── h1 "TaskFlow"
        ├── main.app-main
        │   ├── section#pipeline-explainer
        │   │   ├── h2 "Browser Rendering Pipeline"
        │   │   └── div.carousel-container
        │   ├── section#event-sandbox
        │   │   └── div#grandparent.propagation-box
        │   │       └── div#parent.propagation-box
        │   │           └── div#child.propagation-box
        │   │               └── button#trigger-btn
        │   └── section#task-workspace
        │       └── form#task-form
        └── footer.app-footer
```

**JavaScript access:**
```javascript
// In script.js, we access DOM nodes:
var grandparent = document.getElementById("grandparent");  // Element Node
var taskForm = document.getElementById("task-form");        // Element Node
var titleValue = taskTitleInput.value;                       // Property access
```

**Key Concept:** The DOM is a **live representation** — changes via JavaScript update both the DOM tree and the rendered page.

---

### **Step 4: CSSOM Tree**

**What happens:**
- The browser fetches and parses **external stylesheets** (linked via `<link>`) and **inline styles** (`<style>` tags)
- Builds the **CSS Object Model (CSSOM)** — a tree of cascading style rules

**In our project:**
```html
<link rel="stylesheet" href="styles.css">
```

The browser fetches `styles.css` and parses rules like:

```css
:root {
  --bg-primary: #f8fafc;
  --text-primary: #0f172a;
  --accent-color: #8f84ff;
}

body {
  font-family: 'Plus Jakarta Sans', Arial, sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-secondary);
}

.btn-primary {
  background-color: var(--accent-color);
  color: #ffffff;
  padding: 0.75rem;
  border-radius: 6px;
}
```

**CSSOM Tree structure:**
```
CSSOM Root
├── :root (Selector)
│   ├── --bg-primary: #f8fafc
│   ├── --text-primary: #0f172a
│   └── --accent-color: #8f84ff
├── body (Selector)
│   ├── font-family: 'Plus Jakarta Sans', Arial, sans-serif
│   ├── background-color: var(--bg-primary)
│   └── color: var(--text-secondary)
├── .btn-primary (Selector)
│   ├── background-color: var(--accent-color)
│   ├── color: #ffffff
│   ├── padding: 0.75rem
│   └── border-radius: 6px
└── ... (more rules)
```

**Cascade & Specificity:**
- Rules are sorted by specificity: element < class < ID < inline
- Later rules override earlier ones
- CSS variables (custom properties) are inherited down the tree

**Theme toggling in our app:**
```javascript
// When user clicks theme toggle:
rootElement.setAttribute("data-theme", "dark");

// CSS applies new rules:
// :root[data-theme="dark"] { --bg-primary: #0b0f19; ... }
```

**Key Concept:** CSSOM is **render-blocking** — the browser won't render until stylesheets are fully parsed.

---

### **Step 5: Render Tree**

**What happens:**
- DOM and CSSOM are **combined** to create the **Render Tree**
- Only **visible elements** are included (hidden elements like `display: none` are excluded)
- Each render node contains computed style information

**Render Tree construction:**
```
For each visible DOM node:
  1. Find matching CSS selectors in CSSOM
  2. Calculate final computed styles (cascade rules applied)
  3. Create render node with geometry data

Excluded from Render Tree:
  - Nodes with display: none
  - Nodes with visibility: hidden
  - Nodes outside viewport (initially)
```

**Example from our task manager:**
```javascript
// In initializeTaskEngine(), when creating a task card:
var taskCard = document.createElement("div");
taskCard.className = "task-card";  // Applied CSS class

// The render tree now includes:
// - Render node for taskCard
// - Computed styles from .task-card class:
//   {
//     background-color: #ffffff (from var(--bg-secondary))
//     border: 1px solid #e2e8f0 (from var(--border-color))
//     padding: 1rem
//     display: flex
//     gap: 0.75rem
//   }
```

**Completed tasks example:**
```css
.task-card[data-status="completed"] {
  background-color: var(--bg-tertiary);  /* Lighter background */
}

.task-card[data-status="completed"] .task-card-title {
  text-decoration: line-through;  /* Strike-through text */
  opacity: 0.65;                   /* Dimmed appearance */
}
```

**Key Concept:** The Render Tree is a **filtered, styled version** of the DOM that only includes what needs to be painted.

---

### **Step 6: Layout & Paint**

**Layout Phase (Reflow):**
- Calculate **geometric positions and sizes** for each render node
- Generate a **layout tree** with coordinates (x, y, width, height)

**Paint Phase (Rasterization):**
- Convert vector information into **pixels on the screen**
- Apply visual effects (shadows, borders, colors, gradients)

**In our carousel component:**
```javascript
function updateCarouselPosition() {
  var translatePercentage = currentSlide * 100;
  carouselTrack.style.transform = "translateX(-" + translatePercentage + "%)";
  // This triggers a paint operation (not a full reflow)
}
```

**Performance optimization:**
- `transform` and `opacity` changes trigger **paint only** (fast)
- `width`, `height`, `margin`, `padding` changes trigger **reflow** (slow)

**Pipeline flow in our app:**

```
User clicks "Next" button
    ↓
JavaScript: currentSlide++
    ↓
Update DOM: carouselTrack.style.transform = "translateX(-200%)"
    ↓
REFLOW: Recalculate positions (normally happens, but transform is optimized)
    ↓
PAINT: Render transformed elements to pixels
    ↓
COMPOSITE: Combine layers and display on screen
```

---

## 📡 Event Propagation

When you click an element, the browser doesn't just fire an event on that element. Instead, it triggers a sophisticated **3-phase process** that travels through the DOM tree.

### **Event Capturing Phase**

**What happens:**
- Event starts at the **document root** and travels **DOWN** to the target element
- Each ancestor element (in order) gets a chance to respond
- **Capturing listeners** are called using `addEventListener(type, callback, true)`

**In our sandbox:**
```javascript
// Capturing phase listeners (third parameter = true)
grandparent.addEventListener("click", function() {
  console.log("Capturing: GRANDPARENT");
}, true);  // ← true enables capturing

parent.addEventListener("click", function() {
  console.log("Capturing: PARENT");
}, true);

child.addEventListener("click", function() {
  console.log("Capturing: CHILD");
}, true);

button.addEventListener("click", function() {
  console.log("Capturing: BUTTON");
}, true);
```

**HTML structure (nested containers):**
```html
<div id="grandparent" class="propagation-box grandparent-box">
  <div id="parent" class="propagation-box parent-box">
    <div id="child" class="propagation-box child-box">
      <button id="trigger-btn" class="propagation-button">
        Click to Trigger Event
      </button>
    </div>
  </div>
</div>
```

**When you click the button, capturing phase order:**
```
1. document (root)
2. html
3. body
4. main
5. section
6. div#grandparent ← Capturing listener fires
7. div#parent     ← Capturing listener fires
8. div#child      ← Capturing listener fires
9. button         ← Capturing listener fires
```

**Console output (Capturing phase only):**
```
Capturing: GRANDPARENT
Capturing: PARENT
Capturing: CHILD
Capturing: BUTTON
```

**Real-world use case:** Event capturing is useful for:
- Global event handlers (e.g., analytics tracking before child handlers run)
- Preventing default behaviors at the document level
- Implementing custom focus management systems

---

### **Event Bubbling Phase**

**What happens:**
- Event travels **UP** from the target element back to the document root
- Each ancestor element (in reverse order) gets to respond
- **Bubbling listeners** are called using `addEventListener(type, callback, false)` or omitting the third parameter

**In our sandbox:**
```javascript
// Bubbling phase listeners (third parameter = false or omitted)
grandparent.addEventListener("click", function() {
  console.log("Bubbling: GRANDPARENT");
}, false);  // ← false or omitted enables bubbling

parent.addEventListener("click", function() {
  console.log("Bubbling: PARENT");
}, false);

child.addEventListener("click", function() {
  console.log("Bubbling: CHILD");
}, false);

button.addEventListener("click", function() {
  console.log("Bubbling: BUTTON");
}, false);
```

**When you click the button, bubbling phase order (after target):**
```
9. button         ← Bubbling listener fires
8. div#child      ← Bubbling listener fires
7. div#parent     ← Bubbling listener fires
6. div#grandparent ← Bubbling listener fires
5. section
4. main
3. body
2. html
1. document (root)
```

**Console output (Full cycle with both capturing and bubbling):**
```
Capturing: GRANDPARENT
Capturing: PARENT
Capturing: CHILD
Capturing: BUTTON
Bubbling: BUTTON
Bubbling: CHILD
Bubbling: PARENT
Bubbling: GRANDPARENT
```

**Event phases breakdown:**
```
Phase 1: CAPTURING (Downward)
  document → grandparent → parent → child → button

Phase 2: TARGET
  button (target phase, fires both capturing & bubbling)

Phase 3: BUBBLING (Upward)
  button → child → parent → grandparent → document
```

**Controlling event propagation:**
```javascript
button.addEventListener("click", function(event) {
  event.stopPropagation();      // Stops event from bubbling up
  event.stopImmediatePropagation(); // Stops other listeners
  event.preventDefault();        // Prevents default browser action
});
```

**Real-world use cases for bubbling:**
- Click handlers on parent containers (modal overlays, dropdowns)
- Keyboard shortcuts (document-level listeners)
- Custom drag-and-drop implementations

---

### **Event Delegation**

**What is it:**
Event delegation is a pattern where you attach a **single event listener** to a **parent element** instead of attaching listeners to each child element individually. The listener uses the event object to determine which child was clicked.

**Benefits:**
- ✅ **Memory efficient** — one listener instead of many
- ✅ **Dynamic elements** �� new children automatically handled
- ✅ **Cleaner code** — less event listener management

**In our task manager, event delegation powers the task actions:**

```javascript
// Single listener on the container (parent of all task cards)
taskContainer.addEventListener("click", function(event) {
  var target = event.target;  // The clicked element
  
  // Find the closest task card ancestor
  var card = target.closest(".task-card");
  if (!card) return; // Exit if user clicked outside a card
  
  // Determine which action was clicked by checking classList
  if (target.classList.contains("btn-card-complete")) {
    // Handle completion
  } else if (target.classList.contains("btn-card-edit")) {
    // Handle editing
  } else if (target.classList.contains("btn-card-delete")) {
    // Handle deletion
  }
});
```

**HTML structure (multiple task cards):**
```html
<div id="task-container" class="task-list-active">
  
  <div class="task-card" data-id="1700000000001">
    <div class="task-info">
      <span class="task-card-title">Implement dark mode</span>
    </div>
    <div class="task-actions">
      <button class="btn-card btn-card-complete">Complete</button>
      <button class="btn-card btn-card-edit">Edit</button>
      <button class="btn-card btn-card-delete">Delete</button>
    </div>
  </div>
  
  <div class="task-card" data-id="1700000000002">
    <!-- Same structure -->
  </div>
  
  <!-- New cards dynamically added here -->
</div>
```

**Event delegation flow:**

```
User clicks "Complete" button on task #1
    ↓
Event bubbles to .task-card (parent)
    ↓
Event bubbles to #task-container (event listener attached here)
    ↓
Listener fires:
  - event.target = the Complete button
  - target.closest(".task-card") = finds the parent card
  - target.classList.contains("btn-card-complete") = true
    ↓
Complete handler executes
```

**Complete implementation:**
```javascript
// Handle Complete / Reopen Action
if (target.classList.contains("btn-card-complete")) {
  var currentStatus = card.getAttribute("data-status");
  
  if (currentStatus === "pending") {
    card.setAttribute("data-status", "completed");
    target.textContent = "Reopen";
    
    // Move completed task to bottom
    taskContainer.appendChild(card);
  } else {
    card.setAttribute("data-status", "pending");
    target.textContent = "Complete";
    
    // Move pending task to top
    taskContainer.prepend(card);
  }
  updateStats();
}

// Handle Edit Action
else if (target.classList.contains("btn-card-edit")) {
  var existingInput = card.querySelector(".edit-input-field");
  
  if (existingInput) {
    // Save mode: replace input with text
    var updatedText = existingInput.value.trim();
    var newTitleSpan = document.createElement("span");
    newTitleSpan.className = "task-card-title";
    newTitleSpan.appendChild(document.createTextNode(updatedText || card.dataset.oldTitle));
    existingInput.replaceWith(newTitleSpan);
    target.textContent = "Edit";
  } else {
    // Edit mode: replace text with input
    var titleSpan = card.querySelector(".task-card-title");
    var currentTitle = titleSpan.textContent;
    card.dataset.oldTitle = currentTitle;
    
    var editInput = document.createElement("input");
    editInput.type = "text";
    editInput.className = "edit-input-field";
    editInput.value = currentTitle;
    
    titleSpan.replaceWith(editInput);
    editInput.focus();
    target.textContent = "Save";
  }
}

// Handle Delete Action
else if (target.classList.contains("btn-card-delete")) {
  card.remove();
  if (taskContainer.children.length === 0) {
    restoreEmptyState();
  }
  updateStats();
}
```

**Why delegation works so well for dynamic content:**

When a user submits the form, a new task card is **dynamically created and added to the DOM**:

```javascript
var taskCard = document.createElement("div");
taskCard.className = "task-card";
taskContainer.prepend(taskCard);  // Add to DOM

// No need to attach event listeners to this new card!
// It's already covered by the delegation listener on #task-container
```

**Without delegation** (inefficient approach):
```javascript
// ❌ This doesn't work for dynamically added cards
newTaskCard.addEventListener("click", handleClick);
```

**With delegation** (efficient approach):
```javascript
// ✅ This automatically handles newly added cards
taskContainer.addEventListener("click", function(event) {
  if (event.target.classList.contains("btn-card-complete")) {
    // Works for any card, old or new
  }
});
```

---

## 🎨 Project Features

### **1. Browser Rendering Pipeline Carousel**
- Interactive 6-step carousel explaining the rendering process
- Navigation buttons (Previous/Next) with disabled states
- Each step includes visual code examples
- Smooth CSS transitions (`transform: translateX()` optimized)

### **2. Event Propagation Sandbox**
- Nested container visualization (Grandparent → Parent → Child → Button)
- Color-coded boxes for visual hierarchy
- Console logging to track event phases
- Demonstrates all three event phases: Capturing → Target → Bubbling

### **3. Task Manager Application**
- **Create tasks:** Form validation with semantic HTML
- **Complete/Reopen:** Toggle task status with visual feedback (strikethrough)
- **Edit inline:** In-place title editing with Enter key support
- **Delete:** Remove individual tasks with confirmation
- **Clear All:** Bulk delete with browser confirmation
- **Statistics:** Real-time counters (Total, Pending, Completed)
- **Responsive design:** Works on mobile and desktop

### **4. Theme Toggling**
- Light/Dark mode with CSS variables
- Persistent state using `data-theme` attribute
- Smooth transitions between themes
- 12 CSS color variables for complete thematic control

---

## 🔧 Technical Implementation

### **DOM vs Properties vs Attributes**

```javascript
// Demonstration in form submission:
console.log("=== DOM PROPERTY VS. HTML ATTRIBUTE ===");
console.log("Live DOM Property (input.value): " + taskTitleInput.value);
// Returns: What the user typed (e.g., "Implement dark mode")

console.log("Static HTML Attribute (input.getAttribute('value')): " + 
            taskTitleInput.getAttribute("value"));
// Returns: null (or the initial value from <input value="...">)
```

**Key differences:**
- **Property**: Live, current state of the element
- **Attribute**: Static, from the HTML markup

### **Event Listener Syntax**

```javascript
// Capturing phase (third parameter = true)
element.addEventListener("click", handler, true);

// Bubbling phase (third parameter = false or omitted)
element.addEventListener("click", handler, false);
element.addEventListener("click", handler); // Default bubbling
```

### **DOM Traversal Methods Used**

```javascript
// Find by ID
var element = document.getElementById("element-id");

// Find closest ancestor
var ancestor = element.closest(".class-name");

// Find all descendants
var children = element.querySelectorAll(".selector");

// Find first descendant
var child = element.querySelector(".selector");

// Access parent
var parent = element.parentElement;
```

### **CSS Cascade & Specificity**

```css
/* Specificity: 0 (element) */
button { color: blue; }

/* Specificity: 1 (class) - overrides above */
.btn-primary { color: red; }

/* Specificity: 2 (ID + attribute) - overrides above */
#submit-btn[type="submit"] { color: green; }

/* Inline style - specificity: 3 (always highest) */
<button style="color: purple;">Click</button>
```

---

## 📊 Learning Outcomes

After exploring this project, you'll understand:

1. ✅ How HTML is parsed into a DOM tree
2. ✅ How CSS becomes a CSSOM tree
3. ✅ How browser combines DOM + CSSOM into a render tree
4. ✅ How layout calculations and painting work
5. ✅ The three phases of event propagation
6. ✅ When to use event capturing vs bubbling
7. ✅ How event delegation improves performance
8. ✅ Semantic HTML and accessibility (ARIA labels)
9. ✅ CSS variables and theming systems
10. ✅ Dynamic DOM manipulation and rendering

---

## 🚀 How to Use

1. **Open `index.html`** in your browser
2. **Inspect the browser console** (F12 → Console tab) to see event phase logs
3. **Interact with all three sections:**
   - Carousel: Navigate through rendering pipeline steps
   - Sandbox: Click the button to see event propagation phases
   - Task Manager: Create, edit, complete, and delete tasks
4. **Toggle the theme** using the sun/moon button in the header
5. **Right-click and "Inspect Element"** to examine the DOM tree

---

## 📝 File Structure

```
Assignment7/
├── index.html      # Semantic HTML structure with ARIA labels
├── styles.css      # CSS variables, theming, responsive design
├── script.js       # Event handlers, DOM manipulation, delegation
└── README.md       # This file
```

---

## 💡 Key Takeaways

| Concept | Key Point |
|---------|-----------|
| **HTML Parsing** | Browser converts bytes → characters → tokens → DOM nodes |
| **DOM Tree** | Live, hierarchical representation of the document |
| **CSSOM Tree** | Parsed CSS with cascading rules applied |
| **Render Tree** | DOM + CSSOM combined, only visible elements included |
| **Layout & Paint** | Geometric calculations and rasterization to pixels |
| **Event Capturing** | Top-down phase from document to target element |
| **Event Bubbling** | Bottom-up phase from target element back to document |
| **Event Delegation** | Single listener on parent handles multiple children |

---

## 📚 References

- [MDN: DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
- [MDN: Event Propagation](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events#event_bubbling_and_event_capturing)
- [MDN: Event Delegation](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events#event_delegation)
- [Google: Critical Rendering Path](https://web.dev/articles/critical-rendering-path)

---

**Created:** 2026 | **Assignment:** 7 | **Focus Areas:** Web Fundamentals & Events
