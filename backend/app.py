from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Create the Flask app instance
app = Flask(__name__)
CORS(app)

# Set up the database URI for SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
db = SQLAlchemy(app)

# Create the Task model
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=True)
    due_date = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), nullable=False)

# Create a task with a title, optional description, status, due date/time
@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    print(f"Received data: {data}")  # Log received data

    if not data or not data.get('title') or not data.get('due_date') or not data.get('status'):
        return jsonify({"error": "Missing required fields"}), 400
    
    task = Task(
        title=data['title'],
        description=data.get('description', ''),
        due_date=data['due_date'],
        status=data['status']
    )
    db.session.add(task)
    db.session.commit()
    
    return jsonify({"message": "Task created successfully", "task": {"id": task.id, "title": task.title, "status": task.status}}), 201

# Retrieve all tasks
@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    tasks_list = [
        {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "due_date": task.due_date,
            "status": task.status
        }
        for task in tasks
    ]
    return jsonify({"tasks": tasks_list})

# Retrieve a task by ID
@app.route('/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404

    task_data = {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "due_date": task.due_date,
        "status": task.status
    }
    return jsonify({"task": task_data})

# Update the status of a task
@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404

    data = request.get_json()

    if 'title' in data:
        task.title = data['title']
    if 'description' in data:
        task.description = data['description']
    if 'due_date' in data:
        task.due_date = data['due_date']
    if 'status' in data:
        task.status = data['status']

    db.session.commit()

    return jsonify({"message": "Task updated successfully", "task": {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "due_date": task.due_date,
        "status": task.status
    }})

# Delete a task
@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404

    db.session.delete(task)
    db.session.commit()

    return jsonify({"message": "Task deleted successfully"})

# Define a test route to verify the server is working
@app.route('/test', methods=['GET'])
def test():
    return "Server is working"

# Start the server
if __name__ == "__main__":
    with app.app_context():  # Ensure we are within the application context
        db.create_all()  # Create the database tables if they don't exist
    app.run(debug=True)
