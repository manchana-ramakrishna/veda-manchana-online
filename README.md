# veda.manchana.online

World-class monograph site for Veda Raman Manchana — turning 21 on August 27, 2026.

## Stack

Static site: `index.html`, `styles.css`, `app.js`

Hosted like other `*.manchana.online` properties: **S3 + CloudFront + Route 53**.

## Local

Open `index.html` in a browser, or serve the folder with any static server.

## Deploy

1. Sync site files to the Veda S3 bucket
2. Invalidate CloudFront
3. Ensure Route 53 `veda.manchana.online` points at the distribution

See `.github/workflows/deploy.yml` for CI once AWS secrets are configured.
