# Jeera – A Modern Jira Clone for Project Management

A sleek, full-stack task and project management platform inspired by Jira, featuring AI-powered suggestions, multiple task views, and real-time collaboration.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-teal?style=flat-square&logo=tailwind-css)
![Appwrite](https://img.shields.io/badge/Appwrite-14-pink?style=flat-square&logo=appwrite)

---

## Features

- **AI Integration** – Generate project descriptions & task suggestions
- **Multi-Workspace Support** – Manage multiple organizations
- **Projects & Tasks** – Full CRUD with status, assignees, due dates
- **Multiple Views** – Kanban, Table, and Calendar
- **Role-Based Access Control** – Admin/Member permissions
- **Dark/Light Theme** – Enabled both dark and light mode
- **Smart Filtering & Bulk Edits**
- **Dashboard Analytics** – Visual progress and completion tracking
- **Responsive UI** – Mobile-optimized and theme-switching support

---

## Tech Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + ShadcnUI
- **State & Forms**: React Hook Form, Zod, TanStack Query

### Backend

- **API**: Hono.js
- **Database & Auth**: Appwrite (NoSQL + Session Auth)
- **AI**: Cohere API (Project & Task AI descriptions)

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/japsimar-soin/Jeera.git
cd jeera
npm install  # or npm/yarn/bun
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root of your project:

```env
NEXT_PUBLIC_APP_URL=

NEXT_PUBLIC_APPWRITE_ENDPOINT=
NEXT_PUBLIC_APPWRITE_PROJECT=

NEXT_PUBLIC_APPWRITE_DATABASE_ID=
NEXT_PUBLIC_APPWRITE_WORKSPACES_ID=
NEXT_PUBLIC_APPWRITE_MEMBERS_ID=
NEXT_PUBLIC_APPWRITE_PROJECTS_ID=
NEXT_PUBLIC_APPWRITE_TASKS_ID=
NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID=

NEXT_APPWRITE_KEY=

COHERE_API_KEY=
```

### 3. Run Locally

Start the development server:

```bash
npm run dev
```

Then open your browser and navigate to:  
[http://localhost:3000](http://localhost:3000)

---

## Project Structure

```bash
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Authentication pages
│   ├── (dashboard)/        # Main application
│   ├── api/                # API routes using Hono
├── components/             # UI components (Radix + custom)
├── features/               # Feature-based modules (tasks, projects, workspaces)
├── hooks/                  # Reusable React hooks
├── lib/                    # Utility functions, client config, etc.
```

---

## AI Features

- **Smart Project Description** – Enter project name, get bullet-point descriptions
- **Auto Task Suggestions** – Create relevant tasks based on project context
- **Auto Task Descriptions** – Generate brief task explanations using AI
