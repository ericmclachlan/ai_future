# Presentation App

Interactive presentation application with synchronized slide control across multiple devices. 

This application was built to support a presentation on "Surviving AI as a Software Engineer" at the VIATEC AI Meetup, enabling real-time slide synchronization across presenter and audience devices.

## Quick Start

```bash
# Install dependencies
npm install

# Run both frontend and backend
npm run dev:full
```

## Development

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Docker

```bash
docker compose up
```

## Endpoints

### Frontend
- http://localhost:5173/presenter — Presenter view
- http://localhost:5173/audience — Audience view

### Backend API
- GET  http://localhost:3001/api/current-slide — Get the current slide index
- POST http://localhost:3001/api/current-slide — Set the current slide index (JSON: `{ currentSlide: number }`)
