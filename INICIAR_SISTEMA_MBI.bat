@echo off
title SISTEMA MBI - INICIANDO MODO APP...
set PROJECT_PATH=C:\Users\GraficaMB\Documents\SISTEMA MBI\webapp
set NODE_PATH=C:\Users\GraficaMB\Documents\SISTEMA MBI\node_env22
set CHROME="C:\Program Files\Google\Chrome\Application\chrome.exe"

echo ==========================================
echo       SISTEMA MBI - MODO APLICATIVO
echo ==========================================
echo.
echo [1/3] Configurando ambiente...
set PATH=%NODE_PATH%;%PATH%

echo [2/3] Entrando na pasta do projeto...
cd /d "%PROJECT_PATH%"

echo [3/3] Iniciando Servidor...
echo Aguarde o carregamento do aplicativo...
echo.

:: Inicia o servidor em uma janela minimizada (se desejar ocultar o terminal, use o VBS de novo, mas o .bat é mais seguro para ver erros)
start /min cmd /c "set PATH=%NODE_PATH%;%PATH% && npm run dev"

:: Espera o servidor subir
timeout /t 5 /nobreak > nul

:: Abre o Chrome em Modo Aplicativo (janela limpa)
if exist %CHROME% (
    start "" %CHROME% --app=http://localhost:3000
) else (
    start http://localhost:3000
)

echo.
echo Aplicativo iniciado com sucesso!
echo Nao feche esta janela enquanto estiver usando o sistema.
echo.
timeout /t 3 > nul
exit
