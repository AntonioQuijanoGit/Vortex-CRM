# Vortex

A modern, full-featured workspace application for managing contacts, deals, and sales pipelines. Built with Next.js 14 and TypeScript.

## 🚀 Features

### Core Functionality
- **Dashboard** - Comprehensive overview with stats, charts, and activity feed
- **Contacts Management** - Full CRUD operations with search, filtering, and sorting
- **Pipeline/Kanban Board** - Visual deal management with drag & drop
- **Analytics** - Data visualization with charts and metrics
- **Calendar** - Event and task scheduling
- **Tasks** - Task management with priorities and due dates
- **Reports** - Custom report generation
- **Settings** - User preferences and data management

### Advanced Features
- **Command Palette** (Cmd/Ctrl + K) - Quick navigation and search
- **Keyboard Shortcuts** - Power user navigation
- **Drag & Drop** - Intuitive deal status management
- **Real-time Updates** - Optimistic UI updates
- **Export/Import** - Data portability (JSON, CSV, PDF)
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Dark/Light Mode** - Beautiful themes with system preference support

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + CSS Variables
- **UI Components**: Radix UI + Shadcn/ui
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Mock Data**: @faker-js/faker
- **Date Handling**: date-fns

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Dashboard
│   ├── contacts/          # Contacts pages
│   ├── pipeline/          # Pipeline/Kanban page
│   ├── analytics/         # Analytics page
│   └── settings/          # Settings page
├── components/            # React components
│   ├── ui/                # Base UI components
│   ├── layout/            # Sidebar, Header
│   ├── dashboard/         # Dashboard components
│   ├── contacts/          # Contact components
│   ├── pipeline/          # Pipeline components
│   └── shared/            # Shared components
├── lib/                   # Business logic
│   ├── store.ts           # Zustand store
│   ├── types.ts           # TypeScript types
│   └── utils/             # Utility functions
└── hooks/                 # Custom React hooks
```

## 💾 Data Storage

All data is stored locally in your browser using localStorage. When you first open the app, sample data (100 contacts, 60 deals) is automatically generated for demonstration purposes.

**Important**: Make sure to export your data regularly from Settings, as clearing your browser data will result in data loss.

## 🎨 Customization

- **Theme**: Toggle between light and dark mode
- **Currency**: Configurable in settings
- **Date Format**: Customizable date display
- **Tags**: Custom tagging system

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- 📱 Mobile devices
- 📱 Tablets
- 💻 Desktop computers

## 🚀 Deployment

The project is configured for Vercel deployment. Simply push to GitHub and import in Vercel.

## 📄 License

MIT

## 👨‍💻 Developed by

Antonio Quijano
