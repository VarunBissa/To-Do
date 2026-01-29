To-Do Web Application

A full-stack task management application built with React.js, Node.js, Express, and PostgreSQL. Features include user authentication with email verification, board management, drag-and-drop todo organization, priority levels, due dates, and dark mode.

Features

 Authentication
-  User registration with email verification
-  JWT-based authentication
-  Password reset functionality
-  Secure password hashing with bcrypt

 Board Management
-  Create, read, update, and delete boards
-  Multiple boards per user
-  Board statistics (total/completed todos)

 Todo Management
-  Full CRUD operations on todos
-  Drag-and-drop reordering
-  Priority levels (Low, Medium, High)
-  Due dates with overdue indicators
-  Task completion tracking
-  Filter by status (All, Active, Completed)

 UI/UX
-  Beautiful, modern design with gradients
-  Dark mode support with toggle
-  Fully responsive (mobile, tablet, desktop)
-  Smooth animations and transitions
-  Toast notifications for user feedback
-  Loading states throughout the app

 Tech Stack

 Frontend
- React 18 - UI library
- Vite - Build tool
- Tailwind CSS - Styling
- React Router - Navigation
- @dnd-kit - Drag and drop
- Axios - HTTP client
- React Hot Toast - Notifications
- Lucide React - Icons
- date-fns - Date formatting

 Backend
- Node.js - Runtime
- Express - Web framework
- PostgreSQL - Database
- JWT - Authentication
- Bcrypt - Password hashing
- Nodemailer - Email service
- CORS - Cross-origin requests

Prerequisites

Before running this project, make sure you have:

- Node.js (v16 or higher)
- npm (v8 or higher)
- PostgreSQL (v13 or higher)
- Gmail account (for email verification - optional)

  Quick Start

 1. Clone the Repository

bash
git clone <your-repo-url>
cd To-Do-App


 2. Backend Setup

bash
cd backend
npm install


Create .env file (copy from .env.example):
env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=todo_app_db
DB_USER=postgre
DB_PASSWORD=varun
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=To-Do App <your-gmail@gmail.com>
FRONTEND_URL=http://localhost:5173


Create PostgreSQL database:
sql
CREATE DATABASE todo_app_db;


Run migrations:
bash
npm run migrate


Start backend:
bash
npm run dev


Backend will run on http://localhost:5000

 3. Frontend Setup

bash
cd ../frontend
npm install


Start frontend:
bash
npm run dev


Frontend will run on http://localhost:5173

Email Configuration

 Option 1: Gmail (Recommended for Testing)

1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Generate an App Password: https://myaccount.google.com/apppasswords
4. Use this app password in your .env file

 Option 2: Console Logging (Development)

If you don't configure email credentials, emails will be logged to the console. Check your backend terminal for verification and reset links.

Project Structure


To-Do-App/
├── backend/
│   ├── src/
│   │   ├── config/           Database configuration
│   │   ├── controllers/      Request handlers
│   │   ├── middleware/       Auth middleware
│   │   ├── migrations/       Database migrations
│   │   ├── routes/           API routes
│   │   ├── services/         Email & token services
│   │   └── server.js         Entry point
│   ├── .env                  Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/       React components
│   │   │   ├── common/       Reusable components
│   │   │   └── layout/       Layout components
│   │   ├── contexts/         React contexts
│   │   ├── pages/            Page components
│   │   ├── services/         API services
│   │   ├── App.jsx           Main app component
│   │   └── main.jsx          Entry point
│   ├── .env                  Environment variables
│   └── package.json
│
├── .gitignore
└── README.md


 API Endpoints

 Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/verify-email - Verify email
- POST /api/auth/login - Login
- POST /api/auth/forgot-password - Request password reset
- POST /api/auth/reset-password - Reset password
- GET /api/auth/me - Get current user

 Boards
- GET /api/boards - Get all boards
- POST /api/boards - Create board
- GET /api/boards/:id - Get single board
- PUT /api/boards/:id - Update board
- DELETE /api/boards/:id - Delete board

 Todos
- GET /api/todos/boards/:boardId/todos - Get todos for board
- POST /api/todos/boards/:boardId/todos - Create todo
- GET /api/todos/:id - Get single todo
- PUT /api/todos/:id - Update todo
- PUT /api/todos/reorder - Reorder todos (drag-drop)
- DELETE /api/todos/:id - Delete todo

 Screenshots

Add screenshots here after testing

 Testing

 Backend Testing
Use Postman, Thunder Client, or curl to test API endpoints.

 Frontend Testing
1. Register a new account
2. Check console/email for verification link
3. Verify email and login
4. Create boards and todos
5. Test drag-and-drop functionality
6. Toggle dark mode
7. Test password reset flow

 Deployment

 Backend (Render/Railway)
1. Push to GitHub
2. Create new Web Service
3. Add environment variables
4. Deploy

 Frontend (Vercel/Netlify)
1. Push to GitHub
2. Import project
3. Add environment variable: VITE_API_URL
4. Deploy

 Environment Variables

 Backend (.env)
env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=todo_app_db
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=To-Do App <your-email@gmail.com>
FRONTEND_URL=http://localhost:5173


 Frontend (.env)
env
VITE_API_URL=http://localhost:5000/api


 Contributing

This is a technical assessment project. Not open for contributions.

 License

MIT License

 Author

Created for Full Stack Developer Technical Assessment

 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- UI inspiration from modern task management apps
- Drag-and-drop by [@dnd-kit](https://dndkit.com/)
