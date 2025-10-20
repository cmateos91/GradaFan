@echo off
echo ========================================
echo   LaLiga Social - Servidor Local
echo ========================================
echo.
echo Iniciando servidor en puerto 80...
echo Abre tu navegador en: http://localhost
echo.
echo IMPORTANTE: Este script requiere permisos de administrador
echo Si ves un error, ejecuta este archivo como Administrador
echo.
echo Presiona Ctrl+C para detener el servidor
echo ========================================
echo.

python -m http.server 80

pause
