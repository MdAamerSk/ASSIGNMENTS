# FocusFlow - Productivity Dashboard | Assignment 9

A comprehensive educational project demonstrating **modular JavaScript architecture**, **event delegation patterns**, **state management with local storage**, and **API integration** with an elegant glassmorphic productivity dashboard featuring six interconnected tools.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Application Architecture](#application-architecture)
   - [Architectural Layers](#architectural-layers)
   - [Module System](#module-system)
   - [Event Bus & State Management](#event-bus--state-management)
3. [Core Design Patterns](#core-design-patterns)
   - [Event Delegation](#event-delegation)
   - [Module Pattern](#module-pattern)
   - [Observer Pattern](#observer-pattern)
   - [Local Storage Persistence](#local-storage-persistence)
4. [Feature Modules](#feature-modules)
   - [Navigation Engine](#navigation-engine)
   - [Theme Module](#theme-module)
   - [Todo Module](#todo-module)
   - [Daily Planner](#daily-planner)
   - [Goals Module](#goals-module)
   - [Scratchpad Notes](#scratchpad-notes)
   - [Pomodoro Timer](#pomodoro-timer)
   - [Quotes Module](#quotes-module)
   - [Weather Module](#weather-module)
5. [Technical Implementation](#technical-implementation)
6. [Design System](#design-system)

---

## 🎯 Project Overview

**FocusFlow** is an interactive, single-page productivity dashboard that teaches advanced web development concepts through practical implementation:

- **Section A:** Navigation routing system with hash-based SPA architecture
- **Section B:** Event-driven state management with localStorage persistence
- **Section C:** Six feature modules (todos, planner, goals, notes, timer, quotes, weather) with real-time synchronization
- **Section D:** Glassmorphic UI design with light/dark theme system using CSS variables
- **Section E:** API integration (Open-Meteo weather, DummyJSON quotes)

**Tech Stack:**
- HTML5 (semantic structure with ARIA accessibility labels)
- CSS3 (glassmorphism effects, CSS variables, CSS Grid/Flexbox)
- Vanilla JavaScript ES5 (modular architecture, event delegation, async/await)
- External APIs (Open-Meteo Weather, DummyJSON Quotes)

---

## Live Deployment Link

https://mdaamersk.github.io/ASSIGNMENTS/Assignment9/

## 🏗️ Application Architecture

### **Architectural Layers**

FocusFlow follows a **4-layer architecture pattern**:

```
┌─────────────────────────────────────────────────────────┐
│  1. PRESENTATION LAYER (UI/DOM)                         │
│  - .feature-view sections (Dashboard, Todo, Planner...) │
│  - CSS styling & glassmorphic components                │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│  2. FEATURE LAYER (Modules)                             │
│  - TodoModule, PlannerModule, GoalsModule, etc.         │
│  - Business logic & DOM rendering                       │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│  3. STATE LAYER (Store & EventBus)                      │
│  - LocalStorage persistence                             │
│  - Event emission & subscription system                 │
└────────────────┬────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────┐
│  4. INFRASTRUCTURE LAYER (Utilities)                    │
│  - ApiClient (fetch wrapper with timeout)              │
│  - Utility functions (HTML escaping, formatting)        │
└─────────────────────────────────────────────────────────┘
```

### **Module System**

Each major feature is encapsulated in a **self-contained module** with standardized interface:

```javascript
const ModuleName = {
    // State: Private data storage
    state: [],
    
    // Initialization: Setup events and load persisted data
    init() {
        // Load from Store
        // Attach event listeners
        // Initial render
    },
    
    // Core Methods: Business logic
    addItem(data) { /* ... */ },
    deleteItem(id) { /* ... */ },
    updateItem(id, data) { /* ... */ },
    
    // Rendering: DOM updates
    render() { /* ... */ },
    updateHomePreview() { /* ... */ },
    
    // Persistence: Save to LocalStorage
    saveToStorage() { /* ... */ }
};
```

### **Event Bus & State Management**

Centralized pub/sub system for cross-module communication:

```javascript
const EventBus = {
    listeners: {},
    
    // Subscribe to events
    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    },
    
    // Unsubscribe from events
    off(event, callback) {
        this.listeners[event] = this.listeners[event].filter(fn => fn !== callback);
    },
    
    // Emit events to all subscribers
    emit(event, data) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(cb => cb(data));
    }
};
```

**Event Flow Example:**
```
User completes a goal
    ↓
GoalsModule.toggleGoal() executes
    ↓
Store.saveGoals() persists changes
    ↓
Store.saveGoals() calls EventBus.emit('goals:updated', goals)
    ↓
App.updateHero() listens on 'goals:updated' event
    ↓
Hero banner updates with new goals progress
```

---

## 🎨 Core Design Patterns

### **Event Delegation**

Instead of attaching listeners to individual elements, parent containers handle events using event capturing:

```javascript
// Module Level: Single listener on parent handles all child interactions
const todoList = document.getElementById('todo-list');
todoList.addEventListener('click', (event) => {
    const target = event.target;
    const todoItem = target.closest('.todo-item');
    if (!todoItem) return;
    
    const taskId = Number(todoItem.getAttribute('data-id'));
    
    // Determine which action was clicked
    if (target.closest('.todo-checkbox')) {
        this.toggleTask(taskId, 'completed');
    } else if (target.closest('.star-btn')) {
        this.toggleTask(taskId, 'important');
    } else if (target.closest('.trash-btn')) {
        this.deleteTask(taskId);
    }
});
```

**Benefits:**
- ✅ Memory efficient (one listener instead of many)
- ✅ Dynamic elements automatically covered
- ✅ Centralized event handling logic
- ✅ Reduced code complexity

### **Module Pattern**

Each feature is a singleton object with private state and public interface:

```javascript
const TodoModule = {
    // Private state - only accessible within this module
    state: [],
    
    // Public methods - exposed interface
    init() { /* initialization */ },
    addTask(text) { /* add task */ },
    deleteTask(id) { /* delete task */ },
    render() { /* render DOM */ },
    
    // Helper methods - scoped to module
    escapeHTML(str) { /* sanitize */ }
};
```

**Advantages:**
- Encapsulation of state and methods
- No global namespace pollution
- Reusable pattern across all modules
- Easy to debug and maintain

### **Observer Pattern (Event Bus)**

Modules emit events that other modules subscribe to, enabling loose coupling:

```javascript
// In Store:
saveTodos(todos) {
    localStorage.setItem('focusflow-todos', JSON.stringify(todos));
    EventBus.emit('todos:updated', todos);  // Notify subscribers
}

// In App:
EventBus.on('todos:updated', () => {
    this.updateHero();  // React to change
});
```

**Communication Flow:**
```
TodoModule changes state
    ↓
Calls Store.saveTodos()
    ↓
Store emits 'todos:updated' event
    ↓
App listens and updates hero banner
    ↓
PomodoroModule listens and updates display
    ↓
Multiple modules react to single change
```

### **Local Storage Persistence**

Centralized storage wrapper ensures data consistency:

```javascript
const Store = {
    getTodos() {
        return JSON.parse(localStorage.getItem('focusflow-todos')) || [];
    },
    
    saveTodos(todos) {
        localStorage.setItem('focusflow-todos', JSON.stringify(todos));
        EventBus.emit('todos:updated', todos);  // Trigger updates
    },
    
    getTheme() {
        return localStorage.getItem('focusflow-theme') || 'dark';
    }
};
```

**Storage Schema:**
```
focusflow-todos      → [{ id, text, completed, important }, ...]
focusflow-goals      → [{ id, text, completed }, ...]
focusflow-plans      → { "09": "Morning standup", "14": "Code review", ... }
focusflow-notes      → "Long text string of scratchpad notes"
focusflow-theme      → "dark" | "light"
```

---

## 🔧 Feature Modules

### **1. Navigation Engine (SPA Router)**

Implements client-side routing using hash-based URLs without server requests:

```javascript
const NavigationEngine = {
    init() {
        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleHashChange());
        
        // Initial route on page load
        this.handleHashChange();
    },
    
    handleHashChange() {
        const hash = window.location.hash || '#dashboard';
        const viewId = hash === '#dashboard' ? 'dashboard-view' : `${hash.replace('#', '')}-view`;
        this.switchView(viewId);
    },
    
    switchView(viewId) {
        // Hide all views
        document.querySelectorAll('.feature-view').forEach(view => {
            view.classList.remove('active');
        });
        
        // Show target view with smooth transition
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.classList.add('active');
        }
    }
};
```

**Route Map:**
```
#dashboard  → Dashboard Overview (6-card grid)
#todo       → Todo List Manager
#planner    → Hourly Planner (9 AM - 5 PM)
#goals      → Daily Goals Tracker
#notes      → Quick Scratchpad
#pomodoro   → Focus Timer
#quote      → Inspiration Quotes
#weather    → Weather Forecast
```

**CSS Transitions:**
```css
.feature-view {
    display: none;
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.feature-view.active {
    display: flex;
    opacity: 1;
    transform: translateY(0);
}
```

### **2. Theme Module (Light/Dark Mode)**

CSS variables-based theme system with localStorage persistence:

```javascript
const ThemeModule = {
    init() {
        const savedTheme = Store.getTheme();
        document.body.setAttribute('data-theme', savedTheme);
        
        document.getElementById('theme-toggle').addEventListener('click', 
            () => this.toggleTheme()
        );
    },
    
    toggleTheme() {
        const current = document.body.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        
        document.body.setAttribute('data-theme', next);
        Store.saveTheme(next);
    }
};
```

**CSS Variable System:**

Dark theme (default):
```css
:root {
    --bg-gradient-start: #0a0b0d;
    --text-primary: #ffffff;
    --accent-todo: #818cf8;
    --accent-planner: #34d399;
    --accent-goals: #fbbf24;
    --accent-pomodoro: #f87171;
    --accent-quotes: #22d3ee;
    --accent-weather: #60a5fa;
}
```

Light theme (activated via `body[data-theme="light"]`):
```css
body[data-theme="light"] {
    --bg-gradient-start: #f8fafc;
    --text-primary: #0f172a;
    --accent-todo-alpha: rgba(129, 140, 248, 0.12);
    /* All colors transition smoothly */
}
```

### **3. Todo Module (Task Manager)**

Full CRUD operations with completion tracking and importance flagging:

```javascript
const TodoModule = {
    state: [],
    
    init() {
        this.state = Store.getTodos();
        
        document.getElementById('todo-add-btn').addEventListener('click', () => {
            const text = document.getElementById('todo-input').value.trim();
            if (text) this.addTask(text);
        });
        
        // Event delegation on todo-list parent
        document.getElementById('todo-list').addEventListener('click', (event) => {
            const todoItem = event.target.closest('.todo-item');
            if (!todoItem) return;
            
            const id = Number(todoItem.getAttribute('data-id'));
            
            if (event.target.closest('.todo-checkbox')) {
                this.toggleTask(id, 'completed');
            } else if (event.target.closest('.star-btn')) {
                this.toggleTask(id, 'important');
            } else if (event.target.closest('.trash-btn')) {
                this.deleteTask(id);
            }
        });
        
        this.render();
    },
    
    addTask(text) {
        const newTask = {
            id: Date.now(),
            text: text,
            completed: false,
            important: false
        };
        this.state.push(newTask);
        this.saveToStorage();
        this.render();
    },
    
    render() {
        const todoList = document.getElementById('todo-list');
        todoList.innerHTML = this.state.map(task => `
            <li class="todo-item ${task.completed ? 'completed' : ''} 
                ${task.important ? 'important' : ''}" data-id="${task.id}">
                <div class="todo-left">
                    <div class="todo-checkbox">
                        ${task.completed ? '<i class="ri-check-line"></i>' : ''}
                    </div>
                    <span class="todo-text">${this.escapeHTML(task.text)}</span>
                </div>
                <div class="todo-actions">
                    <button class="action-btn-mini star-btn 
                        ${task.important ? 'active' : ''}">
                        <i class="ri-star-fill"></i>
                    </button>
                    <button class="action-btn-mini trash-btn">
                        <i class="ri-delete-bin-line"></i>
                    </button>
                </div>
            </li>
        `).join('');
    }
};
```

**Task States:**
```
Task Item DOM Structure:
├── .todo-item (completed, important classes)
│   ├── .todo-left
│   │   ├── .todo-checkbox (contains checkmark when completed)
│   │   └── .todo-text
│   └── .todo-actions
│       ├── .star-btn (toggles importance)
│       └── .trash-btn (deletes task)
```

### **4. Daily Planner (Hourly Schedule)**

Nine-slot hourly planner with current hour highlighting and real-time updates:

```javascript
const PlannerModule = {
    init() {
        const inputs = document.querySelectorAll('.planner-input');
        const savedPlans = Store.getPlans();
        
        inputs.forEach(input => {
            const timeId = input.getAttribute('data-slot');
            
            // Load saved content
            if (savedPlans[timeId]) {
                input.value = savedPlans[timeId];
            }
            
            // Save on keystroke (auto-save)
            input.addEventListener('input', (event) => {
                this.saveSlot(timeId, event.target.value);
            });
        });
        
        // Highlight current hour slot
        this.highlightCurrentHour();
    },
    
    highlightCurrentHour() {
        const currentHour = new Date().getHours();
        const currentHourStr = String(currentHour).padStart(2, '0');
        
        const activeSlot = document.querySelector(
            `.planner-slot[data-hour="${currentHourStr}"]`
        );
        if (activeSlot) {
            activeSlot.classList.add('current-hour');
        }
    },
    
    saveSlot(timeId, text) {
        const plans = Store.getPlans();
        plans[timeId] = text;
        Store.savePlans(plans);
    }
};
```

**Time Slots (9 AM - 5 PM):**
```
09:00 → Morning standup, emails
10:00 → Deep work session
11:00 → Code review
12:00 → Lunch break
13:00 → 1:00 PM meetings
14:00 → 2:00 PM coding
15:00 → 3:00 PM documentation
16:00 → 4:00 PM wrap-up
17:00 → 5:00 PM planning
```

### **5. Goals Module (Daily Objectives)**

Pre-seeded default goals with completion tracking and progress visualization:

```javascript
const GoalsModule = {
    state: [],
    
    init() {
        this.state = Store.getGoals();
        
        // Add goal button handler
        document.getElementById('goal-add-btn').addEventListener('click', () => {
            this.addGoal();
        });
        
        // Event delegation on goals-list parent
        document.getElementById('goals-list').addEventListener('click', (event) => {
            const goalItem = event.target.closest('.goal-item');
            if (!goalItem) return;
            
            const goalId = Number(goalItem.getAttribute('data-id'));
            
            if (event.target.closest('.goal-checkbox') || 
                event.target.closest('.goal-label')) {
                this.toggleGoal(goalId);
            } else if (event.target.closest('.trash-btn')) {
                this.deleteGoal(goalId);
            }
        });
        
        this.render();
    },
    
    updateProgress() {
        const total = this.state.length;
        const completed = this.state.filter(g => g.completed).length;
        
        // Update counter text
        document.getElementById('goals-counter').textContent = 
            `${completed} of ${total} completed`;
        
        // Animate progress bar
        const percentage = total > 0 ? (completed / total) * 100 : 0;
        document.getElementById('goals-progress-bar').style.width = 
            `${percentage}%`;
    }
};
```

**Default Goals:**
```
1. Drink 8 glasses of water
2. Complete 2 focus sessions
3. Read for 15 minutes
4. Do some light stretching
5. Plan tomorrow's schedule
```

**Progress Bar Visualization:**
```css
.progress-bar-inner {
    background: linear-gradient(90deg, var(--accent-goals), #fb923c);
    animation: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
```

### **6. Quick Scratchpad (Notes Module)**

Real-time auto-saving textarea with character count and save indicator:

```javascript
const NotesModule = {
    init() {
        const textarea = document.getElementById('scratchpad-textarea');
        const savedNote = Store.getNotes();
        
        textarea.value = savedNote;
        this.updateCharCount(savedNote.length);
        
        textarea.addEventListener('input', (event) => {
            const text = event.target.value;
            this.saveNote(text);
            this.updateCharCount(text.length);
            this.updateHomePreview(text);
            this.showSaveIndicator(true);
        });
    },
    
    saveNote(text) {
        Store.saveNotes(text);
    },
    
    updateCharCount(length) {
        const countEl = document.getElementById('scratchpad-char-count');
        if (countEl) {
            countEl.textContent = `${length} character${length !== 1 ? 's' : ''}`;
        }
    },
    
    showSaveIndicator(isSaving) {
        const indicator = document.getElementById('scratchpad-save-indicator');
        
        if (isSaving) {
            indicator.innerHTML = `<i class="ri-loader-4-line"></i> Saving...`;
            
            // Clear indicator after 800ms
            if (this.saveTimeout) clearTimeout(this.saveTimeout);
            this.saveTimeout = setTimeout(() => {
                indicator.innerHTML = `<i class="ri-checkbox-circle-line"></i> Saved locally`;
            }, 800);
        }
    }
};
```

**Features:**
- Real-time character counting
- Visual save indicator (loading → saved)
- Preview snippet on dashboard card (45 chars truncated)
- Debounced persistence

### **7. Pomodoro Timer (Focus Sessions)**

SVG-based circular progress ring with 25-min focus / 5-min break sessions:

```javascript
const PomodoroModule = {
    timerId: null,
    timeLeft: 1500,  // 25 minutes in seconds
    currentType: 'focus',  // 'focus' or 'break'
    
    init() {
        document.getElementById('timer-start').addEventListener('click', 
            () => this.start()
        );
        document.getElementById('timer-pause').addEventListener('click', 
            () => this.pause()
        );
        document.getElementById('timer-reset').addEventListener('click', 
            () => this.reset()
        );
        
        // Config buttons for mode switching
        document.querySelector('.timer-config').addEventListener('click', (event) => {
            const btn = event.target.closest('.config-btn');
            if (!btn) return;
            
            document.querySelectorAll('.config-btn').forEach(c => 
                c.classList.remove('active')
            );
            btn.classList.add('active');
            this.currentType = btn.getAttribute('data-type');
            this.reset();
        });
        
        this.updateDisplay();
    },
    
    start() {
        clearInterval(this.timerId);
        
        this.timerId = setInterval(() => {
            this.timeLeft--;
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timerId);
                this.timerId = null;
                
                // Switch modes
                alert(this.currentType === 'focus' ? 
                    'Focus session completed! Time for a break.' : 
                    'Break completed! Time to focus.'
                );
                this.currentType = this.currentType === 'focus' ? 'break' : 'focus';
                this.reset();
            } else {
                this.updateDisplay();
            }
        }, 1000);
        
        this.updateButtonStates();
    },
    
    pause() {
        clearInterval(this.timerId);
        this.timerId = null;
        this.updateButtonStates();
    },
    
    reset() {
        clearInterval(this.timerId);
        this.timerId = null;
        
        // Reset to default duration based on mode
        this.timeLeft = this.currentType === 'focus' ? 1500 : 300;
        this.updateDisplay();
        this.updateButtonStates();
    },
    
    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        
        document.getElementById('timer-countdown').textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        // Update SVG progress ring
        const ring = document.getElementById('timer-progress-ring');
        const totalDuration = this.currentType === 'focus' ? 1500 : 300;
        const strokeDasharray = 722;
        const offset = strokeDasharray - ((this.timeLeft / totalDuration) * strokeDasharray);
        ring.style.strokeDashoffset = offset;
    }
};
```

**SVG Progress Ring:**
```html
<svg class="progress-ring" width="260" height="260">
    <!-- Background circle -->
    <circle class="progress-ring__circle-bg" 
            stroke="var(--border-color)" 
            stroke-width="8" 
            fill="transparent" 
            r="115" cx="130" cy="130" />
    
    <!-- Progress circle (animated via strokeDashoffset) -->
    <circle id="timer-progress-ring" 
            class="progress-ring__circle" 
            stroke="var(--accent-pomodoro)" 
            stroke-width="8" 
            fill="transparent" 
            r="115" cx="130" cy="130" />
</svg>
```

**Timer States:**
```
Focus Session: 25 minutes (1500 seconds)
    ↓
Break Time: 5 minutes (300 seconds)
    ↓
Auto-switch and alert user
    ↓
Repeat cycle
```

### **8. Quotes Module (Motivation)**

External API integration with error fallback and loader states:

```javascript
const QuoteModule = {
    apiUrl: "https://dummyjson.com/quotes/random",
    
    init() {
        document.getElementById('new-quote-btn').addEventListener('click', 
            () => this.fetchQuote()
        );
        this.fetchQuote();  // Load initial quote
    },
    
    async fetchQuote() {
        this.showLoader(true);
        
        try {
            // Fetch from external API with 8-second timeout
            const data = await ApiClient.request(this.apiUrl);
            this.renderQuote(data.quote, data.author);
        } catch (error) {
            console.error("Failed to fetch quote:", error);
            
            // Fallback to default quote
            this.renderQuote(
                "The only way to do great work is to love what you do.",
                "Steve Jobs"
            );
        } finally {
            this.showLoader(false);
        }
    },
    
    renderQuote(text, author) {
        document.getElementById('quote-text').textContent = text;
        document.getElementById('quote-author').textContent = 
            author ? `— ${author}` : "— Unknown";
    },
    
    showLoader(isVisible) {
        const loader = document.getElementById('quote-loader');
        if (isVisible) {
            loader.classList.remove('hidden');
        } else {
            loader.classList.add('hidden');
        }
    }
};
```

**API Response Format:**
```json
{
    "id": 1,
    "quote": "The only way to do great work is to love what you do.",
    "author": "Steve Jobs"
}
```

### **9. Weather Module (Live Conditions)**

Geolocation-based weather with WMO weather code mapping and fallback:

```javascript
const WeatherModule = {
    init() {
        document.getElementById('weather-refresh-btn').addEventListener('click', 
            () => this.getLocation()
        );
        this.getLocation();  // Initial load
    },
    
    getLocation() {
        this.showLoader(true);
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    this.fetchWeather(lat, lon);
                },
                (error) => {
                    console.warn("Location denied, using Mumbai fallback");
                    this.fetchWeather(19.0760, 72.8777);  // Mumbai coords
                }
            );
        } else {
            this.fetchWeather(19.0760, 72.8777);  // Fallback to Mumbai
        }
    },
    
    async fetchWeather(lat, lon) {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m`;
        
        try {
            const data = await ApiClient.request(url);
            this.renderWeather(data.current);
        } catch (error) {
            console.error("Failed to fetch weather:", error);
            // Show error state with warning icons
        } finally {
            this.showLoader(false);
        }
    },
    
    renderWeather(current) {
        // Update all weather metrics
        document.getElementById('weather-temp').textContent = 
            Math.round(current.temperature_2m);
        document.getElementById('weather-feels-like').textContent = 
            `${Math.round(current.apparent_temperature)} °C`;
        document.getElementById('weather-wind').textContent = 
            `${current.wind_speed_10m} km/h`;
        document.getElementById('weather-humidity').textContent = 
            `${current.relative_humidity_2m} %`;
        
        // Map WMO code to weather description and icon
        const details = this.getWMOWeatherDetails(current.weather_code);
        document.getElementById('weather-condition').textContent = details.text;
        document.getElementById('weather-icon').className = details.icon;
    },
    
    getWMOWeatherDetails(code) {
        const mapping = {
            0: { text: "Clear Sky", icon: "ri-sun-line" },
            1: { text: "Mainly Clear", icon: "ri-cloud-sun-line" },
            2: { text: "Partly Cloudy", icon: "ri-cloud-sun-line" },
            3: { text: "Overcast", icon: "ri-cloudy-line" },
            45: { text: "Foggy", icon: "ri-mist-line" },
            61: { text: "Slight Rain", icon: "ri-rainy-line" },
            95: { text: "Thunderstorm", icon: "ri-thunderstorm-line" }
            // ... more codes
        };
        return mapping[code] || { text: "Unknown", icon: "ri-cloud-line" };
    }
};
```

**WMO Weather Codes:**
```
0 → Clear Sky (sunny)
1-2 → Partly Cloudy
3 → Overcast
45, 48 → Foggy
51-55 → Drizzle
61-65 → Rain
71-75 → Snowfall
80-82 → Showers
95-99 → Thunderstorm
```

---

## 🛠️ Technical Implementation

### **API Client with Timeout Handling**

Wrapper function for fetch with automatic abort after specified duration:

```javascript
const ApiClient = {
    async request(url, options = {}, timeoutMs = 8000) {
        // Create AbortController for timeout mechanism
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeoutMs);
        
        try {
            const response = await fetch(url, { 
                ...options, 
                signal: controller.signal 
            });
            clearTimeout(id);
            
            if (!response.ok) {
                throw new Error(`HTTP Error Status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            clearTimeout(id);
            throw error;  // Re-throw for caller to handle
        }
    }
};
```

**Usage Examples:**
```javascript
// Quotes API (8 second timeout)
const data = await ApiClient.request('https://dummyjson.com/quotes/random');

// Weather API (8 second timeout)
const weather = await ApiClient.request(
    'https://api.open-meteo.com/v1/forecast?...'
);

// Custom timeout
const customData = await ApiClient.request(url, {}, 5000);  // 5 seconds
```

### **HTML Escaping for XSS Prevention**

Sanitize user input to prevent HTML injection attacks:

```javascript
escapeHTML(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Example:
const userInput = '<img src=x onerror="alert(1)">';
const safe = escapeHTML(userInput);
// Result: &lt;img src=x onerror=&quot;alert(1)&quot;&gt;
```

### **Date & Time Formatting**

```javascript
const DateTimeModule = {
    updateClock() {
        const now = new Date();
        
        // Format time as HH:MM:SS
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        document.getElementById('live-time').textContent = 
            `${hours}:${minutes}:${seconds}`;
        
        // Format date as "Thursday, July 9, 2026"
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        document.getElementById('live-date').textContent = 
            now.toLocaleDateString('en-US', options);
    }
};
```

### **Background Gradient by Time of Day**

Dynamic background CSS classes based on current hour:

```javascript
const BackgroundModule = {
    updateBackground() {
        const hour = new Date().getHours();
        
        document.body.classList.remove('bg-morning', 'bg-afternoon', 'bg-evening', 'bg-night');
        
        if (hour >= 5 && hour < 11) {
            document.body.classList.add('bg-morning');
        } else if (hour >= 11 && hour < 17) {
            document.body.classList.add('bg-afternoon');
        } else if (hour >= 17 && hour < 21) {
            document.body.classList.add('bg-evening');
        } else {
            document.body.classList.add('bg-night');
        }
    }
};
```

---

## 🎨 Design System

### **Glassmorphism UI**

Modern glassmorphic design combining transparency, backdrop blur, and subtle borders:

```css
.app-container {
    background: var(--panel-bg);  /* Translucent background */
    border: 1px solid var(--panel-border);  /* Subtle border */
    backdrop-filter: blur(12px) saturate(140%);  /* Blur effect */
    -webkit-backdrop-filter: blur(12px) saturate(140%);  /* Safari support */
    box-shadow: 0 4px 24px var(--panel-shadow);  /* Soft shadow */
}
```

**Layering Strategy:**
```
Layer 1: Ambient glows (blurred gradient circles)
    ↓
Layer 2: Background image/gradient
    ↓
Layer 3: Glass panels (semi-transparent with backdrop blur)
    ↓
Layer 4: Interactive elements (buttons, inputs)
```

### **Color System (CSS Variables)**

12 core color variables supporting theming:

```css
/* Structural Colors */
--bg-gradient-start: #0a0b0d (dark) / #f8fafc (light)
--text-primary: #ffffff (dark) / #0f172a (light)
--text-secondary: #888e96 (dark) / #5e6b7c (light)
--border-color: rgba(255,255,255,0.06) (dark) / rgba(0,0,0,0.06) (light)

/* Module Accent Colors */
--accent-todo: #818cf8 (Indigo)
--accent-planner: #34d399 (Emerald)
--accent-goals: #fbbf24 (Amber)
--accent-pomodoro: #f87171 (Rose)
--accent-quotes: #22d3ee (Cyan)
--accent-weather: #60a5fa (Blue)
```

### **Typography Scale**

```css
--font-heading: 'Outfit', 'Inter', system-ui, sans-serif
--font-body: 'Inter', system-ui, sans-serif

/* Sizes */
h1: 1.5rem (24px) - Brand logo
h2: 1.35rem (21px) - Feature titles
h3: 1.15rem (18px) - Card titles
body: 0.9rem (14px) - Default text
small: 0.78rem (12px) - Metadata
```

### **Spacing Scale**

```css
Gap / Padding / Margin
0.25rem (4px) - Tight
0.5rem (8px) - Compact
0.75rem (12px) - Standard
1rem (16px) - Comfortable
1.25rem (20px) - Spacious
1.5rem (24px) - Large
1.75rem (28px) - Extra large
2rem (32px) - Huge
```

### **Border Radius Scale**

```css
--radius-sm: 8px   - Input fields, small buttons
--radius-md: 10px  - Cards, medium containers
--radius-lg: 12px  - Main container
50%                - Circle buttons (checkboxes, goals)
```

---

## 📊 Learning Outcomes

After exploring this project, you'll understand:

1. ✅ **Modular JavaScript Architecture** - Organizing code into self-contained, reusable modules
2. ✅ **Event Delegation Pattern** - Efficient event handling with single listeners on parent elements
3. ✅ **State Management** - Centralized state with EventBus for cross-module communication
4. ✅ **LocalStorage Persistence** - Saving and restoring application state
5. ✅ **Single Page Application (SPA)** - Client-side routing with hash-based URLs
6. ✅ **Async/Await Patterns** - API integration with error handling and timeouts
7. ✅ **CSS Variables & Theming** - Dynamic theme switching with CSS custom properties
8. ✅ **Glassmorphism Design** - Backdrop blur, transparency, and modern UI trends
9. ✅ **API Integration** - External services (Open-Meteo, DummyJSON) with fallbacks
10. ✅ **Accessibility** - ARIA labels, semantic HTML, keyboard navigation
11. ✅ **SVG Progress Rings** - Circular progress visualization with strokeDashoffset
12. ✅ **Geolocation API** - Browser location detection with fallbacks

---

## 🚀 How to Use

1. **Open `index.html`** in your browser or visit the live deployment link
2. **Explore Dashboard** - See all 6 feature cards on the main page
3. **Navigate Features** - Click any card to view that feature in detail
4. **Test Each Module:**
   - **Todo:** Add tasks, mark complete, flag important
   - **Planner:** Enter activities for each hour (auto-saves)
   - **Goals:** Check off daily objectives, see progress bar
   - **Notes:** Type freely, character count auto-updates
   - **Timer:** Start/pause/reset Pomodoro sessions
   - **Quote:** Click to fetch new inspiration quotes
   - **Weather:** View live weather for your location
5. **Toggle Theme** - Click sun/moon button in header (persists across sessions)
6. **Refresh Page** - All data persists in localStorage

---

## 📝 File Structure

```
Assignment9/
├── index.html      # Semantic HTML with 8 feature sections
├── style.css       # CSS variables, glassmorphism, theming
├── script.js       # 11 modules (400+ lines of well-organized code)
└── README.md       # This comprehensive guide
```

---

## 🔗 External Resources & APIs

- **Weather Data:** [Open-Meteo Free API](https://open-meteo.com/) - No API key required
- **Quotes:** [DummyJSON Quotes API](https://dummyjson.com/quotes) - Random inspirational quotes
- **Icons:** [Remix Icon CDN](https://remixicon.com/) - 3000+ SVG icons
- **Fonts:** [Google Fonts](https://fonts.google.com/) - Outfit (headings) & Inter (body)

---

## 💡 Key Architectural Patterns

| Pattern | Purpose | Location |
|---------|---------|----------|
| **Module Pattern** | Encapsulate state & methods | TodoModule, GoalsModule, etc. |
| **Event Delegation** | Efficient event handling | All `.addEventListener('click', ...)` |
| **Observer Pattern** | Loose coupling via EventBus | Store.emit('event', data) |
| **Pub/Sub** | Cross-module communication | EventBus.on/off/emit |
| **Singleton** | Single instance per module | All module objects |
| **Factory Pattern** | Create DOM elements | `.render()` methods |
| **Dependency Injection** | Pass Store to modules | Store.getTodos(), etc. |

---

## 🎯 Advanced Implementation Details

### **Why Event Delegation Works:**

```
HTML Hierarchy:
#todo-list (parent with single listener)
├── li.todo-item (no individual listener)
│   ├── .todo-checkbox
│   ├── .star-btn
│   └── .trash-btn

When user clicks .trash-btn:
1. Event fires on .trash-btn
2. Bubbles up through li.todo-item
3. Reaches #todo-list
4. Handler executes:
   - event.target = .trash-btn
   - event.target.closest('.todo-item') finds parent li
   - Delete logic executes
5. Works for ALL dynamically added items
```

### **LocalStorage Schema Persistence:**

```javascript
// Before:
{
    focusflow-todos: '[]',
    focusflow-goals: '[{id: 1, text: "...", completed: false}]',
    focusflow-plans: '{"09": "standup", "14": "code review"}',
    focusflow-notes: 'Long text of notes...',
    focusflow-theme: 'dark'
}

// After:
// Same structure persists across browser sessions
// EventBus triggers listeners whenever any data changes
```

### **Performance Optimizations:**

1. **Event Delegation** - Reduces DOM listeners from 100+ to ~10
2. **CSS Transforms** - Uses `translateX()` instead of `left` (GPU accelerated)
3. **Debounced Saves** - Notes save indicator waits 800ms before clearing
4. **API Timeouts** - 8-second limit prevents hanging requests
5. **CSS Variables** - Theme switch doesn't require DOM re-rendering

---

## 📚 References

- [MDN: Web Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [MDN: Event Delegation](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events#event_delegation)
- [MDN: LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [CSS Tricks: A Complete Guide to CSS Variables](https://css-tricks.com/a-complete-guide-to-custom-properties/)
- [Web.dev: Glassmorphism](https://web.dev/articles/backdrop-filter)
- [Open-Meteo: Weather API Documentation](https://open-meteo.com/en/docs)

---

**Created:** 2026 | **Assignment:** 9 | **Focus Areas:** Advanced JavaScript Architecture, API Integration & State Management
