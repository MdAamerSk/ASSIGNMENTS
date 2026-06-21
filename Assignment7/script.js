document.addEventListener("DOMContentLoaded", function() {
  initializeEventSandbox();
  initializeThemeToggle();
  initializePipelineCarousel();
  initializeTaskEngine();
});

/* 
   PHASE 2: EVENT PROPAGATION SANDBOX
*/
function initializeEventSandbox() {
  // Select sandbox elements individually using getElementById
  var grandparent = document.getElementById("grandparent");
  var parent = document.getElementById("parent");
  var child = document.getElementById("child");
  var button = document.getElementById("trigger-btn");

  // Check if elements are found on the page
  if (!grandparent || !parent || !child || !button) {
    console.error("Propagation sandbox elements are missing!");
    return;
  }

  // A. CAPTURING PHASE EVENT LISTENERS (Using true as the third parameter)
  // Capturing travels from the outermost element inward to the target.
  grandparent.addEventListener("click", function() {
    console.log("Capturing: GRANDPARENT");
  }, true);

  parent.addEventListener("click", function() {
    console.log("Capturing: PARENT");
  }, true);

  child.addEventListener("click", function() {
    console.log("Capturing: CHILD");
  }, true);

  button.addEventListener("click", function() {
    console.log("Capturing: BUTTON");
  }, true);

  // B. BUBBLING PHASE EVENT LISTENERS (Using false or omitting the parameter)
  // Bubbling travels from the target element outward back to the root.
  grandparent.addEventListener("click", function() {
    console.log("Bubbling: GRANDPARENT");
  }, false);

  parent.addEventListener("click", function() {
    console.log("Bubbling: PARENT");
  }, false);

  child.addEventListener("click", function() {
    console.log("Bubbling: CHILD");
  }, false);

  button.addEventListener("click", function() {
    console.log("Bubbling: BUTTON");
  }, false);
}

/* 
   PHASE 3: THEME TOGGLE
*/
function initializeThemeToggle() {
  var themeToggleBtn = document.getElementById("theme-toggle");

  if (!themeToggleBtn) {
    console.error("Theme toggle button not found!");
    return;
  }

  // Attach a standard click handler
  themeToggleBtn.addEventListener("click", function() {
    var rootElement = document.documentElement; // This is the <html> element
    var currentTheme = rootElement.getAttribute("data-theme");

    // Toggle logic using basic if/else statements
    if (currentTheme === "dark") {
      rootElement.setAttribute("data-theme", "light");
      themeToggleBtn.setAttribute("aria-label", "Switch to dark theme");
      console.log("Theme toggled to: LIGHT");
    } else {
      rootElement.setAttribute("data-theme", "dark");
      themeToggleBtn.setAttribute("aria-label", "Switch to light theme");
      console.log("Theme toggled to: DARK");
    }
  });
}

/* 
   PHASE 5: BROWSER PIPELINE CAROUSEL SLIDER
*/
function initializePipelineCarousel() {
  var prevBtn = document.getElementById("prev-btn");
  var nextBtn = document.getElementById("next-btn");
  var carouselTrack = document.getElementById("carousel-track");

  if (!prevBtn || !nextBtn || !carouselTrack) {
    console.error("Carousel elements not found!");
    return;
  }

  // Track current slide index (starts at index 0)
  var currentSlide = 0;
  var totalSlides = 6; // Steps 1 to 6

  // Helper function to update slider position and disabled buttons
  function updateCarouselPosition() {
    // Translate the track horizontally (e.g. 0%, -100%, -200% etc.)
    var translatePercentage = currentSlide * 100;
    carouselTrack.style.transform = "translateX(-" + translatePercentage + "%)";

    // Disable boundary buttons
    if (currentSlide === 0) {
      prevBtn.disabled = true;
    } else {
      prevBtn.disabled = false;
    }

    if (currentSlide === totalSlides - 1) {
      nextBtn.disabled = true;
    } else {
      nextBtn.disabled = false;
    }
  }

  // Previous button click event
  prevBtn.addEventListener("click", function() {
    if (currentSlide > 0) {
      currentSlide = currentSlide - 1;
      updateCarouselPosition();
    }
  });

  // Next button click event
  nextBtn.addEventListener("click", function() {
    if (currentSlide < totalSlides - 1) {
      currentSlide = currentSlide + 1;
      updateCarouselPosition();
    }
  });
}

/*
   PHASE 4: TASK MANAGER ENGINE
*/
function initializeTaskEngine() {
  // Select DOM Elements
  var taskForm = document.getElementById("task-form");
  var taskTitleInput = document.getElementById("task-title");
  var taskCategorySelect = document.getElementById("task-category");
  var taskContainer = document.getElementById("task-container");
  var clearAllBtn = document.getElementById("clear-all-btn");

  if (!taskForm || !taskTitleInput || !taskCategorySelect || !taskContainer || !clearAllBtn) {
    console.error("Task manager interface elements are missing!");
    return;
  }

  // Initial stats calculation
  updateStats();

  /* --- 1. Task Creation Form Submission --- */
  taskForm.addEventListener("submit", function(event) {
    // Stop the browser from refreshing the page
    event.preventDefault();

    // Select the parent nodes for error display
    var titleGroup = taskTitleInput.parentElement;
    var categoryGroup = taskCategorySelect.parentElement;

    // Reset error visuals
    titleGroup.classList.remove("invalid");
    categoryGroup.classList.remove("invalid");

    var titleValue = taskTitleInput.value.trim();
    var categoryValue = taskCategorySelect.value;

    // Validation checks
    var hasError = false;
    if (titleValue === "") {
      titleGroup.classList.add("invalid");
      hasError = true;
    }
    if (categoryValue === "") {
      categoryGroup.classList.add("invalid");
      hasError = true;
    }

    if (hasError) {
      return; // Stop form execution
    }

    /* 
       --- DOM PROPERTY VS. HTML ATTRIBUTE DEMONSTRATION ---
       - Property (taskTitleInput.value) reads what the user typed live.
       - Attribute (taskTitleInput.getAttribute('value')) returns the default HTML markup source value (which is null here).
    */
    console.log("=== DOM PROPERTY VS. HTML ATTRIBUTE ===");
    console.log("Live DOM Property (input.value): " + taskTitleInput.value);
    console.log("Static HTML Attribute (input.getAttribute('value')): " + taskTitleInput.getAttribute("value"));
    console.log("========================================");

    // Create a new task card container
    var taskCard = document.createElement("div");
    taskCard.className = "task-card";
    
    // Add data variables for status and category
    var uniqueId = Date.now().toString();
    taskCard.setAttribute("data-id", uniqueId);
    taskCard.setAttribute("data-status", "pending");
    taskCard.setAttribute("data-category", categoryValue);

    // Create details section container
    var taskInfo = document.createElement("div");
    taskInfo.className = "task-info";

    var titleWrapper = document.createElement("div");
    titleWrapper.className = "task-title-wrapper";

    // Create Category Badge
    var categoryBadge = document.createElement("span");
    categoryBadge.className = "category-badge category-" + categoryValue;
    
    var categoryLabel = "";
    if (categoryValue === "ui") {
      categoryLabel = "UI Design";
    } else if (categoryValue === "logic") {
      categoryLabel = "Core Logic";
    } else if (categoryValue === "debugging") {
      categoryLabel = "Debugging";
    } else if (categoryValue === "docs") {
      categoryLabel = "Documentation";
    }
    categoryBadge.appendChild(document.createTextNode(categoryLabel));

    // Create Title text
    var titleSpan = document.createElement("span");
    titleSpan.className = "task-card-title";
    titleSpan.appendChild(document.createTextNode(titleValue));

    // Nest elements
    titleWrapper.appendChild(categoryBadge);
    titleWrapper.appendChild(titleSpan);
    taskInfo.appendChild(titleWrapper);

    // Create actions container
    var actionsDiv = document.createElement("div");
    actionsDiv.className = "task-actions";

    // Complete Button
    var completeBtn = document.createElement("button");
    completeBtn.type = "button";
    completeBtn.className = "btn-card btn-card-complete";
    completeBtn.appendChild(document.createTextNode("Complete"));

    // Edit Button
    var editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "btn-card btn-card-edit";
    editBtn.appendChild(document.createTextNode("Edit"));

    // Delete Button
    var deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn-card btn-card-delete";
    deleteBtn.appendChild(document.createTextNode("Delete"));

    actionsDiv.appendChild(completeBtn);
    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    taskCard.appendChild(taskInfo);
    taskCard.appendChild(actionsDiv);

    // If the list is empty, clean the placeholder empty container
    if (taskContainer.classList.contains("task-list-empty")) {
      taskContainer.classList.remove("task-list-empty");
      taskContainer.classList.add("task-list-active");
      taskContainer.innerHTML = ""; // Wipe folder icon
    }

    // Add card to top of the list
    taskContainer.prepend(taskCard);

    // Clear form inputs
    taskForm.reset();
    updateStats();
  });

  /* --- 2. Event Delegation Engine --- */
  taskContainer.addEventListener("click", function(event) {
    var target = event.target;
    
    // Find closest task card ancestor
    var card = target.closest(".task-card");
    if (!card) return; // Exit if user clicked outside a card

    // Complete / Reopen Action
    if (target.classList.contains("btn-card-complete")) {
      var currentStatus = card.getAttribute("data-status");

      if (currentStatus === "pending") {
        card.setAttribute("data-status", "completed");
        target.textContent = "Reopen";
        
        // Move completed task card to bottom of the list
        taskContainer.appendChild(card);
      } else {
        card.setAttribute("data-status", "pending");
        target.textContent = "Complete";
        
        // Return task card to top of the list
        taskContainer.prepend(card);
      }
      updateStats();
    }

    // Edit Title Action
    else if (target.classList.contains("btn-card-edit")) {
      var existingInput = card.querySelector(".edit-input-field");
      
      // If already editing, perform the save action
      if (existingInput) {
        var updatedText = existingInput.value.trim();
        var newTitleSpan = document.createElement("span");
        newTitleSpan.className = "task-card-title";
        
        if (updatedText !== "") {
          newTitleSpan.appendChild(document.createTextNode(updatedText));
        } else {
          // Revert if left empty
          newTitleSpan.appendChild(document.createTextNode(card.dataset.oldTitle || ""));
        }
        
        existingInput.replaceWith(newTitleSpan);
        target.textContent = "Edit";
        return;
      }

      var titleSpan = card.querySelector(".task-card-title");
      var currentTitle = titleSpan.textContent;
      card.dataset.oldTitle = currentTitle; // Save old title to revert if input is empty

      // Create inline edit input box
      var editInput = document.createElement("input");
      editInput.type = "text";
      editInput.className = "edit-input-field";
      editInput.value = currentTitle;

      // Enter keyboard click save
      editInput.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
          target.click(); // Trigger the save logic via delegation
        }
      });

      // Swap elements
      titleSpan.replaceWith(editInput);
      editInput.focus();
      target.textContent = "Save";
    }

    // Delete Card Action
    else if (target.classList.contains("btn-card-delete")) {
      card.remove(); // Delete DOM node
      
      // Restore empty screen state if last element is deleted
      if (taskContainer.children.length === 0) {
        restoreEmptyState();
      }
      updateStats();
    }
  });

  /* --- 3. Counters & Clear All Events --- */
  clearAllBtn.addEventListener("click", function() {
    var cards = taskContainer.querySelectorAll(".task-card");
    if (cards.length === 0) return;

    var confirmed = confirm("Are you sure you want to clear all tasks?");
    if (confirmed) {
      taskContainer.innerHTML = "";
      restoreEmptyState();
      updateStats();
    }
  });

  function updateStats() {
    var cards = taskContainer.querySelectorAll(".task-card");
    var totalCount = cards.length;
    var pendingCount = 0;
    var completedCount = 0;

    for (var i = 0; i < cards.length; i++) {
      var status = cards[i].getAttribute("data-status");
      if (status === "completed") {
        completedCount++;
      } else {
        pendingCount++;
      }
    }

    // Write standard counts to screen badges
    document.getElementById("stat-total").textContent = totalCount;
    document.getElementById("stat-pending").textContent = pendingCount;
    document.getElementById("stat-completed").textContent = completedCount;
  }

  function restoreEmptyState() {
    taskContainer.className = "task-list-empty";
    taskContainer.innerHTML = 
      '<div class="empty-state">' +
        '<span class="empty-icon">📂</span>' +
        '<p>No tasks added yet. Fill out the form to populate your list.</p>' +
      '</div>';
  }
}
