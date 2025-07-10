# Booklist Web Application

A modern, responsive web application built with Next.js 13+ (App Router), TypeScript, and React for managing and organizing your personal book collection. This is the frontend part of the Booklist application that connects to the Booklist backend service.

## 🚀 Features

- **📚 Book Management**: Add, edit, and organize your book collection
- **🏷️ Category System**: Categorize books with a flexible category system
- **🔐 Authentication**: Secure signup and login with JWT
- **🎨 Modern UI**: Built with shadcn/ui for a beautiful, accessible interface
- **🌓 Dark Mode**: Built-in dark/light theme support
- **⚡ Performance**: Optimized for fast loading and smooth interactions
- **🔍 Advanced Search**: Find books by title, author, or category
- **📱 Responsive**: Works on all device sizes
- **📊 Dashboard**: Overview of your reading habits and collection stats
## 📁 Project Structure

```
web-app/
├── src/
│   ├── app/                # App router pages and layouts
│   │   ├── (auth)/         # Authentication pages
│   │   ├── (main)/         # Main application pages
│   │   └── api/            # API routes
│   ├── components/         # Reusable components
│   │   ├── books/         # Book-related components
│   │   ├── ui/            # UI components
│   │   └── layout/        # Layout components
│   ├── lib/               # Utility functions
│   ├── services/          # API service clients
│   ├── stores/            # State management
│   └── styles/            # Global styles
├── public/               # Static assets
├── .env.local.example    # Example environment variables
└── package.json          # Dependencies and scripts
```

## 🛠️ Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Booklist backend service running (see main README for setup)

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Update the .env.local file with your configuration
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open the application**
   - http://localhost:3000

## 📚 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🎨 Styling

This project uses:
- **Tailwind CSS** for utility-first styling
- **CSS Modules** for component-scoped styles
- **shadcn/ui** for accessible components

## 🔄 State Management

- **React Query** for server state management
- **Zustand** for client state management
- **React Hook Form** for form state and validation

## 🤝 Contributing

Please read [CONTRIBUTING.md](../CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

- Built with Next.js and React
- UI components by shadcn/ui
- Icons by Lucide React

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide Icons](https://lucide.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn package manager

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Thammasok/booklist.git
   cd booklist/web-app
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up environment variables
   Create a `.env.local` file in the root directory and add the necessary environment variables:
   ```env
   NEXT_PUBLIC_API_URL=your_api_url_here
   ```

4. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🧪 Running Tests

```bash
npm test
# or
yarn test
# or
pnpm test
```

## 🏗️ Building for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```
