# 🌸 සුභ වෙසක් මංගල්‍යයක් වේවා! (Blessed Vesak Greeting Cards)

An elegant, premium 3D digital book-fold Vesak greeting card application built using React, TypeScript, Tailwind CSS, and Supabase.

## ✨ Features
- **Luxurious 3D Book-Fold Animation**: A gorgeous greeting card that folds open like a premium physical card on click.
- **14 Masterpiece Art Covers**: Dynamic high-definition Buddhist-themed cover designs ( lanterns, stupas, bo-leaves).
- **20 Beautiful Sinhala Vesak Poems**: Fully curated list of traditional four-line verses (සිව්පද කවි) with dynamic shuffling.
- **Ambient Buddhist Chant/Music**: Plays a soft, relaxing Buddhist ambient track (`videoId: k783W5arEI4`) at a gentle **12% volume** upon user interaction, with global mute/unmute floating controls.
- **Supabase-Powered Shortlinks**: Generates ultra-clean shareable short links like `/vesak-card/abcdef` instead of ugly parameters.
- **Vercel Router Integration**: Full Single Page Application (SPA) fallback support utilizing `vercel.json`.

## 🚀 Setup & Run Locally
1. Clone this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables inside `.env`:
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. Start local development server:
   ```bash
   npm run dev
   ```

## 🌐 Deployment (Vercel)
Deploy easily on Vercel by importing your GitHub repository and adding your `.env` variables under Project Settings!
