# Annot8-3D

**This project is currently under development and not ready for production use.**

A 3D annotation tool built with Vue.js and FastAPI for annotating point cloud data.

## Features
- Interactive 3D visualization using Three.js
- Multiple viewport perspectives (Main, Overhead, Side, Front views) 
- Annotation tools for labeling 3D objects
- Project and episode management
- JWT-based authentication
- FastAPI backend with OpenAPI specification

## Tech Stack

### Frontend
- Vue 3 with TypeScript
- Vuetify 3 for UI components
- Three.js for 3D rendering
- Pinia for state management
- Vite as build tool

### Backend
- FastAPI
- Python 3.8+
- OpenAPI Generator
- JWT Authentication

## Getting Started

### Frontend Setup
Install dependencies:

```bash
npm install
npm run dev
```

### Backend Setup
Check out the [backend README](src/backend/README.md) for instructions on setting up the FastAPI server.



## Project Structure
```
.
├── src/
│   ├── frontend/         # Vue.js frontend application
│   │   ├── components/   # Vue components
│   │   ├── layouts/      # Page layouts
│   │   ├── stores/       # Pinia stores
│   │   └── utils/        # Utility functions
│   │
│   └── backend/         # FastAPI backend server
│       ├── server/      # Server implementation
│       └── generated/   # OpenAPI generated code
```
