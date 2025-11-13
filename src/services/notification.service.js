// Notification Service - Quản lý thông báo push (FCM)

import apiService from './api.service';

class NotificationService {
    constructor() {
        this.fcmToken = null;
        this.isInitialized = false;
    }

    /**
     * Khởi tạo FCM
     */
    async initialize() {
        if (this.isInitialized) {
            return;
        }

        try {
            console.log('🔔 Đang khởi tạo Firebase Cloud Messaging...');

            // Giả lập lấy FCM token
            const response = await apiService.getFCMToken();
            this.fcmToken = response.data.token;

            console.log('✅ FCM Token:', this.fcmToken);

            this.isInitialized = true;

            // Đăng ký listener cho foreground notifications
            this._setupForegroundNotificationListener();

            return this.fcmToken;
        } catch (error) {
            console.error('Lỗi khởi tạo FCM:', error);
            throw error;
        }
    }

    /**
     * Đăng ký FCM token với server
     */
    async registerToken(userId) {
        if (!this.fcmToken) {
            await this.initialize();
        }

        try {
            await apiService.registerFCMToken(userId, this.fcmToken);
            console.log('✅ Đã đăng ký FCM token với server');
        } catch (error) {
            console.error('Lỗi đăng ký FCM token:', error);
            throw error;
        }
    }

    /**
     * Gửi thông báo khi phát hiện té ngã
     */
    async sendFallAlert(userId, location = null) {
        try {
            const notification = {
                title: '⚠️ Cảnh báo té ngã!',
                body: 'Người thân của bạn có thể đã bị té ngã. Vui lòng kiểm tra ngay!',
                type: 'fall_detected',
                priority: 'high',
                data: {
                    userId,
                    location,
                    timestamp: new Date().toISOString()
                }
            };

            const response = await apiService.sendNotificationToFamily(userId, notification);

            console.log('📤 Đã gửi cảnh báo té ngã:', response);

            return response;
        } catch (error) {
            console.error('Lỗi gửi thông báo:', error);
            throw error;
        }
    }

    /**
     * Gửi thông báo trạng thái
     */
    async sendStatusNotification(userId, status, message) {
        try {
            const statusEmojis = {
                normal: '✅',
                running: '🏃',
                fallen: '⚠️'
            };

            const notification = {
                title: `${statusEmojis[status] || '📱'} Cập nhật trạng thái`,
                body: message,
                type: 'status_update',
                priority: status === 'fallen' ? 'high' : 'normal',
                data: {
                    userId,
                    status,
                    timestamp: new Date().toISOString()
                }
            };

            const response = await apiService.sendNotificationToFamily(userId, notification);

            return response;
        } catch (error) {
            console.error('Lỗi gửi thông báo trạng thái:', error);
            throw error;
        }
    }

    /**
     * Gửi thông báo vị trí
     */
    async sendLocationUpdate(userId, location) {
        try {
            const notification = {
                title: '📍 Cập nhật vị trí',
                body: `Vị trí mới: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`,
                type: 'location_update',
                priority: 'normal',
                data: {
                    userId,
                    location,
                    timestamp: new Date().toISOString()
                }
            };

            const response = await apiService.sendNotificationToFamily(userId, notification);

            return response;
        } catch (error) {
            console.error('Lỗi gửi thông báo vị trí:', error);
            throw error;
        }
    }

    /**
     * Thiết lập listener cho foreground notifications
     */
    _setupForegroundNotificationListener() {
        console.log('👂 Đang lắng nghe thông báo foreground...');

        // Trong thực tế, đây sẽ là listener từ Firebase Messaging
        // Giả lập nhận thông báo
        this.notificationListener = (notification) => {
            console.log('📬 Nhận thông báo:', notification);

            // Hiển thị local notification nếu app đang mở
            this._showLocalNotification(notification);
        };
    }

    /**
     * Hiển thị local notification
     */
    _showLocalNotification(notification) {
        // Trong thực tế sẽ dùng react-native-push-notification
        console.log('🔔 Hiển thị thông báo:', notification.title);

        // Có thể emit event để UI hiển thị
        if (this.onNotificationReceived) {
            this.onNotificationReceived(notification);
        }
    }

    /**
     * Đăng ký callback khi nhận thông báo
     */
    onNotification(callback) {
        this.onNotificationReceived = callback;

        // Return function để unregister
        return () => {
            this.onNotificationReceived = null;
        };
    }

    /**
     * Kiểm tra quyền notification
     */
    async checkPermission() {
        console.log('🔐 Kiểm tra quyền thông báo...');

        // Giả lập kiểm tra quyền
        await new Promise(resolve => setTimeout(resolve, 300));

        // Trong thực tế sẽ check với Firebase Messaging
        return {
            authorized: true,
            message: 'Đã cấp quyền thông báo'
        };
    }

    /**
     * Yêu cầu quyền notification
     */
    async requestPermission() {
        console.log('📝 Yêu cầu quyền thông báo...');

        // Giả lập yêu cầu quyền
        await new Promise(resolve => setTimeout(resolve, 500));

        // Trong thực tế sẽ dùng Firebase Messaging requestPermission
        return {
            granted: true,
            message: 'Người dùng đã cấp quyền'
        };
    }

    /**
     * Hủy đăng ký FCM token
     */
    async unregisterToken() {
        this.fcmToken = null;
        this.isInitialized = false;
        console.log('🔕 Đã hủy đăng ký FCM token');
    }
}

// Export singleton instance
const notificationService = new NotificationService();
export default notificationService;