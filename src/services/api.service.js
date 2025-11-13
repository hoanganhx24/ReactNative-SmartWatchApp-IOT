// API Service - Giả lập tất cả API với mock data

const BASE_URL = 'http://localhost:3000/api'; // Thay đổi theo server của bạn

// Mock Data
const MOCK_USERS = {
    'user_a': {
        id: 'user_a',
        username: 'nguoideoA',
        password: '123456',
        name: 'Người deo A',
        role: 'admin',
        deviceId: 'device_001',
        watchers: ['user_b', 'user_c', 'user_d']
    },
    'user_b': {
        id: 'user_b',
        username: 'nguoinhaB',
        password: '123456',
        name: 'Người nhà B',
        role: 'watcher',
        watchingUser: 'user_a'
    },
    'user_c': {
        id: 'user_c',
        username: 'nguoinhaC',
        password: '123456',
        name: 'Người nhà C',
        role: 'watcher',
        watchingUser: 'user_a'
    },
    'user_d': {
        id: 'user_d',
        username: 'nguoinhaD',
        password: '123456',
        name: 'Người nhà D',
        role: 'watcher',
        watchingUser: 'user_a'
    }
};

// Mock data cho heartbeat (nhịp tim)
let mockHeartRateData = {
    user_a: {
        current: 72,
        timestamp: new Date().toISOString(),
        history: []
    }
};

// Mock data cho trạng thái
let mockStatusData = {
    user_a: {
        status: 'normal', // normal, running, fallen
        lastUpdate: new Date().toISOString()
    }
};

// Mock data cho vị trí GPS
let mockLocationData = {
    user_a: {
        latitude: 21.0285,
        longitude: 105.8542,
        timestamp: new Date().toISOString()
    }
};

// Mock data cho lịch sử đo
let mockMeasurementHistory = [
    {
        id: '1',
        userId: 'user_a',
        heartRate: 75,
        status: 'normal',
        timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
        id: '2',
        userId: 'user_a',
        heartRate: 78,
        status: 'normal',
        timestamp: new Date(Date.now() - 7200000).toISOString()
    },
    {
        id: '3',
        userId: 'user_a',
        heartRate: 120,
        status: 'running',
        timestamp: new Date(Date.now() - 10800000).toISOString()
    }
];

// Helper function để giả lập network delay
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function để tạo response giống API thực
const createResponse = (data, success = true) => {
    return {
        success,
        data,
        timestamp: new Date().toISOString()
    };
};

class ApiService {
    constructor() {
        this.authToken = null;
        this.currentUser = null;
    }

    // ============ Authentication APIs ============

    /**
     * Đăng nhập
     */
    async login(username, password) {
        await simulateDelay();

        const user = Object.values(MOCK_USERS).find(
            u => u.username === username && u.password === password
        );

        if (user) {
            const token = `mock_token_${user.id}_${Date.now()}`;
            this.authToken = token;
            this.currentUser = user;

            // Lưu token vào storage (sẽ implement ở AuthContext)
            return createResponse({
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    name: user.name,
                    role: user.role,
                    deviceId: user.deviceId,
                    watchers: user.watchers
                }
            });
        }

        throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
    }

    /**
     * Đăng ký
     */
    async register(userData) {
        await simulateDelay();

        // Kiểm tra username đã tồn tại
        const exists = Object.values(MOCK_USERS).find(
            u => u.username === userData.username
        );

        if (exists) {
            throw new Error('Tên đăng nhập đã tồn tại');
        }

        const newUser = {
            id: `user_${Date.now()}`,
            username: userData.username,
            password: userData.password,
            name: userData.name,
            role: userData.role || 'watcher',
            watchingUser: userData.watchingUser
        };

        MOCK_USERS[newUser.id] = newUser;

        return createResponse({
            user: newUser
        });
    }

    /**
     * Đăng xuất
     */
    async logout() {
        await simulateDelay(200);
        this.authToken = null;
        this.currentUser = null;
        return createResponse({ message: 'Đăng xuất thành công' });
    }

    /**
     * Lấy thông tin user hiện tại
     */
    async getCurrentUser() {
        await simulateDelay(200);
        if (!this.currentUser) {
            throw new Error('Chưa đăng nhập');
        }
        return createResponse({ user: this.currentUser });
    }

    // ============ Bluetooth / IoT Device APIs ============

    /**
     * Kết nối Bluetooth với thiết bị
     */
    async connectBluetooth(deviceId) {
        await simulateDelay(1000);
        console.log(`Đang kết nối với thiết bị: ${deviceId}`);

        // Giả lập kết nối thành công
        return createResponse({
            connected: true,
            deviceId,
            deviceName: 'IoT Fall Detection Device',
            message: 'Kết nối thành công'
        });
    }

    /**
     * Ngắt kết nối Bluetooth
     */
    async disconnectBluetooth(deviceId) {
        await simulateDelay(300);
        return createResponse({
            connected: false,
            deviceId,
            message: 'Đã ngắt kết nối'
        });
    }

    // ============ Real-time Data APIs ============

    /**
     * Lấy nhịp tim realtime
     */
    async getHeartRate(userId) {
        await simulateDelay(200);

        // Giả lập nhịp tim thay đổi ngẫu nhiên
        const baseRate = mockHeartRateData[userId]?.current || 72;
        const variation = Math.floor(Math.random() * 10) - 5;
        const currentRate = Math.max(60, Math.min(100, baseRate + variation));

        mockHeartRateData[userId] = {
            current: currentRate,
            timestamp: new Date().toISOString(),
            history: [
                ...(mockHeartRateData[userId]?.history || []).slice(-99),
                { rate: currentRate, timestamp: new Date().toISOString() }
            ]
        };

        return createResponse({
            userId,
            heartRate: currentRate,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Lấy trạng thái hiện tại (bình thường / đang chạy / té ngã)
     */
    async getStatus(userId) {
        await simulateDelay(200);

        const status = mockStatusData[userId] || {
            status: 'normal',
            lastUpdate: new Date().toISOString()
        };

        return createResponse({
            userId,
            status: status.status,
            lastUpdate: status.lastUpdate
        });
    }

    /**
     * Cập nhật trạng thái (từ thiết bị IoT)
     */
    async updateStatus(userId, status) {
        await simulateDelay(200);

        mockStatusData[userId] = {
            status,
            lastUpdate: new Date().toISOString()
        };

        return createResponse({
            userId,
            status,
            message: 'Cập nhật trạng thái thành công'
        });
    }

    /**
     * Phát hiện té ngã
     */
    async detectFall(userId, fallData) {
        await simulateDelay(300);

        console.log('⚠️ Phát hiện té ngã!', fallData);

        // Cập nhật trạng thái
        mockStatusData[userId] = {
            status: 'fallen',
            lastUpdate: new Date().toISOString(),
            fallData
        };

        // Thêm vào lịch sử
        mockMeasurementHistory.unshift({
            id: `fall_${Date.now()}`,
            userId,
            status: 'fallen',
            timestamp: new Date().toISOString(),
            fallData
        });

        return createResponse({
            userId,
            fallDetected: true,
            timestamp: new Date().toISOString(),
            message: 'Đã ghi nhận sự cố té ngã'
        });
    }

    // ============ GPS Location APIs ============

    /**
     * Lấy vị trí GPS hiện tại
     */
    async getLocation(userId) {
        await simulateDelay(300);

        const location = mockLocationData[userId] || {
            latitude: 21.0285,
            longitude: 105.8542,
            timestamp: new Date().toISOString()
        };

        return createResponse({
            userId,
            location,
            address: 'Hà Nội, Việt Nam' // Mock address
        });
    }

    /**
     * Cập nhật vị trí GPS
     */
    async updateLocation(userId, latitude, longitude) {
        await simulateDelay(200);

        mockLocationData[userId] = {
            latitude,
            longitude,
            timestamp: new Date().toISOString()
        };

        return createResponse({
            userId,
            location: mockLocationData[userId],
            message: 'Cập nhật vị trí thành công'
        });
    }

    // ============ History APIs ============

    /**
     * Lấy lịch sử đo
     */
    async getMeasurementHistory(userId, limit = 50) {
        await simulateDelay(300);

        const history = mockMeasurementHistory
            .filter(m => m.userId === userId)
            .slice(0, limit);

        return createResponse({
            userId,
            history,
            total: history.length
        });
    }

    // ============ Family/Watcher APIs ============

    /**
     * Lấy danh sách người theo dõi
     */
    async getWatchers(userId) {
        await simulateDelay(200);

        const user = MOCK_USERS[userId];
        if (!user || !user.watchers) {
            return createResponse({ watchers: [] });
        }

        const watchers = user.watchers.map(watcherId => {
            const watcher = MOCK_USERS[watcherId];
            return {
                id: watcher.id,
                username: watcher.username,
                name: watcher.name
            };
        });

        return createResponse({ watchers });
    }

    /**
     * Thêm người theo dõi
     */
    async addWatcher(userId, watcherUsername) {
        await simulateDelay(300);

        const watcher = Object.values(MOCK_USERS).find(
            u => u.username === watcherUsername
        );

        if (!watcher) {
            throw new Error('Không tìm thấy người dùng');
        }

        const user = MOCK_USERS[userId];
        if (!user.watchers) {
            user.watchers = [];
        }

        if (!user.watchers.includes(watcher.id)) {
            user.watchers.push(watcher.id);
            watcher.watchingUser = userId;
        }

        return createResponse({
            message: 'Đã thêm người theo dõi',
            watcher: {
                id: watcher.id,
                username: watcher.username,
                name: watcher.name
            }
        });
    }

    // ============ Notification APIs ============

    /**
     * Gửi thông báo đến gia đình (FCM)
     */
    async sendNotificationToFamily(userId, notification) {
        await simulateDelay(500);

        console.log('📱 Gửi thông báo:', notification);

        const user = MOCK_USERS[userId];
        if (!user || !user.watchers) {
            return createResponse({ sent: false, message: 'Không có người theo dõi' });
        }

        // Giả lập gửi FCM đến tất cả người theo dõi
        const recipients = user.watchers.map(watcherId => ({
            userId: watcherId,
            sent: true,
            timestamp: new Date().toISOString()
        }));

        return createResponse({
            sent: true,
            recipients,
            notification,
            message: `Đã gửi thông báo đến ${recipients.length} người`
        });
    }

    /**
     * Lấy token FCM
     */
    async getFCMToken() {
        await simulateDelay(200);
        return createResponse({
            token: `fcm_mock_token_${Date.now()}`
        });
    }

    /**
     * Đăng ký FCM token
     */
    async registerFCMToken(userId, fcmToken) {
        await simulateDelay(200);
        console.log('Đăng ký FCM token:', userId, fcmToken);
        return createResponse({
            registered: true,
            message: 'Đã đăng ký nhận thông báo'
        });
    }

    // ============ WebSocket / Real-time Simulation ============

    /**
     * Giả lập WebSocket connection cho real-time updates
     */
    subscribeToRealtime(userId, callbacks) {
        console.log('📡 Đăng ký nhận dữ liệu realtime cho user:', userId);

        // Giả lập cập nhật nhịp tim mỗi 2 giây
        const heartRateInterval = setInterval(async () => {
            try {
                const response = await this.getHeartRate(userId);
                if (callbacks.onHeartRate) {
                    callbacks.onHeartRate(response.data);
                }
            } catch (error) {
                console.error('Error updating heart rate:', error);
            }
        }, 2000);

        // Giả lập cập nhật trạng thái mỗi 3 giây
        const statusInterval = setInterval(async () => {
            try {
                const response = await this.getStatus(userId);
                if (callbacks.onStatusChange) {
                    callbacks.onStatusChange(response.data);
                }
            } catch (error) {
                console.error('Error updating status:', error);
            }
        }, 3000);

        // Giả lập phát hiện té ngã ngẫu nhiên (1% mỗi 10 giây)
        const fallDetectionInterval = setInterval(() => {
            if (Math.random() < 0.01) {
                this.detectFall(userId, {
                    acceleration: 9.8,
                    orientation: 'horizontal',
                    confidence: 0.95
                });
                if (callbacks.onFallDetected) {
                    callbacks.onFallDetected({
                        userId,
                        timestamp: new Date().toISOString(),
                        message: 'Phát hiện té ngã!'
                    });
                }
            }
        }, 10000);

        // Return function để unsubscribe
        return () => {
            clearInterval(heartRateInterval);
            clearInterval(statusInterval);
            clearInterval(fallDetectionInterval);
            console.log('🔌 Ngắt kết nối realtime');
        };
    }
}

// Export singleton instance
const apiService = new ApiService();
export default apiService;