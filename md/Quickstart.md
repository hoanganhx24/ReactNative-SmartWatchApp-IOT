# ⚡ Quick Start Guide

## 🚀 Chạy nhanh trong 3 bước

### Bước 1: Cài đặt
```bash
npm install
```

### Bước 2: Chạy Metro Bundler
```bash
npm start
```

### Bước 3: Chạy app
Mở terminal mới:

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

## 🎮 Test nhanh

### 1. Đăng nhập
Dùng tài khoản demo:
- Username: `nguoideoA`
- Password: `123456`

### 2. Xem dữ liệu realtime
- Màn Home sẽ tự động cập nhật nhịp tim
- Trạng thái thay đổi realtime
- Scroll để refresh

### 3. Kết nối Bluetooth
- Nhấn nút "Kết nối thiết bị"
- Chọn "IoT Fall Detector A"
- Xem dữ liệu từ thiết bị

### 4. Xem vị trí GPS
- Nhấn "Bản đồ" trong Quick Actions
- Xem tọa độ hiện tại
- Bật "Theo dõi liên tục"

### 5. Xem lịch sử
- Nhấn "Lịch sử" trong Quick Actions
- Xem các bản ghi đã lưu
- Pull down để refresh

## 📱 Demo các tính năng

### Auto-update (Không cần làm gì)
- Nhịp tim cập nhật mỗi 2 giây
- Trạng thái cập nhật mỗi 3 giây
- Fall detection check mỗi 10 giây

### Giả lập té ngã
Hệ thống tự động giả lập té ngã với xác suất 1% mỗi 10 giây.

Khi té ngã xảy ra:
1. ⚠️ Trạng thái đổi thành "Té ngã"
2. 📍 Lấy vị trí GPS
3. 📱 Gửi thông báo (log trong console)
4. 💾 Lưu vào lịch sử

## 🔍 Debug

### Xem logs
```bash
# Android
npx react-native log-android

# iOS
npx react-native log-ios
```

### Reload app
- Nhấn `R` hai lần nhanh
- Hoặc shake device → Reload

### Debug Menu
- Shake device
- Hoặc Cmd/Ctrl + M

## 🎯 Các tài khoản test

| Username | Password | Role | Mô tả |
|----------|----------|------|-------|
| nguoideoA | 123456 | Admin | Người đeo thiết bị |
| nguoinhaB | 123456 | Watcher | Người nhà theo dõi |
| nguoinhaC | 123456 | Watcher | Người nhà theo dõi |
| nguoinhaD | 123456 | Watcher | Người nhà theo dõi |

## 📊 Dữ liệu mẫu

### Nhịp tim
- Dao động: 60-100 BPM
- Update: Mỗi 2 giây
- Hiển thị: Số lớn + thanh progress

### Trạng thái
- Normal (Xanh): Bình thường
- Running (Cam): Đang chạy
- Fallen (Đỏ): Té ngã

### Vị trí
- Mock location: Hà Nội
- Latitude: ~21.02°N
- Longitude: ~105.85°E

## ⚠️ Troubleshooting nhanh

### App không chạy?
```bash
npm start -- --reset-cache
```

### Build lỗi?
```bash
# Android
cd android && ./gradlew clean && cd ..

# iOS
cd ios && pod install && cd ..
```

### Không thấy data?
1. Check Metro Bundler đang chạy
2. Reload app (R + R)
3. Check console logs

## 📚 Đọc thêm

- [README.md](README.md) - Tài liệu đầy đủ
- [INSTALLATION.md](INSTALLATION.md) - Hướng dẫn cài đặt chi tiết
- [ARCHITECTURE.md](ARCHITECTURE.md) - Kiến trúc ứng dụng

## 💡 Tips

1. **Luôn chạy Metro Bundler trước**: `npm start`
2. **Reload thường xuyên**: Nhấn R + R
3. **Check logs**: Xem console để debug
4. **Mock data**: Tất cả API đều là mock, dữ liệu random
5. **Test nhiều**: Thử tất cả tính năng để hiểu flow

## 🎉 Chúc mừng!

Bạn đã chạy được app! Giờ có thể:
- Xem code trong `/src`
- Thêm tính năng mới
- Customize UI
- Integrate API thật
- Deploy lên store

Happy coding! 🚀