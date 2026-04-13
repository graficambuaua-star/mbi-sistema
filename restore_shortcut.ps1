$ws = New-Object -ComObject WScript.Shell
$lnkPath = "C:\Users\GraficaMB\Desktop\SISTEMA MBI.lnk"
$batPath = "C:\Users\GraficaMB\Documents\SISTEMA MBI\webapp\INICIAR_SISTEMA_MBI.bat"

$s = $ws.CreateShortcut($lnkPath)
$s.TargetPath = $batPath
# Icone de engrenagem / ferramentas do sistema (shell32.dll, 71)
$s.IconLocation = "C:\WINDOWS\System32\shell32.dll,71"
$s.Save()

Write-Host "Atalho restaurado na Área de Trabalho com ícone de sistema."

# Forçar refresh do cache
& ie4uinit.exe -show
