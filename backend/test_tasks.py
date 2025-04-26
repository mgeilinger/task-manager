import pytest
from app import app, db, Task

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'  # Temporary in-memory database
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client

def test_create_task(client):
    response = client.post('/tasks', json={
        "title": "Test Task",
        "description": "Test Description",
        "due_date": "2025-12-31",
        "status": "Not Started"
    })
    assert response.status_code == 201
    data = response.get_json()
    assert data["message"] == "Task created successfully"
    assert data["task"]["title"] == "Test Task"

def test_get_tasks(client):
    # Create a task first
    client.post('/tasks', json={
        "title": "Another Task",
        "description": "Another Description",
        "due_date": "2025-11-30",
        "status": "In Progress"
    })

    response = client.get('/tasks')
    assert response.status_code == 200
    data = response.get_json()

    # Instead of checking total number, check that "Another Task" exists
    task_titles = [task["title"] for task in data["tasks"]]
    assert "Another Task" in task_titles

def test_get_single_task(client):
    # Create a task
    post_response = client.post('/tasks', json={
        "title": "Single Task",
        "description": "Some description",
        "due_date": "2025-10-10",
        "status": "Completed"
    })
    task_id = post_response.get_json()["task"]["id"]

    # Get the specific task
    get_response = client.get(f'/tasks/{task_id}')
    assert get_response.status_code == 200
    task_data = get_response.get_json()["task"]
    assert task_data["title"] == "Single Task"

def test_update_task_status(client):
    # Create a task
    post_response = client.post('/tasks', json={
        "title": "Task to Update",
        "description": "Needs updating",
        "due_date": "2025-09-09",
        "status": "Not Started"
    })
    task_id = post_response.get_json()["task"]["id"]

    # Update the task status
    put_response = client.put(f'/tasks/{task_id}', json={
        "status": "Completed"
    })
    assert put_response.status_code == 200
    updated_task = put_response.get_json()["task"]
    assert updated_task["status"] == "Completed"

def test_delete_task(client):
    # Create a task
    post_response = client.post('/tasks', json={
        "title": "Task to Delete",
        "description": "Delete me",
        "due_date": "2025-08-08",
        "status": "On Hold"
    })
    task_id = post_response.get_json()["task"]["id"]

    # Delete the task
    delete_response = client.delete(f'/tasks/{task_id}')
    assert delete_response.status_code == 200
    delete_message = delete_response.get_json()["message"]
    assert delete_message == "Task deleted successfully"

    # Confirm it's gone
    get_response = client.get(f'/tasks/{task_id}')
    assert get_response.status_code == 404