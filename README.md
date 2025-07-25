# 📚 Lecture Calendar Application

A modern, full-stack web application for managing and viewing lecture schedules with a beautiful Google Calendar-inspired interface.

## 🌟 Features

- **Interactive Calendar Views**: Week, Month, and Day views with intuitive navigation
- **Complete CRUD Operations**: Create, read, update, and delete lectures seamlessly
- **Detailed Lecture Pages**: Rich lecture information with instructor details and materials
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Updates**: Instant synchronization between frontend and backend
- **Professional UI**: Google Calendar-inspired design with smooth animations
- **Type-Safe Development**: Full TypeScript implementation across the stack

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **FullCalendar** for calendar functionality
- **React Router** for navigation
- **Axios** for API communication
- **Custom CSS** with Google Calendar aesthetics
- **Lucide React** for icons

### Backend
- **Node.js** with Express and TypeScript
- **SQLite** database for data persistence
- **RESTful API** design
- **CORS** enabled for cross-origin requests
- **Comprehensive error handling**

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NodirKhikmatov/Lecture-Calendar-.git
   cd lecture-calendar
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Start the development servers**
   ```bash
   # Start both frontend and backend concurrently
   npm run full:dev
   ```

   Or start them separately:
   ```bash
   # Terminal 1 - Backend (Port 3002)
   npm run backend:dev
   
   # Terminal 2 - Frontend (Port 5173)
   npm run dev
   ```

4. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3002/api
   - Health Check: http://localhost:3002/api/health

## 📁 Project Structure

```
lecture-calendar/
├── src/                          # Frontend source code
│   ├── components/
│   │   ├── Calendar/            # Main calendar component
│   │   ├── LectureDetail/       # Lecture detail page
│   │   └── LectureModal/        # Create/edit lecture modal
│   ├── hooks/                   # Custom React hooks
│   ├── services/                # API service layer
│   ├── types/                   # TypeScript type definitions
│   └── App.tsx                  # Main application component
├── backend/                     # Backend source code
│   ├── src/
│   │   ├── controllers/         # Request handlers
│   │   ├── database/           # Database setup and seeding
│   │   ├── routes/             # API route definitions
│   │   ├── types/              # TypeScript interfaces
│   │   └── server.ts           # Express server setup
│   ├── data/                   # SQLite database file
│   └── dist/                   # Compiled JavaScript output
├── public/                     # Static assets
└── README.md
```

## 🔧 API Endpoints

### Lectures
- `GET /api/lectures` - Get all lectures
- `GET /api/lectures/:id` - Get lecture by ID
- `POST /api/lectures` - Create new lecture
- `PUT /api/lectures/:id` - Update lecture
- `DELETE /api/lectures/:id` - Delete lecture

### Query Parameters
- `GET /api/lectures?start=YYYY-MM-DD&end=YYYY-MM-DD` - Filter lectures by date range

## 📊 Data Model

### Lecture Schema
```typescript
interface Lecture {
  id: string;
  title: string;
  instructor: string;
  description: string;
  fullDescription?: string;
  startTime: string;          // HH:MM format
  endTime: string;            // HH:MM format
  date: string;               // YYYY-MM-DD format
  category: 'computer-science' | 'mathematics' | 'physics' | 'chemistry' | 'biology' | 'literature' | 'history' | 'other';
  location?: string;
  maxStudents?: number;
  enrolledStudents?: number;
  materials?: Material[];
  createdAt: string;
  updatedAt: string;
}
```

## 🎨 Design Philosophy

The application follows Google Calendar's design principles:

- **Clean Interface**: Minimal clutter with focus on content
- **Consistent Spacing**: 8px grid system throughout
- **Color System**: Category-based color coding for lectures
- **Smooth Interactions**: Hover effects and transitions
- **Responsive Layout**: Mobile-first approach
- **Accessibility**: Proper contrast ratios and keyboard navigation

## 🔒 Features in Detail

### Calendar Interface
- **Multiple Views**: Switch between month, week, and day views
- **Interactive Events**: Click lectures to view details
- **Quick Creation**: Click empty time slots to create lectures
- **Color Coding**: Visual categorization of lectures
- **Business Hours**: Highlighted working hours (8 AM - 6 PM)

### Lecture Management
- **Rich Forms**: Comprehensive lecture creation and editing
- **Validation**: Client and server-side input validation
- **File Attachments**: Support for PDFs, images, and links
- **Category System**: Organized by academic subjects
- **Capacity Management**: Track enrolled vs. maximum students

### Navigation & Routing
- **Deep Linking**: Direct URLs for specific lectures
- **Browser History**: Full back/forward button support
- **Modal Overlays**: Non-disruptive editing experience
- **Breadcrumb Navigation**: Clear user orientation

## 🚀 Production Deployment

### Build for Production
```bash
# Build both frontend and backend
npm run full:build

# Start production server
npm run dev
npm run backend:start
```

### Environment Variables
Create `.env` files for different environments:

**Backend (.env)**
```
NODE_ENV=production
PORT=3002
DATABASE_PATH=./data/lectures.db
```

**Frontend (.env)**
```
VITE_API_BASE_URL=http://your-api-domain.com/api
```


## 🙏 Acknowledgments

- [FullCalendar](https://fullcalendar.io/) for the excellent calendar component
- [Lucide](https://lucide.dev/) for the beautiful icon library
- [Google Calendar](https://calendar.google.com/) for design inspiration
- React and Express communities for amazing documentation

