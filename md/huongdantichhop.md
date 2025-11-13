# HƯỚNG DẪN TÍCH HỢP BLE VÀO BASE CODE

## 📋 TỔNG QUAN

Hướng dẫn này giúp bạn tích hợp kết nối BLE với ESP32 vào base code React Native hiện có của bạn.

## 🔧 CÁC FILE CẦN THIẾT

### 1. ESP32
- **esp32_ble_server.ino** - Code Arduino cho ESP32

### 2. React Native
- **IoTContext.js** - Context quản lý BLE (file MỚI)
- **BluetoothScreen.js** - Màn hình quét và kết nối (đã có, chỉ cần kiểm tra)

## 📝 BƯỚC 1: CÀI ĐẶT ESP32

### 1.1. Chuẩn bị Arduino IDE
1. Mở Arduino IDE
2. Vào **File → Preferences**
3. Thêm URL vào "Additional Boards Manager URLs":
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
4. Vào **Tools → Board → Boards Manager**
5. Tìm "ESP32" và cài đặt package "esp32 by Espressif Systems"

### 1.2. Upload code lên ESP32
1. Mở file `esp32_ble_server.ino`
2. Chọn board: **Tools → Board → ESP32 Arduino → ESP32 Dev Module**
3. Chọn Port: **Tools → Port → (chọn port của ESP32)**
4. Click nút **Upload** (→)
5. Mở **Serial Monitor** (Ctrl+Shift+M) với baud rate **115200** để xem log

### 1.3. Kiểm tra ESP32 hoạt động
Trong Serial Monitor, bạn sẽ thấy:
```
========================================
ESP32 BLE IoT Server
========================================
Starting BLE Server...
✓ BLE Server is ready!
Device Name: ESP32-IoT-Device
Waiting for connection...
========================================
```

## 📝 BƯỚC 2: CẤU HÌNH REACT NATIVE

### 2.1. Cài đặt thư viện BLE

```bash
npm install react-native-ble-plx
```

Hoặc với yarn:
```bash
yarn add react-native-ble-plx
```

### 2.2. Cài đặt Buffer (cần thiết cho parse dữ liệu)

```bash
npm install buffer
```

### 2.3. Cấu hình Android

**File: android/app/src/main/AndroidManifest.xml**

Thêm các quyền sau vào trong thẻ `<manifest>`:

```xml
<!-- Quyền Bluetooth -->
<uses-permission android:name="android.permission.BLUETOOTH"/>
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN"/>

<!-- Quyền cho Android 12+ -->
<uses-permission android:name="android.permission.BLUETOOTH_SCAN"
                 android:usesPermissionFlags="neverForLocation" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT"/>

<!-- Quyền Location (cần cho BLE scan) -->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
```

### 2.4. Cấu hình iOS

**File: ios/YourAppName/Info.plist**

Thêm các key sau:

```xml
<key>NSBluetoothAlwaysUsageDescription</key>
<string>Ứng dụng cần quyền Bluetooth để kết nối với ESP32</string>

<key>NSBluetoothPeripheralUsageDescription</key>
<string>Ứng dụng cần quyền Bluetooth để giao tiếp với thiết bị BLE</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>Ứng dụng cần quyền vị trí để quét các thiết bị Bluetooth</string>
```

Sau đó chạy:
```bash
cd ios && pod install && cd ..
```

## 📝 BƯỚC 3: TÍCH HỢP IoTContext

### 3.1. Đặt file IoTContext.js

Copy file `IoTContext.js` vào thư mục `src/contexts/` của project

### 3.2. Kiểm tra cấu trúc thư mục

```
src/
├── contexts/
│   ├── AuthContext.js (đã có)
│   └── IoTContext.js (MỚI - vừa copy)
├── screens/
│   ├── BluetoothScreen.js (đã có)
│   ├── HomeScreen.js
│   └── ...
```

### 3.3. Import Buffer trong IoTContext.js

Thêm dòng này ở đầu file `IoTContext.js`:

```javascript
import { Buffer } from 'buffer';
```

Hoặc nếu gặp lỗi, thêm vào đầu file:

```javascript
global.Buffer = global.Buffer || require('buffer').Buffer;
```

## 📝 BƯỚC 4: KIỂM TRA BluetoothScreen.js

File BluetoothScreen.js của bạn đã hoàn chỉnh và tương thích với IoTContext.

**Các chức năng có sẵn:**
- ✅ Quét thiết bị BLE
- ✅ Hiển thị danh sách thiết bị với RSSI
- ✅ Kết nối/Ngắt kết nối
- ✅ Hiển thị thiết bị đang kết nối
- ✅ UI đẹp và thân thiện

**KHÔNG CẦN sửa gì!** Chỉ cần đảm bảo IoTContext được import đúng.

## 📝 BƯỚC 5: CHẠY ỨNG DỤNG

### 5.1. Chạy trên Android

```bash
npx react-native run-android
```

### 5.2. Chạy trên iOS

```bash
npx react-native run-ios
```

## 📝 BƯỚC 6: KIỂM TRA KẾT NỐI

### 6.1. Chuẩn bị
1. ✅ ESP32 đang chạy (kiểm tra Serial Monitor)
2. ✅ Bluetooth trên smartphone đã bật
3. ✅ App đã được cài đặt trên smartphone

### 6.2. Kết nối
1. Mở app và đăng nhập (nếu cần)
2. Vào màn hình **Bluetooth** (BluetoothScreen)
3. App sẽ tự động quét thiết bị
4. Chọn thiết bị **"ESP32-IoT-Device"**
5. Nhấn **Kết nối**
6. Kiểm tra Serial Monitor của ESP32, sẽ thấy: `✓ Device connected!`

### 6.3. Xem dữ liệu
Sau khi kết nối, bạn có thể:
- Xem dữ liệu realtime trong `sensorData` state
- Hiển thị trên HomeScreen hoặc màn hình khác
- Lưu vào database hoặc history

## 🎨 BƯỚC 7: HIỂN THỊ DỮ LIỆU TRÊN HomeScreen

Trong file `HomeScreen.js`, bạn có thể sử dụng dữ liệu như sau:

```javascript
import { useIoT } from '../contexts/IoTContext';

const HomeScreen = () => {
    const { 
        isBluetoothConnected, 
        sensorData, 
        connectedDevice 
    } = useIoT();

    return (
        <View>
            {isBluetoothConnected && (
                <View>
                    <Text>Nhiệt độ: {sensorData.temperature}°C</Text>
                    <Text>Độ ẩm: {sensorData.humidity}%</Text>
                    <Text>Ánh sáng: {sensorData.light}</Text>
                    <Text>Cảm biến: {sensorData.sensor}</Text>
                    <Text>Trạng thái: {sensorData.status ? 'Bật' : 'Tắt'}</Text>
                </View>
            )}
        </View>
    );
};
```

## 🔧 TÙY CHỈNH

### Thay đổi UUID (nếu cần)

1. Tạo UUID mới tại: https://www.uuidgenerator.net/
2. Cập nhật trong **esp32_ble_server.ino**:
   ```c
   #define SERVICE_UUID        "uuid-mới-của-bạn"
   #define CHARACTERISTIC_UUID "uuid-mới-của-bạn"
   ```
3. Cập nhật trong **IoTContext.js**:
   ```javascript
   const SERVICE_UUID = 'uuid-mới-của-bạn';
   const CHARACTERISTIC_UUID = 'uuid-mới-của-bạn';
   ```

### Thay đổi tên thiết bị

Trong **esp32_ble_server.ino**:
```c
#define DEVICE_NAME "Tên-Mới-Của-Bạn"
```

### Thêm cảm biến mới

1. Trong ESP32, thêm cảm biến vào JSON:
   ```c
   jsonData += "\"newSensor\":" + String(newValue) + ",";
   ```

2. Trong **IoTContext.js**, cập nhật state:
   ```javascript
   setSensorData({
       ...existingFields,
       newSensor: data.newSensor
   });
   ```

## ❗ XỬ LÝ LỖI THƯỜNG GẶP

### Lỗi: "Không tìm thấy thiết bị"
- ✅ Kiểm tra ESP32 đang chạy
- ✅ Bật Bluetooth trên smartphone
- ✅ Cấp đủ quyền cho app
- ✅ Ở gần ESP32 (trong vòng 10m)

### Lỗi: "Permission denied"
- Android: Vào **Settings → Apps → YourApp → Permissions** và cấp tất cả quyền
- iOS: Vào **Settings → Privacy → Bluetooth/Location** và bật cho app

### Lỗi: "Cannot connect to device"
- Restart ESP32
- Tắt/bật lại Bluetooth trên smartphone
- Xóa app và cài lại

### Lỗi: "Buffer is not defined"
- Thêm: `npm install buffer`
- Import Buffer ở đầu IoTContext.js

## 📊 KIỂM TRA HOÀN CHỈNH

- [ ] ESP32 upload thành công và chạy
- [ ] Serial Monitor hiển thị "BLE Server is ready!"
- [ ] React Native app build thành công
- [ ] App quét được thiết bị ESP32
- [ ] Kết nối thành công
- [ ] Serial Monitor hiển thị "Device connected!"
- [ ] Nhận được dữ liệu trong app
- [ ] Dữ liệu hiển thị đúng trên UI

## 🎉 HOÀN THÀNH!

Bạn đã tích hợp thành công BLE vào base code của mình. Bây giờ bạn có thể:
- Thu thập dữ liệu từ ESP32
- Hiển thị realtime trên app
- Lưu lịch sử dữ liệu
- Mở rộng thêm chức năng

---
**Chúc bạn thành công!** 🚀