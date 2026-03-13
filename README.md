# StudyVault

## Project Overview
StudyVault is a modern, responsive web application built for students and lifelong learners to manage and curate their personal study resources. It provides a secure platform to save helpful links, categorize them, and attach visual thumbnails, all while contributing to a public repository of knowledge accessible to everyone.

## Features
- **Public Feed**: A beautiful public homepage displaying all resources shared by the community.
- **Secure Authentication**: Registration and Login flows powered by Supabase Auth.
- **Personal Dashboard**: A protected area where users can manage only the resources they have created.
- **Full CRUD Operations**: Create, Read, Update, and Delete your study resources.
- **Image Uploads**: Attach image thumbnails to your resources via Supabase Storage.
- **Safe Deletion**: Deletion confirmation dialogue to prevent accidental data loss.

## Tech Stack
- Frontend Framework: Next.js 15 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- UI Components: Shadcn UI
- Backend & Database: Supabase (Auth, Postgres, Storage)

## Setup Instructions

1. **Clone the repository** (if applicable) and navigate to the project root.
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local` and add your Supabase credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```
4. **Database Configuration**:
   Execute the `supabase/setup.sql` script in your Supabase project's SQL Editor to set up the necessary tables, storage bucket, and Row Level Security (RLS) policies.

## Run Instructions

Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment Instructions

This project is Vercel-ready!
1. Push your code to a GitHub repository.
2. Sign in to Vercel and create a new project.
3. Import your GitHub repository.
4. Add your Environment Variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel project settings.
5. Deploy! Vercel will automatically detect Next.js and build your application.

> **Note for Vercel Deployment**: Ensure your Supabase project is set not to pause during inactivity if you expect regular visitors, or visitors might experience a cold start delay.
