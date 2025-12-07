# Daily Productivity & Habit Tracker

A minimalist, elegant productivity app for managing daily tasks and building consistent habits. Built with React, featuring a sophisticated black and white geometric design.

## 🎯 Purpose

**Daily Productivity** is designed to help you:
- **Track daily tasks** - Manage your to-do list with full CRUD functionality
- **Build habits** - Create daily habits with streak tracking to maintain consistency
- **Monitor progress** - Visualize your productivity with metrics and calendar views
- **Stay organized** - Filter, search, and organize your tasks and habits efficiently

## ✨ Features

### Core Functionality (CRUD)
- ✅ **Create** tasks and habits
- 📖 **Read** and view all items with filtering
- ✏️ **Update** task/habit titles
- 🗑️ **Delete** items

### Task Management
- Normal tasks that can be completed and removed
- Full editing capabilities
- Search functionality
- Date-based filtering (All, Today, This Week)

### Habit Tracking
- Daily habits that reset automatically each day
- **Streak tracking** - See your consecutive days
- **Best streak** - Track your personal records
- Visual indicators for active streaks
- Calendar view showing completed habit days

### Productivity Dashboard
- Task completion rate
- Daily habit completion percentage
- Total streak counter
- Weekly productivity summary
- Visual progress bars

### Additional Features
- 📅 **Calendar view** - See your activity over time
- 🔍 **Search** - Find tasks and habits quickly
- 🎨 **Minimalist design** - Clean, geometric black and white interface
- 💾 **Local storage** - All data persists automatically
- ♿ **Accessible** - Full keyboard navigation and ARIA labels
- 📱 **Responsive** - Works on all devices

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/daily-productivity.git
cd daily-productivity
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Built With

- **React** - UI library
- **CSS3** - Styling with custom properties
- **LocalStorage** - Data persistence
- **Modern JavaScript** - ES6+ features

## 📁 Project Structure

```
src/
├── components/
│   ├── TodoApp.js          # Main app component
│   ├── TodoForm.js         # Task/habit creation form
│   ├── Todo.js             # Individual task/habit item
│   ├── TodoControls.js     # Search and filter controls
│   ├── TodoFilters.js      # Filter buttons
│   ├── TodoSearch.js       # Search input
│   ├── TodoStats.js        # Statistics footer
│   ├── ProductivityDashboard.js  # Productivity metrics
│   ├── Calendar.js         # Calendar view
│   └── EmptyState.js       # Empty state component
├── App.js
└── index.js
```

## 🎨 Design Philosophy

- **Minimalist** - Clean, uncluttered interface
- **Geometric** - Sharp edges, no border-radius
- **Black & White** - Monochrome color scheme
- **Brutalist shadows** - Offset box-shadows for depth
- **Accessible** - WCAG AA compliant
- **Responsive** - Mobile-first approach

## 📝 Usage

### Creating Tasks
1. Type your task in the input field
2. Select "Task" type (default)
3. Click "Add" or press Enter

### Creating Habits
1. Type your habit name
2. Select "Habit" type
3. Click "Add"
4. Mark it complete each day to build your streak

### Tracking Progress
- View the **Dashboard** for productivity metrics
- Check the **Calendar** to see your activity history
- Use **Filters** to view specific types or time periods
- See **Streaks** on habit items to track consistency

## 🔮 Future Enhancements

Potential features for future versions:
- Weekly/monthly goals
- Export data functionality
- Dark/light theme toggle
- Categories and tags
- Due dates for tasks
- Notifications/reminders

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Antonio Quijano**

## 🙏 Acknowledgments

- Inspired by minimalist design principles
- Built with accessibility in mind
- Focused on productivity and habit formation

---

**Start building better habits today!** 🔥
