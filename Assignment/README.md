# Online Course Management System 🎓

This project is a modern, responsive **Online Course Management System** built with a microservices architecture. It includes 4 backend microservices, an API Gateway, and a React frontend.

---

## 👥 Group Members & Contributions

This application is divided into sub-domains, with one microservice per member:
* **Mathumitha G**: Student Service (Port 3001)
* **Vithushana N**: Course Service (Port 3002)
* **Shangave M**: Enrollment Service (Port 3003)
* **Prasadh N H**: Instructor Service (Port 3004)

---

## 🏗️ Architecture Overview

The system is built separating concerns into independent functional areas, communicating via an API Gateway.

### **1. Backend (Microservices + API Gateway)**
- **4 Independent Microservices**: Each runs on its own port, has its own controller, model, validator, and routes, simulating a distributed ecosystem.
- **In-Memory Store**: Data is stored using in-memory arrays for simplicity without sacrificing CRUD functionality.
- **API Gateway (Port 3000)**: A central entry point that proxies incoming requests from the frontend to the respective backend microservices.
- **Validation**: Each service enforces strict data validation (required fields, string lengths, email formatting, numeric limits) and returns structured JSON errors (`400`, `409`, `422`).
- **Documentation**: Swagger UI is integrated into every microservice, providing interactive and detailed API documentation.

### **2. Frontend (React UI)**
- A Single Page Application (SPA) built with React and Vite.
- Implements a modern, dynamic UI with a clean dark-gradient aesthetic.
- Components include Context-based state management, dynamic routing, protected layouts, and comprehensive error/success toast notifications linking seamlessly to the API Gateway.

---

## 💻 Technologies & Dependencies

**Backend Stack:**
* **Node.js** & **Express** (Core server framework)
* **express-http-proxy** (For API Gateway routing)
* **cors** (Cross-Origin Resource Sharing for frontend connectivity)
* **swagger-jsdoc** & **swagger-ui-express** (For API documentation generation)
* **nodemon** & **npm-run-all** (For parallel development and execution)

**Frontend Stack:**
* **React 18** (UI library)
* **Vite** (Build tool and fast development server)
* **React Router DOM** (Client-side routing)
* **Lucide React** (Modern SVG icons provider)
* **Vanilla CSS** (Component-scoped modules and global design system variables)

---

## 🔄 System Workflow

1. The User accesses the application via the React Frontend (`http://localhost:5173`).
2. Upon performing an action (e.g., creating a Student), the frontend sends an HTTP request to the **API Gateway** (`http://localhost:3000`).
3. The API Gateway routes the request to the correct microservice (e.g., **Student Service** on `http://localhost:3001`).
4. The requested microservice validates the incoming data. 
   - If invalid, it immediately returns an error response (`400`, `409`, `422`).
   - If valid, it updates its scoped in-memory data store and returns a success response (`200`, `201`).
5. The API Gateway passes the response back to the Frontend.
6. The Frontend parses the response and displays visual feedback (e.g., a success toast or an error warning) to the user.

---

## 🚀 How to Run this Program

### Prerequisites
* [Node.js](https://nodejs.org/) (v16.x or newer)
* Modern web browser (Chrome, Safari, Firefox, Edge)

### Step 1: Start the Backend
The backend consists of four microservices and one gateway. They can all be started simultaneously.

1. **Open a terminal** in the root directory:
   ```bash
   cd services
   ```
2. **Install all backend dependencies**:
   ```bash
   npm install
   ```
3. **Start the services**:
   ```bash
   npm start
   ```
   *You will see terminal output confirming that all 5 processes (Gateway, Student, Course, Enrollment, Instructor) are running.*
   > **Note:** Do not close this terminal. It must remain active to serve the frontend!

### Step 2: Start the Frontend
The frontend requires a separate terminal process to run its development server.

1. **Open a NEW terminal tab/window** and navigate to the frontend folder:
   ```bash
   cd /path/to/Assignment/frontend
   ```
2. **Install frontend dependencies**:
   ```bash
   npm install
   ```
3. **Launch the build server**:
   ```bash
   npm run dev
   ```
4. **Access the application**:
   Open a browser and navigate to: **http://localhost:5173**

---

## 📖 How to Use the Application

1. **Login Simulation**: Go to `http://localhost:5173`. Enter any email and password and click Login (authentication is a mock placeholder for the UI).
2. **Dashboard**: View high-level metrics of your system.
3. **Sidebar Navigation**: Manage operations. Ensure you create **Students** and **Courses** *before* you attempt to link them via **Enrollments**.
4. **CRUD Actions**: Use the table action menus to Create, Edit, or Delete records completely interactively. Let validation guardrails catch missing/invalid inputs!

---

## 📚 How to View the Swagger Documentation

Each microservice generates interactive Swagger API documentation detailing its schemas, request parameters, response models, and validation constraints.

While the backend is running (`npm start`), open the following links in your browser:
* **Student API Docs**: [http://localhost:3001/api-docs](http://localhost:3001/api-docs)
* **Course API Docs**: [http://localhost:3002/api-docs](http://localhost:3002/api-docs)
* **Enrollment API Docs**: [http://localhost:3003/api-docs](http://localhost:3003/api-docs)
* **Instructor API Docs**: [http://localhost:3004/api-docs](http://localhost:3004/api-docs)
* **API Gateway Summary**: [http://localhost:3000/](http://localhost:3000/)

You can natively test REST requests (GET, POST, PUT, DELETE) directly from these Swagger UI panels.

---
*Created for IT4020 – Modern Topics in IT*
