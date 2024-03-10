@echo off
::set "directoryPath=.\node_modules"

cls
::if exist "%directoryPath%" (
::    rd /s /q "%directoryPath%"
::    echo "Node Modules Directory removed successfully."
::) else (
::    echo "Node Modules Directory does not exist. Hence skipping the deletion."
::)

set "directoryPath=.\out"
if exist "%directoryPath%" (
    rd /s /q "%directoryPath%"
    echo "Out Directory removed successfully."
) else (
    echo "Out Directory does not exist. Hence skipping the deletion."
)
npm i && npm run build && (
if "%1"=="compile" (
    echo First argument is "compile"
) else (
    echo First argument is not "compile"
    ::npm i && npm run build && npm start
    npm start
))