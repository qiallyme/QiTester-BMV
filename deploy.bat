@echo off
echo Building QiTester-BMV for Cloudflare deployment...
echo.

echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Building project...
call npm run build
if %errorlevel% neq 0 (
    echo Error: Build failed
    pause
    exit /b 1
)

echo.
echo Build completed successfully!
echo.
echo Next steps:
echo 1. Install Wrangler CLI: npm install -g wrangler
echo 2. Login to Cloudflare: wrangler login
echo 3. Deploy: npm run deploy
echo.
echo Or deploy via Cloudflare Pages dashboard:
echo - Connect your repository
echo - Build command: npm run build
echo - Build output directory: dist
echo.
pause
