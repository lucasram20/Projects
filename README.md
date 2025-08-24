# Projects Workspace

A multi-project workspace containing various web applications and tools for development and testing.

## 📁 Project Structure

```
gemini/
├── chatbot/           # Full-stack chatbot application
├── todo-app/          # Todo application with modern UI
├── lmarena-test/      # LM Arena testing files
└── README.md          # This file
```

## 🚀 Projects Overview

### 1. Chatbot Application (`chatbot/`)

A full-stack Next.js chatbot application with real-time streaming responses, authentication, and persistent chat history.

**Technology Stack:**
- **Frontend**: Next.js 15.3.0, React 19, TypeScript
- **Backend**: Next.js API routes, tRPC
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: Better Auth with session management
- **Styling**: Tailwind CSS, shadcn/ui components
- **Infrastructure**: Supabase for database hosting
- **Build System**: Turborepo monorepo

**Architecture:**
- `apps/web/` - Frontend application (runs on port 3001)
- `apps/server/` - Backend API (runs on port 3000)

**Key Features:**
- Real-time chat with streaming responses
- User authentication (email/password)
- Persistent chat history
- Modern responsive UI
- Type-safe APIs with tRPC

**Getting Started:**
```bash
cd chatbot
pnpm install
pnpm dev
```

Access the application:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000

### 2. Todo Application (`todo-app/`)

A modern todo application built with Next.js and featuring a clean, accessible interface.

**Technology Stack:**
- **Framework**: Next.js 15.5.0
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS 4.0
- **UI Components**: shadcn/ui, Radix UI
- **Theme**: Next-themes for dark/light mode
- **Icons**: Lucide React

**Key Features:**
- Add, edit, and delete todos
- Dark/light theme toggle
- Responsive design
- Accessible UI components

**Getting Started:**
```bash
cd todo-app
npm install
npm run dev
```

Access the application: http://localhost:3000

### 3. LM Arena Test (`lmarena-test/`)

Collection of HTML test files for LM Arena testing and evaluation.

**Files:**
- `claude-generated.html` - Claude AI generated content
- `ghilbi.html` - Ghibli-themed content
- `gpt5-generated.html` - GPT-5 generated content

## 🛠️ Development Setup

### Prerequisites

- **Node.js**: v22 LTS or higher
- **Package Managers**: 
  - pnpm (recommended for chatbot)
  - npm (for todo-app)
- **Database**: PostgreSQL (for chatbot project)

### Environment Setup

#### Chatbot Project
1. Copy environment files:
   ```bash
   cp chatbot/apps/server/.env.example chatbot/apps/server/.env
   cp chatbot/apps/web/.env.example chatbot/apps/web/.env
   ```

2. Configure your database connection and API keys in the `.env` files

3. Set up the database:
   ```bash
   cd chatbot
   pnpm db:push
   ```

#### Todo App
No additional environment setup required for basic functionality.

## 📋 Available Scripts

### Chatbot Project
```bash
# Install dependencies
pnpm install

# Start all applications in development
pnpm dev

# Start only the web application
pnpm dev:web

# Start only the server
pnpm dev:server

# Build all applications
pnpm build

# Type checking
pnpm check-types

# Database operations
pnpm db:push      # Push schema to database
pnpm db:studio    # Open database studio
pnpm db:generate  # Generate Prisma client
pnpm db:migrate   # Run migrations
```

### Todo App
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 🏗️ Architecture & Design

### Chatbot Architecture
- **Monorepo Structure**: Uses Turborepo for efficient builds and development
- **API Design**: Type-safe APIs with tRPC for end-to-end type safety
- **Database**: PostgreSQL with Prisma for type-safe database operations
- **Authentication**: Better Auth with secure session management
- **Streaming**: Real-time response streaming for chat interactions

### Todo App Architecture
- **Component-Based**: Reusable UI components with shadcn/ui
- **Theme System**: Integrated dark/light mode with next-themes
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🔒 Security & Best Practices

- Environment variables for sensitive configuration
- Comprehensive `.gitignore` to exclude sensitive files
- Type-safe database operations with Prisma
- Secure authentication with Better Auth
- CSRF protection and secure session management

## 🤝 Contributing

1. Clone the repository
2. Choose the project you want to work on
3. Follow the project-specific setup instructions
4. Make your changes and test thoroughly
5. Submit a pull request

## 📝 License

This workspace contains multiple projects with their respective licenses. Please refer to individual project directories for specific licensing information.

## 🆘 Support

For issues or questions:
1. Check the project-specific README files in each directory
2. Review the technology-specific documentation
3. Open an issue in the GitHub repository

---

**Last Updated**: December 2024
**Repository**: https://github.com/lucasram20/Projects