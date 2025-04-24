from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Create the Flask app instance
app = Flask(__name__)
CORS(app)  # Enable CORS

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

# Define the route for creating a task (POST request)
@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.get_json()  # Get data sent in the request
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

# Define the route for retrieving all tasks (GET request)
@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()  # Retrieve all tasks from the database
    tasks_list = [{"id": task.id, "title": task.title, "status": task.status} for task in tasks]
    return jsonify({"tasks": tasks_list})

# Define a test route to verify the server is working
@app.route('/test', methods=['GET'])
def test():
    return "Server is working"

# Start the server
if __name__ == "__main__":
    with app.app_context():  # Ensure we are within the application context
        db.create_all()  # Create the database tables if they don't exist
    app.run(debug=True)
