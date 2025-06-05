

# SkillSwap

**SkillSwap** is a full-stack social platform for peer-to-peer skill exchange. Instead of using money, users can trade their skills — from graphic design to guitar lessons — with others who have something to offer in return.

This project includes a built-in Telegram-style real-time chat with read receipts, reactions, and modern UX to make collaboration seamless and personal.

---

## 🌐 Live Demo

- **Frontend (Vercel)**: [https://skillswap-mauve.vercel.app/profile](https://skillswap-mauve.vercel.app/profile)
- **Backend (Railway)**: [latest-skillswap-production.up.railway.app](latest-skillswap-production.up.railway.app)

---

## 🚀 Features

- 🔁 **Skill-based request system** – Users can post skills and request skills from others
- 💬 **Real-time messaging** – Chat like Telegram with message reactions, read indicators, and animations(some features will be available in future updates)
- 📩 **Notification logic** – See updates live without reloading
- 🎭 **Auth system** – Simple and secure account creation (no Google yet)
- 💼 **Profile system** – Show your skills, edit/delete requests, and manage active trades
- 🎨 **Modern design** – Responsive UI with TailwindCSS and thoughtful UX
- 🛡️ **Amdin Features** - Admin can delete skills and see reported skill requests

---

## 🛠 Tech Stack

**Frontend:**

- React + Vite
- TypeScript
- Zustand (state management)
- TailwindCSS
- SCSS modules
- pnpm

**Backend:**

- Node.js + Express
- MongoDB (via Mongoose)
- Socket.IO (real-time messaging)
- Railway (deployment)

---

## 📦 Install Dependencies

Make sure you have [pnpm](https://pnpm.io/) installed globally:

```bash
npm install -g pnpm
```

Then install all dependencies:

```bash
pnpm install
```

---

## 🔧 Environment Variables

You need to set up `.env` files for both the frontend and backend.

### Frontend: `/frontend/.env`

```env
VITE_API_URL=https://your-backend-url.up.railway.app
```

### Backend: `/backend/.env`

```env
MONGODB_URI=your-mongodb-connection-string
PORT=5000
CLIENT_URL=https://your-frontend-url.vercel.app
```

---

## 🧪 Running the App Locally

Open two terminals or use a process manager like `concurrently`.

### Run the frontend

```bash
cd frontend
pnpm dev
```

### Run the backend

```bash
cd backend
pnpm dev
```

The frontend will typically be available at [http://localhost:5173](http://localhost:5173) and the backend at [http://localhost:5000](http://localhost:5000).

---

## 🗂 Project Structure

```
skillswap/
├── frontend/      # React + Vite + Tailwind
│   ├── src/
│   └── ...
├── backend/       # Node.js + Express + Mongoose + Socket.IO
│   ├── src/
│   └── ...
```

---

## ✅ Deployment

- **Frontend:** Deployed via [Vercel](https://vercel.com)
- **Backend:** Hosted on [Railway](https://railway.app)
- Ensure both frontend and backend URLs are correctly set in your `.env` files for production.

---

## 📌 TODO / Future Features

- AI-powered skill matching
- Skill calendars and availability system
- Review and rating system
- Public shareable user portfolios

---

## 📄 License

This project is licensed under the MIT License.
