# Task Manager Application

A simple, full-stack task management application built with **React** (Vite) and **Node.js** (Express). This application allows users to manage their daily tasks with a premium, responsive user interface.

## 🚀 Features

- **User Authentication**: Simple login interface (Mock authentication for demonstration).
- **Task Management**:
  - **Create**: Add new tasks with titles and descriptions.
  - **Read**: View a list of all tasks.
  - **Update**: Edit existing tasks.
  - **Delete**: Remove tasks.
  - **Complete**: Mark tasks as completed or incomplete.
- **Persistence**: Tasks are stored in-memory on the server (data resets on server restart).
- **Modern UI**: Built with Vanilla CSS using a dark theme with glassmorphism design principles and responsive layouts.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Vanilla CSS
- **Backend**: Node.js, Express, CORS
- **Data Storage**: In-memory storage (can be extended to JSON file or database)

## Screenshots

<img width="1912" height="1039" alt="Screenshot 2025-11-28 215840" src="https://github.com/user-attachments/assets/2ecc7090-ddbc-4476-80e7-1266ac45f8ca" />
<img width="1919" height="1038" alt="Screenshot 2025-11-28 215853" src="https://github.com/user-attachments/assets/2bfc6cf1-15ce-4376-80d9-b5d065d2770b" />
<img width="1917" height="1043" alt="Screenshot 2025-11-28 220021" src="https://github.com/user-attachments/assets/a2ce3920-e2b8-4898-ba42-05af6ba81db4" />
<img width="1919" height="1044" alt="Screenshot 2025-11-28 220035" src="https://github.com/user-attachments/assets/cdc3b430-0d7f-41cb-9fa4-1c834a31bbea" />
<img width="1915" height="1032" alt="Screenshot 2025-11-28 220114" src="https://github.com/user-attachments/assets/09537a82-ba92-438f-b6fd-56bc4911d339" />
<img width="1919" height="875" alt="Screenshot 2025-11-28 220132" src="https://github.com/user-attachments/assets/6803f50b-d188-480b-942a-da4014696e6c" />


## ⚙️ Installation & Setup

1. **Clone the repository** (if applicable) or navigate to the project folder.

2. **Install All Dependencies**:
   ```bash
   # Navigate to the root directory
   cd prj

   # Install all dependencies (root, server, and client)
   npm run install:all
   ```

   Or install manually:
   ```bash
   # Install root dependencies
   npm install

   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

## 🏃‍♂️ Running the Application

### Option 1: Run Both Servers Together (Recommended)

From the root directory, run:
```bash
npm run dev
```

This will start both servers simultaneously:
- **Backend Server**: `http://localhost:5000`
- **Frontend Development Server**: `http://localhost:5173`

Then open `http://localhost:5173` in your browser.

### Option 2: Run Servers Separately

1. **Start the Backend Server**:
   From the root directory:
   ```bash
   npm run dev:server
   ```
   Or from the `server` directory:
   ```bash
   cd server
   npm run dev
   ```
   *The server will start on `http://localhost:5000`*

2. **Start the Frontend Development Server**:
   Open a new terminal, and from the root directory:
   ```bash
   npm run dev:client
   ```
   Or from the `client` directory:
   ```bash
   cd client
   npm run dev
   ```
   *The application will be accessible at `http://localhost:5173`*

## 📂 Project Structure

```
prj/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── App.jsx         # Main application component with routing
│   │   ├── App.css         # Application styles
│   │   ├── index.css       # Global styles
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express Backend
│   ├── index.js            # Express server and API routes
│   └── package.json
├── package.json            # Root dependencies and scripts
└── README.md               # Project documentation
```

## 📝 API Endpoints

The backend exposes RESTful APIs under `http://localhost:5000/api`:

- **GET `/api/tasks`** – Get all tasks
- **GET `/api/tasks/:id`** – Get a single task by id
- **POST `/api/tasks`** – Create a new task
  - Body: `{ "title": string, "description": string }`
- **PUT `/api/tasks/:id`** – Replace/update a task
  - Body: `{ "title": string, "description": string, "completed": boolean }`
- **PATCH `/api/tasks/:id`** – Partial update (e.g., mark as completed)
  - Body can include any subset of `title`, `description`, `completed`
- **DELETE `/api/tasks/:id`** – Delete a task

All endpoints include validation and error handling.

## 📝 Usage Guide

1. **Login**: Enter any username and password on the login screen to access the dashboard.
2. **Add Task**: Use the form on the left side to create a new task with a title and description.
3. **Manage Tasks**: 
   - Click **"Mark as Completed"** to toggle task completion status
   - Click **"Edit"** to modify a task
   - Click **"Delete"** to remove a task
4. **View Tasks**: All tasks are displayed on the right side, with completed tasks visually differentiated.

---
