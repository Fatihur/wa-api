# 🔧 Troubleshooting Guide

Panduan mengatasi masalah umum pada WhatsApp API Gateway.

## 📋 Daftar Isi

1. [Session Errors](#session-errors)
2. [Connection Errors](#connection-errors)
3. [QR Code Issues](#qr-code-issues)
4. [Webhook Errors](#webhook-errors)
5. [Message Sending Errors](#message-sending-errors)
6. [Performance Issues](#performance-issues)

---

## Session Errors

### ❌ Error: "Session already exists"

**Penyebab:**
- Session dengan ID yang sama sudah dibuat dan masih aktif

**Solusi:**
1. Cek session yang ada:
   ```bash
   curl http://localhost:3000/api/session
   ```

2. Hapus session yang lama:
   ```bash
   curl -X DELETE http://localhost:3000/api/session/YOUR_SESSION_ID
   ```

3. Atau gunakan session ID yang berbeda

**Prevention:**
- Gunakan session ID yang unik untuk setiap koneksi
- Selalu cek session status sebelum create baru

---

### ❌ Error: "Session not found"

**Penyebab:**
- Session belum dibuat atau sudah dihapus

**Solusi:**
1. Create session terlebih dahulu:
   ```bash
   curl -X POST http://localhost:3000/api/session/create \
     -H "Content-Type: application/json" \
     -d '{"sessionId": "your-session"}'
   ```

2. Verifikasi session exists:
   ```bash
   curl http://localhost:3000/api/session/your-session/status
   ```

---

### ❌ Error: "Session not connected"

**Penyebab:**
- Session belum di-scan dengan WhatsApp
- Connection terputus

**Solusi:**
1. Dapatkan QR code:
   ```bash
   curl http://localhost:3000/api/session/your-session/qr
   ```

2. Scan QR code dengan WhatsApp di HP

3. Tunggu sampai status `connected`

4. Jika terus disconnect, cek:
   - Internet connection
   - Tidak ada session lain dengan nomor yang sama
   - WhatsApp di HP masih login

---

## Connection Errors

### ❌ Error: "QR refs attempts ended"

**Penyebab:**
- QR code timeout (tidak di-scan dalam 60 detik)
- QR code expired

**Solusi:**
1. Session otomatis dibersihkan saat QR timeout
2. Create session baru dan scan QR lebih cepat:
   ```bash
   # Create session
   curl -X POST http://localhost:3000/api/session/create \
     -H "Content-Type: application/json" \
     -d '{"sessionId": "new-session"}'
   
   # Langsung get QR
   curl http://localhost:3000/api/session/new-session/qr
   ```

3. Scan QR dalam waktu 60 detik

**Prevention:**
- Scan QR code segera setelah generate
- Gunakan web UI untuk testing: `http://localhost:3000/docs`

---

### ❌ Connection Closed / Auto Reconnect Loop

**Gejala:**
- Log menunjukkan "Reconnecting... Attempt X"
- Session terus disconnect dan reconnect

**Penyebab:**
- Internet tidak stabil
- WhatsApp di HP logout
- Session file corrupt
- Multiple sessions dengan nomor yang sama

**Solusi:**

1. **Cek internet connection:**
   ```bash
   ping google.com
   ```

2. **Hapus session dan mulai fresh:**
   ```bash
   # Delete via API
   curl -X DELETE http://localhost:3000/api/session/your-session
   
   # Atau hapus folder manual
   rm -rf ./sessions/your-session
   ```

3. **Stop server dan hapus semua sessions:**
   ```bash
   # Stop server (Ctrl+C)
   # Hapus semua sessions
   rm -rf ./sessions/*
   # Start server
   npm start
   ```

4. **Pastikan hanya 1 session per nomor WA:**
   - Jangan pakai nomor yang sama di device/app lain
   - Logout dari WhatsApp Web jika ada
   - Check di HP: Settings > Linked Devices

---

### ❌ Error: "Connection lost"

**Solusi:**
1. Cek status di HP: WhatsApp > Linked Devices
2. Jika device hilang dari list, create session baru
3. Jika masih ada tapi offline, restart server

---

## QR Code Issues

### ❌ QR Code Tidak Muncul

**Solusi:**
1. Tunggu 3-5 detik setelah create session
2. Get QR code manual:
   ```bash
   curl http://localhost:3000/api/session/YOUR_SESSION/qr
   ```

3. Cek session status:
   ```bash
   curl http://localhost:3000/api/session/YOUR_SESSION/status
   ```

---

### ❌ QR Code Invalid / Tidak Bisa Di-scan

**Solusi:**
1. Delete session dan create baru
2. Pastikan response format benar (data:image/png;base64,...)
3. Test dengan web UI: `http://localhost:3000/docs`

---

## Webhook Errors

### ⚠️ Warning: "Webhook delivery failed"

**Gejala:**
- Log: "Webhook delivery failed" dengan error 404, timeout, dll

**Penyebab:**
- Webhook URL tidak valid
- Server webhook tidak running
- Firewall memblokir request

**Solusi:**

1. **Verifikasi webhook URL:**
   - Pastikan URL accessible dari server
   - Test dengan curl:
     ```bash
     curl -X POST https://your-webhook-url.com/webhook \
       -H "Content-Type: application/json" \
       -d '{"test": "data"}'
     ```

2. **Gunakan webhook testing service:**
   - [webhook.site](https://webhook.site)
   - [requestbin.com](https://requestbin.com)
   - Atau ngrok untuk local testing:
     ```bash
     ngrok http 3000
     ```

3. **Optional: Disable webhook:**
   - Create session tanpa webhookUrl:
     ```bash
     curl -X POST http://localhost:3000/api/session/create \
       -H "Content-Type: application/json" \
       -d '{"sessionId": "test"}'
     ```

**Note:** Webhook errors tidak akan crash aplikasi, hanya log warning.

---

## Message Sending Errors

### ❌ Error: "Invalid JID format"

**Penyebab:**
- Format nomor WhatsApp salah

**Format yang benar:**
```
Individual: 6281234567890@s.whatsapp.net
Group: 120363012345678@g.us
```

**Format yang salah:**
```
❌ +6281234567890
❌ 081234567890
❌ 6281234567890 (tanpa @s.whatsapp.net)
```

**Solusi:**
- Gunakan format: `[country_code][number]@s.whatsapp.net`
- Contoh untuk Indonesia: `6281234567890@s.whatsapp.net`

---

### ❌ Error: "Message failed to send"

**Kemungkinan Penyebab & Solusi:**

1. **Nomor tidak terdaftar di WhatsApp:**
   ```bash
   # Check nomor dulu
   curl -X POST http://localhost:3000/api/profile/YOUR_SESSION/check-number \
     -H "Content-Type: application/json" \
     -d '{"numbers": ["6281234567890"]}'
   ```

2. **Session disconnected:**
   - Cek session status
   - Reconnect jika perlu

3. **Rate limit dari WhatsApp:**
   - Jangan kirim terlalu banyak pesan dalam waktu singkat
   - Tunggu beberapa detik antar pesan
   - WhatsApp bisa ban nomor jika spam

---

### ❌ Media Upload Failed

**Penyebab:**
- File terlalu besar (max 50MB)
- Format tidak didukung
- Permission error

**Solusi:**
1. **Cek ukuran file:**
   ```bash
   ls -lh your-file.jpg
   ```

2. **Compress file jika terlalu besar:**
   - Image: gunakan tools seperti TinyPNG
   - Video: compress dengan ffmpeg
   - Document: zip atau compress

3. **Cek permission folder uploads:**
   ```bash
   chmod 755 ./uploads
   ```

4. **Supported formats:**
   - Image: JPG, PNG, GIF, WebP
   - Video: MP4, AVI, MKV
   - Audio: MP3, WAV, OGG, M4A
   - Document: PDF, DOC, XLS, PPT, ZIP, dll

---

## Performance Issues

### 🐌 API Response Lambat

**Solusi:**

1. **Cek server resources:**
   ```bash
   # CPU & Memory
   top
   # atau
   htop
   ```

2. **Restart server:**
   ```bash
   # Stop server
   # Start fresh
   npm start
   ```

3. **Optimize sessions:**
   - Hapus session yang tidak dipakai
   - Jangan buat terlalu banyak session concurrent

4. **Enable production mode:**
   ```bash
   NODE_ENV=production npm start
   ```

---

### 💾 High Memory Usage

**Penyebab:**
- Banyak session aktif
- Message store menumpuk
- Memory leak

**Solusi:**

1. **Monitor memory:**
   ```bash
   node --expose-gc src/app.js
   ```

2. **Limit sessions:**
   - Close sessions yang tidak digunakan
   - Recommend max 10-20 concurrent sessions per server

3. **Restart periodic:**
   - Setup cron job untuk restart server setiap hari
   - Atau gunakan PM2 dengan max memory limit

---

## Server Issues

### ❌ Error: "Port already in use"

**Solusi:**

1. **Kill process di port 3000:**
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # Linux/Mac
   lsof -ti:3000 | xargs kill -9
   ```

2. **Atau ubah port di .env:**
   ```env
   PORT=3001
   ```

---

### ❌ Error: "Cannot find module"

**Solusi:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## Database / Storage Issues

### ❌ Session Files Corrupt

**Gejala:**
- Cannot load session
- Auth state error

**Solusi:**
```bash
# Backup dulu (optional)
cp -r ./sessions ./sessions-backup

# Hapus session corrupt
rm -rf ./sessions/SESSION_ID

# Create session baru
curl -X POST http://localhost:3000/api/session/create \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "SESSION_ID"}'
```

---

## Best Practices

### ✅ Development

1. **Use web UI for testing:**
   - http://localhost:3000/docs
   - Lebih mudah untuk QR scan dan testing

2. **Monitor logs:**
   ```bash
   npm run dev
   ```

3. **Test dengan Postman:**
   - Import `postman_collection.json`
   - Import `postman_environment.json`

### ✅ Production

1. **Use PM2:**
   ```bash
   npm install -g pm2
   pm2 start src/app.js --name wa-api
   pm2 startup
   pm2 save
   ```

2. **Setup monitoring:**
   ```bash
   pm2 monit
   ```

3. **Auto restart on crash:**
   ```bash
   pm2 start src/app.js --name wa-api --max-restarts 10
   ```

4. **Backup sessions regularly:**
   ```bash
   # Cron job setiap hari
   0 2 * * * tar -czf sessions-backup-$(date +\%Y\%m\%d).tar.gz ./sessions
   ```

5. **Use HTTPS:**
   - Setup reverse proxy dengan Nginx/Apache
   - Use Let's Encrypt untuk SSL

6. **Limit access:**
   - Firewall
   - IP whitelist
   - VPN

---

## Getting Help

### 📚 Documentation
- [README.md](README.md) - Overview & features
- [QUICKSTART.md](QUICKSTART.md) - Quick start guide
- [EXAMPLES.md](EXAMPLES.md) - Usage examples
- [POSTMAN_GUIDE.md](POSTMAN_GUIDE.md) - Postman testing guide

### 🔍 Debug Mode
Enable detailed logging:
```javascript
// In src/app.js or src/services/sessionManager.js
logger.level = 'debug';
```

### 📝 Report Issues
Jika masih ada masalah, prepare information berikut:
- Error message lengkap
- Steps to reproduce
- Server logs
- Node.js version: `node --version`
- npm version: `npm --version`
- OS: Windows/Linux/Mac

---

**Happy Coding! 🚀**
