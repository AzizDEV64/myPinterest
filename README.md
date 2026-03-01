# 📌 myPinterest

A Pinterest-inspired image gallery application. Users can upload, update, delete, and browse images in a Masonry-style layout with infinite scrolling.

![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen?logo=mongodb)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Image%20CDN-blue?logo=cloudinary)
![EJS](https://img.shields.io/badge/EJS-Template%20Engine-yellow)

---

## 🎯 Features

- 🖼️ **Masonry Gallery** — Pinterest-style responsive card layout
- ♾️ **Infinite Scroll** — Automatically loads more content on scroll
- ➕ **Image Upload** — Upload files or drag & drop image URLs from the web
- ✏️ **Image Update** — Edit title, description, and replace image
- 🗑️ **Image Delete** — Removes from both Cloudinary and the database
- 🔍 **Lightbox** — Click any image for a full-screen preview
- 🎨 **Modern UI** — Inter font, glassmorphism effects, smooth animations
- 🛡️ **XSS Protection** — Client-side HTML escaping
- 🔐 **CORS Configuration** — Restricted to allowed origins only

---

## 🏗️ Architecture

The project consists of **two independent Express servers**:

```
myPinterest/
├── backend/              # REST API (Port 5000)
│   ├── bin/www               # Server bootstrap & DB connection
│   ├── app.js                # Express config & CORS
│   ├── config/
│   │   └── enum.js           # HTTP status codes
│   ├── db/
│   │   ├── DB.js             # Mongoose singleton connection
│   │   └── models/
│   │       └── Image.js      # Image schema
│   ├── lib/
│   │   ├── Error.js          # Custom error class
│   │   └── Response.js       # Standardized API responses
│   ├── routes/
│   │   ├── index.js          # Auto route loader
│   │   └── image.js          # CRUD endpoints
│   ├── .env
│   └── .env.example
│
├── frontend/             # SSR Web Interface (Port 3000)
│   ├── bin/www               # Server bootstrap
│   ├── app.js                # Express + EJS config
│   ├── routes/
│   │   ├── index.js          # Home page & pagination API
│   │   └── image.js          # Image operations (proxy → backend)
│   ├── views/
│   │   ├── index.ejs         # Main gallery page
│   │   └── error.ejs         # Error page
│   ├── public/
│   │   ├── stylesheets/
│   │   │   └── style.css     # All styles
│   │   └── javascripts/
│   │       └── app.js        # Modals, lightbox, drag & drop
│   ├── .env
│   └── .env.example
│
└── .gitignore
```

### Data Flow

```
User (Browser)
     │
     ▼
Frontend (Express + EJS)  ──axios──▶  Backend (REST API)
     Port 3000                              Port 5000
                                               │
                                    ┌──────────┼──────────┐
                                    ▼                     ▼
                              MongoDB               Cloudinary
                            (Database)             (Image CDN)
```

---

## 🗄️ Database Schema

**Image** model:

| Field         | Type     | Description                        |
| ------------- | -------- | ---------------------------------- |
| `title`       | String   | Image title (max 100 chars)        |
| `description` | String   | Image description (max 500 chars)  |
| `imageURL`    | String   | Cloudinary image URL               |
| `publicId`    | String   | Cloudinary public ID               |
| `createdAt`   | Date     | Creation timestamp (auto)          |
| `updatedAt`   | Date     | Last update timestamp (auto)       |

---

## 🔌 API Endpoints

All endpoints are under the `/api/image` prefix.

| Method   | Endpoint                | Description                              |
| -------- | ----------------------- | ---------------------------------------- |
| `GET`    | `/api/image/feed`       | Get the first 10 images                  |
| `POST`   | `/api/image/images`     | Paginated image list (`page` in body)    |
| `POST`   | `/api/image/add`        | Add a new image (multipart/form-data)    |
| `PUT`    | `/api/image/update/:id` | Update an image (optional new file)      |
| `DELETE` | `/api/image/delete/:id` | Delete an image (Cloudinary + DB)        |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16+)
- **MongoDB** (local or Atlas)
- **Cloudinary** account ([cloudinary.com](https://cloudinary.com))

### 1. Clone the Repository

```bash
git clone https://github.com/<username>/myPinterest.git
cd myPinterest
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configure Environment Variables

Copy the example files and fill in your credentials:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

**`backend/.env`**

```env
PORT=5000
DB_URL=mongodb://localhost:27017/myPinterest
FRONTEND_URL=http://localhost:3000
CLOUD_NAME=your_cloud_name
API_KEY=your_api_key
API_SECRET=your_api_secret
```

**`frontend/.env`**

```env
PORT=3000
BACKEND_URL=http://localhost:5000/api
```

### 4. Run the Application

In two separate terminals:

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open **http://localhost:3000** in your browser. 🎉

---

## 🛠️ Tech Stack

### Backend
| Package       | Purpose                           |
| ------------- | --------------------------------- |
| `express`     | Web framework                     |
| `mongoose`    | MongoDB ODM                       |
| `cloudinary`  | Cloud-based image storage         |
| `multer`      | File upload (memory storage)      |
| `cors`        | Cross-origin resource sharing     |
| `dotenv`      | Environment variable management   |
| `morgan`      | HTTP request logging              |

### Frontend
| Package       | Purpose                           |
| ------------- | --------------------------------- |
| `express`     | Web framework                     |
| `ejs`         | Template engine (SSR)             |
| `axios`       | Backend API requests              |
| `multer`      | File upload (proxy)               |
| `form-data`   | Multipart form construction       |
| `dotenv`      | Environment variable management   |

---

## 📜 License

This project was developed for educational purposes.
