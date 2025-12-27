# Production Build Fix

## Problemă
Build-ul în producție pe Railway crea un ciclu infinit din cauza scripturilor recursive în `npm run build`.

## Soluție
Am implementat mai multe metode de build pentru a preveni ciclul infinit:

### 1. Nixpacks Configuration (`nixpacks.toml`)
- Configurează pașii exacti de build pentru Railway
- Evită apelurile recursive la `npm run build`

### 2. Railway Configuration (`railway.json`)
- Specifică comenzi directe de build fără scripturi intermediare
- Build command: `cd client && npm ci --omit=dev && npm run build && cd ../server && npm ci --omit=dev && npm run build`

### 3. Docker Support (Opțional)
- `Dockerfile` pentru containerizare completă
- `docker-compose.yml` pentru dezvoltare locală

### 4. Scripturi de Build Locale
- `build.ps1` - Script PowerShell pentru Windows
- `build.sh` - Script Bash pentru Linux/Mac

## Utilizare

### Railway Deployment (Recomandat)
```bash
# Railway va folosi automat nixpacks.toml sau railway.json
git push origin master
```

### Build Local
```bash
# Windows
npm run build:prod

# Sau manual
cd client && npm run build && cd ../server && npm run build
```

### Docker Build
```bash
npm run build:docker
# Sau
docker build -t beauty-salon-app .
```

## Configurație Railway
Asigurați-vă că aveți următoarele variabile de mediu în Railway:
- `NODE_ENV=production`
- `JWT_SECRET=your-secret-key`
- `CLIENT_URL=https://your-app.railway.app`
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`

## Health Check
Aplicația are un endpoint de health check la `/api/health` pentru monitorizare.