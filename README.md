# BruinBlog  
_UCLA CS 144 — final project_

BruinBlog is a single-page, offline-capable blogging PWA that lets Bruins swap
ideas in real time, even from the Bruin Bus with no Wi-Fi.  
The stack is React 18 + Vite, Express 4, MongoDB Atlas, Redis Cloud, Socket.IO,
and Google App Engine.

---

## 1  Quick start (local dev)

```bash
git clone https://github.com/Prof-Rosario-UCLA/team5.git
cd team5

# 1.  Fill in secrets
Create a server/.env variable that contains the following information
MONGO_URI=
REDIS_URL=
JWT_SECRET=
CLIENT_URL=
EMAIL_FROM=
SMTP_HOST= email of smtp account you're emailing from
SMTP_PORT= port number of smtp (I used 587)
SMTP_USER= email of smtp account you're emailing from
SMTP_PASS= password of smtp account (If you're using gmail enable two factor authentication and then create an app password)

# 2.  Install root-level workspaces
npm install

# 3.  Run dev servers
npm --workspace client run dev &   # → http://localhost:5173
npm --workspace server run dev     # → http://localhost:8080
