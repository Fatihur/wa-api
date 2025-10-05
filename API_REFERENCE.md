# API Reference - WhatsApp Gateway

Base URL: `http://localhost:3000`

## Authentication

All endpoints require authentication via API Key.

**Methods:**
- Header: `x-api-key: fatih-ganteng`
- Query: `?apiKey=fatih-ganteng`

---

## Session Management

### 1. Create Session
**POST** `/api/session/create`

Create new WhatsApp session.

**Request Body:**
```json
{
  "sessionId": "string (required)",
  "webhookUrl": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Session created. Scan QR code to connect",
  "data": {
    "sessionId": "mysession1"
  }
}
```

---

### 2. Get QR Code
**GET** `/api/session/:sessionId/qr`

Get QR code for scanning.

**Response:**
```json
{
  "success": true,
  "message": "QR code retrieved",
  "data": {
    "qr": "data:image/png;base64,iVBORw0KG..."
  }
}
```

---

### 3. Get Session Status
**GET** `/api/session/:sessionId/status`

Check session connection status.

**Response:**
```json
{
  "success": true,
  "message": "Session status retrieved",
  "data": {
    "sessionId": "mysession1",
    "status": "connected",
    "user": {
      "id": "6281234567890:1@s.whatsapp.net",
      "name": "My Name"
    }
  }
}
```

---

### 4. List All Sessions
**GET** `/api/session`

Get all active sessions.

**Response:**
```json
{
  "success": true,
  "message": "All sessions retrieved",
  "data": {
    "sessions": [
      {
        "sessionId": "session1",
        "status": "connected",
        "user": {...}
      }
    ]
  }
}
```

---

### 5. Delete Session
**DELETE** `/api/session/:sessionId`

Delete session and logout.

**Response:**
```json
{
  "success": true,
  "message": "Session deleted successfully",
  "data": null
}
```

---

## Messaging

### 1. Send Text Message
**POST** `/api/message/:sessionId/send/text`

**Request Body:**
```json
{
  "jid": "6281234567890@s.whatsapp.net",
  "text": "Hello from API!"
}
```

---

### 2. Send Image
**POST** `/api/message/:sessionId/send/image`

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `image` (file) - Image file
- `jid` (string) - Recipient JID
- `caption` (string, optional) - Image caption

**OR JSON Body:**
```json
{
  "jid": "6281234567890@s.whatsapp.net",
  "imageUrl": "https://example.com/image.jpg",
  "caption": "Check this out!"
}
```

---

### 3. Send Video
**POST** `/api/message/:sessionId/send/video`

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `video` (file) - Video file
- `jid` (string) - Recipient JID
- `caption` (string, optional) - Video caption

**OR JSON Body:**
```json
{
  "jid": "6281234567890@s.whatsapp.net",
  "videoUrl": "https://example.com/video.mp4",
  "caption": "Watch this!"
}
```

---

### 4. Send Audio
**POST** `/api/message/:sessionId/send/audio`

**Form Fields:**
- `audio` (file) - Audio file
- `jid` (string) - Recipient JID
- `ptt` (boolean) - true for voice note, false for audio file

---

### 5. Send Document
**POST** `/api/message/:sessionId/send/document`

**Form Fields:**
- `document` (file) - Document file
- `jid` (string) - Recipient JID
- `fileName` (string, optional) - File name

---

### 6. Send Location
**POST** `/api/message/:sessionId/send/location`

**Request Body:**
```json
{
  "jid": "6281234567890@s.whatsapp.net",
  "latitude": "-6.200000",
  "longitude": "106.816666",
  "name": "Monas",
  "address": "Jakarta, Indonesia"
}
```

---

### 7. Send Contact
**POST** `/api/message/:sessionId/send/contact`

**Request Body:**
```json
{
  "jid": "6281234567890@s.whatsapp.net",
  "contacts": [
    {
      "fullName": "John Doe",
      "waid": "6281234567890",
      "phoneNumber": "6281234567890"
    }
  ]
}
```

---

### 8. Send Reaction
**POST** `/api/message/:sessionId/send/reaction`

**Request Body:**
```json
{
  "jid": "6281234567890@s.whatsapp.net",
  "messageId": "3EB0XXXXX",
  "emoji": "👍"
}
```

---

### 9. Send Button Message
**POST** `/api/message/:sessionId/send/buttons`

**Request Body:**
```json
{
  "jid": "6281234567890@s.whatsapp.net",
  "text": "Choose an option:",
  "footer": "Powered by API",
  "buttons": [
    {"id": "btn1", "text": "Button 1"},
    {"id": "btn2", "text": "Button 2"}
  ]
}
```

---

### 10. Send List Message
**POST** `/api/message/:sessionId/send/list`

**Request Body:**
```json
{
  "jid": "6281234567890@s.whatsapp.net",
  "text": "Select from menu:",
  "buttonText": "View Menu",
  "footer": "Powered by API",
  "sections": [
    {
      "title": "Main Menu",
      "rows": [
        {
          "title": "Option 1",
          "description": "Description 1",
          "rowId": "opt1"
        }
      ]
    }
  ]
}
```

---

### 11. Forward Message
**POST** `/api/message/:sessionId/forward`

**Request Body:**
```json
{
  "jid": "6281234567890@s.whatsapp.net",
  "messageId": "3EB0XXXXX",
  "fromJid": "6289876543210@s.whatsapp.net"
}
```

---

### 12. Delete Message
**POST** `/api/message/:sessionId/delete`

**Request Body:**
```json
{
  "jid": "6281234567890@s.whatsapp.net",
  "messageId": "3EB0XXXXX"
}
```

---

### 13. Mark as Read
**POST** `/api/message/:sessionId/read`

**Request Body:**
```json
{
  "jid": "6281234567890@s.whatsapp.net",
  "messageId": "3EB0XXXXX"
}
```

---

### 14. Send Presence Update
**POST** `/api/message/:sessionId/presence`

**Request Body:**
```json
{
  "jid": "6281234567890@s.whatsapp.net",
  "type": "composing"
}
```

**Types:**
- `composing` - Typing
- `recording` - Recording audio
- `available` - Online
- `unavailable` - Offline

---

### 15. Download Media
**POST** `/api/message/:sessionId/download`

**Request Body:**
```json
{
  "jid": "6281234567890@s.whatsapp.net",
  "messageId": "3EB0XXXXX"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Media downloaded",
  "data": {
    "media": "base64_encoded_media_data"
  }
}
```

---

## Group Management

### 1. Create Group
**POST** `/api/group/:sessionId/create`

**Request Body:**
```json
{
  "name": "My Group",
  "participants": [
    "6281234567890@s.whatsapp.net",
    "6289876543210@s.whatsapp.net"
  ]
}
```

---

### 2. Get Group Metadata
**GET** `/api/group/:sessionId/:jid/metadata`

**Response:**
```json
{
  "success": true,
  "message": "Group metadata retrieved",
  "data": {
    "id": "120363012345678@g.us",
    "subject": "Group Name",
    "subjectOwner": "6281234567890@s.whatsapp.net",
    "creation": 1234567890,
    "participants": [...],
    "desc": "Group description"
  }
}
```

---

### 3. Update Group Name
**PUT** `/api/group/:sessionId/name`

**Request Body:**
```json
{
  "jid": "120363012345678@g.us",
  "name": "New Group Name"
}
```

---

### 4. Update Group Description
**PUT** `/api/group/:sessionId/description`

**Request Body:**
```json
{
  "jid": "120363012345678@g.us",
  "description": "New description"
}
```

---

### 5. Update Group Picture
**PUT** `/api/group/:sessionId/picture`

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `image` (file) - Group picture
- `jid` (string) - Group JID

---

### 6. Add Participants
**POST** `/api/group/:sessionId/participants/add`

**Request Body:**
```json
{
  "jid": "120363012345678@g.us",
  "participants": ["6281234567890@s.whatsapp.net"]
}
```

---

### 7. Remove Participants
**POST** `/api/group/:sessionId/participants/remove`

**Request Body:**
```json
{
  "jid": "120363012345678@g.us",
  "participants": ["6281234567890@s.whatsapp.net"]
}
```

---

### 8. Promote to Admin
**POST** `/api/group/:sessionId/participants/promote`

**Request Body:**
```json
{
  "jid": "120363012345678@g.us",
  "participants": ["6281234567890@s.whatsapp.net"]
}
```

---

### 9. Demote from Admin
**POST** `/api/group/:sessionId/participants/demote`

**Request Body:**
```json
{
  "jid": "120363012345678@g.us",
  "participants": ["6281234567890@s.whatsapp.net"]
}
```

---

### 10. Leave Group
**POST** `/api/group/:sessionId/leave`

**Request Body:**
```json
{
  "jid": "120363012345678@g.us"
}
```

---

### 11. Get Invite Code
**GET** `/api/group/:sessionId/:jid/invite-code`

**Response:**
```json
{
  "success": true,
  "message": "Invite code retrieved",
  "data": {
    "inviteCode": "ABC123XYZ",
    "inviteUrl": "https://chat.whatsapp.com/ABC123XYZ"
  }
}
```

---

### 12. Revoke Invite Code
**POST** `/api/group/:sessionId/invite-code/revoke`

**Request Body:**
```json
{
  "jid": "120363012345678@g.us"
}
```

---

### 13. Join Group via Invite
**POST** `/api/group/:sessionId/join`

**Request Body:**
```json
{
  "inviteCode": "ABC123XYZ"
}
```

---

### 14. Update Group Settings
**PUT** `/api/group/:sessionId/settings`

**Request Body:**
```json
{
  "jid": "120363012345678@g.us",
  "setting": "announcement"
}
```

**Settings:**
- `announcement` - Only admins can send
- `not_announcement` - All members can send
- `locked` - Only admins can edit group info
- `unlocked` - All members can edit group info

---

### 15. Get Group Invite Info
**GET** `/api/group/:sessionId/invite/:inviteCode`

**Response:**
```json
{
  "success": true,
  "message": "Group invite info retrieved",
  "data": {
    "id": "120363012345678@g.us",
    "subject": "Group Name",
    "size": 10,
    "owner": "6281234567890@s.whatsapp.net"
  }
}
```

---

## Profile & Contacts

### 1. Get Profile
**GET** `/api/profile/:sessionId/profile?jid=6281234567890@s.whatsapp.net`

**Response:**
```json
{
  "success": true,
  "message": "Profile retrieved",
  "data": {
    "jid": "6281234567890@s.whatsapp.net",
    "status": "Hey there! I'm using WhatsApp",
    "statusTimestamp": 1234567890,
    "profilePicture": "https://..."
  }
}
```

---

### 2. Update Profile Name
**PUT** `/api/profile/:sessionId/profile/name`

**Request Body:**
```json
{
  "name": "My New Name"
}
```

---

### 3. Update Profile Status
**PUT** `/api/profile/:sessionId/profile/status`

**Request Body:**
```json
{
  "status": "Available"
}
```

---

### 4. Update Profile Picture
**PUT** `/api/profile/:sessionId/profile/picture`

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `image` (file) - Profile picture

---

### 5. Remove Profile Picture
**DELETE** `/api/profile/:sessionId/profile/picture`

---

### 6. Block Contact
**POST** `/api/profile/:sessionId/contacts/block`

**Request Body:**
```json
{
  "jid": "6281234567890@s.whatsapp.net"
}
```

---

### 7. Unblock Contact
**POST** `/api/profile/:sessionId/contacts/unblock`

**Request Body:**
```json
{
  "jid": "6281234567890@s.whatsapp.net"
}
```

---

### 8. Get Blocked Contacts
**GET** `/api/profile/:sessionId/contacts/blocked`

**Response:**
```json
{
  "success": true,
  "message": "Blocked contacts retrieved",
  "data": {
    "blocked": ["6281234567890@s.whatsapp.net"]
  }
}
```

---

### 9. Get All Contacts
**GET** `/api/profile/:sessionId/contacts`

---

### 10. Get All Chats
**GET** `/api/profile/:sessionId/chats`

---

### 11. Check Number on WhatsApp
**POST** `/api/profile/:sessionId/check-number`

**Request Body:**
```json
{
  "numbers": ["6281234567890", "6289876543210"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Number status checked",
  "data": {
    "results": [
      {
        "number": "6281234567890",
        "exists": true,
        "jid": "6281234567890@s.whatsapp.net"
      },
      {
        "number": "6289876543210",
        "exists": false
      }
    ]
  }
}
```

---

### 12. Update Privacy Settings
**PUT** `/api/profile/:sessionId/privacy`

**Request Body:**
```json
{
  "setting": "last",
  "value": "contacts"
}
```

**Settings:**
- `last` - Last seen
- `online` - Online status
- `profile` - Profile photo
- `status` - Status/About
- `readreceipts` - Read receipts
- `groupadd` - Who can add to groups

**Values:**
- `all` - Everyone
- `contacts` - My contacts
- `contact_blacklist` - My contacts except...
- `none` - Nobody

---

### 13. Get Privacy Settings
**GET** `/api/profile/:sessionId/privacy`

---

## Webhook Events

If you set `webhookUrl` when creating session, these events will be sent to your webhook:

### QR Code Event
```json
{
  "event": "qr",
  "sessionId": "mysession1",
  "data": {
    "qr": "data:image/png;base64,..."
  }
}
```

### Connected Event
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

### Message Received Event
```json
{
  "event": "message",
  "sessionId": "mysession1",
  "data": {
    "key": {
      "remoteJid": "6281234567890@s.whatsapp.net",
      "id": "3EB0XXXXX",
      "fromMe": false
    },
    "message": {
      "conversation": "Hello!"
    },
    "messageTimestamp": "1234567890"
  }
}
```

### Disconnected Event
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

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": null
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (missing API key)
- `403` - Forbidden (invalid API key)
- `404` - Not Found
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

---

## Rate Limiting

Default: **100 requests per minute per IP**

Configure in `.env`:
```env
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

When rate limit exceeded:
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

---

## JID Format

### Individual Chat
Format: `[country_code][number]@s.whatsapp.net`

Examples:
- `6281234567890@s.whatsapp.net` (Indonesia)
- `14155552671@s.whatsapp.net` (USA)
- `447911123456@s.whatsapp.net` (UK)

### Group Chat
Format: `[group_id]@g.us`

Example: `120363012345678@g.us`

---

## Best Practices

1. **Session Management**
   - Use unique session IDs per client/user
   - Implement session cleanup for inactive sessions
   - Monitor session status regularly

2. **Error Handling**
   - Always check `success` field in response
   - Implement retry logic for failed requests
   - Log errors for debugging

3. **Security**
   - Keep API key secure (never expose in frontend)
   - Use HTTPS in production
   - Implement IP whitelisting if possible
   - Rotate API keys periodically

4. **Performance**
   - Respect rate limits
   - Use webhooks instead of polling
   - Cache frequently accessed data
   - Compress large media before sending

5. **Media Handling**
   - Validate file types and sizes
   - Use URLs for large files when possible
   - Clean up temporary files after upload

---

## Support

For issues, questions, or feature requests:
- Check documentation: `/docs`
- Review examples: `EXAMPLES.md`
- Test with UI: `test-qr.html`

---

**Version:** 1.0.0  
**Last Updated:** 2025
