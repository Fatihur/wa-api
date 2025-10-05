# Contoh Penggunaan API

## Setup Awal

1. Jalankan server:
```bash
npm start
```

2. Server berjalan di `http://localhost:3000`

## Header Authentication

Semua request memerlukan header:
```
x-api-key: fatih-ganteng
```

---

## 1. Session Management

### Membuat Session Baru
```bash
curl -X POST http://localhost:3000/api/session/create \
  -H "Content-Type: application/json" \
  -H "x-api-key: fatih-ganteng" \
  -d '{
    "sessionId": "mysession1",
    "webhookUrl": "https://your-app.com/webhook"
  }'
```

### Mendapatkan QR Code
```bash
curl http://localhost:3000/api/session/mysession1/qr \
  -H "x-api-key: fatih-ganteng"
```

Response:
```json
{
  "success": true,
  "message": "QR code retrieved",
  "data": {
    "qr": "data:image/png;base64,iVBORw0KGgoAAAANS..."
  }
}
```

Tampilkan QR Code di browser dengan tag:
```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANS..." />
```

### Cek Status Session
```bash
curl http://localhost:3000/api/session/mysession1/status \
  -H "x-api-key: fatih-ganteng"
```

### Lihat Semua Session
```bash
curl http://localhost:3000/api/session \
  -H "x-api-key: fatih-ganteng"
```

### Hapus Session
```bash
curl -X DELETE http://localhost:3000/api/session/mysession1 \
  -H "x-api-key: fatih-ganteng"
```

---

## 2. Messaging

### Send Text Message
```bash
curl -X POST http://localhost:3000/api/message/mysession1/send/text \
  -H "Content-Type: application/json" \
  -H "x-api-key: fatih-ganteng" \
  -d '{
    "jid": "6281234567890@s.whatsapp.net",
    "text": "Hello, ini pesan dari API!"
  }'
```

### Send Image (with file upload)
```bash
curl -X POST http://localhost:3000/api/message/mysession1/send/image \
  -H "x-api-key: fatih-ganteng" \
  -F "image=@/path/to/image.jpg" \
  -F "jid=6281234567890@s.whatsapp.net" \
  -F "caption=Lihat gambar ini!"
```

### Send Image (with URL)
```bash
curl -X POST http://localhost:3000/api/message/mysession1/send/image \
  -H "Content-Type: application/json" \
  -H "x-api-key: fatih-ganteng" \
  -d '{
    "jid": "6281234567890@s.whatsapp.net",
    "imageUrl": "https://example.com/image.jpg",
    "caption": "Lihat gambar ini!"
  }'
```

### Send Video
```bash
curl -X POST http://localhost:3000/api/message/mysession1/send/video \
  -H "x-api-key: fatih-ganteng" \
  -F "video=@/path/to/video.mp4" \
  -F "jid=6281234567890@s.whatsapp.net" \
  -F "caption=Video keren!"
```

### Send Audio/Voice Note
```bash
curl -X POST http://localhost:3000/api/message/mysession1/send/audio \
  -H "x-api-key: fatih-ganteng" \
  -F "audio=@/path/to/audio.mp3" \
  -F "jid=6281234567890@s.whatsapp.net" \
  -F "ptt=true"
```
Note: `ptt=true` untuk voice note, `ptt=false` untuk audio file biasa

### Send Document
```bash
curl -X POST http://localhost:3000/api/message/mysession1/send/document \
  -H "x-api-key: fatih-ganteng" \
  -F "document=@/path/to/document.pdf" \
  -F "jid=6281234567890@s.whatsapp.net" \
  -F "fileName=dokumen.pdf"
```

### Send Location
```bash
curl -X POST http://localhost:3000/api/message/mysession1/send/location \
  -H "Content-Type: application/json" \
  -H "x-api-key: fatih-ganteng" \
  -d '{
    "jid": "6281234567890@s.whatsapp.net",
    "latitude": "-6.200000",
    "longitude": "106.816666",
    "name": "Monas",
    "address": "Jakarta Pusat, Indonesia"
  }'
```

### Send Contact
```bash
curl -X POST http://localhost:3000/api/message/mysession1/send/contact \
  -H "Content-Type: application/json" \
  -H "x-api-key: fatih-ganteng" \
  -d '{
    "jid": "6281234567890@s.whatsapp.net",
    "contacts": [
      {
        "fullName": "John Doe",
        "waid": "6281234567890",
        "phoneNumber": "6281234567890"
      }
    ]
  }'
```

### Send Reaction
```bash
curl -X POST http://localhost:3000/api/message/mysession1/send/reaction \
  -H "Content-Type: application/json" \
  -H "x-api-key: fatih-ganteng" \
  -d '{
    "jid": "6281234567890@s.whatsapp.net",
    "messageId": "MESSAGE_ID_HERE",
    "emoji": "👍"
  }'
```

### Send Button Message
```bash
curl -X POST http://localhost:3000/api/message/mysession1/send/buttons \
  -H "Content-Type: application/json" \
  -H "x-api-key: fatih-ganteng" \
  -d '{
    "jid": "6281234567890@s.whatsapp.net",
    "text": "Pilih salah satu:",
    "footer": "Powered by API",
    "buttons": [
      {"id": "btn1", "text": "Button 1"},
      {"id": "btn2", "text": "Button 2"},
      {"id": "btn3", "text": "Button 3"}
    ]
  }'
```

### Send List Message
```bash
curl -X POST http://localhost:3000/api/message/mysession1/send/list \
  -H "Content-Type: application/json" \
  -H "x-api-key: fatih-ganteng" \
  -d '{
    "jid": "6281234567890@s.whatsapp.net",
    "text": "Silakan pilih menu:",
    "buttonText": "Lihat Menu",
    "footer": "Powered by API",
    "sections": [
      {
        "title": "Menu Utama",
        "rows": [
          {"title": "Menu 1", "description": "Deskripsi menu 1", "rowId": "menu1"},
          {"title": "Menu 2", "description": "Deskripsi menu 2", "rowId": "menu2"}
        ]
      }
    ]
  }'
```

### Mark Message as Read
```bash
curl -X POST http://localhost:3000/api/message/mysession1/read \
  -H "Content-Type: application/json" \
  -H "x-api-key: fatih-ganteng" \
  -d '{
    "jid": "6281234567890@s.whatsapp.net",
    "messageId": "MESSAGE_ID_HERE"
  }'
```

### Send Presence Update (Typing/Recording/Online)
```bash
# Typing
curl -X POST http://localhost:3000/api/message/mysession1/presence \
  -H "Content-Type: application/json" \
  -H "x-api-key: fatih-ganteng" \
  -d '{
    "jid": "6281234567890@s.whatsapp.net",
    "type": "composing"
  }'

# Recording
curl -X POST http://localhost:3000/api/message/mysession1/presence \
  -H "Content-Type: application/json" \
  -H "x-api-key: fatih-ganteng" \
  -d '{
    "jid": "6281234567890@s.whatsapp.net",
    "type": "recording"
  }'

# Available/Online
curl -X POST http://localhost:3000/api/message/mysession1/presence \
  -H "Content-Type: application/json" \
  -H "x-api-key: fatih-ganteng" \
  -d '{
    "jid": "6281234567890@s.whatsapp.net",
    "type": "available"
  }'
```

### Delete Message
```bash
curl -X POST http://localhost:3000/api/message/mysession1/delete \
  -H "Content-Type: application/json" \
  -H "x-api-key: fatih-ganteng" \
  -d '{
    "jid": "6281234567890@s.whatsapp.net",
    "messageId": "MESSAGE_ID_HERE"
  }'
```

---

## 3. Group Management

### Create Group
```bash
curl -X POST http://localhost:3000/api/group/mysession1/create \
  -H "Content-Type: application/json" \
  -H "x-api-key: fatih-ganteng" \
  -d '{
    "name": "My Group",
    "participants": [
      "6281234567890@s.whatsapp.net",
      "6289876543210@s.whatsapp.net"
    ]
  }'
```

### Get Group Metadata
```bash
curl http://localhost:3000/api/group/mysession1/GROUP_JID_HERE/metadata \
  -H "x-api-key: fatih-ganteng"
```

### Update Group Name
```bash
curl -X PUT http://localhost:3000/api/group/mysession1/name \
  -H "Content-Type: application/json" \
  -H "x-api-key: fatih-ganteng" \
  -d '{
    "jid": "GROUP_JID_HERE@g.us",
    "name": "New Group Name"
  }'
```

### Update Group Description
```bash
curl -X PUT http://localhost:3000/api/group/mysession1/description \
  -H "Content-Type: application/json" \
  -H "x-api-key: fatih-ganteng" \
  -d '{
    "jid": "GROUP_JID_HERE@g.us",
    "description": "New group description"
  }'
```

### Add Participants
```bash
curl -X POST http://localhost:3000/api/group/mysession1/participants/add \
  -H "Content-Type: application/json" \
  -H "x-api-key: fatih-ganteng" \
  -d '{
    "jid": "GROUP_JID_HERE@g.us",
    "participants": ["6281234567890@s.whatsapp.net"]
  }'
```

### Remove Participants
```bash
curl -X POST http://localhost:3000/api/group/mysession1/participants/remove \
  -H "Content-Type: application/json" \
  -H "x-api-key: fatih-ganteng" \
  -d '{
    "jid": "GROUP_JID_HERE@g.us",
    "participants": ["6281234567890@s.whatsapp.net"]
  }'
```

### Promote to Admin
```bash
curl -X POST http://localhost:3000/api/group/mysession1/participants/promote \
  -H "Content-Type: application/json" \
  -H "x-api-key: fatih-ganteng" \
  -d '{
    "jid": "GROUP_JID_HERE@g.us",
    "participants": ["6281234567890@s.whatsapp.net"]
  }'
```

### Demote from Admin
```bash
curl -X POST http://localhost:3000/api/group/mysession1/participants/demote \
  -H "Content-Type: application/json" \
  -H "x-api-key: fatih-ganteng" \
  -d '{
    "jid": "GROUP_JID_HERE@g.us",
    "participants": ["6281234567890@s.whatsapp.net"]
  }'
```

### Get Invite Code
```bash
curl http://localhost:3000/api/group/mysession1/GROUP_JID_HERE@g.us/invite-code \
  -H "x-api-key: fatih-ganteng"
```

### Join Group via Invite
```bash
curl -X POST http://localhost:3000/api/group/mysession1/join \
  -H "Content-Type: application/json" \
  -H "x-api-key: fatih-ganteng" \
  -d '{
    "inviteCode": "INVITE_CODE_HERE"
  }'
```

### Leave Group
```bash
curl -X POST http://localhost:3000/api/group/mysession1/leave \
  -H "Content-Type: application/json" \
  -H "x-api-key: fatih-ganteng" \
  -d '{
    "jid": "GROUP_JID_HERE@g.us"
  }'
```

---

## 4. Profile Management

### Get Profile
```bash
curl "http://localhost:3000/api/profile/mysession1/profile?jid=6281234567890@s.whatsapp.net" \
  -H "x-api-key: fatih-ganteng"
```

### Update Profile Name
```bash
curl -X PUT http://localhost:3000/api/profile/mysession1/profile/name \
  -H "Content-Type: application/json" \
  -H "x-api-key: fatih-ganteng" \
  -d '{
    "name": "My New Name"
  }'
```

### Update Profile Status
```bash
curl -X PUT http://localhost:3000/api/profile/mysession1/profile/status \
  -H "Content-Type: application/json" \
  -H "x-api-key: fatih-ganteng" \
  -d '{
    "status": "Available"
  }'
```

### Block Contact
```bash
curl -X POST http://localhost:3000/api/profile/mysession1/contacts/block \
  -H "Content-Type: application/json" \
  -H "x-api-key: fatih-ganteng" \
  -d '{
    "jid": "6281234567890@s.whatsapp.net"
  }'
```

### Unblock Contact
```bash
curl -X POST http://localhost:3000/api/profile/mysession1/contacts/unblock \
  -H "Content-Type: application/json" \
  -H "x-api-key: fatih-ganteng" \
  -d '{
    "jid": "6281234567890@s.whatsapp.net"
  }'
```

### Check if Numbers are on WhatsApp
```bash
curl -X POST http://localhost:3000/api/profile/mysession1/check-number \
  -H "Content-Type: application/json" \
  -H "x-api-key: fatih-ganteng" \
  -d '{
    "numbers": ["6281234567890", "6289876543210"]
  }'
```

### Get All Contacts
```bash
curl http://localhost:3000/api/profile/mysession1/contacts \
  -H "x-api-key: fatih-ganteng"
```

### Get All Chats
```bash
curl http://localhost:3000/api/profile/mysession1/chats \
  -H "x-api-key: fatih-ganteng"
```

---

## 5. Format JID

### Individual Chat
Format: `[country_code][phone_number]@s.whatsapp.net`
- Contoh: `6281234567890@s.whatsapp.net`

### Group Chat
Format: `[group_id]@g.us`
- Contoh: `120363012345678@g.us`

---

## 6. Webhook Events

Jika Anda set `webhookUrl` saat create session, API akan mengirim POST request ke URL tersebut untuk setiap event:

### Event: QR Code
```json
{
  "event": "qr",
  "sessionId": "mysession1",
  "data": {
    "qr": "data:image/png;base64,..."
  }
}
```

### Event: Connected
```json
{
  "event": "connected",
  "sessionId": "mysession1",
  "data": {
    "user": {
      "id": "6281234567890:1@s.whatsapp.net",
      "name": "My Name"
    }
  }
}
```

### Event: Message Received
```json
{
  "event": "message",
  "sessionId": "mysession1",
  "data": {
    "key": {
      "remoteJid": "6281234567890@s.whatsapp.net",
      "id": "3EB0123456789ABCDEF",
      "fromMe": false
    },
    "message": {
      "conversation": "Hello!"
    },
    "messageTimestamp": "1234567890"
  }
}
```

### Event: Disconnected
```json
{
  "event": "disconnected",
  "sessionId": "mysession1",
  "data": {
    "reason": "Connection closed"
  }
}
```

---

## Tips & Best Practices

1. **Simpan Session ID**: Gunakan session ID yang unik per aplikasi/user
2. **Webhook URL**: Harus HTTPS dan publicly accessible
3. **Rate Limiting**: Default 100 requests/menit, sesuaikan di .env
4. **File Size**: Max 50MB untuk upload file
5. **Error Handling**: Selalu cek response success status
6. **Security**: Jangan expose API Key di client-side

---

## Testing dengan JavaScript/Node.js

```javascript
const axios = require('axios');

const API_URL = 'http://localhost:3000';
const API_KEY = 'your-secret-api-key-12345';

// Create session
async function createSession() {
  const response = await axios.post(`${API_URL}/api/session/create`, {
    sessionId: 'test-session',
    webhookUrl: 'https://your-app.com/webhook'
  }, {
    headers: { 'x-api-key': API_KEY }
  });
  
  console.log(response.data);
}

// Send text message
async function sendMessage(jid, text) {
  const response = await axios.post(
    `${API_URL}/api/message/test-session/send/text`,
    { jid, text },
    { headers: { 'x-api-key': API_KEY } }
  );
  
  console.log(response.data);
}

createSession();
sendMessage('6281234567890@s.whatsapp.net', 'Hello from Node.js!');
```
