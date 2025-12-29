# CRM Application

A complete, production-ready CRM (Customer Relationship Management) application built with Next.js 14, TypeScript, and modern React patterns.

## 🚀 Features

### Core Functionality
- **Dashboard** - Comprehensive overview with stats, charts, and activity feed
- **Contacts Management** - Full CRUD operations with search, filtering, and sorting
- **Pipeline/Kanban Board** - Visual deal management with drag & drop
- **Analytics** - Data visualization with charts and metrics
- **Settings** - User preferences and data management

### Advanced Features
- **Command Palette** (Cmd/Ctrl + K) - Quick navigation and search
- **Keyboard Shortcuts** - Power user navigation
- **Drag & Drop** - Intuitive deal status management
- **Real-time Updates** - Optimistic UI updates
- **Export/Import** - Data portability
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Dark Mode** - Beautiful dark theme (light mode ready)

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
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
├── components/
│   ├── ui/                # Shadcn/ui components
│   ├── layout/            # Layout components (sidebar, header)
│   ├── dashboard/         # Dashboard components
│   ├── contacts/          # Contact components
│   ├── pipeline/          # Pipeline/Kanban components
│   └── shared/            # Shared components (command palette, etc.)
├── lib/
│   ├── store.ts           # Zustand store
│   ├── types.ts           # TypeScript types
│   ├── constants.ts       # Constants
│   ├── validations.ts     # Zod schemas
│   ├── data-generator.ts  # Faker data generation
│   └── utils.ts           # Utility functions
└── hooks/                 # Custom React hooks
```

## 🎨 Design System

The application uses a modern design system inspired by Vercel/Linear/Cal.com:

- **Colors**: Dark mode optimized with carefully chosen palette
- **Typography**: Inter font family
- **Spacing**: 4px grid system
- **Components**: Fully accessible with ARIA labels
- **Animations**: Smooth transitions and micro-interactions

## 📱 Pages

### Dashboard (`/`)
- Stats cards (Total Contacts, Active Deals, Monthly Revenue, Win Rate)
- Revenue chart (last 6 months)
- Recent activity feed
- Quick actions

### Contacts (`/contacts`)
- List/table view with search and filters
- Create, edit, delete contacts
- Contact detail page with tabs (Overview, Deals, Activity, Notes)
- Bulk operations support

### Pipeline (`/pipeline`)
- Kanban board with drag & drop
- Deal management across statuses
- Visual deal cards with key information
- Deal creation and editing

### Analytics (`/analytics`)
- Revenue over time chart
- Deals won vs lost (pie chart)
- Top contacts by value (bar chart)
- Key metrics and statistics

### Settings (`/settings`)
- Appearance preferences
- Data export/import
- Data management options

## 🔑 Keyboard Shortcuts

- `Cmd/Ctrl + K` - Open command palette
- `Esc` - Close dialogs/modals
- `/` - Focus search (on contacts page)
- `N` - New contact (coming soon)
- `D` - New deal (coming soon)

## 💾 Data Storage

All data is stored in localStorage. The application includes:
- Automatic data seeding on first load (100 contacts, 60 deals, 200+ activities)
- Data persistence across sessions
- Export/import functionality
- Version management for data migrations

## 🚢 Deployment

This application is ready to be deployed on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Deploy automatically on push

Or deploy manually:
```bash
npm run build
npm start
```

## 🔮 Future Improvements

- [ ] Backend API integration
- [ ] User authentication
- [ ] Real-time collaboration
- [ ] Advanced filtering and saved views
- [ ] Email integration
- [ ] Calendar integration
- [ ] Advanced reporting
- [ ] Mobile app
- [ ] Multi-tenant support
- [ ] Advanced permissions

## 📄 License

This is a portfolio project. Feel free to use it as a reference or starting point for your own projects.

## 👨‍💻 Author

Built as a portfolio demonstration of senior-level full-stack development skills.

---

**Note**: This is a portfolio project demonstrating modern web development practices. For production use, consider adding backend API, authentication, and proper database integration.
