const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Simple in-memory store for tasks
// Shape: { id, title, description, completed }
let tasks = [];
let nextId = 1;

// Validation helper
function validateTaskPayload(body, isPartial = false) {
  const errors = [];

  if (!isPartial || body.title !== undefined) {
    if (typeof body.title !== 'string' || body.title.trim().length === 0) {
      errors.push('Title is required and must be a non-empty string.');
    }
  }

  if (!isPartial || body.description !== undefined) {
    if (typeof body.description !== 'string') {
      errors.push('Description is required and must be a string.');
    }
  }

  if (body.completed !== undefined && typeof body.completed !== 'boolean') {
    errors.push('Completed must be a boolean if provided.');
  }

  return errors;
}

// GET all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// GET task by ID
app.get('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

// POST create new task
app.post('/api/tasks', (req, res) => {
  const errors = validateTaskPayload(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const { title, description } = req.body;
  const newTask = {
    id: nextId++,
    title: title.trim(),
    description: description.trim(),
    completed: false,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT update entire task
app.put('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const errors = validateTaskPayload(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const { title, description, completed = false } = req.body;
  const updatedTask = {
    ...tasks[taskIndex],
    title: title.trim(),
    description: description.trim(),
    completed,
  };

  tasks[taskIndex] = updatedTask;
  res.json(updatedTask);
});

// PATCH mark as completed or partial updates
app.patch('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const errors = validateTaskPayload(req.body, true);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const existing = tasks[taskIndex];
  const updatedTask = {
    ...existing,
    ...(req.body.title !== undefined && { title: req.body.title.trim() }),
    ...(req.body.description !== undefined && { description: req.body.description.trim() }),
    ...(req.body.completed !== undefined && { completed: req.body.completed }),
  };

  tasks[taskIndex] = updatedTask;
  res.json(updatedTask);
});

// DELETE task
app.delete('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const [deleted] = tasks.splice(taskIndex, 1);
  res.json({ message: 'Task deleted', task: deleted });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});


