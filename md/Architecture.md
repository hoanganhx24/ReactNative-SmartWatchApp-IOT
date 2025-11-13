# 🏗 Kiến trúc ứng dụng IoT Fall Detection

## 📊 Tổng quan kiến trúc

```
┌─────────────────────────────────────────────────────────┐
│                    React Native App                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Screens    │  │   Contexts   │  │  Services    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│         │                 │                   │         │
│         └─────────────────┴───────────────────┘         │
│                          │                              │
├──────────────────────────┼──────────────────────────────┤
│                          │                              │
│              ┌───────────▼───────────┐                  │
│              │   Mock API Service    │                  │
│              └───────────────────────┘                  │
│                          │                              │
└──────────────────────────┼──────────────────────────────┘
                           │
            ┌──────────────┴──────────────┐
            │                             │
      ┌─────▼─────┐                ┌─────▼─────┐
      │  Bluetooth │                │ Node.js   │
      │  Device    │                │ Server    │
      │  (IoT)     │                │ (Future)  │
      └────────────┘                └───────────┘
```

## 🎯 Luồng dữ liệu

### 1. Authentication Flow

```
User Input (Login) 
    ↓
LoginScreen
    ↓
AuthContext.login()
    ↓
api.service.login()
    ↓
Save to AsyncStorage
    ↓
Update App State
    ↓
Navigate to HomeScreen
```

### 2. Realtime Data Flow

```
User Logged In
    ↓
IoTContext initialized
    ↓
Start Realtime Connection
    ↓
api.service.subscribeToRealtime()
    ↓
Receive Updates (every 2-3 seconds)
    ↓
Update Context State
    ↓
UI Auto Re-renders
```

### 3. Fall Detection Flow

```
IoT Device detects fall
    ↓
bluetoothService receives event
    ↓
IoTContext.handleFallDetected()
    ↓
1. Update status to "fallen"
2. Get current GPS location
3. Send notification to family
4. Save to history
    ↓
UI shows alert
Family receives notification
```

## 📁 Chi tiết từng layer

### Layer 1: Screens (UI)

**Trách nhiệm:**
- Hiển thị giao diện
- Nhận input từ user
- Gọi functions từ Contexts

**Files:**
- `LoginScreen.js` - Đăng nhập/đăng ký
- `HomeScreen.js` - Dashboard chính
- `BluetoothScreen.js` - Quét và kết nối Bluetooth
- `LocationScreen.js` - Hiển thị bản đồ
- `HistoryScreen.js` - Lịch sử đo

**Pattern:**
```javascript
const SomeScreen = () => {
  const { data, action } = useContext();
  
  return (
    <View>
      <Text>{data}</Text>
      <Button onPress={action} />
    </View>
  );
};
```

### Layer 2: Contexts (State Management)

**Trách nhiệm:**
- Quản lý global state
- Cung cấp state và actions cho components
- Orchestrate giữa services

**Files:**
- `AuthContext.js` - Authentication state
    - User info
    - Login/logout
    - Token management

- `IoTContext.js` - IoT data state
    - Bluetooth connection
    - Realtime data (heart rate, status)
    - Location tracking
    - History

**Pattern:**
```javascript
const SomeContext = createContext();

export const SomeProvider = ({ children }) => {
  const [state, setState] = useState();
  
  const action = async () => {
    const result = await service.doSomething();
    setState(result);
  };
  
  return (
    <SomeContext.Provider value={{ state, action }}>
      {children}
    </SomeContext.Provider>
  );
};
```

### Layer 3: Services (Business Logic)

**Trách nhiệm:**
- Xử lý business logic
- Gọi API
- Quản lý kết nối (Bluetooth, Location, etc.)
- Mock data (hiện tại)

**Files:**

#### `api.service.js` - API Service
```javascript
class ApiService {
  // Auth APIs
  login(username, password)
  register(userData)
  logout()
  
  // IoT APIs
  connectBluetooth(deviceId)
  getHeartRate(userId)
  getStatus(userId)
  detectFall(userId, data)
  
  // Location APIs
  getLocation(userId)
  updateLocation(userId, lat, lng)
  
  // Notification APIs
  sendNotificationToFamily(userId, notification)
  
  // Realtime
  subscribeToRealtime(userId, callbacks)
}
```

#### `bluetooth.service.js` - Bluetooth Service
```javascript
class BluetoothService {
  scanDevices()
  connect(deviceId)
  disconnect()
  addListener(callback)
  sendCommand(command, params)
}
```

#### `notification.service.js` - Notification Service
```javascript
class NotificationService {
  initialize()
  sendFallAlert(userId, location)
  sendStatusNotification(userId, status)
  registerToken(userId)
}
```

#### `location.service.js` - Location Service
```javascript
class LocationService {
  getCurrentLocation()
  startTracking(options)
  stopTracking()
  getAddressFromCoordinates(lat, lng)
}
```

## 🔄 Data Flow Examples

### Example 1: User đăng nhập

```
1. User nhập username/password trong LoginScreen
   ↓
2. LoginScreen gọi AuthContext.login()
   ↓
3. AuthContext.login() gọi api.service.login()
   ↓
4. api.service tìm user trong MOCK_USERS
   ↓
5. Nếu đúng, trả về token + user data
   ↓
6. AuthContext lưu vào AsyncStorage
   ↓
7. AuthContext update state: user, token
   ↓
8. App detect isAuthenticated = true
   ↓
9. Navigation chuyển sang HomeScreen
   ↓
10. IoTContext tự động start realtime connection
```

### Example 2: Nhận dữ liệu nhịp tim realtime

```
1. IoTContext.startRealtimeConnection() được gọi
   ↓
2. api.service.subscribeToRealtime() tạo intervals
   ↓
3. Mỗi 2 giây, gọi api.service.getHeartRate()
   ↓
4. getHeartRate() tạo random heart rate (mock)
   ↓
5. Callback onHeartRate được trigger
   ↓
6. IoTContext update state: heartRate
   ↓
7. HomeScreen re-render với heartRate mới
   ↓
8. UI hiển thị giá trị nhịp tim mới
```

### Example 3: Phát hiện té ngã

```
1. bluetoothService nhận event 'fall' từ device
   ↓
2. IoTContext.handleFallDetected() được gọi
   ↓
3. Cập nhật status: setStatus('fallen')
   ↓
4. locationService.getCurrentLocation() - lấy GPS
   ↓
5. notificationService.sendFallAlert() - gửi thông báo
   ↓
6. api.service.detectFall() - lưu vào history
   ↓
7. api.service.sendNotificationToFamily() - gửi FCM
   ↓
8. HomeScreen hiển thị alert màu đỏ
   ↓
9. Gia đình nhận notification trên điện thoại
```

## 🔌 Mock vs Real Integration

### Hiện tại (Mock)

```javascript
// api.service.js
async login(username, password) {
  await simulateDelay(500); // Giả lập network
  
  const user = MOCK_USERS.find(/* ... */);
  
  if (user) {
    return { success: true, data: { token, user } };
  }
}
```

### Tương lai (Real API)

```javascript
// api.service.js
async login(username, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  
  const data = await response.json();
  return data;
}
```

**Chỉ cần thay đổi logic bên trong services, screens và contexts giữ nguyên!**

## 🎨 Component Patterns

### 1. Screen Pattern

```javascript
const SomeScreen = ({ navigation }) => {
  // Get data from context
  const { data, loading, error, action } = useContext();
  
  // Local state nếu cần
  const [localState, setLocalState] = useState();
  
  // Effects
  useEffect(() => {
    // Load data when screen mounts
  }, []);
  
  // Handlers
  const handleSomething = async () => {
    await action();
  };
  
  // Render
  return (
    <SafeAreaView>
      {loading && <Loading />}
      {error && <Error />}
      {data && <Content />}
    </SafeAreaView>
  );
};
```

### 2. Context Pattern

```javascript
const SomeContext = createContext();

export const SomeProvider = ({ children }) => {
  // State
  const [state, setState] = useState(initialState);
  
  // Derived state
  const derivedState = useMemo(() => {
    return compute(state);
  }, [state]);
  
  // Actions
  const action = useCallback(async () => {
    try {
      setState({ ...state, loading: true });
      const result = await service.action();
      setState({ ...state, data: result, loading: false });
    } catch (error) {
      setState({ ...state, error, loading: false });
    }
  }, [state]);
  
  // Value
  const value = {
    ...state,
    derivedState,
    action
  };
  
  return (
    <SomeContext.Provider value={value}>
      {children}
    </SomeContext.Provider>
  );
};

export const useSome = () => useContext(SomeContext);
```

### 3. Service Pattern

```javascript
class SomeService {
  constructor() {
    this.state = {};
  }
  
  async doSomething(params) {
    // 1. Validate
    if (!params) throw new Error('Invalid params');
    
    // 2. Process
    const result = await this._process(params);
    
    // 3. Update internal state if needed
    this.state = { ...this.state, result };
    
    // 4. Return
    return result;
  }
  
  _process(params) {
    // Private helper method
  }
}

// Singleton
const someService = new SomeService();
export default someService;
```

## 🔐 Security Considerations

### Authentication
- Token được lưu trong AsyncStorage
- Token được gửi kèm mỗi API request
- Auto logout khi token expire

### Data Protection
- Không lưu password plain text
- Sensitive data được encrypt trước khi lưu
- HTTPS cho tất cả API calls (production)

### Permissions
- Location: Request khi cần
- Bluetooth: Request khi scan
- Notifications: Request khi initialize FCM

## 📱 Performance Optimizations

### 1. Memo & Callbacks
```javascript
const expensive = useMemo(() => compute(data), [data]);
const handler = useCallback(() => action(), [dep]);
```

### 2. Lazy Loading
```javascript
const LazyScreen = lazy(() => import('./Screen'));
```

### 3. Virtualized Lists
```javascript
<FlatList
  data={longList}
  renderItem={renderItem}
  keyExtractor={item => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
/>
```

### 4. Image Optimization
```javascript
<Image
  source={{ uri }}
  resizeMode="cover"
  cache="only-if-cached"
/>
```

## 🧪 Testing Strategy

### Unit Tests
- Services: Test business logic
- Utils: Test helper functions

### Integration Tests
- Contexts: Test state management
- API calls: Test with mock server

### E2E Tests
- User flows: Login → Home → Actions
- Critical paths: Fall detection flow

## 📈 Future Enhancements

### Phase 1: Real Backend
- Replace mock API với real Node.js server
- Setup database (MongoDB/PostgreSQL)
- Implement WebSocket cho realtime

### Phase 2: Advanced Features
- Video call khi phát hiện té ngã
- AI prediction cho té ngã
- Health analytics dashboard
- Export reports PDF

### Phase 3: Optimization
- Offline support
- Background location tracking
- Push notification optimization
- Better caching strategy

## 🎓 Best Practices được áp dụng

1. **Separation of Concerns**: UI, Logic, Data được tách riêng
2. **Single Responsibility**: Mỗi file có 1 mục đích rõ ràng
3. **DRY**: Không lặp code, reuse logic
4. **Error Handling**: Try-catch ở mọi async operation
5. **Type Safety**: Consistent data structures
6. **Naming**: Clear, descriptive names
7. **Comments**: Giải thích "why", không "what"
8. **Testing**: Testable code structure

## 📚 Learning Resources

- React Native: https://reactnative.dev
- React Navigation: https://reactnavigation.org
- React Context: https://react.dev/reference/react/useContext
- Async Storage: https://react-native-async-storage.github.io