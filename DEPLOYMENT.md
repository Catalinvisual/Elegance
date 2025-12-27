# Beauty Salon App - Deployment Guide

## Overview
This is a full-stack beauty salon management application built with React (frontend) and Node.js/Express (backend).

## Project Structure
```
beauty-salon/
├── client/          # React frontend
├── server/          # Node.js backend
├── package.json     # Root package.json for deployment
└── railway.json     # Railway deployment configuration
```

## Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0
- Git

## Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/Catalinvisual/Elegance.git
cd Elegance
```

### 2. Install dependencies
```bash
npm run install:all
```

### 3. Set up environment variables
Copy the example environment file and update with your values:
```bash
cd server
cp .env.example .env
```

Edit the `.env` file with your configuration:
- Database credentials
- JWT secret
- Email settings
- Port configuration

### 4. Run the development servers
```bash
# From root directory
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Production Deployment (Railway)

### 1. GitHub Setup
Make sure your code is pushed to the GitHub repository:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Railway Deployment

#### Option A: Deploy from GitHub (Recommended)
1. Go to [Railway](https://railway.app)
2. Sign up/log in to your account
3. Click "New Project"
4. Select "Deploy from GitHub"
5. Connect your GitHub account and select the repository
6. Railway will automatically detect the configuration and deploy

#### Option B: Deploy using Railway CLI
1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login to Railway:
```bash
railway login
```

3. Initialize project:
```bash
railway init
```

4. Deploy:
```bash
railway up
```

### 3. Environment Variables Configuration
After deployment, set these environment variables in Railway dashboard:

#### Required Variables:
- `NODE_ENV=production`
- `PORT=5000`
- `JWT_SECRET=your-super-secret-jwt-key`
- `CLIENT_URL=https://your-app.railway.app`

#### Database Variables (PostgreSQL):
- `DB_HOST=${{Postgres.HOST}}`
- `DB_PORT=${{Postgres.PORT}}`
- `DB_NAME=${{Postgres.DATABASE}}`
- `DB_USER=${{Postgres.USER}}`
- `DB_PASSWORD=${{Postgres.PASSWORD}}`

#### Email Variables:
- `EMAIL_HOST=smtp.gmail.com`
- `EMAIL_PORT=587`
- `EMAIL_USER=your-email@gmail.com`
- `EMAIL_PASS=your-app-password`

### 4. Database Setup
Railway will automatically provision a PostgreSQL database. The application will automatically:
- Create necessary tables
- Set up default admin user (admin@beautysalon.com / admin123)

### 5. Domain Configuration
After successful deployment:
1. Railway will provide a default domain
2. You can configure a custom domain in Railway dashboard
3. Update the `CLIENT_URL` environment variable if using a custom domain

## Build Process
The deployment automatically:
1. Installs all dependencies
2. Builds the React frontend
3. Compiles TypeScript backend
4. Serves the built frontend from the backend server
5. Configures CORS for production

## Post-Deployment

### Default Admin Access
- URL: https://your-app.railway.app/admin
- Email: admin@beautysalon.com
- Password: admin123

### Features Available
- Service management
- Appointment booking
- Gallery management
- Contact form
- Newsletter subscription
- Admin dashboard

## Troubleshooting

### Common Issues:
1. **Database connection errors**: Check PostgreSQL variables
2. **CORS issues**: Verify CLIENT_URL matches your domain
3. **Build failures**: Check Node.js version compatibility
4. **Email not working**: Verify email credentials and app passwords

### Logs
Check deployment logs in Railway dashboard for detailed error information.

## Support
For issues or questions:
- Check Railway documentation
- Review application logs
- Verify environment variables
- Ensure all dependencies are properly installed