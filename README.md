### CADzilla

# **3D Model Uploader & Viewer**  

🚀 A **React & express 3D model uploader and viewer** that allows users to upload, preview, manipulate, and manage **STL** and **OBJ** files interactively.

---

## **📌 Features**  

✅ **Drag & Drop File Upload** – Easily upload 3D models.  
✅ **File Format Support** – Supports `.stl` and `.obj` formats.  
✅ **Animated UI** – Smooth UI interactions with **Framer Motion**.  
✅ **Recent Uploads Section** – Uploaded models appear dynamically in a history section.  
✅ **Color Picker** – Hidden input-based color selection.  
✅ **JWT Authentication** – Secure access with token-based authentication.  
✅ **Model Manipulation Options** –  
   - **Zoom In & Zoom Out**  
   - **Rotate & Pan**  
   - **Reset View**  

---

## **🛠️ Tech Stack**  

- **Frontend:**  
  - React.js (Vite)  
  - Tailwind CSS  
  - Framer Motion  
  - Lucide Icons  
  - React Hot Toast  
  - Three.js  

- **Backend:**  
  - Node.js (Express.js)  
  - MongoDB (Mongoose)  
  - Multer (File Uploads)  
  - JWT Authentication  

---

## **📂 Folder Structure**  

```
📦 3D-Model-Uploader
├── 📂 node_modules
├── 📂 public
├── 📂 server
│   ├── 📂 config              # Configuration files (DB connection)
│   ├── 📂 controllers         # Handles authentication & file uploads
│   │   ├── authController.js
│   │   ├── fileController.js
│   ├── 📂 middleware          # Authentication middleware
│   ├── 📂 models              # MongoDB models
│   ├── 📂 routes              # API endpoints
│   │   ├── auth.route.js
│   │   ├── file.route.js
│   ├── 📂 uploads             # Uploaded files storage
│   ├── .env                   # Environment variables
│   ├── app.js                 # Express app entry point
│   ├── package.json
├── 📂 src (Frontend)
│   ├── 📂 components          # Reusable UI components
│   ├── 📂 pages               # Page-level components
│   ├── .env                   # Frontend environment variables
│   ├── App.jsx                # Main React component
│   ├── index.html
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js
│   ├── package.json
│   ├── README.md
```


## **⚡ How to Run Locally**  

### **1️⃣ Clone the repository**  
```sh
git clone https://github.com/cherish2003/Cadzilla.git
cd Cadzilla
```

### **2️⃣ Install dependencies**  

#### **Frontend**
```sh
npm install
```

#### **Backend**
```sh
cd server
npm install
```

### **3️⃣ Set up environment variables**  
- Create a `.env` file in both **src** and **server** folders and add the respective variables.

---

## **📄 Environment Variables**  

### **Frontend (`src/.env`)**
```
VITE_API_URL=<your-backend-url>
```

### **Backend (`server/.env`)**
```
MONGO_URI=mongodb+srv://<your-db-connection>
JWT_SECRET=<your-jwt-secret>
```

---

### **4️⃣ Start the backend**
```sh
cd server
npm run dev
```

### **5️⃣ Start the frontend**
```sh
npm run dev
```

---

## **🎮 How to Use Model Viewer**  

- **Upload a Model** – Drag & drop or browse for `.stl` or `.obj` files.  
- **Interact with the Model** –  
  - **Zoom In/Out** – Scroll or use buttons.  
  - **Rotate** – Click & drag.  
  - **Pan** – Hold `Shift` and drag.  
  - **Reset View** – Click reset.  

---
