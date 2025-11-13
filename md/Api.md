# 📡 API Documentation

## Base URL
```
http://localhost:3000/api
```

> **Note**: Hiện tại tất cả API đều là mock trong `api.service.js`

## 🔐 Authentication

### POST /auth/login
Đăng nhập vào hệ thống

**Request:**
```javascript
{
  username: "nguoideoA",
  password: "123456"
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    token: "mock_token_user_a_1234567890",
    user: {
      id: "user_a",
      username: "nguoideoA",
      name: "Người deo A",
      role: "admin",
      deviceId: "device_001",
      watchers: ["user_b", "user_c", "user_d"]
    }
  },
  timestamp: "2025-11-13T..."
}
```

**Errors:**
- 401: "Tên đăng nhập hoặc mật khẩu không đúng"

---

### POST /auth/register
Đăng ký tài khoản mới

**Request:**
```javascript
{
  username: "newuser",
  password: "123456",
  name: "User Name",
  role: "watcher",
  watchingUser: "user_a"
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    user: {
      id: "user_new123",
      username: "newuser",
      name: "User Name",
      role: "watcher"
    }
  }
}
```

---

### POST /auth/logout
Đăng xuất

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```javascript
{
  success: true,
  data: {
    message: "Đăng xuất thành công"
  }
}
```

---

## 🔗 Bluetooth/IoT

### POST /bluetooth/connect
Kết nối với thiết bị Bluetooth

**Request:**
```javascript
{
  deviceId: "device_001"
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    connected: true,
    deviceId: "device_001",
    deviceName: "IoT Fall Detection Device",
    message: "Kết nối thành công"
  }
}
```

---

### POST /bluetooth/disconnect
Ngắt kết nối Bluetooth

**Request:**
```javascript
{
  deviceId: "device_001"
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    connected: false,
    deviceId: "device_001",
    message: "Đã ngắt kết nối"
  }
}
```

---

## 💓 Realtime Data

### GET /data/heartrate/:userId
Lấy nhịp tim hiện tại

**Response:**
```javascript
{
  success: true,
  data: {
    userId: "user_a",
    heartRate: 72,
    timestamp: "2025-11-13T..."
  }
}
```

---

### GET /data/status/:userId
Lấy trạng thái hiện tại

**Response:**
```javascript
{
  success: true,
  data: {
    userId: "user_a",
    status: "normal", // normal | running | fallen
    lastUpdate: "2025-11-13T..."
  }
}
```

**Status values:**
- `normal` - Bình thường
- `running` - Đang chạy/vận động
- `fallen` - Té ngã

---

### POST /data/status/:userId
Cập nhật trạng thái

**Request:**
```javascript
{
  status: "running"
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    userId: "user_a",
    status: "running",
    message: "Cập nhật trạng thái thành công"
  }
}
```

---

### POST /data/fall/:userId
Báo cáo sự cố té ngã

**Request:**
```javascript
{
  fallData: {
    acceleration: 9.8,
    orientation: "horizontal",
    confidence: 0.95
  }
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    userId: "user_a",
    fallDetected: true,
    timestamp: "2025-11-13T...",
    message: "Đã ghi nhận sự cố té ngã"
  }
}
```

---

## 📍 Location/GPS

### GET /location/:userId
Lấy vị trí hiện tại

**Response:**
```javascript
{
  success: true,
  data: {
    userId: "user_a",
    location: {
      latitude: 21.0285,
      longitude: 105.8542,
      timestamp: "2025-11-13T..."
    },
    address: "Hà Nội, Việt Nam"
  }
}
```

---

### POST /location/:userId
Cập nhật vị trí

**Request:**
```javascript
{
  latitude: 21.0285,
  longitude: 105.8542
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    userId: "user_a",
    location: {
      latitude: 21.0285,
      longitude: 105.8542,
      timestamp: "2025-11-13T..."
    },
    message: "Cập nhật vị trí thành công"
  }
}
```

---

## 📊 History

### GET /history/:userId
Lấy lịch sử đo

**Query params:**
- `limit` (optional): Số bản ghi (default: 50)

**Response:**
```javascript
{
  success: true,
  data: {
    userId: "user_a",
    history: [
      {
        id: "1",
        userId: "user_a",
        heartRate: 75,
        status: "normal",
        timestamp: "2025-11-13T..."
      },
      {
        id: "fall_123",
        userId: "user_a",
        status: "fallen",
        timestamp: "2025-11-13T...",
        fallData: {
          acceleration: 9.8,
          confidence: 0.95
        }
      }
    ],
    total: 2
  }
}
```

---

## 👨‍👩‍👧‍👦 Family/Watchers

### GET /family/watchers/:userId
Lấy danh sách người theo dõi

**Response:**
```javascript
{
  success: true,
  data: {
    watchers: [
      {
        id: "user_b",
        username: "nguoinhaB",
        name: "Người nhà B"
      },
      {
        id: "user_c",
        username: "nguoinhaC",
        name: "Người nhà C"
      }
    ]
  }
}
```

---

### POST /family/watchers/:userId
Thêm người theo dõi

**Request:**
```javascript
{
  watcherUsername: "nguoinhaD"
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    message: "Đã thêm người theo dõi",
    watcher: {
      id: "user_d",
      username: "nguoinhaD",
      name: "Người nhà D"
    }
  }
}
```

---

## 🔔 Notifications

### POST /notifications/fall/:userId
Gửi cảnh báo té ngã đến gia đình

**Request:**
```javascript
{
  title: "⚠️ Cảnh báo té ngã!",
  body: "Người thân của bạn có thể đã bị té ngã",
  type: "fall_detected",
  priority: "high",
  data: {
    userId: "user_a",
    location: {
      latitude: 21.0285,
      longitude: 105.8542
    },
    timestamp: "2025-11-13T..."
  }
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    sent: true,
    recipients: [
      {
        userId: "user_b",
        sent: true,
        timestamp: "2025-11-13T..."
      }
    ],
    notification: { /* ... */ },
    message: "Đã gửi thông báo đến 3 người"
  }
}
```

---

### POST /notifications/fcm/register
Đăng ký FCM token

**Request:**
```javascript
{
  userId: "user_a",
  fcmToken: "fcm_token_here"
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    registered: true,
    message: "Đã đăng ký nhận thông báo"
  }
}
```

---

## 🌐 WebSocket (Realtime)

### Connection
```javascript
ws://localhost:3000/realtime?userId=user_a
```

### Events từ server

**heartrate**
```javascript
{
  type: "heartrate",
  data: {
    userId: "user_a",
    heartRate: 72,
    timestamp: "2025-11-13T..."
  }
}
```

**status**
```javascript
{
  type: "status",
  data: {
    userId: "user_a",
    status: "normal",
    lastUpdate: "2025-11-13T..."
  }
}
```

**fall_detected**
```javascript
{
  type: "fall_detected",
  data: {
    userId: "user_a",
    timestamp: "2025-11-13T...",
    message: "Phát hiện té ngã!"
  }
}
```

---

## 📝 Data Models

### User
```typescript
interface User {
  id: string;
  username: string;
  password: string; // Hashed in production
  name: string;
  role: "admin" | "watcher";
  deviceId?: string;
  watchers?: string[];
  watchingUser?: string;
}
```

### HeartRate
```typescript
interface HeartRate {
  userId: string;
  heartRate: number; // BPM
  timestamp: string; // ISO 8601
}
```

### Status
```typescript
interface Status {
  userId: string;
  status: "normal" | "running" | "fallen";
  lastUpdate: string;
}
```

### Location
```typescript
interface Location {
  latitude: number;
  longitude: number;
  timestamp: string;
  accuracy?: number;
}
```

### Measurement
```typescript
interface Measurement {
  id: string;
  userId: string;
  heartRate?: number;
  status: string;
  timestamp: string;
  fallData?: {
    acceleration: number;
    orientation: string;
    confidence: number;
  };
}
```

### Notification
```typescript
interface Notification {
  title: string;
  body: string;
  type: "fall_detected" | "status_update" | "location_update";
  priority: "high" | "normal";
  data: {
    userId: string;
    location?: Location;
    status?: string;
    timestamp: string;
  };
}
```

---

## 🔑 Authentication

Tất cả endpoints (trừ login/register) cần token:

**Header:**
```
Authorization: Bearer {token}
```

**Token format:**
```
mock_token_{userId}_{timestamp}
```

---

## ⚠️ Error Responses

### Format chung
```javascript
{
  success: false,
  error: {
    code: "ERROR_CODE",
    message: "Human readable message"
  }
}
```

### Error codes
- `AUTH_REQUIRED` - Chưa đăng nhập
- `INVALID_TOKEN` - Token không hợp lệ
- `INVALID_CREDENTIALS` - Sai username/password
- `USER_EXISTS` - Username đã tồn tại
- `USER_NOT_FOUND` - Không tìm thấy user
- `DEVICE_NOT_FOUND` - Không tìm thấy thiết bị
- `INVALID_PARAMS` - Params không hợp lệ

---

## 🔧 Rate Limiting

- Login: 5 requests/minute
- API calls: 100 requests/minute
- WebSocket: 1 connection per user

---

## 📌 Notes

1. **Mock Data**: Tất cả dữ liệu hiện tại là mock
2. **Delays**: Có simulate network delay (200-1000ms)
3. **Random Data**: Một số giá trị được random (heart rate, fall detection)
4. **No Persistence**: Data mất khi restart app
5. **Single User Session**: Chỉ support 1 user login tại một thời điểm

---

## 🚀 Migration to Real API

Khi migrate sang API thật:

1. Update `BASE_URL` trong `api.service.js`
2. Thay thế mock functions bằng real `fetch()` calls
3. Remove `simulateDelay()` và mock data
4. Implement proper error handling
5. Add request/response interceptors
6. Setup refresh token logic
7. Implement WebSocket connection
8. Add retry logic cho network failures

---

## 📚 Testing

### Test với Postman/Insomnia

Import collection:
```bash
# Coming soon
```

### Test với cURL

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"nguoideoA","password":"123456"}'
```

**Get Heart Rate:**
```bash
curl -X GET http://localhost:3000/api/data/heartrate/user_a \
  -H "Authorization: Bearer {token}"
```