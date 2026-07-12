/**
 * 0. GLOBAL ARCHITECTURAL INFRASTRUCTURE
 * Centralized Store, EventBus mediator, and API fetch client.
 */
const EventBus = {
    listeners: {},
    on(event, cb) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(cb);
    },
    off(event, cb) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(fn => fn !== cb);
    },
    emit(event, data) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(cb => cb(data));
    }
};

const Store = {
    getTodos() {
        return JSON.parse(localStorage.getItem('focusflow-todos')) || [];
    },
    saveTodos(todos) {
        localStorage.setItem('focusflow-todos', JSON.stringify(todos));
        EventBus.emit('todos:updated', todos);
    },
    getGoals() {
        const defaultGoals = [
            { id: 1, text: "Drink 8 glasses of water", completed: false },
            { id: 2, text: "Complete 2 focus sessions", completed: false },
            { id: 3, text: "Read for 15 minutes", completed: false },
            { id: 4, text: "Do some light stretching", completed: false },
            { id: 5, text: "Plan tomorrow's schedule", completed: false }
        ];
        return JSON.parse(localStorage.getItem('focusflow-goals')) || defaultGoals;
    },
    saveGoals(goals) {
        localStorage.setItem('focusflow-goals', JSON.stringify(goals));
        EventBus.emit('goals:updated', goals);
    },
    getPlans() {
        return JSON.parse(localStorage.getItem('focusflow-plans')) || {};
    },
    savePlans(plans) {
        localStorage.setItem('focusflow-plans', JSON.stringify(plans));
        EventBus.emit('plans:updated', plans);
    },
    getNotes() {
        return localStorage.getItem('focusflow-notes') || "";
    },
    saveNotes(notes) {
        localStorage.setItem('focusflow-notes', notes);
        EventBus.emit('notes:updated', notes);
    },
    getTheme() {
        return localStorage.getItem('focusflow-theme') || 'dark';
    },
    saveTheme(theme) {
        localStorage.setItem('focusflow-theme', theme);
        EventBus.emit('theme:updated', theme);
    }
};

const ApiClient = {
    async request(url, options = {}, timeoutMs = 8000) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeoutMs);
        
        try {
            const response = await fetch(url, { ...options, signal: controller.signal });
            clearTimeout(id);
            if (!response.ok) {
                throw new Error(`HTTP Error Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            clearTimeout(id);
            throw error;
        }
    }
};

/**
 * 1. NAVIGATION ENGINE MODULE
 * Manages view switching between the dashboard grid and individual tools.
 */
const NavigationEngine = {
    // Initializes the navigation event listeners for cards and back buttons.
    init() {
        const grid = document.querySelector('.dashboard-grid');
        
        // Event delegation: Listen for clicks inside the card grid and navigate if a card was clicked.
        if (grid) {
            grid.addEventListener('click', (event) => {
                const card = event.target.closest('.dashboard-card');
                if (card) {
                    const targetViewId = card.getAttribute('data-target');
                    // Set window location hash to the name of the tool (e.g. #todo)
                    window.location.hash = targetViewId.replace('-view', '');
                }
            });
        }

        // Select all back buttons and link them to return back to the main dashboard.
        const backButtons = document.querySelectorAll('.back-btn');
        backButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                window.location.hash = 'dashboard';
            });
        });

        // Set up hash change routing listener
        window.addEventListener('hashchange', () => this.handleHashChange());

        // Perform initial routing on load
        this.handleHashChange();
    },

    // Extracts the view ID from window hash and routes view state
    handleHashChange() {
        const hash = window.location.hash || '#dashboard';
        const viewId = hash === '#dashboard' ? 'dashboard-view' : `${hash.replace('#', '')}-view`;
        this.switchView(viewId);
    },

    // Swaps active CSS classes on feature view sections to display the requested view.
    switchView(viewId) {
        const views = document.querySelectorAll('.feature-view');
        
        // Loop through all views, removing the active class to hide them.
        views.forEach(view => {
            view.classList.remove('active');
        });

        // Add the active class to the targeted view, triggering CSS display and opacity transitions.
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.classList.add('active');
            
            // Scroll to the top of the app container smoothly when views transition.
            const container = document.querySelector('.app-container');
            if (container) {
                container.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
};

/**
 * 2. THEME SWITCH MODULE
 * Manages light and dark theme preferences, attribute swapping, and local storage persistence.
 */
const ThemeModule = {
    // Reads initial theme state from Local Storage or defaults to dark mode.
    init() {
        const toggleBtn = document.getElementById('theme-toggle');
        
        // Retrieve stored theme, falling back to 'dark' if none exists.
        const savedTheme = Store.getTheme();
        
        // Apply the theme to the body tag immediately.
        document.body.setAttribute('data-theme', savedTheme);

        // Bind the toggle button click to trigger theme swap.
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    },

    // Swaps theme attributes on the body and saves the new preference to Local Storage.
    toggleTheme() {
        const currentTheme = document.body.getAttribute('data-theme');
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Set new theme attribute on body to trigger CSS variables transition.
        document.body.setAttribute('data-theme', nextTheme);
        
        // Persist theme choice inside browser localStorage.
        Store.saveTheme(nextTheme);
    }
};

/**
 * 3. DATE & TIME MODULE
 * Displays live, ticking time and date in the header, preventing load-flickers.
 */
const DateTimeModule = {
    // Begins the live clock interval and executes an immediate update to prevent blank frames.
    init() {
        // Run update immediately so date/time text loads instantly rather than waiting 1 second.
        this.updateClock();
        
        // Setup clock interval to trigger every 1000ms (1 second).
        setInterval(() => {
            this.updateClock();
        }, 1000);
    },

    // Pulls the current date/time, formats them elegantly, and injects them into the DOM.
    updateClock() {
        const timeElement = document.getElementById('live-time');
        const dateElement = document.getElementById('live-date');
        
        if (!timeElement || !dateElement) return;

        const now = new Date();

        // Format time as HH:MM:SS with leading zeroes.
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}:${seconds}`;

        // Format date dynamically: DayOfWeek, Month Day, Year.
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('en-US', options);
    }
};

/* ==========================================================================
   STUBS FOR INCOMING DATA MODULES (Steps 3 & 4)
   ========================================================================== */

/**
 * 4. DYNAMIC BACKGROUND MODULE
 * Automatically updates body gradient themes matching standard time periods.
 */
const BackgroundModule = {
    // Begins the background evaluation checks and updates the gradient class.
    init() {
        // Evaluate and update background class immediately on load.
        this.updateBackground();
        
        // Setup clock interval to trigger every 5 minutes (300000ms).
        setInterval(() => {
            this.updateBackground();
        }, 300000);
    },

    // Checks current hour and sets gradient overriding classes on the body tag.
    updateBackground() {
        const hour = new Date().getHours();
        
        // Clear all previous backgrounds before adding the current state.
        document.body.classList.remove('bg-morning', 'bg-afternoon', 'bg-evening', 'bg-night');

        // Apply background gradient variables class matching the hour ranges.
        if (hour >= 5 && hour < 11) {
            document.body.classList.add('bg-morning'); // 5 AM - 11 AM Morning
        } else if (hour >= 11 && hour < 17) {
            document.body.classList.add('bg-afternoon'); // 11 AM - 5 PM Afternoon
        } else if (hour >= 17 && hour < 21) {
            document.body.classList.add('bg-evening'); // 5 PM - 9 PM Evening
        } else {
            document.body.classList.add('bg-night'); // 9 PM - 5 AM Night
        }
    }
};

const TodoModule = {
    // Array storing task objects: { id: number, text: string, completed: boolean, important: boolean }
    state: [],

    // Initializes UI elements, reads stored tasks, and wires event listeners.
    init() {
        const addBtn = document.getElementById('todo-add-btn');
        const inputField = document.getElementById('todo-input');
        const todoList = document.getElementById('todo-list');

        // Load tasks from Local Storage store wrapper.
        this.state = Store.getTodos();

        // Add task button click handler.
        if (addBtn && inputField) {
            addBtn.addEventListener('click', () => {
                const text = inputField.value.trim();
                if (text) {
                    this.addTask(text);
                    inputField.value = '';
                }
            });

            // Enter key press handler on the text input.
            inputField.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    const text = inputField.value.trim();
                    if (text) {
                        this.addTask(text);
                        inputField.value = '';
                    }
                }
            });
        }

        // Event delegation: Attaches click listener to task list parent container.
        if (todoList) {
            todoList.addEventListener('click', (event) => {
                const target = event.target;
                const todoItem = target.closest('.todo-item');
                if (!todoItem) return;

                const taskId = Number(todoItem.getAttribute('data-id'));

                // Handle complete checkbox toggle.
                if (target.closest('.todo-checkbox')) {
                    this.toggleTask(taskId, 'completed');
                }
                // Handle importance star toggle.
                else if (target.closest('.star-btn')) {
                    this.toggleTask(taskId, 'important');
                }
                // Handle delete button action.
                else if (target.closest('.trash-btn')) {
                    this.deleteTask(taskId);
                }
            });
        }

        // Perform initial list rendering.
        this.render();
        this.updateHomePreview();
    },

    // Renders the list items into the DOM, checking states to apply correct styling classes.
    render() {
        const todoList = document.getElementById('todo-list');
        if (!todoList) return;

        todoList.innerHTML = this.state.map(task => `
            <li class="todo-item ${task.completed ? 'completed' : ''} ${task.important ? 'important' : ''}" data-id="${task.id}">
                <div class="todo-left">
                    <div class="todo-checkbox">
                        ${task.completed ? '<i class="ri-check-line"></i>' : ''}
                    </div>
                    <span class="todo-text">${this.escapeHTML(task.text)}</span>
                </div>
                <div class="todo-actions">
                    <button class="action-btn-mini star-btn ${task.important ? 'active' : ''}" aria-label="Mark Important">
                        <i class="ri-star-fill"></i>
                    </button>
                    <button class="action-btn-mini trash-btn" aria-label="Delete Task">
                        <i class="ri-delete-bin-line"></i>
                    </button>
                </div>
            </li>
        `).join('');
    },

    // Appends a new task object to the state and synchronizes state with Local Storage.
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
        this.updateHomePreview();
    },

    // Swaps boolean states (completed or important) on a target task item.
    toggleTask(id, key) {
        const task = this.state.find(t => t.id === id);
        if (task) {
            task[key] = !task[key];
            this.saveToStorage();
            this.render();
            this.updateHomePreview();
        }
    },

    // Removes a specific task item from the state array and updates storage.
    deleteTask(id) {
        this.state = this.state.filter(t => t.id !== id);
        this.saveToStorage();
        this.render();
        this.updateHomePreview();
    },

    // Synchronizes the local tasks state array to the browser's Local Storage.
    saveToStorage() {
        Store.saveTodos(this.state);
    },

    // Counts uncompleted tasks and updates the dashboard preview with highest-indexed uncompleted task.
    updateHomePreview() {
        const uncompletedTasks = this.state.filter(task => !task.completed);
        const count = uncompletedTasks.length;
        const previewEl = document.getElementById('todo-home-preview');
        if (previewEl) {
            if (count > 0) {
                const highestTask = uncompletedTasks[uncompletedTasks.length - 1];
                previewEl.innerHTML = `<span class="telemetry-highlight">Focus: ${this.escapeHTML(highestTask.text)}</span> <span class="telemetry-badge">${count} left</span>`;
            } else {
                previewEl.textContent = "No active tasks";
            }
        }
    },

    // Escapes special characters in text strings to prevent HTML injection.
    escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
};

const PlannerModule = {
    // Reads slot values from Local Storage and binds input changes dynamically.
    init() {
        const inputs = document.querySelectorAll('.planner-input');
        
        // Load plan content mapping object from Local Storage wrapper.
        const savedPlans = Store.getPlans();

        // Loop through all predefined DOM slots and populate values.
        inputs.forEach(input => {
            const timeId = input.getAttribute('data-slot');
            
            // Set content if it exists in Local Storage.
            if (savedPlans[timeId]) {
                input.value = savedPlans[timeId];
            }

            // Bind input event to save values dynamically on keystroke.
            input.addEventListener('input', (event) => {
                this.saveSlot(timeId, event.target.value);
            });

            // Bind Enter key to submit/blur input fields (Step 22)
            input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    input.blur();
                }
            });
        });

        // Set up individual slot clear button event delegation (Step 25)
        const grid = document.getElementById('planner-grid');
        if (grid) {
            grid.addEventListener('click', (event) => {
                const clearBtn = event.target.closest('.planner-clear-btn');
                if (clearBtn) {
                    const timeId = clearBtn.getAttribute('data-clear');
                    this.clearSlot(timeId);
                }
            });
        }

        // Set up global clear day button click listener (Step 25)
        const clearAllBtn = document.getElementById('planner-clear-all-btn');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => {
                if (confirm("Are you sure you want to clear the entire daily schedule?")) {
                    this.clearAllSlots();
                }
            });
        }

        // Highlight the current time slot using the Date Object.
        this.highlightCurrentHour();

        // Perform initial list rendering of the home preview card widget.
        this.updateHomePreview();
    },

    // Identifies slot corresponding to current hour and adds a highlight border.
    highlightCurrentHour() {
        const currentHour = new Date().getHours();
        const currentHourStr = String(currentHour).padStart(2, '0');
        
        // Find the slot element with matching data-hour.
        const activeSlot = document.querySelector(`.planner-slot[data-hour="${currentHourStr}"]`);
        if (activeSlot) {
            activeSlot.classList.add('current-hour');
        }
    },

    // Saves slot details to Local Storage under a specific key, executing immediately on change.
    saveSlot(timeId, text) {
        const savedPlans = Store.getPlans();
        
        // Write the text to the key matching the input's timeId.
        savedPlans[timeId] = text;
        
        // Write entire map back to Local Storage wrapper.
        Store.savePlans(savedPlans);

        // Update home preview card widget.
        this.updateHomePreview();
    },

    // Clears a single time slot (Step 25)
    clearSlot(timeId) {
        const input = document.querySelector(`.planner-input[data-slot="${timeId}"]`);
        if (input) {
            input.value = "";
        }
        this.saveSlot(timeId, "");
    },

    // Clears the entire daily schedule (Step 25)
    clearAllSlots() {
        const inputs = document.querySelectorAll('.planner-input');
        inputs.forEach(input => {
            input.value = "";
        });
        Store.savePlans({});
        this.updateHomePreview();
    },

    // Dynamically updates the home page preview widget showing current or upcoming activities.
    updateHomePreview() {
        const previewEl = document.getElementById('planner-home-preview');
        if (!previewEl) return;

        const savedPlans = Store.getPlans();
        const currentHour = new Date().getHours();
        
        let foundPlan = null;
        let foundHour = null;

        // Loop forward starting from the current hour to find active or upcoming events
        for (let h = currentHour; h <= 21; h++) {
            const hStr = String(h).padStart(2, '0');
            if (savedPlans[hStr] && savedPlans[hStr].trim() !== "") {
                foundPlan = savedPlans[hStr].trim();
                foundHour = h;
                break;
            }
        }

        // Fallback: look for any activity entered elsewhere in the planner (e.g. earlier hours)
        if (!foundPlan) {
            for (let h = 7; h <= 21; h++) {
                const hStr = String(h).padStart(2, '0');
                if (savedPlans[hStr] && savedPlans[hStr].trim() !== "") {
                    foundPlan = savedPlans[hStr].trim();
                    foundHour = h;
                    break;
                }
            }
        }

        if (foundPlan) {
            const truncated = foundPlan.length > 30 ? foundPlan.substring(0, 30) + "..." : foundPlan;
            const escaped = this.escapeHTML(truncated);
            const hourLabel = foundHour === currentHour ? "Active" : `${String(foundHour).padStart(2, '0')}:00`;
            previewEl.innerHTML = `<span class="telemetry-highlight">${hourLabel}: ${escaped}</span>`;
        } else {
            previewEl.textContent = "No upcoming events";
        }
    },

    // Escapes special characters in text strings to prevent HTML injection.
    escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
};

const GoalsModule = {
    // Array storing goal objects: { id: number, text: string, completed: boolean }
    state: [],

    // Bootstraps default daily goals if empty, loads storage, and attaches event handlers.
    init() {
        const addBtn = document.getElementById('goal-add-btn');
        const inputField = document.getElementById('goal-input');
        const goalsList = document.getElementById('goals-list');

        // Fetch stored goals list from Store.
        this.state = Store.getGoals();

        // Add goal button click handler.
        if (addBtn && inputField) {
            addBtn.addEventListener('click', () => {
                this.addGoal();
            });

            // Enter key press handler on the text input.
            inputField.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    this.addGoal();
                }
            });
        }

        // Event delegation: listen for clicks on checkboxes and delete buttons inside goals wrapper.
        if (goalsList) {
            goalsList.addEventListener('click', (event) => {
                const target = event.target;
                const goalItem = target.closest('.goal-item');
                if (!goalItem) return;

                const goalId = Number(goalItem.getAttribute('data-id'));
                
                // Toggle completion status if user clicked the circular checkbox or text.
                if (target.closest('.goal-checkbox') || target.closest('.goal-label')) {
                    this.toggleGoal(goalId);
                }
                // Handle delete button action.
                else if (target.closest('.trash-btn')) {
                    this.deleteGoal(goalId);
                }
            });
        }

        // Perform initial rendering and progress bar updates.
        this.render();
        this.updateHomePreview();
    },

    // Injects the goal elements into the DOM dynamically.
    render() {
        const goalsList = document.getElementById('goals-list');
        if (!goalsList) return;

        goalsList.innerHTML = this.state.map(goal => `
            <li class="goal-item ${goal.completed ? 'completed' : ''}" data-id="${goal.id}">
                <div class="goal-left">
                    <div class="goal-checkbox">
                        ${goal.completed ? '<i class="ri-check-line"></i>' : ''}
                    </div>
                    <span class="goal-label">${this.escapeHTML(goal.text)}</span>
                </div>
                <button class="action-btn-mini trash-btn" aria-label="Delete Goal">
                    <i class="ri-delete-bin-line"></i>
                </button>
            </li>
        `).join('');

        // Recalculate metrics fractions and progress indicators.
        this.updateProgress();
    },

    // Creates a new goal object, appends it to state, and persists updates.
    addGoal() {
        const inputField = document.getElementById('goal-input');
        if (!inputField) return;

        const text = inputField.value.trim();
        if (text) {
            const newGoal = {
                id: Date.now(),
                text: text,
                completed: false
            };
            this.state.push(newGoal);
            this.saveToStorage();
            this.render();
            this.updateHomePreview();
            inputField.value = '';
        }
    },

    // Removes a goal from state and updates Local Storage.
    deleteGoal(id) {
        this.state = this.state.filter(g => g.id !== id);
        this.saveToStorage();
        this.render();
        this.updateHomePreview();
    },

    // Inverts completion status of a target goal item and triggers re-render.
    toggleGoal(id) {
        const goal = this.state.find(g => g.id === id);
        if (goal) {
            goal.completed = !goal.completed;
            this.saveToStorage();
            this.render();
            this.updateHomePreview();
        }
    },

    // Performs math metrics updates and handles progress bar animation width changes.
    updateProgress() {
        const total = this.state.length;
        const completed = this.state.filter(goal => goal.completed).length;

        // Update the fractional display text indicator.
        const counterElement = document.getElementById('goals-counter');
        if (counterElement) {
            counterElement.textContent = `${completed} of ${total} completed`;
        }

        // Animate the progress bar slider width based on dynamic math percentage.
        const progressBar = document.getElementById('goals-progress-bar');
        if (progressBar) {
            const percentage = total > 0 ? (completed / total) * 100 : 0;
            progressBar.style.width = `${percentage}%`;
        }
    },

    // Synchronizes current goals state array to browser's Local Storage.
    saveToStorage() {
        Store.saveGoals(this.state);
    },

    // Updates the dashboard preview representation.
    updateHomePreview() {
        const total = this.state.length;
        const completed = this.state.filter(g => g.completed).length;
        const el = document.getElementById('goals-home-preview');
        if (el) {
            el.innerHTML = `<span class="telemetry-highlight">${completed} of ${total} Completed</span>`;
        }
    },

    // Escapes special characters in text strings to prevent HTML injection.
    escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
};

/**
 * 3. QUICK SCRATCHPAD MODULE
 * Auto-saves and counts characters of temporary notes on the home card and sub-view.
 */
const NotesModule = {
    // Initializes scratchpad, binds textarea events, and updates home view card snippets.
    init() {
        const textarea = document.getElementById('scratchpad-textarea');
        if (!textarea) return;

        // Load saved note from Store.
        const savedNote = Store.getNotes();
        textarea.value = savedNote;

        // Calculate character count and update indicators.
        this.updateCharCount(savedNote.length);

        // Listen to input keystrokes to auto-save and update preview.
        textarea.addEventListener('input', (event) => {
            const text = event.target.value;
            this.saveNote(text);
            this.updateCharCount(text.length);
            this.updateHomePreview(text);
            this.showSaveIndicator(true);
        });

        // Initial home card snippet render.
        this.updateHomePreview(savedNote);
    },

    // Saves scratchpad notes state string back to browser's Local Storage.
    saveNote(text) {
        Store.saveNotes(text);
    },

    // Updates character counts displayed in status label area.
    updateCharCount(length) {
        const countEl = document.getElementById('scratchpad-char-count');
        if (countEl) {
            countEl.textContent = `${length} character${length !== 1 ? 's' : ''}`;
        }
    },

    // Adapts home preview card telemetry snippet.
    updateHomePreview(text) {
        const previewEl = document.getElementById('notes-home-preview');
        if (previewEl) {
            const trimmedText = text.trim();
            if (trimmedText) {
                // Preview snippet of the first 45 characters.
                const truncated = trimmedText.length > 45 ? trimmedText.substring(0, 45) + "..." : trimmedText;
                const escaped = this.escapeHTML(truncated);
                previewEl.innerHTML = `<span class="telemetry-highlight">"${escaped}"</span>`;
            } else {
                previewEl.textContent = "No notes saved";
            }
        }
    },

    // Escapes special characters in text strings to prevent HTML injection.
    escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    },

    // Triggers save status flash indicators.
    showSaveIndicator(isSaving) {
        const indicator = document.getElementById('scratchpad-save-indicator');
        if (!indicator) return;

        if (isSaving) {
            indicator.innerHTML = `<i class="ri-loader-4-line"></i> Saving...`;
            
            // Debounce or clear indicator after 800ms
            if (this.saveTimeout) clearTimeout(this.saveTimeout);
            this.saveTimeout = setTimeout(() => {
                indicator.innerHTML = `<i class="ri-checkbox-circle-line"></i> Saved locally`;
            }, 800);
        }
    }
};

const PomodoroModule = {
    // Stores the active interval ID, remaining countdown seconds, and the current session mode type.
    timerId: null,
    timeLeft: 1500, // 25 minutes default in seconds
    currentType: 'focus', // 'focus' or 'break'

    // Initializes button actions, config listeners, and sets the initial timer display properties.
    init() {
        const startBtn = document.getElementById('timer-start');
        const pauseBtn = document.getElementById('timer-pause');
        const resetBtn = document.getElementById('timer-reset');
        const configContainer = document.querySelector('.timer-config');

        // Bind control buttons to their respective operational methods.
        if (startBtn) startBtn.addEventListener('click', () => this.start());
        if (pauseBtn) pauseBtn.addEventListener('click', () => this.pause());
        if (resetBtn) resetBtn.addEventListener('click', () => this.reset());

        // Bind option buttons to alternate between focus and break session lengths.
        if (configContainer) {
            configContainer.addEventListener('click', (event) => {
                const btn = event.target.closest('.config-btn');
                if (!btn) return;

                // Update active state class styling across the configurations.
                document.querySelectorAll('.config-btn').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');

                // Read selected config type, set properties, and reset timer values.
                this.currentType = btn.getAttribute('data-type');
                this.reset();
            });
        }

        // Initialize progress ring SVG stroke boundaries.
        const ring = document.getElementById('timer-progress-ring');
        if (ring) {
            ring.style.strokeDasharray = '722';
            ring.style.strokeDashoffset = '0';
        }

        // Synchronize displays to render "25:00" defaults immediately.
        this.updateDisplay();
    },

    // Spawns the ticking interval, ensuring active loops are cleared before spawning a new one.
    start() {
        // Prevent speed-tick malfunctions by clearing active threads.
        clearInterval(this.timerId);

        const startBtn = document.getElementById('timer-start');
        const pauseBtn = document.getElementById('timer-pause');

        // Toggle state styles on buttons.
        if (startBtn) {
            startBtn.classList.add('disabled');
            startBtn.disabled = true;
        }
        if (pauseBtn) {
            pauseBtn.classList.remove('disabled');
            pauseBtn.disabled = false;
        }

        // Span a 1-second ticking interval thread.
        this.timerId = setInterval(() => {
            this.timeLeft--;

            // Handle timer completion boundaries.
            if (this.timeLeft <= 0) {
                clearInterval(this.timerId);
                this.timerId = null;
                
                // Alert the user and automatically toggle next session type.
                alert(this.currentType === 'focus' ? 'Focus session completed! Time for a short break.' : 'Break completed! Time to focus.');
                this.currentType = this.currentType === 'focus' ? 'break' : 'focus';
                this.updateConfigActiveButton();
                this.reset();
            } else {
                this.updateDisplay();
            }
        }, 1000);
    },

    // Pauses the timer and updates operational button visibility attributes.
    pause() {
        clearInterval(this.timerId);
        this.timerId = null;

        const startBtn = document.getElementById('timer-start');
        const pauseBtn = document.getElementById('timer-pause');

        // Toggle state styles back to idle/paused settings.
        if (startBtn) {
            startBtn.classList.remove('disabled');
            startBtn.disabled = false;
        }
        if (pauseBtn) {
            pauseBtn.classList.add('disabled');
            pauseBtn.disabled = true;
        }
    },

    // Halts active intervals and recalibrates durations back to default configurations.
    reset() {
        // Clear active running timer loop.
        clearInterval(this.timerId);
        this.timerId = null;

        // Set duration based on current type (25 mins for focus, 5 mins for break).
        this.timeLeft = this.currentType === 'focus' ? 1500 : 300;

        const startBtn = document.getElementById('timer-start');
        const pauseBtn = document.getElementById('timer-pause');

        // Enable start button and disable pause button upon reset.
        if (startBtn) {
            startBtn.classList.remove('disabled');
            startBtn.disabled = false;
        }
        if (pauseBtn) {
            pauseBtn.classList.add('disabled');
            pauseBtn.disabled = true;
        }

        // Render clean timer UI update.
        this.updateDisplay();
    },

    // Calculates minute/second values and adapts the progress ring stroke offset.
    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const minStr = String(minutes).padStart(2, '0');
        const secStr = String(seconds).padStart(2, '0');
        
        const countdown = document.getElementById('timer-countdown');
        if (countdown) {
            countdown.textContent = `${minStr}:${secStr}`;
        }
        
        const statusText = document.getElementById('timer-status-text');
        if (statusText) {
            statusText.textContent = this.currentType === 'focus' ? 'Focus Session' : 'Short Break';
        }
        
        // Dynamically calculate circular stroke offset value based on total duration ratios.
        const ring = document.getElementById('timer-progress-ring');
        if (ring) {
            const totalDuration = this.currentType === 'focus' ? 1500 : 300;
            const strokeDasharray = 722;
            const offset = strokeDasharray - ((this.timeLeft / totalDuration) * strokeDasharray);
            ring.style.strokeDashoffset = offset;
        }

        // Broadcast active countdown clock digits back to main dashboard home card.
        const homeEl = document.getElementById('pomodoro-home-preview');
        if (homeEl) {
            if (this.timerId !== null) {
                const typeLabel = this.currentType === 'focus' ? 'Focusing' : 'Break';
                homeEl.innerHTML = `<span class="telemetry-highlight">${typeLabel}: ${minStr}:${secStr}</span>`;
            } else {
                homeEl.textContent = `Timer Idle - ${minStr}:${secStr}`;
            }
        }

        // Update the master focus CTA button text in real-time
        const heroBtn = document.getElementById('hero-master-cta');
        if (heroBtn) {
            if (this.timerId !== null) {
                heroBtn.innerHTML = `<i class="ri-play-circle-line"></i> Resume Focus Session (${minStr}:${secStr})`;
            } else {
                heroBtn.innerHTML = `<i class="ri-play-circle-line"></i> Start Focus Session`;
            }
        }
        // Trigger dynamic updates of welcome hero banner stats aggregation via EventBus.
        EventBus.emit('timer:tick', {
            timerId: this.timerId,
            timeLeft: this.timeLeft,
            currentType: this.currentType,
            minStr,
            secStr
        });
    },

    // Synchronizes active config styling states when automatically switching modes.
    updateConfigActiveButton() {
        const configButtons = document.querySelectorAll('.config-btn');
        configButtons.forEach(btn => {
            if (btn.getAttribute('data-type') === this.currentType) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
};

const QuoteModule = {
    // API endpoint for fetching a random quote dynamically from the network.
    apiUrl: "https://dummyjson.com/quotes/random",

    // Binds reload event triggers and triggers the initial page load fetch.
    init() {
        const fetchBtn = document.getElementById('new-quote-btn');
        if (fetchBtn) {
            fetchBtn.addEventListener('click', () => this.fetchQuote());
        }

        // Load an initial quote on startup.
        this.fetchQuote();
    },

    // Fetches a random quote from the live API endpoint and handles visual rendering.
    async fetchQuote() {
        this.showLoader(true);

        try {
            // Send a network request to the live random quotes endpoint using ApiClient.
            const data = await ApiClient.request(this.apiUrl);
            
            // Map the parsed JSON properties to the DOM layout display.
            this.renderQuote(data.quote, data.author);
        } catch (error) {
            console.error("Quotes API retrieval failed, loading default fallback:", error);
            
            // Fall back to a classic static quote block to prevent UI breakages.
            this.renderQuote(
                "The only way to do great work is to love what you do.",
                "Steve Jobs"
            );
        } finally {
            this.showLoader(false);
        }
    },

    // Injects the quote text content and author details into the DOM elements.
    renderQuote(text, author) {
        const textElement = document.getElementById('quote-text');
        const authorElement = document.getElementById('quote-author');
        if (textElement) textElement.textContent = text;
        if (authorElement) authorElement.textContent = author ? `— ${author}` : "— Unknown";
        
        // Also push onto home quotes telemetry slot!
        const homeEl = document.getElementById('quotes-home-preview');
        if (homeEl) {
            const previewText = author ? `"${text.substring(0, 45)}..." — ${author}` : `"${text.substring(0, 45)}..."`;
            const escaped = this.escapeHTML(previewText);
            homeEl.innerHTML = `<span class="telemetry-highlight">${escaped}</span>`;
        }
    },

    // Escapes special characters in text strings to prevent HTML injection.
    escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    },

    // Toggles the visibility of the visual loader spinner card block.
    showLoader(isVisible) {
        const loader = document.getElementById('quote-loader');
        if (loader) {
            if (isVisible) {
                loader.classList.remove('hidden');
            } else {
                loader.classList.add('hidden');
            }
        }
    }
};

const WeatherModule = {
    // Sets up refresh triggers and commands browser location calls on startup.
    init() {
        const refreshBtn = document.getElementById('weather-refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.getLocation());
        }

        // Call geolocation sequence on widget load.
        this.getLocation();
    },

    // Requests user coordinates, falling back to Mumbai defaults if blocked.
    getLocation() {
        this.showLoader(true);
        const locationLabel = document.getElementById('weather-location');

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    
                    if (locationLabel) {
                        locationLabel.innerHTML = `<i class="ri-map-pin-line"></i> Local Coordinates (${lat.toFixed(2)}, ${lon.toFixed(2)})`;
                    }
                    this.fetchWeather(lat, lon);
                },
                (error) => {
                    console.warn("Location permission denied/failed. Defaulting to Mumbai.", error);
                    if (locationLabel) {
                        locationLabel.innerHTML = `<i class="ri-map-pin-line"></i> Mumbai, IN (Fallback)`;
                    }
                    // Fetch for Mumbai coordinates as specified.
                    this.fetchWeather(19.0760, 72.8777);
                }
            );
        } else {
            console.warn("Geolocation API not supported. Defaulting to Mumbai.");
            if (locationLabel) {
                locationLabel.innerHTML = `<i class="ri-map-pin-line"></i> Mumbai, IN (Fallback)`;
            }
            this.fetchWeather(19.0760, 72.8777);
        }
    },

    // Retrieves live weather statistics from Open-Meteo REST service endpoints.
    async fetchWeather(lat, lon) {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m`;
        
        try {
            const data = await ApiClient.request(url);
            
            // Validate existence of current measurements object.
            if (data && data.current) {
                this.renderWeather(data.current);
            } else {
                throw new Error("Malformed weather json received");
            }
        } catch (error) {
            console.error("Failed to fetch weather metrics:", error);
            
            // Query DOM nodes to clean up numerical stats and icons during network failures.
            const tempVal = document.getElementById('weather-temp');
            const feelsVal = document.getElementById('weather-feels-like');
            const windVal = document.getElementById('weather-wind');
            const humidityVal = document.getElementById('weather-humidity');
            const precipitationVal = document.getElementById('weather-precipitation');
            const condText = document.getElementById('weather-condition');
            const iconEl = document.getElementById('weather-icon');
            const miniTemp = document.getElementById('weather-mini-temp');
            const miniIcon = document.getElementById('weather-mini-icon');

            // Reset numerical metric readouts to standard fallback indicators.
            if (tempVal) tempVal.textContent = "--";
            if (feelsVal) feelsVal.textContent = "-- °C";
            if (windVal) windVal.textContent = "-- km/h";
            if (humidityVal) humidityVal.textContent = "-- %";
            if (precipitationVal) precipitationVal.textContent = "-- mm";
            if (miniTemp) miniTemp.textContent = "--";
            
            // Inform the user of feed disconnections in the description field.
            if (condText) condText.textContent = "Feed unavailable (Offline)";
            
            // Replace standard icons with warning icons to visually signal connection issues.
            if (iconEl) iconEl.className = "ri-error-warning-line";
            if (miniIcon) miniIcon.className = "ri-error-warning-line";
        } finally {
            this.showLoader(false);
        }
    },

    // Maps results to the DOM widgets and selects appropriate weather icons.
    renderWeather(current) {
        const tempVal = document.getElementById('weather-temp');
        const feelsVal = document.getElementById('weather-feels-like');
        const windVal = document.getElementById('weather-wind');
        const humidityVal = document.getElementById('weather-humidity');
        const precipitationVal = document.getElementById('weather-precipitation');
        const condText = document.getElementById('weather-condition');
        const iconEl = document.getElementById('weather-icon');
        const miniTemp = document.getElementById('weather-mini-temp');
        const miniIcon = document.getElementById('weather-mini-icon');
        const weatherPreview = document.getElementById('weather-home-preview');

        // Apply raw numerical measurements directly into layout spans.
        if (tempVal) tempVal.textContent = Math.round(current.temperature_2m);
        if (feelsVal) feelsVal.textContent = `${Math.round(current.apparent_temperature)} °C`;
        if (windVal) windVal.textContent = `${current.wind_speed_10m} km/h`;
        if (humidityVal) humidityVal.textContent = `${current.relative_humidity_2m} %`;
        if (precipitationVal) precipitationVal.textContent = `${current.precipitation} mm`;
        if (miniTemp) miniTemp.textContent = Math.round(current.temperature_2m);

        // Extract condition definitions and visual icon class labels.
        const details = this.getWMOWeatherDetails(current.weather_code);
        if (condText) condText.textContent = details.text;
        
        if (iconEl) {
            // Remove previous classes and set corresponding Remix icon target.
            iconEl.className = '';
            iconEl.className = details.icon;
        }
        if (miniIcon) {
            // Update dashboard card weather icon.
            miniIcon.className = '';
            miniIcon.className = details.icon;
        }

        // Push a clean condensed text block showing city, temperature, and visual icons onto the home preview
        if (weatherPreview) {
            const locationLabel = document.getElementById('weather-location');
            let locationName = "Local weather";
            if (locationLabel) {
                if (locationLabel.textContent.includes("Mumbai")) {
                    locationName = "Mumbai";
                } else if (locationLabel.textContent.includes("Coordinates")) {
                    locationName = "My Location";
                }
            }
            weatherPreview.innerHTML = `
                <div class="weather-mini-display" style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--font-heading); font-weight: 700; font-size: 1.15rem; margin-top: 0.25rem;">
                    <span>${locationName}: ${Math.round(current.temperature_2m)}°C</span>
                    <i class="${details.icon}" style="color: var(--accent-weather); font-size: 1.25rem;"></i>
                </div>
            `;
        }
    },

    // Maps WMO standard weather codes to corresponding textual phrases and icon keys.
    getWMOWeatherDetails(code) {
        const mapping = {
            0: { text: "Clear Sky", icon: "ri-sun-line" },
            1: { text: "Mainly Clear", icon: "ri-cloud-sun-line" },
            2: { text: "Partly Cloudy", icon: "ri-cloud-sun-line" },
            3: { text: "Overcast", icon: "ri-cloudy-line" },
            45: { text: "Foggy", icon: "ri-mist-line" },
            48: { text: "Depositing Rime Fog", icon: "ri-mist-line" },
            51: { text: "Light Drizzle", icon: "ri-drizzle-line" },
            53: { text: "Moderate Drizzle", icon: "ri-drizzle-line" },
            55: { text: "Dense Drizzle", icon: "ri-drizzle-line" },
            61: { text: "Slight Rain", icon: "ri-rainy-line" },
            63: { text: "Moderate Rain", icon: "ri-rainy-line" },
            65: { text: "Heavy Rain", icon: "ri-rainy-line" },
            71: { text: "Slight Snowfall", icon: "ri-snowy-line" },
            73: { text: "Moderate Snowfall", icon: "ri-snowy-line" },
            75: { text: "Heavy Snowfall", icon: "ri-snowy-line" },
            80: { text: "Slight Rain Showers", icon: "ri-showers-line" },
            81: { text: "Moderate Rain Showers", icon: "ri-showers-line" },
            82: { text: "Violent Rain Showers", icon: "ri-showers-line" },
            95: { text: "Thunderstorm", icon: "ri-thunderstorm-line" },
            96: { text: "Thunderstorm with Hail", icon: "ri-thunderstorm-line" },
            99: { text: "Thunderstorm with Heavy Hail", icon: "ri-thunderstorm-line" }
        };
        return mapping[code] || { text: "Unknown Conditions", icon: "ri-cloud-line" };
    },

    // Toggles visibility spinner attributes of the weather widget container overlay.
    showLoader(isVisible) {
        const loader = document.getElementById('weather-loader');
        if (loader) {
            if (isVisible) {
                loader.classList.remove('hidden');
            } else {
                loader.classList.add('hidden');
            }
        }
    }
};

/* ==========================================================================
   4. CORE ORCHESTRATION LAYER (MAIN INITIATOR)
   ========================================================================== */
const App = {
    // Boots up all separate modules sequentially upon document readiness.
    init() {
        NavigationEngine.init();
        ThemeModule.init();
        BackgroundModule.init();
        DateTimeModule.init();
        TodoModule.init();
        PlannerModule.init();
        GoalsModule.init();
        NotesModule.init();
        PomodoroModule.init();
        QuoteModule.init();
        WeatherModule.init();

        // Subscribe to EventBus updates to update the Hero productivity snapshot dynamically
        EventBus.on('todos:updated', () => this.updateHero());
        EventBus.on('goals:updated', () => this.updateHero());
        EventBus.on('plans:updated', () => this.updateHero());
        EventBus.on('timer:tick', () => this.updateHero());

        // Bind Welcome Hero master CTA button to switch directly to the focus timer via hash change.
        const heroBtn = document.getElementById('hero-master-cta');
        if (heroBtn) {
            heroBtn.addEventListener('click', () => {
                window.location.hash = 'pomodoro';
            });
        }

        // Initialize aggregator readout elements on bootstrap.
        this.updateHero();
        console.log("FocusFlow application successfully booted.");
    },

    // Calculates real-time telemetry metrics and populates the Welcome Hero banner snapshot elements.
    updateHero() {
        // 1. Tasks Left
        let pendingTodos = 0;
        if (typeof TodoModule !== 'undefined' && TodoModule.state) {
            pendingTodos = TodoModule.state.filter(t => !t.completed).length;
        }
        const tasksEl = document.getElementById('hero-tasks');
        if (tasksEl) {
            tasksEl.textContent = pendingTodos;
        }

        // 2. Goals completed fraction
        let completedGoals = 0;
        let totalGoals = 0;
        if (typeof GoalsModule !== 'undefined' && GoalsModule.state) {
            totalGoals = GoalsModule.state.length;
            completedGoals = GoalsModule.state.filter(g => g.completed).length;
        }
        const goalsEl = document.getElementById('hero-goals');
        if (goalsEl) {
            goalsEl.textContent = `${completedGoals} / ${totalGoals}`;
        }

        // 3. Current hour or upcoming planner slot plan
        let plannerText = "No Events";
        const currentHour = new Date().getHours();
        const savedPlans = Store.getPlans();
        
        let foundPlan = null;
        let foundHour = null;

        // Loop forward starting from the current hour to find active or upcoming events
        for (let h = currentHour; h <= 21; h++) {
            const hStr = String(h).padStart(2, '0');
            if (savedPlans[hStr] && savedPlans[hStr].trim() !== "") {
                foundPlan = savedPlans[hStr].trim();
                foundHour = h;
                break;
            }
        }

        // Fallback: look for any activity entered elsewhere in the planner (e.g. earlier hours)
        if (!foundPlan) {
            for (let h = 7; h <= 21; h++) {
                const hStr = String(h).padStart(2, '0');
                if (savedPlans[hStr] && savedPlans[hStr].trim() !== "") {
                    foundPlan = savedPlans[hStr].trim();
                    foundHour = h;
                    break;
                }
            }
        }

        if (foundPlan) {
            const truncated = foundPlan.length > 20 ? foundPlan.substring(0, 20) + "..." : foundPlan;
            const hourLabel = foundHour === currentHour ? "Active" : `${String(foundHour).padStart(2, '0')}:00`;
            plannerText = `${hourLabel}: ${truncated}`;
        }

        const plannerEl = document.getElementById('hero-planner');
        if (plannerEl) {
            plannerEl.textContent = plannerText;
        }

        // 4. Focus session timer state
        let focusText = "Idle";
        let focusColor = "var(--text-secondary)";
        if (typeof PomodoroModule !== 'undefined') {
            if (PomodoroModule.timerId !== null) {
                const minutes = String(Math.floor(PomodoroModule.timeLeft / 60)).padStart(2, '0');
                const seconds = String(PomodoroModule.timeLeft % 60).padStart(2, '0');
                const typeLabel = PomodoroModule.currentType === 'focus' ? 'Focusing' : 'Break';
                focusText = `${typeLabel} (${minutes}:${seconds})`;
                focusColor = "var(--accent-pomodoro)";
            }
        }
        const focusEl = document.getElementById('hero-focus');
        if (focusEl) {
            focusEl.textContent = focusText;
            focusEl.style.color = focusColor;
        }
    }
};

// Safe entry point: Initialize App only when DOM represents the fully loaded HTML layout.
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
