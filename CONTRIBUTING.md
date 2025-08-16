# Contributing to MIL Guard

Thank you for your interest in contributing to MIL Guard! This guide will help you get started with contributing to our Media & Information Literacy application.

## Table of Contents
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Responsive Design Guidelines](#responsive-design-guidelines)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)

## Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **pnpm**
- **Git**
- Basic knowledge of **React**, **TypeScript**, and **Tailwind CSS**

### First Time Setup
1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/mil-guard.git
   cd mil-guard
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Add your OpenAI API key and other required variables
   ```
5. **Start the development server**:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:5000](http://localhost:5000) in your browser

## Development Setup

### Environment Variables
Create a `.env` file with the following variables:
```env
OPENAI_API_KEY=your_openai_api_key_here
JWT_SECRET=your_jwt_secret_here
DATABASE_URL=your_database_url (optional for development)
```

### Development Workflow
The project uses a **unified development setup** where both frontend and backend run together:
- **Frontend**: React with Vite (served at `/`)
- **Backend**: Express.js API (served at `/api/*`)
- **Single Port**: Everything runs on port 5000

### Database
- **Development**: Uses in-memory storage by default
- **Production**: PostgreSQL with Drizzle ORM
- **Migrations**: Run `npm run db:migrate` for database changes

## Project Structure

```
mil-guard/
├── client/src/           # React frontend
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # shadcn/ui components
│   │   └── ...          # Custom components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── pages/           # Page components
│   └── App.tsx          # Main app component
├── server/              # Express.js backend
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Database abstraction
│   └── types.ts         # Server types
├── shared/              # Shared types and schemas
│   └── schema.ts        # Database schemas (Drizzle)
└── README.md
```

## Coding Standards

### TypeScript
- **Always use TypeScript** for new files
- **Use proper typing** - avoid `any` when possible
- **Export types** from shared files when used across modules
- **Use interface** for object types, **type** for unions/primitives

### React Components
- **Use functional components** with hooks
- **Use meaningful component names** in PascalCase
- **Props should be typed** with interfaces
- **Keep components focused** - single responsibility
- **Use custom hooks** for complex logic

### Code Style
- **Use Prettier** for formatting (configured in project)
- **Use ESLint** rules (configured in project)
- **2 spaces** for indentation
- **Single quotes** for strings
- **Semicolons** at line endings
- **Meaningful variable names** - avoid abbreviations

### Example Component Structure:
```typescript
import React from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface MyComponentProps {
  title: string;
  onAction: () => void;
  isLoading?: boolean;
}

export function MyComponent({ title, onAction, isLoading = false }: MyComponentProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className={`p-4 ${isMobile ? 'space-y-2' : 'space-y-4'}`}>
      <h2 className="responsive-text-lg font-semibold">{title}</h2>
      <Button 
        onClick={onAction}
        disabled={isLoading}
        className={isMobile ? 'w-full' : ''}
      >
        {isLoading ? 'Loading...' : 'Action'}
      </Button>
    </div>
  );
}
```

## Responsive Design Guidelines

### Mobile-First Approach
- **Design for mobile first**, then enhance for larger screens
- **Use the `useIsMobile()` hook** for conditional rendering
- **Test on multiple device sizes** (320px, 768px, 1024px, 1440px+)

### Breakpoints (Tailwind CSS)
- **sm**: 640px and up (tablets)
- **md**: 768px and up (small laptops)
- **lg**: 1024px and up (laptops)
- **xl**: 1280px and up (large screens)
- **2xl**: 1536px and up (very large screens)

### Responsive Patterns
```typescript
// Conditional layouts
const isMobile = useIsMobile();
<div className={isMobile ? 'flex-col space-y-4' : 'flex-row space-x-4'}>

// Responsive grids
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Responsive text
<h1 className="text-2xl sm:text-3xl lg:text-4xl">

// Mobile-specific classes (defined in index.css)
<div className="mobile-stack">        // Stacks on mobile, row on desktop
<div className="mobile-grid">         // Responsive grid
<div className="mobile-hide">         // Hidden on mobile
<div className="mobile-show">         // Shown only on mobile
```

### Touch-Friendly Design
- **Minimum 44px touch targets** for buttons and interactive elements
- **Use the `touch-friendly` CSS class** for mobile interactions
- **Provide adequate spacing** between interactive elements
- **Consider thumb-friendly navigation** placement

### Navigation Patterns
- **Desktop**: Horizontal navigation with all items visible
- **Mobile**: Hamburger menu with slide-out drawer
- **Use Sheet component** for mobile overlays
- **Sticky header** for better navigation on long pages

## Making Changes

### Branch Naming
- **Feature**: `feature/description-of-feature`
- **Bug Fix**: `fix/description-of-bug`
- **Documentation**: `docs/description-of-change`
- **Refactor**: `refactor/description-of-change`

### Commit Messages
Use conventional commit format:
```
type(scope): description

feat(auth): add user authentication system
fix(mobile): resolve responsive layout issues
docs(readme): update installation instructions
style(ui): improve button hover states
refactor(api): simplify error handling logic
```

### Making Changes
1. **Create a new branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the coding standards

3. **Test your changes**:
   ```bash
   npm run dev        # Test locally
   npm run build      # Test production build
   npm run lint       # Check code style
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat(component): add responsive navigation"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

## Testing

### Manual Testing
- **Test on multiple screen sizes** (Chrome DevTools)
- **Test touch interactions** on mobile devices
- **Verify accessibility** with keyboard navigation
- **Check loading states** and error handling
- **Test authentication flows**

### Browser Testing
- **Chrome** (primary development browser)
- **Firefox** (secondary testing)
- **Safari** (iOS/macOS compatibility)
- **Mobile browsers** (iOS Safari, Chrome Mobile)

### Responsive Testing Checklist
- [ ] **320px**: Small mobile (iPhone SE)
- [ ] **375px**: Standard mobile (iPhone)
- [ ] **768px**: Tablets
- [ ] **1024px**: Small laptops
- [ ] **1440px**: Large screens
- [ ] **Touch interactions** work properly
- [ ] **Navigation** is accessible on all sizes
- [ ] **Text is readable** at all sizes
- [ ] **Images scale** appropriately

## Submitting Changes

### Pull Request Process
1. **Ensure your fork is up to date**:
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Create a Pull Request** on GitHub with:
   - **Clear title** describing the change
   - **Detailed description** of what was changed and why
   - **Screenshots** for UI changes (before/after)
   - **Mobile screenshots** if responsive changes were made
   - **Test instructions** for reviewers

3. **PR Template** (include in description):
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Responsive improvement
   
   ## Screenshots
   ### Desktop
   [Add desktop screenshots]
   
   ### Mobile
   [Add mobile screenshots]
   
   ## Testing
   - [ ] Tested on multiple screen sizes
   - [ ] Tested touch interactions
   - [ ] No console errors
   - [ ] Follows accessibility guidelines
   
   ## Checklist
   - [ ] Code follows project style guidelines
   - [ ] Self-review completed
   - [ ] Changes are documented
   - [ ] No breaking changes
   ```

### Code Review
- **Be responsive** to feedback
- **Explain your decisions** if asked
- **Make requested changes** promptly
- **Ask questions** if feedback is unclear
- **Test suggested changes** before implementing

## Reporting Issues

### Bug Reports
Include the following information:
- **Device/Browser** information
- **Screen size** when the issue occurred
- **Steps to reproduce** the issue
- **Expected behavior**
- **Actual behavior**
- **Screenshots** or screen recordings
- **Console errors** (if any)

### Feature Requests
- **Describe the feature** and its purpose
- **Explain the use case** and who would benefit
- **Consider responsive implications**
- **Suggest implementation approach** (if applicable)

### Issue Labels
- `bug`: Something isn't working
- `enhancement`: New feature or improvement
- `documentation`: Documentation related
- `responsive`: Mobile/tablet layout issues
- `good first issue`: Good for newcomers
- `help wanted`: Community help needed

## Additional Resources

### Useful Documentation
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [Express.js](https://expressjs.com)

### Design Resources
- [Mobile Design Patterns](https://mobbin.design)
- [Responsive Design Guidelines](https://web.dev/responsive-web-design-basics)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref)

### Tools
- **VS Code Extensions**: ES7+ React/Redux/React-Native snippets, Tailwind CSS IntelliSense
- **Browser Extensions**: React Developer Tools, Lighthouse
- **Design Tools**: Figma (for mockups), Chrome DevTools (for responsive testing)

---

## Questions?

If you have questions about contributing, feel free to:
- **Open an issue** with the `question` label
- **Start a discussion** in GitHub Discussions
- **Check existing issues** for similar questions

Thank you for contributing to MIL Guard! 🛡️
