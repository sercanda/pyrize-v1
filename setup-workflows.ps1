# Antigravity Workflows Setup Script for Pyrize Project
# This script downloads and sets up workflows from xenitV1/Antigravity-Workflows

Write-Host "🚀 Setting up Antigravity Workflows..." -ForegroundColor Cyan

# Create .agent directory structure
$agentDir = Join-Path $PSScriptRoot ".agent"
$workflowsDir = Join-Path $agentDir "workflows"
$rulesDir = Join-Path $agentDir "rules"

Write-Host "📁 Creating directory structure..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path $workflowsDir | Out-Null
New-Item -ItemType Directory -Force -Path $rulesDir | Out-Null

# Base URL for raw files
$baseUrl = "https://raw.githubusercontent.com/xenitV1/Antigravity-Workflows/main"

# Workflow files to download
$workflows = @(
    "README.md",
    "plan.md",
    "implement.md",
    "test.md",
    "debug.md",
    "review.md",
    "refactor.md",
    "deploy.md",
    "docs.md",
    "seo.md",
    "geo.md",
    "ultrathink.md"
)

# Rule files to download
$rules = @(
    "README.md",
    "core-orchestrator.md",
    "architecture.md",
    "backend.md",
    "debugging.md",
    "dependency-management.md",
    "design-system.md",
    "documentation.md",
    "geo-specialist.md",
    "seo-specialist.md",
    "mobile.md",
    "multi-file-sync.md",
    "optimization.md",
    "production-deployment.md",
    "quality-gates.md",
    "refactoring.md",
    "testing.md",
    "ultrathink.md"
)

# Download workflows
Write-Host "📥 Downloading workflow files..." -ForegroundColor Yellow
foreach ($file in $workflows) {
    $url = "$baseUrl/.agent/workflows/$file"
    $dest = Join-Path $workflowsDir $file
    try {
        Invoke-WebRequest -Uri $url -OutFile $dest -ErrorAction Stop
        Write-Host "  ✓ $file" -ForegroundColor Green
    } catch {
        Write-Host "  ✗ Failed to download $file" -ForegroundColor Red
    }
}

# Download rules
Write-Host "📥 Downloading rule files..." -ForegroundColor Yellow
foreach ($file in $rules) {
    $url = "$baseUrl/.agent/rules/$file"
    $dest = Join-Path $rulesDir $file
    try {
        Invoke-WebRequest -Uri $url -OutFile $dest -ErrorAction Stop
        Write-Host "  ✓ $file" -ForegroundColor Green
    } catch {
        Write-Host "  ✗ Failed to download $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✅ Antigravity Workflows setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Available workflows (use with slash commands):" -ForegroundColor Cyan
Write-Host "  /plan      - Create implementation plan" -ForegroundColor Gray
Write-Host "  /implement - Implement features" -ForegroundColor Gray
Write-Host "  /test      - Write tests" -ForegroundColor Gray
Write-Host "  /debug     - Debug issues" -ForegroundColor Gray
Write-Host "  /review    - Code review" -ForegroundColor Gray
Write-Host "  /refactor  - Refactor code" -ForegroundColor Gray
Write-Host "  /deploy    - Deploy application" -ForegroundColor Gray
Write-Host "  /docs      - Generate documentation" -ForegroundColor Gray
Write-Host "  /seo       - SEO optimization" -ForegroundColor Gray
Write-Host "  /geo       - GEO optimization" -ForegroundColor Gray
Write-Host "  /ultrathink - Deep analysis mode" -ForegroundColor Gray
Write-Host ""
