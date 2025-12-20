# 📁Online File System

A secure web application that allows users to upload, download, and delete files with authenticated access. The system ensures user-specific file isolation and maintains data privacy while abstracting backend storage details from users.

**Try it out live:** https://ourdb.onrender.com/

## Features

- Secure user authentication and protected access
- Upload, download, and delete files
- User-specific file isolation for data privacy
- Reliable client–server interaction with proper error handling
- Responsive and clean user interface

## Project Overview

This project focuses on building a structured and secure file management system with clear separation between frontend and backend responsibilities. It emphasizes access control, data privacy, and reliable request handling to deliver a smooth and secure user experience.

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Thirumalesh921/OnlineFileSystem.git
cd OnlineFileSystem
```
### 2. Frontend Setup
```bash
cd client
npm install
```

### 3. Create a .env file inside the client folder
```bash
VITE_BACKEND_URL=http://localhost:3000
```

### 4. Start Frontend
```bash
npm run dev
```

### 5. Backend Setup
```bash
cd server
npm install
```

### 6. Create a .env file inside the server folder:
```bash
PORT=3000
GITHUB_TOKEN=your_github_token
JWT_SECRET=your_jwt_secret
MONGO_URL=your_mongodb_connection_string
GITHUB_USER=your_github_username
GITHUB_REPO=your_repository_name
FRONTEND_URL=http://localhost:5173
```

### 7. Start Backend
```bash
npm run dev
```

# Future Enhancements

Folder organization

File sharing support

File preview functionality

Storage usage tracking
