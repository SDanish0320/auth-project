# 🔐 Auth Project — Frontend Authentication

This is a simple responsive frontend auth project using **HTML, CSS, and JavaScript**, integrated with an external API (`https://os-project-server.vercel.app`) that returns a **JWT token** after login.

## 🚀 Live Demo

🔗 **Live on Vercel:** [https://auth-project-ivory-phi.vercel.app](https://auth-project-ivory-phi.vercel.app)  
🔗 **GitHub Repo:** [https://github.com/SDanish0320/auth-project](https://github.com/SDanish0320/auth-project)  

## 🔑 Features

- User registration via `/auth/newuser`
- Login via `/auth/existinguser` using **username**
- Token decoding & welcome screen
- Logout functionality
- Clean, responsive UI

## 📁 Files & Folders

├── index.html # Login Page
├── register.html # Registration Page
├── reset-password.html # Reset Password Page
│
├── scripts/
│ ├── login.js # Login logic
│ ├── register.js # Registration logic
│ ├── reset-password.js # Reset password logic
│
├── styles/
│ ├── style.css # Main stylesheet

markdown
Copy
Edit

## 🧪 Test Instructions

1. **Register:** Open `register.html`, fill username/email/password  
2. **Login:** Go to `index.html`, use the same username + password  
3. **Welcome:** JWT token is decoded, user ID shown  
4. **Logout:** Clears token and redirects to login  

## 📎 Notes

- ✅ Use **username** (not email) to login  
- ⚠ Ensure backend server is live  
- Token is stored in `localStorage`  

## 👤 Author

Made with ❤️ by **Muhammad Danish**