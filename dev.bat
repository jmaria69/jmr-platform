@echo off
REM Script para manejar el servidor de desarrollo Praxia Labs

:menu
cls
echo.
echo ========================================
echo   PRAXIA LABS - Dev Server Manager
echo ========================================
echo.
echo 1. Iniciar servidor (npm run dev)
echo 2. Detener servidor
echo 3. Limpiar cache (.next) e iniciar
echo 4. Hacer build
echo 5. Salir
echo.
set /p choice="Selecciona una opcion (1-5): "

if "%choice%"=="1" goto start
if "%choice%"=="2" goto stop
if "%choice%"=="3" goto clean_start
if "%choice%"=="4" goto build
if "%choice%"=="5" goto exit
echo Opcion invalida
timeout /t 2
goto menu

:start
echo.
echo Iniciando servidor...
npm run dev
goto menu

:stop
echo.
echo Deteniendo proceso en puerto 3000/3001...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do taskkill /pid %%a /f
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3001" ^| find "LISTENING"') do taskkill /pid %%a /f
echo Servidor detenido.
timeout /t 2
goto menu

:clean_start
echo.
echo Limpiando cache (.next)...
if exist .next (
    rmdir /s /q .next
    echo Cache eliminado
)
echo Limpiando node_modules/.next...
if exist node_modules/.next (
    rmdir /s /q node_modules/.next
)
echo Iniciando servidor...
npm run dev
goto menu

:build
echo.
echo Ejecutando build...
npm run build
echo Build completado.
timeout /t 3
goto menu

:exit
cls
echo Saliendo...
exit /b 0