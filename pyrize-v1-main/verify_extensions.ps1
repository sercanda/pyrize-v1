$cursor = "D:\Program Files\cursor\resources\app\bin\cursor.cmd"
$exts = & "$cursor" --list-extensions
Write-Host "Found extensions:"
$exts | Select-String "antigravity"
