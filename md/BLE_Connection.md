Thư viện cho react native, file package.json
"react-native-ble-plx": "^3.1.2"

# Hệ thống kết nối BLE: React Native ↔ ESP32

## 📁 Cấu trúc Files

### 1. ESP32
- **esp32_ble_server.ino** - Code Arduino cho ESP32, hoạt động như BLE Server

### 2. React Native App
- **App.tsx** - Component chính của React Native app
- **package.json** - Danh sách dependencies
- **AndroidManifest.xml** - Config quyền cho Android (đặt trong android/app/src/main/)

## 🚀 Bắt đầu nhanh

### Bước 1: Cài đặt ESP32
1. Mở file `esp32_ble_server.ino` trong Arduino IDE
2. Chọn board: ESP32 Dev Module
3. Upload code lên ESP32
4. Mở Serial Monitor (115200 baud) để xem log

### Bước 2: Tạo React Native Project
```bash
# Cài đặt thư viện BLE
npm install react-native-ble-plx

# Copy các file
# - Copy App.tsx vào thư mục gốc (thay thế file cũ)
# - Copy AndroidManifest.xml vào android/app/src/main/
# - Copy Info.plist vào ios/ESP32BLEApp/

# Chạy app
npx react-native run-android  # hoặc run-ios
```

## 📱 Sử dụng

1. Bật Bluetooth trên smartphone
2. Đảm bảo ESP32 đang chạy
3. Mở app và cấp quyền khi được yêu cầu
4. Nhấn "Quét thiết bị BLE"
5. Chọn "ESP32-BLE-Server"
6. Xem dữ liệu hiển thị trên màn hình

## 🔧 UUID quan trọng

Đảm bảo UUID trong ESP32 và React Native app phải khớp nhau:

```
SERVICE_UUID:        4fafc201-1fb5-459e-8fcc-c5c9c331914b
CHARACTERISTIC_UUID: beb5483e-36e1-4688-b7f5-ea07361b26a8
```


### esp32_ble_server.ino
```text
/*
 * ESP32 BLE Server - Truyền dữ liệu IoT từ ESP32 sang React Native App
 * Tác giả: Claude Assistant
 * Mô tả: Server BLE để gửi dữ liệu cảm biến đến React Native IoT app
 */

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

// UUID cho BLE Service và Characteristic
// Lưu ý: UUID này phải khớp với IoTContext trong React Native app
#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

// Tên thiết bị BLE (sẽ hiển thị trong app)
#define DEVICE_NAME "ESP32-IoT-Device"

BLEServer* pServer = NULL;
BLECharacteristic* pCharacteristic = NULL;
bool deviceConnected = false;
bool oldDeviceConnected = false;

// Callback khi có device kết nối/ngắt kết nối
class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
      Serial.println("✓ Device connected!");
      Serial.println("Started sending data...");
    };

    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
      Serial.println("✗ Device disconnected!");
    }
};

void setup() {
  Serial.begin(115200);
  Serial.println("========================================");
  Serial.println("ESP32 BLE IoT Server");
  Serial.println("========================================");
  Serial.println("Starting BLE Server...");

  // Khởi tạo BLE với tên device
  BLEDevice::init(DEVICE_NAME);

  // Tạo BLE Server
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  // Tạo BLE Service
  BLEService *pService = pServer->createService(SERVICE_UUID);

  // Tạo BLE Characteristic với quyền READ và NOTIFY
  pCharacteristic = pService->createCharacteristic(
                      CHARACTERISTIC_UUID,
                      BLECharacteristic::PROPERTY_READ |
                      BLECharacteristic::PROPERTY_NOTIFY
                    );

  // Thêm BLE Descriptor cho notification
  pCharacteristic->addDescriptor(new BLE2902());

  // Khởi động service
  pService->start();

  // Bắt đầu advertising để các device có thể tìm thấy
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();
  
  Serial.println("✓ BLE Server is ready!");
  Serial.print("Device Name: ");
  Serial.println(DEVICE_NAME);
  Serial.println("Waiting for connection...");
  Serial.println("========================================");
}

void loop() {
  // Khi có device kết nối
  if (deviceConnected) {
    // ============================================
    // ĐỌC DỮ LIỆU TỪ CẢM BIẾN
    // ============================================
    // Thay thế các giá trị ngẫu nhiên bên dưới bằng dữ liệu thực tế từ cảm biến của bạn
    
    // Ví dụ: Đọc nhiệt độ từ DHT11/DHT22
    float temperature = random(200, 350) / 10.0; // 20.0 - 35.0°C
    
    // Ví dụ: Đọc độ ẩm
    float humidity = random(300, 800) / 10.0;    // 30.0 - 80.0%
    
    // Ví dụ: Đọc giá trị cảm biến ánh sáng
    int lightLevel = random(0, 1024);            // 0 - 1023
    
    // Ví dụ: Đọc giá trị analog khác
    int sensorValue = random(0, 100);
    
    // Ví dụ: Trạng thái thiết bị
    bool deviceStatus = true;
    
    // ============================================
    // TẠO CHUỖI JSON ĐỂ GỬI
    // ============================================
    // Format JSON này sẽ được parse trong IoTContext của React Native app
    String jsonData = "{";
    jsonData += "\"temperature\":" + String(temperature, 1) + ",";
    jsonData += "\"humidity\":" + String(humidity, 1) + ",";
    jsonData += "\"light\":" + String(lightLevel) + ",";
    jsonData += "\"sensor\":" + String(sensorValue) + ",";
    jsonData += "\"status\":" + String(deviceStatus ? "true" : "false") + ",";
    jsonData += "\"timestamp\":" + String(millis());
    jsonData += "}";
    
    // ============================================
    // GỬI DỮ LIỆU QUA BLE NOTIFICATION
    // ============================================
    pCharacteristic->setValue(jsonData.c_str());
    pCharacteristic->notify();
    
    // Hiển thị log
    Serial.print("Sent: ");
    Serial.println(jsonData);
    
    // Gửi dữ liệu mỗi 2 giây
    delay(2000);
  }

  // ============================================
  // XỬ LÝ RECONNECTION
  // ============================================
  if (!deviceConnected && oldDeviceConnected) {
    delay(500);
    pServer->startAdvertising();
    Serial.println("Restarting advertising...");
    Serial.println("Waiting for connection...");
    oldDeviceConnected = deviceConnected;
  }
  
  if (deviceConnected && !oldDeviceConnected) {
    oldDeviceConnected = deviceConnected;
  }
}

// ============================================
// HƯỚNG DẪN TÙY CHỈNH
// ============================================
/*
 * 1. THAY ĐỔI TÊN THIẾT BỊ:
 *    - Sửa giá trị DEVICE_NAME ở đầu file
 *    - Ví dụ: #define DEVICE_NAME "My-Smart-Home"
 * 
 * 2. THÊM CẢM BIẾN MỚI:
 *    - Thêm thư viện cảm biến vào đầu file
 *    - Khởi tạo cảm biến trong setup()
 *    - Đọc dữ liệu trong loop()
 *    - Thêm vào chuỗi JSON
 * 
 * 3. THAY ĐỔI TỐC ĐỘ GỬI DỮ LIỆU:
 *    - Sửa giá trị delay() cuối loop()
 *    - delay(2000) = gửi mỗi 2 giây
 * 
 * 4. THÊM CHỨC NĂNG NHẬN LỆNH:
 *    - Tạo thêm Characteristic với PROPERTY_WRITE
 *    - Implement callback để xử lý dữ liệu nhận được
 * 
 * 5. UUID MỚI:
 *    - Tạo UUID mới tại: https://www.uuidgenerator.net/
 *    - Cập nhật SERVICE_UUID và CHARACTERISTIC_UUID
 *    - Nhớ cập nhật cả trong IoTContext.js
 */
```

### AndroidManifest.xml
```text
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Quyền Bluetooth cho Android -->
    <uses-permission android:name="android.permission.BLUETOOTH"/>
    <uses-permission android:name="android.permission.BLUETOOTH_ADMIN"/>
    
    <!-- Quyền cho Android 12+ (API 31+) -->
    <uses-permission android:name="android.permission.BLUETOOTH_SCAN"
                     android:usesPermissionFlags="neverForLocation" />
    <uses-permission android:name="android.permission.BLUETOOTH_CONNECT"/>
    
    <!-- Quyền location (cần thiết để scan BLE trên Android 6-11) -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>

    <application
      android:name=".MainApplication"
      android:label="@string/app_name"
      android:icon="@mipmap/ic_launcher"
      android:roundIcon="@mipmap/ic_launcher_round"
      android:allowBackup="false"
      android:theme="@style/AppTheme">
      
      <activity
        android:name=".MainActivity"
        android:label="@string/app_name"
        android:configChanges="keyboard|keyboardHidden|orientation|screenLayout|screenSize|smallestScreenSize|uiMode"
        android:launchMode="singleTask"
        android:windowSoftInputMode="adjustResize"
        android:exported="true">
        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent-filter>
      </activity>
    </application>
</manifest>
```

