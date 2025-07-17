# 🛍️ Strength Labz — Next-Gen Fitness eCommerce Platform

Strength Labz is a powerful and fully functional MERN-stack based fitness eCommerce website that sets itself apart from generic online stores. Built with performance, scalability, and user experience in mind, it supports both user and admin functionalities, secure authentication, cloud-based media handling, and smooth payment integration — delivering a seamless and modern online shopping experience.

## 🚀 Live Demo

🌐 [View Live Website](https://strengthlabz.vercel.app)  
📦 [Backend API](https://strengthlabz-server.onrender.com)

---

## ⚙️ Features

### 🛒 For Users
- Browse products with responsive UI
- Product details with image carousel & related suggestions
- Add to cart, update quantities, remove items
- Secure login/register with JWT
- Checkout with Razorpay payment integration
- Order confirmation & purchase history

### 🛠️ For Admin
- Admin-only dashboard with authentication
- Full CRUD operations on products & categories
- Upload product images via Cloudinary
- View and manage user orders
- Real-time admin panel updates

### 🌐 Tech Stack
| Frontend | Backend | Database | Cloud & Tools |
| -------- | ------- | -------- | -------------- |
| React.js + Vite | Express.js | MongoDB Atlas | Cloudinary (images) |
| Tailwind CSS | Node.js | Mongoose | JWT Authentication |
| Axios | REST API | Razorpay | Git + GitHub |
| React Router | Multer | Dotenv | Railway / Render for hosting |

---

## 📂 Project Structure

```bash
strengthLabz/
│
├── client/              # React Frontend
│   ├── components/      # UI Components
│   ├── pages/           # User/Admin Pages
│   └── utils/           # Axios config, constants
│
├── server/              # Express Backend
│   ├── controllers/     # Business logic
│   ├── routes/          # API Routes
│   ├── models/          # MongoDB Schemas
│   ├── middleware/      # Auth, Error Handling
│   └── uploads/         # Product image handling
│
├── .env                 # Environment Variables
└── README.md
```

### 💡 Why Strength Labz Stands Out
🔐 Security First: Role-based access, token-based auth, route protection.
✅ Full-Stack Production Ready: Not just a frontend showcase — it has a fully operational backend with DB, Auth, Payments.
☁️ Cloud Native: Cloudinary for scalable image hosting and Razorpay for real-world payment handling.
⚙️ Scalable Architecture: Modular folder structure and clean codebase — easy to maintain and extend.
💼 Recruiter Impact: Demonstrates real-world skills — Full Stack, REST APIs, auth, deployment, state management, and more.

### 🧪 Local Development Setup
# Clone the repository
git clone https://github.com/aryankardam/StrengthLabz.git
cd StrengthLabz

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

# Run both servers
npm run dev  # from /client
npm start    # from /server


### 📜 License
This project is open-source and available under the MIT License.

### 📬 Contact
Created with ❤️ by Aryan Kardam
📧 **Email**: aryankardam50275@gmail.com
🔗 **Portfolio**: [Visit My Portfolio](https://personal-portfolio-main-git-main-aryan-kardams-projects.vercel.app/)
