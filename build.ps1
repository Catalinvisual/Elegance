# Production build script for Beauty Salon App (Windows)
# This script prevents build loops by using explicit commands

Write-Host "🚀 Starting production build..." -ForegroundColor Green

# Build client
Write-Host "📦 Building client..." -ForegroundColor Yellow
Set-Location client
npm ci --omit=dev
npm run build
Set-Location ..

# Build server
Write-Host "⚙️ Building server..." -ForegroundColor Yellow
Set-Location server
npm ci --omit=dev
npm run build
Set-Location ..

Write-Host "✅ Production build completed successfully!" -ForegroundColor Green
Write-Host "📁 Client build: client/build/" -ForegroundColor Cyan
Write-Host "📁 Server build: server/dist/" -ForegroundColor Cyan
Write-Host ""
Write-Host "To run the application:" -ForegroundColor White
Write-Host "cd server && npm start" -ForegroundColor White