@echo off
rem Regenerate index.html from partials/ (uses XAMPP PHP)
cd /d "%~dp0"
php build.php
pause