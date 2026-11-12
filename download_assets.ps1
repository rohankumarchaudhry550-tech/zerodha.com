# Create directories
$baseDir = "c:\Users\rohan\Desktop\zerodha\public\static\images"
$productsDir = "$baseDir\products"

if (!(Test-Path $baseDir)) {
    New-Item -ItemType Directory -Force -Path $baseDir
}
if (!(Test-Path $productsDir)) {
    New-Item -ItemType Directory -Force -Path $productsDir
}

# Assets mapping
$assets = @{
    "https://zerodha.com/static/images/logo.svg" = "$baseDir\logo.svg"
    "https://zerodha.com/static/images/landing.svg" = "$baseDir\landing.svg"
    "https://zerodha.com/static/images/ecosystem.png" = "$baseDir\ecosystem.png"
    "https://zerodha.com/static/images/kc-logo-landing.svg" = "$baseDir\kc-logo-landing.svg"
    "https://zerodha.com/static/images/kc-banner-image.svg" = "$baseDir\kc-banner-image.svg"
    "https://zerodha.com/static/images/pricing-eq.svg" = "$baseDir\pricing-eq.svg"
    "https://zerodha.com/static/images/other-trades.svg" = "$baseDir\other-trades.svg"
    "https://zerodha.com/static/images/index-education.svg" = "$baseDir\index-education.svg"
    "https://zerodha.com/static/images/google-play-badge-light.svg" = "$baseDir\google-play-badge-light.svg"
    "https://zerodha.com/static/images/appstore-badge-light.svg" = "$baseDir\appstore-badge-light.svg"
    "https://zerodha.com/static/images/x-twitter.svg" = "$baseDir\x-twitter.svg"
    "https://zerodha.com/static/images/youtube.svg" = "$baseDir\youtube.svg"
    "https://zerodha.com/static/images/whatsapp-logo.svg" = "$baseDir\whatsapp-logo.svg"
    "https://zerodha.com/static/images/products/kite-logo.svg" = "$productsDir\kite-logo.svg"
    "https://zerodha.com/static/images/products/console.svg" = "$productsDir\console.svg"
    "https://zerodha.com/static/images/products/kite-connect.svg" = "$productsDir\kite-connect.svg"
    "https://zerodha.com/static/images/products/coin.svg" = "$productsDir\coin.svg"
    "https://zerodha.com/static/images/products/varsity.png" = "$productsDir\varsity.png"
    "https://zerodha.com/static/images/products/tqna.png" = "$productsDir\tqna.png"
}

# Download assets
foreach ($url in $assets.Keys) {
    $dest = $assets[$url]
    Write-Host "Downloading $url to $dest..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $dest -UserAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    } catch {
        Write-Error "Failed to download $url : $_"
    }
}
Write-Host "All assets downloaded successfully!"
