# Task Manager

## Project Overview
This project is a task management system built with Flask for the backend and a simple frontend to interact with it. It allows users to create, view, update, and delete tasks, and provides basic validation and error handling. Tasks are stored in a database, and the system includes unit tests for both the backend and frontend.

## Setup Instructions

### Prerequisites

- Python 3.x
- pip (Python package manager)
- Flask
- SQLAlchemy
- A working version of a database (SQLite is used for this project, but it can be easily adapted to others)

### Backend Setup

1. Navigate to the `backend` directory:
    ```bash
    cd backend
    ```

2. Create a virtual environment:
    ```bash
    python3 -m venv venv
    ```

3. Activate the virtual environment:
    - On macOS/Linux:
      ```bash
      source venv/bin/activate
      ```
    - On Windows:
      ```bash
      venv\Scripts\activate
      ```

4. Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```

5. Run the Flask application:
    ```bash
    flask run
    ```

### Frontend Setup

1. Navigate to the `frontend` directory:
    ```bash
    cd ../frontend
    ```

2. Open the `index.html` file in your browser to view and interact with the task management system.

## API Endpoints

### `GET /tasks`

Retrieve all tasks.

**Request Example:**
```bash
GET /tasks
```

**Response Example:**

```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Task 1",
      "description": "Task description",
      "due_date": "2025-05-01",
      "status": "Not Started"
    },
    {
      "id": 2,
      "title": "Task 2",
      "description": "Another description",
      "due_date": "2025-06-01",
      "status": "In Progress"
    }
  ]
}
```

### `POST /tasks`

Create a new task.

**Request Example:**
```bash
POST /tasks
Content-Type: application/json
```

**Body:**
```json
{
  "title": "New Task",
  "description": "Details about the task",
  "due_date": "2025-07-01",
  "status": "Not Started"
}
```

**Response Example:**

```json
{
  "message": "Task created successfully",
  "task": {
    "id": 3,
    "title": "New Task",
    "description": "Details about the task",
    "due_date": "2025-07-01",
    "status": "Not Started"
  }
}
```

### `GET /tasks/<task_id>`

Retrieve a single task by ID.

**Request Example:**
```bash
GET /tasks/1
```

**Response Example:**

```json
{
  "task": {
    "id": 1,
    "title": "Task 1",
    "description": "Task description",
    "due_date": "2025-05-01",
    "status": "Not Started"
  }
}
```

### `PUT /tasks/<task_id>/status`

Update the status of a task.

**Request Example:**
```bash
PUT /tasks/1/status
Content-Type: application/json
```

**Body:**
```json
{
  "status": "Completed"
}
```

**Response Example:**

```json
{
  "message": "Task status updated successfully",
  "task": {
    "id": 1,
    "title": "Task 1",
    "description": "Task description",
    "due_date": "2025-05-01",
    "status": "Completed"
  }
}
```

### `DELETE /tasks/<task_id>`

Delete a task by ID.

**Request Example:**
```bash
DELETE /tasks/1
```

**Response Example:**

```json
{
  "message": "Task deleted successfully"
}
```

## Running Tests

To run the unit tests for the backend, make sure your virtual environment is activated.

Run:

```bash
Copy
Edit
pytest
```

This will automatically discover and execute tests written in the backend/test_tasks.py file.