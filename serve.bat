:: Copy this to the directory you wish to serve.
ECHO OFF
setlocal

:start

CD /d "%~dp0"

SET port=""
SET /p port="Port: "
SET /a port=%port%

IF NOT DEFINED port (SET port=8000)

IF %port% LSS 1000 (SET /a port=%port%+8000)

SET test=0
IF %port% LSS 1025 SET test=1
IF %port% GTR 49151 SET test=1
IF %test%==1 (
  ECHO %port% is an invalid port.
  SET test=0
  SET port=""
  GOTO start
)

START chrome http://localhost:%port%
python -m http.server %port%
PAUSE
endlocal
