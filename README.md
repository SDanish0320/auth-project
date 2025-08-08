# 🔐 Auth Project — Frontend Authentication using External API

This is a simple, responsive frontend authentication project built with **HTML, CSS, and JavaScript**. It integrates with an external API for user registration and login using **JWT tokens**.

---

## 🚀 Live Demo

🔗 **Live on Vercel:** [your-vercel-link](https://your-vercel-link.vercel.app)  
📦 **GitHub Repo:** [your-github-link](https://github.com/your-username/auth-project)

---

## 🛠 Tech Stack

- HTML5
- CSS3 (modular and reusable)
- Vanilla JavaScript (ES6+)
- External API: `https://os-project-server.vercel.app`

---

## 📂 Folder Structure

```
auth-project/
│
├── index.html           # Register Page
├── login.html           # Login Page
├── welcome.html         # Welcome Screen
│
├── styles/
│   └── style.css        # Central CSS
│
└── scripts/
    ├── register.js      # Register logic
    ├── login.js         # Login logic
    └── welcome.js       # Token decoding + logout
```

---

## 🔁 Authentication Flow

1. **Register Page (`index.html`)**
   - Sends POST request to `/auth/newuser`
   - On success → redirects to login

2. **Login Page (`login.html`)**
   - Sends POST request to `/auth/existinguser`
   - On success → stores JWT token in `localStorage`
   - Redirects to welcome screen

3. **Welcome Page (`welcome.html`)**
   - Decodes token from `localStorage`
   - Displays user-specific data
   - Logout clears token & redirects to login

---

## 🧪 How to Test

### ➕ Register
1. Go to `/index.html`
2. Enter unique `username`, valid `email`, and password
3. Submit the form

### 🔑 Login
1. Use the same `username` & `password` used during registration
2. On success, you'll be redirected to the welcome screen

---

## ⚙️ Setup Locally

```bash
git clone https://github.com/your-username/auth-project.git
cd auth-project
# Open index.html or login.html in your browser
```

---

## 🧾 Notes

- ✅ Authentication is based on `username`, not email
- ⚠ Make sure the API server is online: `https://os-project-server.vercel.app`
- Token is a standard JWT format and decoded on the client side

---

## 📧 Contact

Made with ❤️ by [Your Name]