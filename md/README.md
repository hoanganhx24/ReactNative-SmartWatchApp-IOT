# IoT Fall Detection App

Ứng dụng React Native để giám sát và phát hiện té ngã cho người cao tuổi thông qua thiết bị IoT.

## 🎯 Tính năng

### 🔗 Kết nối Bluetooth
- Quét và kết nối với thiết bị IoT
- Nhận dữ liệu realtime từ thiết bị
- Hiển thị trạng thái kết nối

### ❤️ Giám sát sức khỏe
- Theo dõi nhịp tim realtime
- Hiển thị trạng thái: Bình thường / Đang chạy / Té ngã
- Biểu đồ nhịp tim trực quan

### 📍 Vị trí GPS
- Theo dõi vị trí hiện tại
- Cập nhật vị trí liên tục
- Xem trên Google Maps
- Gửi vị trí khi phát hiện té ngã

### 📊 Lịch sử đo
- Xem lại các lần đo
- Thống kê sự cố té ngã
- Chi tiết từng bản ghi

### 👨‍👩‍👧‍👦 Hệ thống tài khoản
- Người deo thiết bị (Admin)
- Người nhà theo dõi (Watcher)
- Quản lý danh sách người theo dõi

### 🔔 Thông báo
- Gửi cảnh báo té ngã qua FCM
- Thông báo realtime đến gia đình
- Hiển thị vị trí kèm theo

## 📁 Cấu trúc thư mục

```
AppIOT/
├── src/
│   ├── services/          # Các service xử lý logic
│   │   ├── api.service.js          # API calls & mock data
│   │   ├── bluetooth.service.js    # Bluetooth connection
│   │   ├── notification.service.js # FCM notifications
│   │   └── location.service.js     # GPS & Location
│   │
│   ├── contexts/          # React Context
│   │   ├── AuthContext.js          # Authentication state
│   │   └── IoTContext.js           # IoT data & connections
│   │
│   ├── screens/           # Màn hình
│   │   ├── LoginScreen.js          # Đăng nhập
│   │   ├── HomeScreen.js           # Màn hình chính
│   │   ├── BluetoothScreen.js      # Quét Bluetooth
│   │   ├── LocationScreen.js       # Bản đồ GPS
│   │   └── HistoryScreen.js        # Lịch sử đo
│   │
│   └── components/        # Components tái sử dụng
│
├── App.js                 # Main app entry point
└── package.json           # Dependencies
```

## 🚀 Cài đặt

### 1. Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
```

### 2. Cài đặt pods (iOS only)

```bash
cd ios
pod install
cd ..
```

### 3. Chạy ứng dụng

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

## 👤 Tài khoản demo

### Người deo thiết bị (Admin)
- Username: `nguoideoA`
- Password: `123456`
- Vai trò: Quản trị, đeo thiết bị IoT

### Người nhà theo dõi
- **Người nhà B:**
    - Username: `nguoinhaB`
    - Password: `123456`

- **Người nhà C:**
    - Username: `nguoinhaC`
    - Password: `123456`

- **Người nhà D:**
    - Username: `nguoinhaD`
    - Password: `123456`

## 🔧 API Service

Tất cả API đã được giả lập với mock data trong `api.service.js`.

### Endpoints có sẵn:

#### Authentication
- `login(username, password)` - Đăng nhập
- `register(userData)` - Đăng ký
- `logout()` - Đăng xuất
- `getCurrentUser()` - Lấy thông tin user

#### Bluetooth/IoT
- `connectBluetooth(deviceId)` - Kết nối Bluetooth
- `disconnectBluetooth(deviceId)` - Ngắt kết nối

#### Realtime Data
- `getHeartRate(userId)` - Lấy nhịp tim
- `getStatus(userId)` - Lấy trạng thái
- `updateStatus(userId, status)` - Cập nhật trạng thái
- `detectFall(userId, fallData)` - Phát hiện té ngã

#### GPS Location
- `getLocation(userId)` - Lấy vị trí
- `updateLocation(userId, lat, lng)` - Cập nhật vị trí

#### History
- `getMeasurementHistory(userId, limit)` - Lấy lịch sử

#### Family/Watchers
- `getWatchers(userId)` - Lấy danh sách người theo dõi
- `addWatcher(userId, watcherUsername)` - Thêm người theo dõi

#### Notifications
- `sendNotificationToFamily(userId, notification)` - Gửi thông báo
- `registerFCMToken(userId, fcmToken)` - Đăng ký FCM

#### WebSocket Simulation
- `subscribeToRealtime(userId, callbacks)` - Đăng ký realtime updates

## 📱 Tính năng chính

### 1. Realtime Monitoring
Ứng dụng tự động cập nhật:
- Nhịp tim mỗi 2 giây
- Trạng thái mỗi 3 giây
- Kiểm tra té ngã mỗi 10 giây (1% probability)

### 2. Fall Detection
Khi phát hiện té ngã:
1. Cập nhật trạng thái thành "fallen"
2. Lấy vị trí GPS hiện tại
3. Gửi thông báo đến tất cả người nhà
4. Lưu vào lịch sử với chi tiết

### 3. Location Tracking
- Tự động theo dõi vị trí mỗi 5 giây
- Cập nhật lên server
- Có thể bật/tắt theo ý muốn

### 4. Bluetooth Connection
- Quét thiết bị xung quanh
- Hiển thị tín hiệu (RSSI)
- Kết nối/ngắt kết nối
- Nhận dữ liệu từ thiết bị

## 🔐 Authentication Flow

1. User đăng nhập
2. Lưu token vào AsyncStorage
3. Tự động đăng ký FCM token
4. Kết nối realtime với server
5. Bắt đầu nhận dữ liệu

## 🔔 Notification System

### Loại thông báo:
1. **Fall Alert** - Cảnh báo té ngã (Priority: High)
2. **Status Update** - Cập nhật trạng thái (Priority: Normal)
3. **Location Update** - Cập nhật vị trí (Priority: Normal)

### FCM Integration:
- Tự động khởi tạo khi app start
- Đăng ký token với server
- Lắng nghe foreground notifications
- Background notifications qua OS

## 🛠 Customization

### Thay đổi API endpoint:

Trong `src/services/api.service.js`:
```javascript
const BASE_URL = 'http://your-server.com/api';
```

### Thêm user mới:

Trong `src/services/api.service.js`:
```javascript
const MOCK_USERS = {
  'user_new': {
    id: 'user_new',
    username: 'newuser',
    password: '123456',
    name: 'New User',
    role: 'watcher',
    watchingUser: 'user_a'
  }
};
```

## 📝 Notes

- Tất cả API hiện tại đang dùng mock data
- Khi integrate với server thật, chỉ cần thay đổi logic trong các service files
- WebSocket/Realtime được giả lập bằng setInterval
- FCM token là mock, cần integrate Firebase thật để nhận notification

## 🐛 Troubleshooting

### Lỗi Metro Bundler
```bash
npm start -- --reset-cache
```

### Lỗi Build Android
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Lỗi Build iOS
```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

## 📄 License

MIT

## 👨‍💻 Author

Created for IoT Fall Detection System