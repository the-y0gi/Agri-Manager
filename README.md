# Tractor Management System

A modern, bilingual web application for managing tractor services, agricultural jobs, and client payments. Built with Next.js 14, TypeScript, and MongoDB.

## Features

- **🚜 Job Management**: Create and track comprehensive job records including farmer details, services provided, and work logs.
- **💰 Financial Tracking**:
  - Track total amounts, paid amounts, and pending balances.
  - Record split payments with `PaymentLogSchema`.
  - Dashboard sorting highlights pending payments first.
- **🌐 Bilingual Support**: Full support for **English** and **Hindi**, with a dedicated `LanguageContext` for seamless switching.
- **📊 Interactive Dashboard**:
  - Real-time search by farmer name.
  - Recent activity overview.
  - Status indicators for ongoing vs. completed jobs.
- **⚡ Modern UI/UX**:
  - Global loading states for smooth transitions.
  - Mobile-first responsive design using Tailwind CSS.
  - Toast notifications for user feedback.
- **🛠️ Service Configuration**: Manage different tractor services with hourly or fixed pricing models.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Lucide React](https://lucide.dev/) (Icons)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: Custom auth system with JWT (`jose`)
- **State Management**: React Context API (`LanguageContext`, `LoaderContext`)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database instance

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd tractor-management
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root directory:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    NEXTAUTH_SECRET=your_nextauth_secret
    NEXTAUTH_URL=http://localhost:3000
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                  # App Router pages and API routes
│   ├── api/              # Backend API endpoints (auth, jobs, services)
│   ├── jobs/             # Job management pages (create, view details)
│   ├── login/            # Authentication pages
│   ├── public/           # Public-facing service pages
│   ├── reports/          # Analytics and reporting
│   ├── settings/         # Application settings
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout with providers
│   └── page.tsx          # Dashboard (Home)
├── components/           # Reusable UI components
│   ├── GlobalLoader.tsx  # Application-wide loading spinner
│   ├── JobCard.tsx       # Component for displaying job summaries
│   ├── Navbar.tsx        # Navigation bar
│   └── ...
├── context/              # Global state contexts
│   ├── LanguageContext.tsx # i18n state management
│   └── LoaderContext.tsx   # Loading state management
├── data/                 # Static data and translations
│   └── translations.ts   # English/Hindi translation strings
├── lib/                  # Utility functions
│   └── db.ts             # MongoDB connection helper
├── models/               # Mongoose data models
│   ├── Job.ts            # Job schema with work/payment logs
│   └── Service.ts        # Service definition schema
└── middleware.ts         # Next.js middleware (auth protection)
```

## API Routes

- `GET /api/jobs`: Fetch all jobs (supports sorting by payment status).
- `POST /api/jobs`: Create a new job.
- `GET /api/jobs/[id]`: Get detailed job info.
- `PUT /api/jobs/[id]`: Update job status or details.
- `POST /api/auth/login`: Admin authentication.

## usage

### Dashboard
The main dashboard gives a quick overview of all activities.
- **Search**: Quickly find jobs by farmer name.
- **Sorting**: Jobs with pending payments are prioritized at the top.
- **Language Switch**: Toggle between Hindi and English using the UI controls.

### Job Tracking
Each job maintains a detailed log:
- **Work Logs**: Tracks daily work, start/end times, and hours worked.
- **Payment Logs**: Records partial payments and payment methods.



## License

This project is licensed under the MIT License.
