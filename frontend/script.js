const apiUrl = "http://127.0.0.1:5000";  // Flask backend

// Fetch all tasks and display them
function loadTasks() {
    fetch(`${apiUrl}/tasks`)
    .then(response => response.json())
    .then(data => {
        const taskList = document.getElementById("taskList");
        taskList.innerHTML = "";
        data.tasks.forEach(task => {
            const li = document.createElement("li");
            li.className = "task-item";  // Add a class for styling

            // --- Left side (task info) ---
            const taskContent = document.createElement("div");
            taskContent.className = "task-content";
            taskContent.textContent = `
                ${task.title} | ${task.description || 'No description'} | Due: ${task.due_date}
            `.trim();

            // --- Right side (actions) ---
            const taskActions = document.createElement("div");
            taskActions.className = "task-actions";

            // Status dropdown
            const statusSelect = document.createElement("select");
            ["Not Started", "In Progress", "Completed", "On Hold"].forEach(statusOption => {
                const option = document.createElement("option");
                option.value = statusOption;
                option.textContent = statusOption;
                if (task.status === statusOption) {
                    option.selected = true;
                }
                statusSelect.appendChild(option);
            });
            statusSelect.addEventListener('change', function() {
                updateTaskStatus(task.id, statusSelect.value);
            });

            // Edit button
            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.addEventListener('click', function() {
                enterEditMode(task, li);
            });

            // Delete button
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener('click', function() {
                deleteTask(task.id);
            });

            // Add all actions to the taskActions div
            taskActions.appendChild(statusSelect);
            taskActions.appendChild(editButton);
            taskActions.appendChild(deleteButton);

            // Add content and actions to li
            li.appendChild(taskContent);
            li.appendChild(taskActions);

            taskList.appendChild(li);
        });
    })
    .catch(error => console.error("Error fetching tasks:", error));
}

// Enter edit mode
function enterEditMode(task, li) {
    li.innerHTML = '';
    li.className = "task-item"; // Keep the same style

    const editContainer = document.createElement("div");
    editContainer.className = "edit-container";

    // Title input
    const titleInput = document.createElement("input");
    titleInput.value = task.title;
    titleInput.className = "edit-title";

    // Description input (wider)
    const descInput = document.createElement("input");
    descInput.value = task.description;
    descInput.className = "edit-description";

    // Date selectors
    const yearSelect = document.createElement("select");
    const monthSelect = document.createElement("select");
    const daySelect = document.createElement("select");

    // Populate year options
    function populateYears() {
        const currentYear = new Date().getFullYear();
        for (let year = currentYear; year <= currentYear + 5; year++) {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            if (year === parseInt(task.due_date.split("-")[0])) {
                option.selected = true;
            }
            yearSelect.appendChild(option);
        }
    }

    // Populate month options
    function populateMonths() {
        for (let month = 1; month <= 12; month++) {
            const option = document.createElement("option");
            option.value = month.toString().padStart(2, '0');
            option.textContent = month;
            if (month === parseInt(task.due_date.split("-")[1])) {
                option.selected = true;
            }
            monthSelect.appendChild(option);
        }
    }

    // Populate day options
    function populateDays(year, month) {
        daySelect.innerHTML = '';
        const daysInMonth = new Date(year, month, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
            const option = document.createElement("option");
            option.value = day.toString().padStart(2, '0');
            option.textContent = day;
            if (day === parseInt(task.due_date.split("-")[2])) {
                option.selected = true;
            }
            daySelect.appendChild(option);
        }
    }

    // React when year/month changes
    yearSelect.addEventListener('change', () => populateDays(parseInt(yearSelect.value), parseInt(monthSelect.value)));
    monthSelect.addEventListener('change', () => populateDays(parseInt(yearSelect.value), parseInt(monthSelect.value)));

    populateYears();
    populateMonths();
    populateDays(parseInt(task.due_date.split("-")[0]), parseInt(task.due_date.split("-")[1]));

    // Date group (no gaps)
    const dateGroup = document.createElement("div");
    dateGroup.className = "date-group";
    dateGroup.appendChild(yearSelect);
    dateGroup.appendChild(monthSelect);
    dateGroup.appendChild(daySelect);

    // Save button
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.addEventListener('click', function() {
        const dueDate = `${yearSelect.value}-${monthSelect.value}-${daySelect.value}`;
        updateFullTask(task.id, titleInput.value, descInput.value, dueDate);
    });

    editContainer.appendChild(titleInput);
    editContainer.appendChild(descInput);
    editContainer.appendChild(dateGroup);
    editContainer.appendChild(saveButton);

    li.appendChild(editContainer);
}

// Update the task information
function updateFullTask(taskId, newTitle, newDescription, newDueDate) {
    fetch(`${apiUrl}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: newTitle,
            description: newDescription,
            due_date: newDueDate
        })
    })
    .then(response => {
        if (response.ok) {
            loadTasks(); // Reload the tasks
        } else {
            console.error("Failed to update task details");
        }
    })
    .catch(error => console.error("Error updating task details:", error));
}

// Update task status
function updateTaskStatus(taskId, newStatus) {
    fetch(`${apiUrl}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
    })
    .then(response => {
        if (!response.ok) {
            console.error("Failed to update task status");
        }
    })
    .catch(error => console.error("Error updating task status:", error));
}

// Create a new task
function createTask() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const year = document.getElementById("year").value;
    const month = document.getElementById("month").value;
    const day = document.getElementById("day").value;
    const dueDate = `${year}-${month}-${day}`;  // Combine date information into YYYY-MM-DD format
    const status = document.getElementById("status").value;
    
    console.log("Sending task data:", { title, description, due_date: dueDate, status });  // Log the data being sent

    fetch(`${apiUrl}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title,
            description,
            due_date: dueDate,
            status
        })
    })
    .then(response => {
        if (response.ok) {
            loadTasks();
        } else {
            console.error("Failed to create task");
        }
    })
    .catch(error => console.error("Error creating task:", error));
}

// Delete a task
function deleteTask(taskId) {
    if (!confirm("Are you sure you want to delete this task?")) {
        return;
    }

    fetch(`${apiUrl}/tasks/${taskId}`, {
        method: "DELETE",
    })
    .then(response => {
        if (response.ok) {
            loadTasks(); // Refresh the list after deletion
        } else {
            console.error("Failed to delete task");
        }
    })
    .catch(error => console.error("Error deleting task:", error));
}

// Date selector
document.addEventListener('DOMContentLoaded', function() {
    const yearSelect = document.getElementById('year');
    const monthSelect = document.getElementById('month');
    const daySelect = document.getElementById('day');

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // 0-indexed
    const currentDay = today.getDate();

    // Populate years (you can customize range)
    for (let year = currentYear; year <= currentYear + 5; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        if (year === currentYear) option.selected = true;
        yearSelect.appendChild(option);
    }

    // Populate months
    for (let month = 1; month <= 12; month++) {
        const option = document.createElement('option');
        option.value = month.toString().padStart(2, '0'); // '01', '02', etc.
        option.textContent = month;
        if (month === currentMonth) option.selected = true;
        monthSelect.appendChild(option);
    }

    // Populate days
    function populateDays(year, month) {
        daySelect.innerHTML = ''; // Clear previous days
        const daysInMonth = new Date(year, month, 0).getDate(); // Get number of days

        for (let day = 1; day <= daysInMonth; day++) {
            const option = document.createElement('option');
            option.value = day.toString().padStart(2, '0');
            option.textContent = day;
            if (day === currentDay) option.selected = true;
            daySelect.appendChild(option);
        }
    }

    // Initially populate days
    populateDays(currentYear, currentMonth);

    // Update days when year or month changes
    yearSelect.addEventListener('change', function() {
        populateDays(parseInt(yearSelect.value), parseInt(monthSelect.value));
    });
    monthSelect.addEventListener('change', function() {
        populateDays(parseInt(yearSelect.value), parseInt(monthSelect.value));
    });
});

// Load tasks when page first loads
document.addEventListener("DOMContentLoaded", loadTasks);