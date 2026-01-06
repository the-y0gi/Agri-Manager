# Tractor Management System

A modern web application for managing tractor services, jobs, and client interactions. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Public Service Page**: Display available tractor services with rates and contact information
- **Job Management**: Create, view, and manage tractor service jobs
- **Service Management**: Add and manage different tractor services with hourly or fixed pricing
- **Authentication**: Secure login/logout functionality
- **Responsive Design**: Mobile-first design optimized for all devices
- **Real-time Updates**: Live service rate updates and job status tracking

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: MongoDB (via custom DB connection)
- **Authentication**: Custom auth system
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tractor-management
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── jobs/
│   │   └── services/
│   ├── jobs/
│   ├── login/
│   ├── public/
│   ├── reports/
│   ├── settings/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── BottomNav.tsx
│   ├── JobCard.tsx
│   ├── Navbar.tsx
│   ├── RevenueChart.tsx
│   └── TopBar.tsx
├── lib/
│   ├── db.ts
│   └── translations.ts
└── models/
    ├── Job.ts
    └── Service.ts
```

## API Routes

- `GET/POST /api/services` - Manage services
- `GET/POST /api/jobs` - Manage jobs
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

## Usage

### Public Page
Visit `/public` to view available services and contact the service provider.

### Admin Features
- Login at `/login`
- Manage services and jobs through the dashboard
- View reports and analytics

## Building for Production

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Troubleshooting

### Common Issues

- **Database Connection**: Ensure MongoDB is running and connection string is correct
- **Build Errors**: Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- **TypeScript Errors**: Run `npm run type-check` to identify issues

### Development Tips

- Use `npm run lint` to check code quality
- Enable React DevTools for debugging
- Test on multiple devices for responsive design

## License

This project is licensed under the MIT License.
