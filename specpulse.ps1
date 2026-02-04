# SpecPulse Kısayol Script
# Bu script SpecPulse komutlarını kolayca çalıştırmanızı sağlar

$specpulsePath = "C:\Users\90546\AppData\Local\Programs\Python\Python314\Scripts\specpulse.exe"

if (Test-Path $specpulsePath) {
    & $specpulsePath $args
} else {
    Write-Host "SpecPulse bulunamadı: $specpulsePath" -ForegroundColor Red
    Write-Host "Lütfen SpecPulse'un kurulu olduğundan emin olun." -ForegroundColor Yellow
}

