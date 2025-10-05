# WhatsApp API Gateway

WhatsApp API Gateway menggunakan Baileys dengan dukungan multi-client untuk banyak aplikasi.

## 📚 Documentation

- **[Web UI Documentation](http://localhost:3000/docs)** - Interactive documentation with live testing ⭐
- **[API Reference](API_REFERENCE.md)** - Complete API reference
- **[Quick Start Guide](QUICKSTART.md)** - Get started in 5 minutes
- **[Examples](EXAMPLES.md)** - Usage examples for all endpoints
- **[QR Testing UI](test-qr.html)** - Visual QR code tester

## Fitur

### ✅ Session Management
- Multi-session support (multiple WhatsApp connections)
- QR Code authentication
- Session persistence
- Auto-reconnect
- Webhook notifications

### ✅ Messaging
- Send text messages
- Send media (image, video, audio, document, sticker)
- Send location
- Send contacts
- Send reactions
- Send button messages
- Send list messages
- Forward messages
- Delete messages
- Mark as read
- Typing/recording indicators
- Download media from messages

### ✅ Group Management
- Create groups
- Get group metadata
- Update group info (name, description, picture)
- Add/remove participants
- Promote/demote admins
- Leave group
- Get/revoke invite codes
- Join via invite link
- Group settings (locked/unlocked)

### ✅ Profile Management
- Get profile information
- Update profile (name, status, picture)
- Block/unblock contacts
- Get contacts & chats
- Check if numbers are on WhatsApp
- Privacy settings

## Instalasi

```bash
npm install
```

## Konfigurasi

Edit file `.env`:

```env
PORT=3000
HOST=0.0.0.0
SESSION_STORAGE_PATH=./sessions
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

## Menjalankan Server

```bash
# Production
npm start

# Development (dengan nodemon)
npm run dev
```

Server akan berjalan di `http://localhost:3000`

## Penggunaan API

Semua endpoint dapat diakses secara langsung tanpa memerlukan API key.

## Dokumentasi API

Akses dokumentasi lengkap di: `http://localhost:3000/api/docs`

## Contoh Penggunaan

### 1. Membuat Session Baru

```bash
curl -X POST http://localhost:3000/api/session/create \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "client1",
    "webhookUrl": "https://your-app.com/webhook"
  }'
```

### 2. Mendapatkan QR Code

```bash
curl http://localhost:3000/api/session/client1/qr
```

Response akan berisi QR Code dalam format Data URL yang bisa langsung ditampilkan di browser.

### 3. Mengirim Pesan Text

```bash
curl -X POST http://localhost:3000/api/message/client1/send/text \
  -H "Content-Type: application/json" \
  -d '{
    "jid": "6281234567890@s.whatsapp.net",
    "text": "Hello from API!"
  }'
```

### 4. Mengirim Gambar

```bash
curl -X POST http://localhost:3000/api/message/client1/send/image \
  -F "image=@/path/to/image.jpg" \
  -F "jid=6281234567890@s.whatsapp.net" \
  -F "caption=Check this image!"
```

### 5. Membuat Group

```bash
curl -X POST http://localhost:3000/api/group/client1/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Group",
    "participants": ["6281234567890@s.whatsapp.net", "6289876543210@s.whatsapp.net"]
  }'
```

## Format JID (WhatsApp ID)

- **Individual:** `6281234567890@s.whatsapp.net`
- **Group:** `120363012345678@g.us`

## Webhook Events

Jika Anda mengatur `webhookUrl` saat membuat session, server akan mengirim event ke URL tersebut:

### Event Types:

```json
// QR Code Generated
{
  "event": "qr",
  "sessionId": "client1",
  "data": {
    "qr": "data:image/png;base64,..."
  }
}

// Connected
{
  "event": "connected",
  "sessionId": "client1",
  "data": {
    "user": {
      "id": "6281234567890:1@s.whatsapp.net",
      "name": "My Name"
    }
  }
}

// Message Received
{
  "event": "message",
  "sessionId": "client1",
  "data": {
    "key": {...},
    "message": {...},
    "messageTimestamp": "1234567890"
  }
}

// Disconnected
{
  "event": "disconnected",
  "sessionId": "client1",
  "data": {
    "reason": "Connection closed"
  }
}
```

## Multi-Client Support

API ini mendukung multiple sessions secara bersamaan. Setiap aplikasi dapat membuat session sendiri dengan `sessionId` yang berbeda:

```bash
# App 1
POST /api/session/create {"sessionId": "app1-user1"}

# App 2
POST /api/session/create {"sessionId": "app2-client1"}

# App 3
POST /api/session/create {"sessionId": "app3-service1"}
```

## Error Handling

Semua response menggunakan format standar:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": null
}
```

## Rate Limiting

Default rate limit: 100 requests per menit per IP. Konfigurasi dapat diubah di file `.env`.

## Security

- Gunakan HTTPS di production
- Batasi akses ke IP tertentu jika memungkinkan
- Gunakan firewall atau reverse proxy untuk kontrol akses
- Simpan credentials dengan aman

## Troubleshooting

### QR Code tidak muncul
- Pastikan session sudah dibuat dengan benar
- Cek status session: `GET /api/session/:sessionId/status`

### Session terputus terus
- Cek koneksi internet
- Pastikan tidak ada session lain dengan nomor yang sama
- Cek logs untuk error detail

### Media tidak terkirim
- Pastikan ukuran file tidak melebihi 50MB
- Pastikan format file didukung
- Cek permission folder uploads/

## Support

Untuk pertanyaan atau issue, silakan buka issue di repository.

## License

MIT
