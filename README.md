# Mankind Matrix

**Mankind Matrix** is a React-based frontend application designed to showcase AI and Semiconductor products in an interactive and scalable interface.
---

## ⚙️ Tech Stack

- **React** – Frontend framework
- **JavaScript**

---

## 🚀 Getting Started

### 1. Prerequisites

Make sure you have the following tools installed on your system:

- [Node.js (LTS version recommended)](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [VS Code (optional)](https://code.visualstudio.com/)

Check installation:

```bash
node -v
npm -v
git --version
```

---


### (Optional) 2. Set Up React Project

> _Skip this if you're working directly from the existing repo. This command will create a new project where you can understand how to start from scratch a project, but for front-end development, we have everything created already, jump to step 3._

You can create a new React project using Create React App with the command below:

```bash
npx create-react-app your-project-name
cd your-project-name
npm start
```
---

### 3. Clone This Repository

To work with the **Mankind Matrix** project, clone the `master` branch:

```bash
git clone --branch master https://github.com/Nikhilbansal777/mankind_matrix
cd mankind_matrix
```

### 4. Environment Setup

The project requires environment variables to be set up before running. Follow these steps:

1. Create a `.env` file in the project root directory
2. Copy the contents from `.env.example` to your new `.env` file
3. Update the variables as needed

The `.env.example` file contains all the necessary variables that the system needs to function properly.

### 5. Backend Connection

There are two ways to connect to the backend services:

#### Option 1: Using Deployed API (Recommended for Production)

The backend services are deployed and accessible through the following URLs:

**API Documentation:**
- Product Service: https://mankind-product-service.onrender.com/swagger-ui/index.html
- User Service: https://mankind-user-service.onrender.com/swagger-ui/index.html
- Wishlist Service: https://mankind-wishlist-service.onrender.com/swagger-ui/index.html
- Cart Service: https://mankind-cart-service.onrender.com/swagger-ui/index.html

#### Option 2: Running Backend Locally (Development)

To run the backend services locally:

1. Clone the backend repository:
```bash
git clone https://github.com/rebeccayilma/mankind-backend
```

2. Follow the instructions in the backend repository to run the services using Docker

3. Update your `.env` file with the following local development URLs

**Local API Documentation:**
- Product Service: http://localhost:8080/swagger-ui/index.html
- User Service: http://localhost:8081/swagger-ui/index.html
- Wishlist Service: http://localhost:8083/swagger-ui/index.html
- Cart Service: http://localhost:8082/swagger-ui/index.html

### 6. Install Project Dependencies

Install all required packages:

```bash
npm install
```

---

### 7. Run the Development Server

Start the development server:

```bash
npm start
```

Your application should now be running at:

```
http://localhost:3000
```
### 8. Backend Integration

[Reference to backend Integration](backendIntegration.md)

---

## 🧑‍💻 Contributing

We welcome contributions! Please follow the steps below to contribute effectively:

---

### 💡 Step-by-Step: Raise a Pull Request

1. **Create a New Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes Locally**

3. **Stage and Commit Your Changes**

   ```bash
   git add .
   git commit -m "Add feature: meaningful message here"
   ```

4. **Push to Your Branch**

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request (PR)**

   - Go to: [Pull Requests](https://github.com/Nikhilbansal777/mankind_matrix/pulls)
   - Click **"New pull request"**
   - Choose:
     - **Base branch**: `master`
     - **Compare branch**: `feature/your-feature-name`
   - Provide a descriptive title and detailed summary of your changes
   - Click **Create pull request**

---

## 📂 Project Structure (Sample)

```
mankind_matrix/
├── public/
├── src/
│   ├-- layouts/
│   ├── features/
│   ├── assets/
│   ├── App.js
|    ....
|
├── .gitignore
├── index.html
├── package.json
```

---

## 🤝 Acknowledgements

Thanks to all contributors who help make this project better. We appreciate your time and efforts!
