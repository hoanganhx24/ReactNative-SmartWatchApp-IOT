// Bluetooth Service - Quản lý kết nối Bluetooth với thiết bị IoT

import apiService from './api.service';

class BluetoothService {
    constructor() {
        this.isConnected = false;
        this.connectedDevice = null;
        this.listeners = [];
    }

    /**
     * Quét tìm thiết bị Bluetooth
     */
    async scanDevices() {
        console.log('🔍 Đang quét thiết bị Bluetooth...');

        // Giả lập danh sách thiết bị
        await new Promise(resolve => setTimeout(resolve, 2000));

        const devices = [
            {
                id: 'device_001',
                name: 'IoT Fall Detector A',
                rssi: -45,
                isConnectable: true
            },
            {
                id: 'device_002',
                name: 'IoT Fall Detector B',
                rssi: -67,
                isConnectable: true
            },
            {
                id: 'device_003',
                name: 'Unknown Device',
                rssi: -85,
                isConnectable: false
            }
        ];

        return devices;
    }

    /**
     * Kết nối với thiết bị
     */
    async connect(deviceId) {
        try {
            console.log(`🔗 Đang kết nối với thiết bị: ${deviceId}`);

            const response = await apiService.connectBluetooth(deviceId);

            if (response.success) {
                this.isConnected = true;
                this.connectedDevice = {
                    id: deviceId,
                    name: response.data.deviceName,
                    connectedAt: new Date().toISOString()
                };

                this._notifyListeners('connected', this.connectedDevice);

                // Bắt đầu lắng nghe dữ liệu từ thiết bị
                this._startListeningToDevice();
            }

            return response;
        } catch (error) {
            console.error('Lỗi kết nối Bluetooth:', error);
            throw error;
        }
    }

    /**
     * Ngắt kết nối
     */
    async disconnect() {
        if (!this.isConnected || !this.connectedDevice) {
            return;
        }

        try {
            console.log('🔌 Đang ngắt kết nối...');

            await apiService.disconnectBluetooth(this.connectedDevice.id);

            this._stopListeningToDevice();

            this.isConnected = false;
            const disconnectedDevice = this.connectedDevice;
            this.connectedDevice = null;

            this._notifyListeners('disconnected', disconnectedDevice);

            console.log('✅ Đã ngắt kết nối');
        } catch (error) {
            console.error('Lỗi ngắt kết nối:', error);
            throw error;
        }
    }

    /**
     * Lắng nghe dữ liệu từ thiết bị
     */
    _startListeningToDevice() {
        if (!this.connectedDevice) return;

        console.log('👂 Bắt đầu lắng nghe dữ liệu từ thiết bị...');

        // Giả lập nhận dữ liệu từ thiết bị mỗi 2 giây
        this.dataInterval = setInterval(() => {
            // Giả lập dữ liệu nhịp tim
            const heartRate = 60 + Math.floor(Math.random() * 40);
            this._notifyListeners('heartRate', { rate: heartRate });

            // Giả lập dữ liệu trạng thái
            const statuses = ['normal', 'normal', 'normal', 'running'];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            this._notifyListeners('status', { status: randomStatus });

            // Giả lập phát hiện té ngã (1% chance)
            if (Math.random() < 0.01) {
                this._notifyListeners('fall', {
                    detected: true,
                    timestamp: new Date().toISOString(),
                    severity: 'high'
                });
            }
        }, 2000);
    }

    /**
     * Dừng lắng nghe dữ liệu
     */
    _stopListeningToDevice() {
        if (this.dataInterval) {
            clearInterval(this.dataInterval);
            this.dataInterval = null;
        }
    }

    /**
     * Đăng ký listener để nhận sự kiện
     */
    addListener(callback) {
        this.listeners.push(callback);

        // Return function để remove listener
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    /**
     * Thông báo đến tất cả listeners
     */
    _notifyListeners(eventType, data) {
        this.listeners.forEach(callback => {
            try {
                callback(eventType, data);
            } catch (error) {
                console.error('Error in Bluetooth listener:', error);
            }
        });
    }

    /**
     * Kiểm tra trạng thái kết nối
     */
    getConnectionStatus() {
        return {
            isConnected: this.isConnected,
            device: this.connectedDevice
        };
    }

    /**
     * Gửi lệnh đến thiết bị
     */
    async sendCommand(command, params = {}) {
        if (!this.isConnected) {
            throw new Error('Chưa kết nối với thiết bị');
        }

        console.log('📤 Gửi lệnh đến thiết bị:', command, params);

        // Giả lập gửi lệnh
        await new Promise(resolve => setTimeout(resolve, 300));

        return {
            success: true,
            command,
            params,
            response: 'OK'
        };
    }
}

// Export singleton instance
const bluetoothService = new BluetoothService();
export default bluetoothService;