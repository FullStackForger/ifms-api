
@echo --------------------------------
@echo use below command to check what is listening on a port
@echo 'netstat -anb | findstr :80'
@echo --------------------------------

@ECHO OFF
start C:\dev\nginx\nginx.exe
start /B C:\dev\php\php-cgi.exe -b 127.0.0.1:9000 -c C:\dev\php\php.ini
ping 127.0.0.1 -n 1>NUL
echo Starting nginx
echo .
echo ..
echo ...
ping 127.0.0.1 >NUL
