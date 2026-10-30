<#
.SYNOPSIS
    SmartLink Business - Native Production HTTP Server & Secure Email Dispatcher
.DESCRIPTION
    Zero-dependency, high-performance static server with /api/send-enquiry endpoint
    supporting secure server-side email delivery via environment variables / .env.
#>

$port = 3000
$root = $PSScriptRoot

# 1. Load .env file if present
$envFile = Join-Path $root ".env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
            $parts = $line.Split("=", 2)
            $k = $parts[0].Trim()
            $v = $parts[1].Trim().Trim('"').Trim("'")
            [System.Environment]::SetEnvironmentVariable($k, $v, "Process")
        }
    }
    Write-Host "[CONFIG] Loaded environment settings from .env" -ForegroundColor Green
}

# Read Environment Variables
if ($env:PORT) { $port = [int]$env:PORT }
$notificationEmail = $env:NOTIFICATION_EMAIL
$smtpHost          = $env:SMTP_HOST
$smtpPort          = if ($env:SMTP_PORT) { [int]$env:SMTP_PORT } else { 587 }
$smtpUser          = $env:SMTP_USER
$smtpPass          = $env:SMTP_PASS
$fromEmail         = if ($env:FROM_EMAIL) { $env:FROM_EMAIL } else { $smtpUser }

# Display Server & SMTP Configuration Status
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   SMARTLINK BUSINESS - PRODUCTION & LOCAL SERVER" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Server Root        : $root"
Write-Host " Local URL          : http://localhost:$port/"
Write-Host " Recipient Email    : $(if ($notificationEmail) { $notificationEmail } else { '[NOT SET - Update in .env]' })"
Write-Host " SMTP Server        : $(if ($smtpHost) { "$smtpHost`:$smtpPort" } else { '[NOT CONFIGURED - Update in .env]' })"
Write-Host "==========================================================" -ForegroundColor Cyan

# Prepare inquiries persistence file
$leadsFile = Join-Path $root "enquiries.json"
if (-not (Test-Path $leadsFile)) {
    "[]" | Out-File -FilePath $leadsFile -Encoding utf8
}

# Start HTTP Listener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")

try {
    $listener.Start()
    Write-Host "[READY] Server listening on http://localhost:$port/" -ForegroundColor Green
    Write-Host "[INFO] Press Ctrl+C to terminate server.`n" -ForegroundColor Gray
} catch {
    Write-Host "[ERROR] Could not start listener on port $port : $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".webp" = "image/webp"
    ".ico"  = "image/x-icon"
    ".txt"  = "text/plain; charset=utf-8"
}

function Send-JsonResponse($resp, $statusCode, $obj) {
    $resp.StatusCode = $statusCode
    $resp.ContentType = "application/json; charset=utf-8"
    $json = $obj | ConvertTo-Json -Depth 4
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
    $resp.ContentLength64 = $bytes.Length
    $resp.OutputStream.Write($bytes, 0, $bytes.Length)
    $resp.Close()
}

# Main Request Loop
while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # CORS Headers
        $response.AddHeader("Access-Control-Allow-Origin", "*")
        $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        $response.AddHeader("Access-Control-Allow-Headers", "Content-Type")

        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 200
            $response.Close()
            continue
        }

        $rawPath = $request.Url.LocalPath

        # =====================================================================
        # API ROUTE: POST /api/send-enquiry
        # =====================================================================
        if ($rawPath -eq "/api/send-enquiry" -and $request.HttpMethod -eq "POST") {
            $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
            $jsonBody = $reader.ReadToEnd()
            $reader.Close()

            $leadData = $null
            try {
                $leadData = ConvertFrom-Json $jsonBody
            } catch {
                Send-JsonResponse $response 400 @{ success = $false; message = "Invalid JSON payload." }
                continue
            }

            $fullName     = [string]$leadData.fullName
            $businessName = [string]$leadData.businessName
            $email        = [string]$leadData.email
            $phone        = [string]$leadData.phone
            $service      = [string]$leadData.service
            $message      = [string]$leadData.message
            $timestamp    = if ($leadData.timestamp) { [string]$leadData.timestamp } else { (Get-Date).ToString("o") }

            # Basic Validation
            if ([string]::IsNullOrWhiteSpace($fullName) -or [string]::IsNullOrWhiteSpace($email)) {
                Send-JsonResponse $response 400 @{ success = $false; message = "Missing required name or email fields." }
                continue
            }

            # 1. Log Enquiry to enquiries.json (Zero Data Loss)
            try {
                $existing = Get-Content $leadsFile -Raw -Encoding utf8 | ConvertFrom-Json
                if (-not ($existing -is [System.Collections.IEnumerable])) {
                    $existing = @($existing)
                }
            } catch {
                $existing = @()
            }

            $newLead = [PSCustomObject]@{
                id           = "LEAD-" + (Get-Date -UFormat %s)
                fullName     = $fullName
                businessName = $businessName
                email        = $email
                phone        = $phone
                service      = $service
                message      = $message
                timestamp    = $timestamp
            }

            $existing += $newLead
            $existing | ConvertTo-Json -Depth 5 | Out-File -FilePath $leadsFile -Encoding utf8
            Write-Host "[ENQUIRY STORED] Recorded from $fullName ($businessName)" -ForegroundColor Yellow

            # 2. Check SMTP Configuration for Server-Side Email Dispatch
            if ($smtpHost -and $smtpUser -and $smtpPass -and $notificationEmail) {
                try {
                    $mail = New-Object System.Net.Mail.MailMessage
                    $mail.From = New-Object System.Net.Mail.MailAddress($fromEmail, "SmartLink Business Leads")
                    $mail.To.Add($notificationEmail)
                    $mail.Subject = "New SmartLink Enquiry: $fullName - $businessName ($service)"
                    $mail.IsBodyHtml = $true

                    $mail.Body = @"
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 20px; background: #f9fafb; }
    .card { background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; max-width: 600px; margin: 0 auto; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: #0A0B0D; color: #FAF8F5; padding: 24px; border-bottom: 2px solid #F59E0B; }
    .header h2 { margin: 0; font-size: 1.3rem; color: #FAF8F5; }
    .badge { display: inline-block; background: #F59E0B; color: #0A0B0D; font-weight: 700; font-size: 0.75rem; padding: 2px 8px; border-radius: 4px; margin-top: 6px; }
    .content { padding: 24px; }
    .row { display: flex; padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
    .label { width: 160px; font-weight: 600; color: #6b7280; font-size: 0.85rem; text-transform: uppercase; }
    .value { flex: 1; font-weight: 500; color: #111827; }
    .message-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 4px; margin-top: 16px; font-style: italic; }
    .footer { background: #f3f4f6; padding: 16px; text-align: center; font-size: 0.8rem; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2>✦ New Customer Lead Received</h2>
      <div class="badge">$service</div>
    </div>
    <div class="content">
      <div class="row"><div class="label">Customer Name</div><div class="value"><strong>$fullName</strong></div></div>
      <div class="row"><div class="label">Business / Venue</div><div class="value">$businessName</div></div>
      <div class="row"><div class="label">Email Address</div><div class="value"><a href="mailto:$email">$email</a></div></div>
      <div class="row"><div class="label">Phone / WhatsApp</div><div class="value"><a href="tel:$phone">$phone</a> | <a href="https://wa.me/$($phone -replace '[^\d]', '')" target="_blank">Chat on WhatsApp</a></div></div>
      <div class="row"><div class="label">Service Required</div><div class="value">$service</div></div>
      <div class="row"><div class="label">Submission Date</div><div class="value">$timestamp</div></div>
      
      <div style="margin-top: 16px;">
        <div class="label">Message / Requirements</div>
        <div class="message-box">$(if ($message) { $message } else { 'No special notes provided.' })</div>
      </div>
    </div>
    <div class="footer">
      Dispatched securely by SmartLink Business Production Server • Indore, MP
    </div>
  </div>
</body>
</html>
"@
                    $smtpClient = New-Object System.Net.Mail.SmtpClient($smtpHost, $smtpPort)
                    $smtpClient.EnableSsl = $true
                    $smtpClient.Credentials = New-Object System.Net.NetworkCredential($smtpUser, $smtpPass)
                    $smtpClient.Timeout = 15000

                    $smtpClient.Send($mail)
                    $mail.Dispose()
                    $smtpClient.Dispose()

                    Write-Host "[EMAIL SENT] Dispatched enquiry to $notificationEmail via $smtpHost" -ForegroundColor Green
                    Send-JsonResponse $response 200 @{
                        success = $true
                        message = "Enquiry recorded and delivered to $notificationEmail"
                        recipient = $notificationEmail
                    }
                    continue
                } catch {
                    Write-Host "[SMTP ERROR] Could not dispatch email: $($_.Exception.Message)" -ForegroundColor Red
                    Send-JsonResponse $response 200 @{
                        success = $false
                        code    = "SMTP_ERROR"
                        message = "Enquiry safely saved to enquiries.json, but email dispatch failed: $($_.Exception.Message)"
                    }
                    continue
                }
            } else {
                # SMTP not yet configured - report honestly without faking
                Write-Host "[NOTICE] SMTP unconfigured. Lead saved to enquiries.json. Update .env to enable email dispatch." -ForegroundColor DarkYellow
                Send-JsonResponse $response 200 @{
                    success = $false
                    code    = "SMTP_NOT_CONFIGURED"
                    message = "Enquiry recorded on server! To dispatch live emails, configure NOTIFICATION_EMAIL and SMTP settings in .env."
                }
                continue
            }
        }

        # =====================================================================
        # STATIC FILE SERVING
        # =====================================================================
        $urlPath = $rawPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($urlPath)) {
            $urlPath = "index.html"
        }

        $urlPath = [System.Uri]::UnescapeDataString($urlPath)
        $filePath = Join-Path $root ($urlPath -replace '/', '\')

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $response.ContentType = $contentType
            $response.AddHeader("Cache-Control", "no-cache")

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $urlPath")
            $response.OutputStream.Write($msg, 0, $msg.Length)
            $response.Close()
        }
    } catch {
        # Catch connection aborts gracefully
    }
}
