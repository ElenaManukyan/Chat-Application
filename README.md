# 💬 Slack Clone Chat Application

## Tests:
[![Actions Status](https://github.com/ElenaManukyan/frontend-project-12/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/ElenaManukyan/frontend-project-12/actions)

## 🚀 Demonstration:
[https://frontend-project-12-yffa.onrender.com](https://frontend-project-12-yffa.onrender.com)

## Description
This is a simplified version of a real-time messaging application inspired by Slack. The project demonstrates the use of modern frontend development technologies such as **React**, **Redux Toolkit**, **WebSockets**, and **REST API**.  

## 🌟 Features:
- 💬 Chat and channel functionality.
- ⚡ Real-time message exchange using WebSockets.
- 🔐 User authentication and authorization.
- 🌍 Interface localization (i18n).
- 🛠 State management using Redux Toolkit.
- 📝 Form validation with Formik and Yup.
- 🔔 Action notifications via React Toastify.

---

## ⚙️ Installation and Setup

```
# Clone the repository
   git clone https://github.com/ElenaManukyan/Chat-Application.git
   cd Chat-Application

# Install dependencies. (backend)
   npm install
   
 # Install dependencies. (frontend)
   cd frontend
   npm install
# Build the frontend
   npm run build
# Start the server
   cd ..
   npm run start
# Start the frontend part
   cd frontend
   npm run start
```
The application should open at: ```http://127.0.0.1:5001```

## 🛠 Technologies

### Backend:
* **Socket.IO** — for WebSocket communication.
* **@hexlet/chat-server** — a library for chat server functionality.

### Frontend:
* **React** — a library for building user interfaces.
* **Redux Toolkit** — for state management.
* **React Router Dom** — for client-side routing.
* **Formik & Yup** — for form creation and validation.
* **React Bootstrap** — for UI styling.
* **Rollbar** — for error monitoring.
