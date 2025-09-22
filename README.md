language="markdown"# 🛒 Real-Time Shopping List App

A modern, collaborative shopping list application built with React and Supabase that syncs in real-time across all devices and users.

## ✨ Features

### Core Functionality
- ✅ **Add/Edit/Delete Items** - Manage your shopping items with quantities
- 🔄 **Real-time Sync** - Changes appear instantly across all connected devices
- ✅ **Check Off Items** - Mark items as completed while shopping
- 🎯 **Drag & Drop Reordering** - Organize items in your preferred order
- 🎉 **Completion Celebration** - Confetti animation when all items are checked

### Bulk Operations
- 🔄 **Bulk Actions** - Clear completed items or reset entire list
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile

### Real-time Collaboration
- 👥 **Multi-user Support** - Share lists with family/roommates
- ⚡ **Instant Updates** - See changes from other users immediately
- 🔄 **Automatic Sync** - No refresh needed, everything stays in sync

## 🛠 Tech Stack

- **Frontend**: React 18 with Hooks
- **Backend**: Supabase (PostgreSQL + Real-time subscriptions)
- **Styling**: CSS3 with modern gradients and animations
- **Drag & Drop**: @hello-pangea/dnd (react-beautiful-dnd fork)
- **Real-time**: Supabase WebSocket connections

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Supabase account

## 🗄 Database Schema

Create this table in your Supabase SQL editor:

```sql
CREATE TABLE items (
  id uuid PRIMARY KEY,
  name TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  is_checked BOOLEAN DEFAULT FALSE,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE items;
```

## ⚡ Real-time Features

The app uses Supabase's real-time functionality to provide instant collaboration:

```javascript
// Real-time subscription setup
const channel = supabase
  .channel("items-changes")
  .on("postgres_changes", 
    { event: "*", schema: "public", table: "items" },
    (payload) => {
      // Handle INSERT/UPDATE/DELETE events
      setItems(prev => {
        switch (payload.eventType) {
          case "INSERT": return [...prev, payload.new];
          case "UPDATE": return prev.map(i => 
            i.id === payload.new.id ? payload.new : i);
          case "DELETE": return prev.filter(i => 
            i.id !== payload.old.id);
        }
      });
    }
  )
  .subscribe();
```

## 🎨 Styling Features

- **Modern Design**: Gradient backgrounds and glassmorphism effects
- **Smooth Animations**: Hover effects and transitions
- **Responsive Layout**: Adapts to different screen sizes
- **Visual Feedback**: Checked items show strike-through styling
- **Confetti Celebration**: CSS-powered animation on completion

---

**Happy Shopping!** 🛍️