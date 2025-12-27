# IMPORTANT: Railway Database Setup

The error `ConnectionRefusedError` happens because the server cannot connect to the database.
This is because Railway does not automatically provide a database unless you add one.

## 1. Add PostgreSQL Database in Railway
1. Go to your Railway Project.
2. Click **"New"** (or right-click the canvas).
3. Select **"Database"** -> **"PostgreSQL"**.
4. Wait for it to deploy.

## 2. Connect Server to Database
1. Click on your **Node.js Server** service in Railway.
2. Go to **"Variables"**.
3. Add a new variable:
   - **Variable Name**: `DATABASE_URL`
   - **Value**: `${PostgreSQL.DATABASE_URL}` (Railway should autocomplete this when you type `${`)
   
   *Alternatively, if you link the services via the UI (Connect), this variable is added automatically.*

## 3. Required Environment Variables
Ensure these variables are present in your Server service:

- `NODE_ENV`: `production`
- `PORT`: `5000` (or allow Railway to set `PORT`)
- `JWT_SECRET`: (Your secret key for authentication)
- `DATABASE_URL`: (The connection string from step 2)

## Changes Made to Code
I have updated `server/src/config/database.ts` to automatically use `DATABASE_URL` when available.
This fixes the `ECONNREFUSED` error by using the correct Railway database connection instead of `localhost`.
