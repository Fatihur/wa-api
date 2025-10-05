# 📮 Postman Collection & Environment Guide

Panduan lengkap untuk testing WhatsApp API Gateway menggunakan Postman.

## 📥 Import ke Postman

### 1. Import Collection

1. Buka Postman
2. Klik **Import** di pojok kiri atas
3. Pilih file `postman_collection.json`
4. Collection "WhatsApp API Gateway" akan muncul di sidebar

### 2. Import Environment

1. Klik icon **⚙️ Settings** (gear icon) di pojok kanan atas
2. Pilih tab **Environments**
3. Klik **Import**
4. Pilih file `postman_environment.json`
5. Environment "WhatsApp API - Local" akan tersedia

### 3. Aktifkan Environment

1. Di dropdown environment (pojok kanan atas), pilih **WhatsApp API - Local**
2. Environment sekarang aktif dan siap digunakan

## 🔧 Konfigurasi Environment Variables

Environment berisi variabel yang digunakan di semua request:

| Variable | Default Value | Deskripsi |
|----------|---------------|-----------|
| `base_url` | `http://localhost:3000` | URL server API |
| `session_id` | `test-session` | Session ID untuk testing |
| `test_phone` | `6281234567890@s.whatsapp.net` | Nomor WhatsApp untuk testing |
| `test_group_jid` | `120363012345678@g.us` | Group JID untuk testing |
| `webhook_url` | `https://your-app.com/webhook` | URL webhook (optional) |

### Cara Edit Environment Variable:

1. Klik icon **👁️ Eye** di pojok kanan atas
2. Klik **Edit** di sebelah environment name
3. Ubah value sesuai kebutuhan
4. Klik **Save**

## 🚀 Quick Start Testing

### Step 1: Buat Session

1. Expand folder **Session Management**
2. Pilih request **Create Session**
3. Klik **Send**
4. Session akan dibuat dengan ID dari variable `{{session_id}}`

### Step 2: Dapatkan QR Code

1. Pilih request **Get QR Code**
2. Klik **Send**
3. Copy QR code dari response (format: `data:image/png;base64,...`)
4. Paste QR code di browser address bar untuk melihat QR
5. Scan dengan WhatsApp di HP

### Step 3: Cek Status Koneksi

1. Pilih request **Get Session Status**
2. Klik **Send**
3. Pastikan status `connected: true`

### Step 4: Kirim Pesan Test

1. **Update variable `test_phone`** dengan nomor tujuan yang valid
2. Expand folder **Messaging**
3. Pilih request **Send Text Message**
4. Klik **Send**
5. Pesan akan terkirim ke nomor yang ada di `{{test_phone}}`

## 📁 Collection Structure

Collection terbagi menjadi 4 folder utama:

### 1. **Session Management** (5 endpoints)
- ✅ Create Session
- ✅ Get All Sessions
- ✅ Get QR Code
- ✅ Get Session Status
- ✅ Delete Session

### 2. **Messaging** (16 endpoints)
- ✅ Send Text Message
- ✅ Send Image
- ✅ Send Video
- ✅ Send Audio
- ✅ Send Document
- ✅ Send Sticker
- ✅ Send Location
- ✅ Send Contact
- ✅ Send Reaction
- ✅ Send Buttons
- ✅ Send List
- ✅ Forward Message
- ✅ Delete Message
- ✅ Mark as Read
- ✅ Send Presence Update
- ✅ Download Media

### 3. **Group Management** (15 endpoints)
- ✅ Create Group
- ✅ Get Group Metadata
- ✅ Update Group Name
- ✅ Update Group Description
- ✅ Update Group Picture
- ✅ Add Participants
- ✅ Remove Participants
- ✅ Promote to Admin
- ✅ Demote from Admin
- ✅ Leave Group
- ✅ Get Invite Code
- ✅ Revoke Invite Code
- ✅ Join via Invite
- ✅ Toggle Settings
- ✅ Get Group Info from Invite

### 4. **Profile & Contacts** (13 endpoints)
- ✅ Get Profile
- ✅ Update Profile Name
- ✅ Update Profile Status
- ✅ Update Profile Picture
- ✅ Remove Profile Picture
- ✅ Block Contact
- ✅ Unblock Contact
- ✅ Get Blocked Contacts
- ✅ Get Contacts
- ✅ Get Chats
- ✅ Check Number Status
- ✅ Update Privacy Settings
- ✅ Get Privacy Settings

**Total: 49 Endpoints** 🎯

## 💡 Tips & Tricks

### 1. Menggunakan Variables

Semua request sudah menggunakan variables:
```
{{base_url}}/api/session/{{session_id}}/qr
```

Anda bisa tambah variable baru:
1. Edit environment
2. Tambah key-value baru
3. Gunakan dengan format `{{variable_name}}`

### 2. Testing dengan Multiple Sessions

Untuk test multiple sessions:
1. Duplicate environment
2. Ganti nama jadi "WhatsApp API - Session 2"
3. Ubah `session_id` ke `test-session-2`
4. Switch environment saat testing

### 3. Upload File (Image, Video, Document)

Untuk endpoints yang butuh file upload:
1. Pilih request (misal: Send Image)
2. Di tab **Body**, pilih **form-data**
3. Klik tombol **Select Files** di field `image`
4. Upload file dari komputer
5. Klik **Send**

### 4. Copy Response untuk Request Berikutnya

Beberapa response berisi data yang dibutuhkan untuk request lain:
- **Message ID**: Dari response send message, untuk delete/reaction
- **Group JID**: Dari response create group, untuk manage group
- **Invite Code**: Dari response get invite code, untuk join group

### 5. Bulk Testing dengan Runner

Untuk test banyak request sekaligus:
1. Klik kanan pada folder
2. Pilih **Run folder**
3. Pilih requests yang mau dijalankan
4. Klik **Run WhatsApp API Gateway**

### 6. Save Response sebagai Example

Setelah request berhasil:
1. Klik **Save as Example**
2. Response akan tersimpan sebagai contoh
3. Helpful untuk dokumentasi

## 🔍 Format JID WhatsApp

### Individual Contact
```
[country_code][number]@s.whatsapp.net
```
Contoh: `6281234567890@s.whatsapp.net`

### Group
```
[group_id]@g.us
```
Contoh: `120363012345678@g.us`

**Catatan**: 
- Jangan gunakan `+` atau `-` 
- Gunakan kode negara tanpa leading zero

## 🐛 Troubleshooting

### Error: "Session not found"
- Pastikan sudah create session terlebih dahulu
- Cek variable `session_id` sudah benar
- Jalankan request **Get All Sessions** untuk lihat session yang tersedia

### Error: "Session not connected"
- Session belum di-scan dengan WhatsApp
- Dapatkan QR code dan scan dengan WhatsApp
- Tunggu sampai status `connected: true`

### Error: "Invalid JID format"
- Pastikan format JID benar: `[number]@s.whatsapp.net`
- Jangan gunakan format nomor dengan + atau -
- Contoh benar: `6281234567890@s.whatsapp.net`

### Upload File Tidak Berhasil
- Pastikan ukuran file tidak melebihi 50MB
- Cek format file didukung
- Pastikan field name sesuai (image, video, audio, document, sticker)

### Base URL Tidak Bisa Diakses
- Pastikan server sudah running (`npm start`)
- Cek port 3000 tidak dipakai aplikasi lain
- Update variable `base_url` jika menggunakan port berbeda

## 📚 Resources

- **API Documentation**: http://localhost:3000/docs
- **API Endpoints List**: http://localhost:3000/api/docs
- **Full Documentation**: [README.md](README.md)
- **Quick Start Guide**: [QUICKSTART.md](QUICKSTART.md)
- **Examples**: [EXAMPLES.md](EXAMPLES.md)

## 🔐 Security Note

Collection ini tidak menggunakan API key karena endpoints bersifat public. Untuk production:
- Gunakan HTTPS
- Setup reverse proxy dengan authentication
- Batasi akses dengan firewall/IP whitelist
- Gunakan VPN atau network isolation

## 🤝 Contributing

Jika menemukan endpoint yang belum ada di collection atau ada improvement:
1. Update `postman_collection.json`
2. Test perubahan
3. Commit changes

---

**Happy Testing! 🚀**
