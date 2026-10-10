🗺️ Outing Aura — Mood & Aesthetic Outing Engine

SerpApi India Hackathon 2026 Submission

Discover real-time, handpicked local spots tailored precisely to your mood, aesthetic, and vibe.

🌟 Overview

Outing Aura transforms how people explore cities by moving beyond traditional keyword searches. Instead of searching for "cafes near me," users can enter expressive, atmospheric prompts like "Quiet rooftop cafe with acoustic music and cozy aesthetic" or "Late night dessert spot with neon lighting in Hinglish/Hindi/English".

Using a Dual-Engine SerpApi Integration coupled with Google Gemini AI, Outing Aura analyzes live map data alongside real visual search context to curate tailored places, suggest aesthetic outfit tips, design a 3-step timeline itinerary, and decode local specialty highlights with real visitor community photos.

✨ Key Features

⚡ Dual-Engine SerpApi Synergy:

google_maps Engine: Fetches live local results, overall ratings, review counts, coordinates, and exact address metadata.

google_images Engine: Extracts visual decor, ambient lighting, and aesthetic interior context for real-world grounding.

google (Search Web) Engine: Scrapes live organic snippets to power the specialty decoder.

👗 Aesthetic & Outfit Scout:

Leverages visual context from SerpApi Images to provide style, color palette, and clothing recommendations tailored to each venue's ambient aesthetic.

🎯 "Why It's Famous" & Specialty Decoder:

Clicking on any place card opens a dynamic modal fetching real-time organic web snippets and community visitor photos (from Google, Instagram, and web reviews) with direct source redirection links.

🌐 Native Dynamic Multilingual Engine:

Automatically detects user prompt language/script/dialect (e.g., Hinglish, Hindi, English, Gujarati, Spanish) and responds strictly in the user's preferred language and tone.

🛡️ Production-Grade Resilience & Performance:

MongoDB Cache: Prevents redundant API calls and ensures lightning-fast sub-second cached responses.

Resilient Gemini LLM System: Optimized Gemini integration with automatic error recovery.

Robust Safe JSON Parsing: Custom JSON cleaner prevents server crashes from malformed LLM outputs.

🏗️ Architecture & Tech Stack

   [User Prompt]
         │
         ▼
[MongoDB Cache Check] ──(Hit)──► Return Cached Results (⚡ <50ms)
         │
      (Miss)
         ▼
[SerpApi Dual Engine Parallel Fetch]
  ├── Engine A: google_maps   (Place Data, Ratings, Address)
  └── Engine B: google_images (Aesthetic & Interior Context)
         │
         ▼
[Gemini LLM Synthesis] (Language Match + Outfit Scout + Itinerary)
         │
         ▼
[MongoDB Cache Upsert] & [Aesthetic Frontend Render]



Frontend: React.js, Tailwind CSS, Framer Motion, Lucide Icons

Backend: Node.js, Express.js, Nodemon

Database: MongoDB (Mongoose, TTL Cache Index)

APIs & Services: SerpApi (google_maps, google_images, google), Google Gemini API

🚀 Quick Start & Setup Instructions

Prerequisites

Node.js (v18+)

MongoDB database instance (Local or MongoDB Atlas)

SerpApi API Key

Google Gemini API Key

1. Backend Setup

# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
touch .env



Add your environment variables inside backend/.env:

PORT=5000
MONGO_URI=mongodb://localhost:27017/vibemap_db
SERPAPI_API_KEY=your_serpapi_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here



Start the backend server using Nodemon or NPM:

# Start server in development mode with Nodemon
npm run dev

# OR start in standard production mode
npm start



2. Frontend Setup

# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev



The application will be running live at http://localhost:5173.

📸 Usage Demo Walkthrough

Vibe Discovery: Enter your mood/vibe prompt and city (e.g. "Aesthetic cafe with plant decor in Vadodara").

Visual & Outfit Guidance: Review handpicked spots along with AI-generated outfit recommendations grounded in real visual search snippets.

Specialty Decoder: Click any place card to launch the modal showcasing "Why People Love This Spot", pro visitor tips, and clickable visitor community photos redirecting directly to source posts.

Fresh Re-analysis: Tap "Refresh Live Data" to bypass MongoDB cache and generate fresh insights.

📄 License

Built for the SerpApi India Hackathon 2026.
