# FloodSense Delhi

FloodSense Delhi is a web application that helps monitor, predict, and visualize flood risk across Delhi's wards. It combines weather forecasts, historical data, and geospatial mapping to provide an interactive dashboard for citizens, community volunteers, and emergency responders.

## Key Features

- **Interactive Map**: Visualize flood risk by ward with map overlays and heatmaps.
- **Historical Timeline**: View past flood/incident reports and rainfall trends.
- **Rainfall & Risk Charts**: Time series and distribution charts for rainfall and risk metrics.
- **Incident Reporting**: Submit community incident reports and emergency contacts.
- **Prediction Engine**: On-device or server-side flood risk predictions using integrated functions.
- **Export & Sharing**: Export reports (PDF/CSV) for sharing with authorities or judges.
- **Responsive UI**: Mobile-friendly layout and components for quick field use.

## Tech Stack

- Frontend: React + TypeScript, Vite
- UI: Tailwind CSS, shadcn UI primitives, Radix UI
- Maps: Leaflet + react-leaflet
- Charts: Recharts
- Data & Backend: Supabase (client library present), serverless functions in `supabase/functions`

## Quick Demo (for hackathon judges)

You can run the project locally to demo the app. Follow the steps below.

### Prerequisites

- Node.js (recommend 18+) and npm or pnpm
- git (optional, for cloning)

### Install

Open a terminal in the project root and run:

```bash
cd "folder path"; npm install
```

### Run in development mode (for judges)

Start the dev server and open the app:

```bash
cd "folder path"; npm run dev
```

Vite in this project starts on port 8080 by default. When the server is ready it prints a local URL such as:

```
http://localhost:8080/
```

You can also press `o` in the terminal where Vite is running to open the app in your browser automatically. Show judges the interactive dashboard, map, and forms.

### Build and preview (production build)

```bash
npm run build
npm run preview
```

`npm run preview` serves the built app so judges can see production behavior.

### Environment / Supabase notes

- The repository includes a `supabase` folder with function code and a `supabase/config.toml` sample. If the app requires Supabase services (database, auth, functions), provide the following environment variables to the running frontend or a local `.env`:

- `VITE_SUPABASE_URL` — your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — your Supabase anon/public key

If you do not have Supabase set up, the frontend will still run; however features that depend on Supabase (report persistence, server-side predictions) will need a running Supabase instance or mocked responses.

### Serverless functions (optional)

The `supabase/functions` folder contains serverless functions used for prediction/analyze endpoints. To run them locally, follow Supabase CLI docs or deploy the functions to your Supabase project and point the frontend to that project.

## Troubleshooting

- If the map tiles or Leaflet components do not appear, ensure network access to tile providers and that required CSS from `leaflet` is loaded.
- If Supabase features fail, verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set.


