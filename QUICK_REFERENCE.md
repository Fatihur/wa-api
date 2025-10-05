# 🚀 Quick Reference Card

## 📍 Base URL
```
http://localhost:3000
```

## 🔑 Authentication
```bash
# Header (Recommended)
x-api-key: fatih-ganteng

# Query Parameter
?apiKey=fatih-ganteng
```

---

## 📚 Documentation Access

| Type | URL | Best For |
|------|-----|----------|
| **Web UI** | `/docs` | Development |
| **JSON API** | `/api/docs` | Automation |
| **QR Test** | `test-qr.html` | Quick test |

---

## 🔌 Session Management

```bash
# Create session
POST /api/session/create
{"sessionId": "test1", "webhookUrl": "..."}

# Get QR code
GET /api/session/:sessionId/qr

# Check status
GET /api/session/:sessionId/status

# List all
GET /api/session

# Delete session
DELETE /api/session/:sessionId
```

---

## 💬 Messaging

```bash
# Text
POST /api/message/:sessionId/send/text
{"jid": "6281234567890@s.whatsapp.net", "text": "Hello"}

# Image
POST /api/message/:sessionId/send/image
Form: image (file), jid, caption

# Video
POST /api/message/:sessionId/send/video
Form: video (file), jid, caption

# Audio
POST /api/message/:sessionId/send/audio
Form: audio (file), jid, ptt (bool)

# Document
POST /api/message/:sessionId/send/document
Form: document (file), jid, fileName

# Location
POST /api/message/:sessionId/send/location
{"jid": "...", "latitude": "-6.2", "longitude": "106.8"}

# Contact
POST /api/message/:sessionId/send/contact
{"jid": "...", "contacts": [{...}]}

# Reaction
POST /api/message/:sessionId/send/reaction
{"jid": "...", "messageId": "...", "emoji": "👍"}

# Buttons
POST /api/message/:sessionId/send/buttons
{"jid": "...", "text": "...", "buttons": [{...}]}

# List
POST /api/message/:sessionId/send/list
{"jid": "...", "text": "...", "sections": [{...}]}

# Delete
POST /api/message/:sessionId/delete
{"jid": "...", "messageId": "..."}

# Read
POST /api/message/:sessionId/read
{"jid": "...", "messageId": "..."}

# Presence (typing/recording/online)
POST /api/message/:sessionId/presence
{"jid": "...", "type": "composing"}
```

---

## 👥 Group Management

```bash
# Create group
POST /api/group/:sessionId/create
{"name": "My Group", "participants": [...]}

# Get metadata
GET /api/group/:sessionId/:jid/metadata

# Update name
PUT /api/group/:sessionId/name
{"jid": "...", "name": "..."}

# Update description
PUT /api/group/:sessionId/description
{"jid": "...", "description": "..."}

# Update picture
PUT /api/group/:sessionId/picture
Form: image (file), jid

# Add participants
POST /api/group/:sessionId/participants/add
{"jid": "...", "participants": [...]}

# Remove participants
POST /api/group/:sessionId/participants/remove
{"jid": "...", "participants": [...]}

# Promote to admin
POST /api/group/:sessionId/participants/promote
{"jid": "...", "participants": [...]}

# Demote from admin
POST /api/group/:sessionId/participants/demote
{"jid": "...", "participants": [...]}

# Leave group
POST /api/group/:sessionId/leave
{"jid": "..."}

# Get invite code
GET /api/group/:sessionId/:jid/invite-code

# Revoke invite
POST /api/group/:sessionId/invite-code/revoke
{"jid": "..."}

# Join via invite
POST /api/group/:sessionId/join
{"inviteCode": "..."}

# Group settings
PUT /api/group/:sessionId/settings
{"jid": "...", "setting": "announcement"}
```

---

## 👤 Profile & Contacts

```bash
# Get profile
GET /api/profile/:sessionId/profile?jid=...

# Update name
PUT /api/profile/:sessionId/profile/name
{"name": "..."}

# Update status
PUT /api/profile/:sessionId/profile/status
{"status": "..."}

# Update picture
PUT /api/profile/:sessionId/profile/picture
Form: image (file)

# Remove picture
DELETE /api/profile/:sessionId/profile/picture

# Block contact
POST /api/profile/:sessionId/contacts/block
{"jid": "..."}

# Unblock contact
POST /api/profile/:sessionId/contacts/unblock
{"jid": "..."}

# Get blocked
GET /api/profile/:sessionId/contacts/blocked

# Get contacts
GET /api/profile/:sessionId/contacts

# Get chats
GET /api/profile/:sessionId/chats

# Check number
POST /api/profile/:sessionId/check-number
{"numbers": ["6281234567890", "..."]}

# Privacy settings
PUT /api/profile/:sessionId/privacy
{"setting": "last", "value": "contacts"}

GET /api/profile/:sessionId/privacy
```

---

## 📝 JID Format

```bash
# Individual
6281234567890@s.whatsapp.net

# Group
120363012345678@g.us
```

---

## 🔔 Webhook Events

```javascript
// QR Code
{"event": "qr", "sessionId": "...", "data": {"qr": "..."}}

// Connected
{"event": "connected", "sessionId": "...", "data": {"user": {...}}}

// Message Received
{"event": "message", "sessionId": "...", "data": {...}}

// Disconnected
{"event": "disconnected", "sessionId": "...", "data": {...}}
```

---

## ⚡ Quick Start

```bash
# 1. Start
npm start

# 2. Create session
curl -X POST http://localhost:3000/api/session/create \
  -H "Content-Type: application/json" \
  -H "x-api-key: fatih-ganteng" \
  -d '{"sessionId": "test1"}'

# 3. Get QR
curl http://localhost:3000/api/session/test1/qr \
  -H "x-api-key: fatih-ganteng"

# 4. Scan QR with WhatsApp

# 5. Send message
curl -X POST http://localhost:3000/api/message/test1/send/text \
  -H "Content-Type: application/json" \
  -H "x-api-key: fatih-ganteng" \
  -d '{"jid": "6281234567890@s.whatsapp.net", "text": "Hello!"}'
```

---

## 🎯 Common Use Cases

### Send Broadcast
```bash
for number in 6281111 6282222 6283333; do
  curl -X POST http://localhost:3000/api/message/test1/send/text \
    -H "Content-Type: application/json" \
    -H "x-api-key: fatih-ganteng" \
    -d "{\"jid\": \"${number}@s.whatsapp.net\", \"text\": \"Broadcast message\"}"
done
```

### Check Multiple Numbers
```bash
curl -X POST http://localhost:3000/api/profile/test1/check-number \
  -H "Content-Type: application/json" \
  -H "x-api-key: fatih-ganteng" \
  -d '{"numbers": ["6281234567890", "6289876543210"]}'
```

### Send Image from URL
```bash
curl -X POST http://localhost:3000/api/message/test1/send/image \
  -H "Content-Type: application/json" \
  -H "x-api-key: fatih-ganteng" \
  -d '{
    "jid": "6281234567890@s.whatsapp.net",
    "imageUrl": "https://example.com/image.jpg",
    "caption": "Check this!"
  }'
```

---

## 🛡️ Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized (no API key) |
| 403 | Forbidden (invalid API key) |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Server Error |

---

## 📊 Response Format

### Success
```json
{
  "success": true,
  "message": "...",
  "data": {...}
}
```

### Error
```json
{
  "success": false,
  "message": "...",
  "errors": null
}
```

---

## ⚙️ Configuration

```env
# .env file
PORT=3000
HOST=0.0.0.0
API_KEY=fatih-ganteng
SESSION_STORAGE_PATH=./sessions
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🔧 Troubleshooting

```bash
# QR not showing
GET /api/session/:sessionId/status

# Session disconnected
POST /api/session/create (create new)

# Rate limited
Wait 1 minute

# Media not sending
Check file size (<50MB)

# Number invalid
Verify JID format
```

---

## 📱 JavaScript Example

```javascript
const API_URL = 'http://localhost:3000';
const API_KEY = 'fatih-ganteng';

async function sendMessage(sessionId, jid, text) {
  const response = await fetch(`${API_URL}/api/message/${sessionId}/send/text`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY
    },
    body: JSON.stringify({ jid, text })
  });
  
  return await response.json();
}

// Usage
sendMessage('test1', '6281234567890@s.whatsapp.net', 'Hello!');
```

---

## 🐍 Python Example

```python
import requests

API_URL = 'http://localhost:3000'
API_KEY = 'fatih-ganteng'

def send_message(session_id, jid, text):
    response = requests.post(
        f'{API_URL}/api/message/{session_id}/send/text',
        headers={'x-api-key': API_KEY},
        json={'jid': jid, 'text': text}
    )
    return response.json()

# Usage
send_message('test1', '6281234567890@s.whatsapp.net', 'Hello!')
```

---

## 💡 Tips

1. **Use Web UI** for development: `http://localhost:3000/docs`
2. **Keep API key secure** - never expose in frontend
3. **Use webhooks** instead of polling
4. **Respect rate limits** - 100 req/min default
5. **Test with test-qr.html** for quick setup
6. **Cache QR codes** - they expire after scan
7. **Monitor session status** regularly
8. **Use meaningful session IDs** per user/client

---

## 📚 More Resources

- **Full Docs:** `/docs` or `README.md`
- **Quick Start:** `QUICKSTART.md`
- **Examples:** `EXAMPLES.md`
- **API Reference:** `API_REFERENCE.md`
- **UI Guide:** `UI_DOCS.md`

---

**Version:** 1.0.0  
**Total Endpoints:** 47+  
**Print this page for quick reference!** 🖨️
