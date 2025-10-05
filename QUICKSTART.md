# 🚀 Quick Start Guide

## 1. Instalasi (Sudah Selesai ✅)

Dependencies sudah terinstall. Jika ingin install ulang:
```bash
npm install
```

## 2. Konfigurasi

File `.env` sudah dibuat dengan default values:
```env
PORT=3000
HOST=0.0.0.0
SESSION_STORAGE_PATH=./sessions
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

## 3. Jalankan Server

```bash
npm start
```

Atau dengan auto-reload (development):
```bash
npm run dev
```

Server akan running di: **http://localhost:3000**

## 4. Test Koneksi

Buka browser dan akses:
```
http://localhost:3000
```

Anda akan melihat response:
```json
{
  "success": true,
  "message": "WhatsApp API Gateway",
  "version": "1.0.0",
  "documentation": "/api/docs"
}
```

## 5. Lihat Dokumentasi API

Akses dokumentasi lengkap di browser:
```
http://localhost:3000/api/docs
```

## 6. Test dengan QR Code (Mudah!)

Buka file `test-qr.html` di browser:
```bash
# Windows
start test-qr.html

# Atau double click file test-qr.html
```

Interface akan muncul untuk:
1. Input Session ID
2. Generate & tampilkan QR Code
3. Auto-detect ketika WhatsApp terhubung

## 7. Test dengan cURL

### a. Buat Session Baru
```bash
curl -X POST http://localhost:3000/api/session/create \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\": \"test1\"}"
```

### b. Dapatkan QR Code
```bash
curl http://localhost:3000/api/session/test1/qr
```

Copy QR code (data:image/png;base64,...) dan paste di browser address bar untuk melihat QR.

### c. Scan QR di WhatsApp
1. Buka WhatsApp di HP
2. Menu > Linked Devices
3. Link a Device
4. Scan QR yang muncul

### d. Cek Status
```bash
curl http://localhost:3000/api/session/test1/status
```

### e. Kirim Pesan
```bash
curl -X POST http://localhost:3000/api/message/test1/send/text \
  -H "Content-Type: application/json" \
  -d "{\"jid\": \"6281234567890@s.whatsapp.net\", \"text\": \"Hello dari API!\"}"
```

Ganti `6281234567890` dengan nomor tujuan (dengan kode negara, tanpa +)

## 8. Format Nomor WhatsApp (JID)

- **Individual:** `[kode_negara][nomor]@s.whatsapp.net`
  - Contoh: `6281234567890@s.whatsapp.net`
  
- **Group:** `[group_id]@g.us`
  - Contoh: `120363012345678@g.us`

## 9. Multi-Client Setup

API ini support multiple sessions sekaligus:

```bash
# Client 1
curl -X POST http://localhost:3000/api/session/create \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\": \"client1\"}"

# Client 2
curl -X POST http://localhost:3000/api/session/create \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\": \"client2\"}"

# Client 3 dengan webhook
curl -X POST http://localhost:3000/api/session/create \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\": \"client3\", \"webhookUrl\": \"https://myapp.com/webhook\"}"
```

Setiap session independen dan bisa terhubung ke nomor WhatsApp berbeda.

## 10. Fitur Lengkap

### ✅ Session Management
- Create/delete session
- QR code generation
- Status monitoring
- Auto-reconnect

### ✅ Messaging (30+ endpoints)
- Text, Image, Video, Audio
- Document, Sticker
- Location, Contact
- Reaction, Buttons, Lists
- Forward, Delete, Read receipts
- Typing indicators

### ✅ Group Management (15+ endpoints)
- Create/update groups
- Add/remove members
- Promote/demote admins
- Invite links
- Group settings

### ✅ Profile & Contacts (12+ endpoints)
- Get/update profile
- Block/unblock contacts
- Check numbers on WhatsApp
- Privacy settings

## 11. Webhook Integration

Jika Anda set webhook URL saat create session, server akan push events ke URL tersebut:

```json
// Event: Message Received
POST https://your-app.com/webhook
{
  "event": "message",
  "sessionId": "client1",
  "data": {
    "key": {...},
    "message": {"conversation": "Hello!"},
    "messageTimestamp": "1234567890"
  }
}
```

Events yang dikirim:
- `qr` - QR code generated
- `connected` - WhatsApp connected
- `disconnected` - Connection lost
- `message` - New message received
- `message.update` - Message updated
- `presence` - Contact presence changed
- `chats.update` - Chats updated
- `groups.update` - Groups updated

## 12. Tips Production

1. **Gunakan HTTPS** (bukan HTTP) di production
2. **Setup Reverse Proxy** dengan Nginx/Apache untuk kontrol akses
3. **Batasi akses** menggunakan firewall atau IP whitelist
4. **Monitor Logs** untuk debugging
5. **Backup folder `sessions/`** secara berkala
6. **Rate Limiting** sudah aktif (100 req/menit default)
7. **Use PM2** atau Docker untuk production deployment

### Deployment dengan PM2:
```bash
npm install -g pm2
pm2 start src/app.js --name "wa-api"
pm2 startup
pm2 save
```

## 13. Troubleshooting

**Q: QR tidak muncul?**
- Tunggu 3-5 detik setelah create session
- Refresh dengan endpoint GET /session/:sessionId/qr

**Q: Session terputus terus?**
- Pastikan tidak ada session lain dengan nomor yang sama
- Cek logs untuk error detail
- Pastikan koneksi internet stabil

**Q: Error "Session not found"?**
- Buat session dulu dengan POST /session/create
- Cek session tersedia dengan GET /session

**Q: Media tidak bisa dikirim?**
- Maksimal file size 50MB
- Pastikan format didukung
- Cek permission folder `uploads/`

## 14. Next Steps

- Lihat **EXAMPLES.md** untuk contoh lengkap semua endpoints
- Lihat **README.md** untuk dokumentasi detail
- Test dengan **test-qr.html** untuk quick testing
- Integrate dengan aplikasi Anda menggunakan HTTP client favorit

## 15. Support

Jika ada pertanyaan atau menemukan bug, silakan buka issue.

---

**Happy Coding! 🚀**
