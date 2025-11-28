import './App.css'

import { useState, useEffect } from 'react'

const API_BASE = 'http://localhost:5000/api'

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setError('Please enter username and password')
      return
    }
    // Simple fake login, no backend authentication
    onLogin({ username: username.trim() })
  }

  return (
    <div className="page login-page">
      <div className="card login-card">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to manage your tasks.</p>
        <form onSubmit={handleSubmit} className="form">
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="primary-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

function TaskForm({ onSubmit, initialTask, onCancel }) {
  const [title, setTitle] = useState(initialTask?.title || '')
  const [description, setDescription] = useState(initialTask?.description || '')
  const [error, setError] = useState('')

  // Sync form state with initialTask prop changes
  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '')
      setDescription(initialTask.description || '')
    } else {
      setTitle('')
      setDescription('')
    }
    setError('')
  }, [initialTask])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    onSubmit({
      title: title.trim(),
      description: description.trim(),
    })
    setError('')
  }

  return (
    <form onSubmit={handleSubmit} className="form task-form">
      <label>
        Title
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
        />
      </label>
      <label>
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
          rows={3}
        />
      </label>
      {error && <p className="error">{error}</p>}
      <div className="form-actions">
        <button type="submit" className="primary-btn">
          {initialTask ? 'Update Task' : 'Add Task'}
        </button>
        {onCancel && (
          <button type="button" className="secondary-btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

function TaskItem({ task, onToggleCompleted, onEdit, onDelete }) {
  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-main">
        <h3>{task.title}</h3>
        <p>{task.description}</p>
      </div>
      <div className="task-actions">
        <button
          className="primary-btn outline"
          onClick={() => onToggleCompleted(task)}
        >
          {task.completed ? 'Mark as Incomplete' : 'Mark as Completed'}
        </button>
        <button className="secondary-btn" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="danger-btn" onClick={() => onDelete(task)}>
          Delete
        </button>
      </div>
    </div>
  )
}

function HomePage({ user, onLogout }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingTask, setEditingTask] = useState(null)
  const [formKey, setFormKey] = useState(0)

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/tasks`)
      if (!res.ok) {
        throw new Error('Failed to load tasks')
      }
      const data = await res.json()
      setTasks(data)
    } catch (err) {
      setError(err.message || 'Error fetching tasks')
    } finally {
      setLoading(false)
    }
  }

  const addTask = async (task) => {
    try {
      setError('')
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.errors?.join(', ') || data.error || 'Failed to add task')
      }
      setTasks((prev) => [...prev, data])
      setFormKey((prev) => prev + 1) // Reset form after successful add
    } catch (err) {
      setError(err.message || 'Error adding task')
    }
  }

  const updateTask = async (id, updates) => {
    try {
      setError('')
      const existing = tasks.find((t) => t.id === id)
      if (!existing) return
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...existing,
          ...updates,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.errors?.join(', ') || data.error || 'Failed to update task')
      }
      setTasks((prev) => prev.map((t) => (t.id === id ? data : t)))
      setEditingTask(null)
      setFormKey((prev) => prev + 1) // Reset form after successful update
    } catch (err) {
      setError(err.message || 'Error updating task')
    }
  }

  const toggleCompleted = async (task) => {
    try {
      setError('')
      const res = await fetch(`${API_BASE}/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.errors?.join(', ') || data.error || 'Failed to update task')
      }
      setTasks((prev) => prev.map((t) => (t.id === task.id ? data : t)))
    } catch (err) {
      setError(err.message || 'Error toggling task')
    }
  }

  const deleteTask = async (task) => {
    if (!window.confirm(`Delete task "${task.title}"?`)) return
    try {
      setError('')
      const res = await fetch(`${API_BASE}/tasks/${task.id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete task')
      }
      setTasks((prev) => prev.filter((t) => t.id !== task.id))
    } catch (err) {
      setError(err.message || 'Error deleting task')
    }
  }

  // Load tasks once when component mounts
  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <div className="page home-page">
      <header className="header">
        <h1>Task Manager</h1>
        <div className="header-right">
          <span className="welcome">Welcome, {user.username}</span>
          <button className="secondary-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="content">
        <section className="card">
          <h2>{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
          <TaskForm
            key={formKey}
            initialTask={editingTask}
            onSubmit={(task) =>
              editingTask ? updateTask(editingTask.id, task) : addTask(task)
            }
            onCancel={editingTask ? () => setEditingTask(null) : undefined}
          />
        </section>

        <section className="card">
          <div className="tasks-header">
            <h2>Tasks</h2>
            <button className="secondary-btn" onClick={fetchTasks}>
              Refresh
            </button>
          </div>
          {loading && <p>Loading tasks...</p>}
          {error && <p className="error">{error}</p>}
          {tasks.length === 0 && !loading ? (
            <p>No tasks yet. Add your first task above.</p>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleCompleted={toggleCompleted}
                  onEdit={setEditingTask}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

function App() {
  const [user, setUser] = useState(null)

  if (!user) {
    return <LoginPage onLogin={setUser} />
  }

  return <HomePage user={user} onLogout={() => setUser(null)} />
}

export default App
