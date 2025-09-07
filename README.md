# 🎯 FocusFlow

**A comprehensive productivity and study application designed specifically for students with ADHD.**

FocusFlow combines science-backed focus techniques with intuitive productivity tools to help students achieve their academic goals with confidence and clarity.

## ✨ Features

### 🎲 Smart Focus Timer
- **Customizable Pomodoro sessions** that adapt to your attention span and energy levels
- **Flexible timer durations** from 15 minutes to 2+ hours for hyperfocus sessions
- **Browser notifications with sound alerts** to keep you on track
- **Automatic session tracking** with database persistence

### 📝 Intelligent Task Management
- **Priority-based organization** with visual color coding
- **AI-powered task assistance** using Google Gemini API
- **Smart task breakdown** for overwhelming projects
- **Due date tracking** with calendar integration
- **Completion progress monitoring**

### 📚 Smart Notes
- **Organized note-taking** with tags and search functionality
- **AI integration** - save task analysis and breakdowns directly to notes
- **Quick capture** for ideas and insights during focus sessions

### 📅 Visual Calendar
- **Color-coded calendar view** that makes deadlines crystal clear
- **Task integration** - view your tasks directly on calendar dates
- **Deadline visualization** to prevent last-minute stress

### 📊 Progress Tracking
- **Celebration of small wins** with level progression
- **Focus time analytics** and streak tracking
- **Weekly progress overview** with visual charts
- **Achievement badges** for motivation

### 🎯 Habit Tracking
- **Daily habit monitoring** to build consistent study routines
- **Streak tracking** for motivation
- **Custom habit creation** tailored to your needs

## 🧠 ADHD-Friendly Design

### Executive Function Support
- **Visual cues and priority colors** for easy task identification
- **Structured workflows** that reduce decision fatigue
- **Flexible timer options** that work with your natural rhythms

### Stress-Free Approach
- **Gentle reminders** instead of harsh notifications
- **Positive reinforcement** celebrating progress over perfection
- **Hyperfocus-friendly** extended timer options

### Accessibility First
- **Clear visual hierarchy** with high contrast design
- **Intuitive navigation** with consistent patterns
- **Responsive design** that works on all devices

## 🤖 AI-Powered Features

FocusFlow integrates Google Gemini API to provide:
- **Intelligent task analysis** and difficulty assessment
- **Smart task breakdown** for complex projects
- **Context-aware grouping** suggestions
- **ADHD-friendly recommendations** for task management

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for fast development and hot module replacement
- **Tailwind CSS** for responsive, utility-first styling
- **shadcn/ui** components built on Radix UI primitives
- **TanStack Query** for server state management
- **Wouter** for lightweight client-side routing

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** database with Neon cloud hosting
- **Drizzle ORM** for type-safe database operations
- **Google Gemini API** integration for AI features

### Development Tools
- **TypeScript** throughout for enhanced developer experience
- **ESBuild** for fast production builds
- **PostCSS** with Tailwind CSS processing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or use the built-in Replit database)
- Google Gemini API key for AI features

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd focusflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file with:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

4. **Initialize the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5000`

## 📁 Project Structure

```
focusflow/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Main application pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
├── server/                # Express.js backend
│   ├── ai/               # AI integration modules
│   └── routes.ts         # API route definitions
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema definitions
└── package.json
```

## 🎨 Design Philosophy

FocusFlow is built with ADHD students in mind:

- **Reduce cognitive load** through clear visual hierarchy
- **Support different attention patterns** with flexible timing
- **Celebrate progress** rather than perfection
- **Provide structure** without being rigid
- **Make productivity feel achievable** and rewarding

## 🤝 Contributing

We welcome contributions that help make FocusFlow even better for students with ADHD:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with love for students with ADHD who want to unlock their potential
- Inspired by evidence-based productivity techniques and ADHD research
- Special thanks to the ADHD community for feedback and insights

---

**Ready to transform your productivity?** Start your FocusFlow journey today! 🚀