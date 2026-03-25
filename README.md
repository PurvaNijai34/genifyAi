# 🚀 Genify AI  



## 📑 Table of Contents
- [🔍 Overview](#overview)
- [✨ Features](#features)
- [ 🛠️ Tech Stack](#tech-stack)
- [⚙️ Installation](#instalaltion)
- [🔒 Environment Variables](#env)
- [📷 Screenshot](#screenshot)
- [👤 Author](#author)
<h2><a class="anchor" id="overview"> 🔍Overview</a></h2>

Genify AI is a full-stack AI-powered SaaS platform that allows users to generate content, edit images, and analyze resumes using advanced AI tools.

The platform provides a freemium model where users can access basic AI features with limited credits, while premium users get unlimited access to advanced tools like image generation, background removal, object removal, and resume analysis.

It integrates authentication, billing, and role-based access using Clerk, along with real-time AI processing powered by Groq and ClipDrop APIs.

---
<h2><a class="anchor" id="features">✨ Features</a></h2>


### 🆓 Free Plan
- ✍️ Generate Articles  
- 🧠 Generate Blog Titles  
- 🎯 Limited Credits (10)

### 💎 Premium Plan
- ✍️ Generate Articles  
- 🧠 Generate Blog Titles  
- 🖼️ AI Image Generation  
- 🧹 Remove Image Background  
- ✂️ Remove Objects from Image  
- 📄 Resume Review (ATS Analysis)  
- 🚀 Unlimited Access  

---


<h2><a class="anchor" id="tech-stack"> 🛠️ Tech Stack</a></h2>

### Frontend
- React.js
- Tailwind CSS
- Clerk Authentication

### Backend
- Node.js
- Express.js

### AI Services
- Groq API (Text Generation)
- ClipDrop API (Image Generation)

### Storage & DB
- PostgreSQL
- Cloudinary (Image Processing)

### Auth & Billing
- Clerk (Authentication + Billing + Webhooks)

---
<h2><a class="anchor" id="installation">⚙️ Installation</a></h2>



### 1. Clone Repository



```bash 
git clone https://github.com/PurvaNijai34/secure-user-profile-access-control.git
```

### 2. Backend setup

####  Go to Backend Folder


```bash
cd server
npm install
npm run server
```

### 3. Frontend setup

####  Go to Frontend Folder


```bash
cd client
npm install
npm run dev
```

<h2><a class="anchor" id="env">🔒 Environment Variables</a></h2>

### 📁 Client (.env)
```bash
VITE_BASE_URL=backend_url
VITE_CLERK_PUBLISHABLE_KEY=your_key
```
### 📁 Server (.env)
```bash
PORT=5000
CLERK_SECRET_KEY=your_key
DATABASE_URL=your_db_url
GROQ_API_KEY=your_key
CLIPDROP_API_KEY=your_key
CLOUDINARY_URL=your_url
```


<h2> <a class="anchor" id="screenshot">📷Screenshots</a><h2/>

<h2><a class="anchor" id="author"> 👤 Author</a><h2/>


**Purva Nijai** 
### - 💼 GitHub: [PurvaNijai34](https://github.com/PurvaNijai34)
### - 🔗 LinkedIn: https://www.linkedin.com/in/purva-nijai-6041002a5/
### - 📧 Email: purvanijai05@gmail.com
