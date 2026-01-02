# 🌊 FloodSense Delhi

FloodSense Delhi is a web-based flood monitoring and visualization platform designed to help **citizens, volunteers, and emergency responders** understand and respond to flood risks across Delhi’s wards.

The application combines **weather data, historical trends, predictive logic, and interactive geospatial maps** into a single, easy-to-use dashboard suitable for **hackathons, demos, and real-world pilots**.

---

## 🚀 Live Demo

🔗 **Live Deployment:**  
👉 https://floodsensedelhi.vercel.app/

- Deployed on **Vercel** with GitHub-integrated CI/CD
- Publicly accessible (no login required)
- Works on desktop and mobile devices

---

## ✨ Key Features

- **Interactive Flood Map**
  - Ward-level flood risk visualization
  - Built using Leaflet and react-leaflet

- **Data Visualizations**
  - Rainfall trends and flood-risk analytics
  - Charts rendered using Recharts

- **Historical Insights**
  - Timeline-based flood and rainfall data exploration

- **Incident & Community Reporting**
  - Forms for submitting local flood or emergency reports

- **Prediction & Analysis**
  - Client-side logic with optional serverless prediction functions
  - Supabase Edge Functions support

- **Responsive UI**
  - Mobile-first and fully responsive layout
  - Built with Tailwind CSS and shadcn UI primitives

---

## 🛠 Tech Stack

**Frontend**
- React + TypeScript
- Vite

**UI**
- Tailwind CSS
- shadcn UI
- Radix UI

**Maps**
- Leaflet
- react-leaflet

**Charts**
- Recharts

**Backend / Data**
- Supabase (client library)
- Supabase Edge Functions (`supabase/functions`)

**Deployment**
- Vercel (GitHub-integrated CI/CD)

---

## 📦 Local Development

### Prerequisites
- Node.js **18+**
- npm
- Git (optional)

---

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd floodsensedelhi-main
npm install
```

Run in Development Mode

```bash
npm run dev
```

Vite will start a local development server and output a URL such as:

```bash
http://localhost:8080/
```

## 📌 Deployment Notes

Frontend is deployed on Vercel

GitHub is the source of truth for application code

Deployment-specific settings (environment variables, install flags) are handled at the platform level

Continuous deployment triggers on pushes to the main branch





## 📄 License
This project is intended for demo, research, and educational purposes.












