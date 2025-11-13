// IoT Context - Quản lý dữ liệu realtime từ thiết bị IoT

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiService from '../services/api.service';
import bluetoothService from '../services/bluetooth.service';
import locationService from '../services/location.service';
import notificationService from '../services/notification.service';
import { useAuth } from './AuthContext';

const IoTContext = createContext();

export const useIoT = () => {
    const context = useContext(IoTContext);
    if (!context) {
        throw new Error('useIoT must be used within IoTProvider');
    }
    return context;
};

export const IoTProvider = ({ children }) => {
    const { user } = useAuth();

    // State cho Bluetooth
    const [isBluetoothConnected, setIsBluetoothConnected] = useState(false);
    const [connectedDevice, setConnectedDevice] = useState(null);
    const [availableDevices, setAvailableDevices] = useState([]);

    // State cho dữ liệu realtime
    const [heartRate, setHeartRate] = useState(null);
    const [status, setStatus] = useState('normal');
    const [location, setLocation] = useState(null);

    // State cho lịch sử
    const [measurementHistory, setMeasurementHistory] = useState([]);

    // State khác
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Kết nối realtime khi user đăng nhập
    useEffect(() => {
        if (user) {
            startRealtimeConnection();
            return () => stopRealtimeConnection();
        }
    }, [user]);

    // Lắng nghe dữ liệu từ Bluetooth
    useEffect(() => {
        const removeListener = bluetoothService.addListener((eventType, data) => {
            switch (eventType) {
                case 'connected':
                    setIsBluetoothConnected(true);
                    setConnectedDevice(data);
                    break;
                case 'disconnected':
                    setIsBluetoothConnected(false);
                    setConnectedDevice(null);
                    break;
                case 'heartRate':
                    setHeartRate(data.rate);
                    break;
                case 'status':
                    setStatus(data.status);
                    break;
                case 'fall':
                    handleFallDetected(data);
                    break;
                default:
                    break;
            }
        });

        return removeListener;
    }, []);

    // Kết nối realtime với server
    const startRealtimeConnection = useCallback(() => {
        if (!user) return;

        console.log('🔗 Bắt đầu kết nối realtime...');

        const unsubscribe = apiService.subscribeToRealtime(user.id, {
            onHeartRate: (data) => {
                setHeartRate(data.heartRate);
            },
            onStatusChange: (data) => {
                setStatus(data.status);
            },
            onFallDetected: (data) => {
                handleFallDetected(data);
            }
        });

        return unsubscribe;
    }, [user]);

    const stopRealtimeConnection = useCallback(() => {
        console.log('🔌 Ngắt kết nối realtime');
        // Unsubscribe sẽ được gọi qua cleanup function
    }, []);

    // Quét thiết bị Bluetooth
    const scanBluetoothDevices = async () => {
        try {
            setLoading(true);
            setError(null);

            const devices = await bluetoothService.scanDevices();
            setAvailableDevices(devices);

            return devices;
        } catch (err) {
            setError(err.message);
            console.error('Lỗi quét Bluetooth:', err);
            return [];
        } finally {
            setLoading(false);
        }
    };

    // Kết nối Bluetooth
    const connectBluetooth = async (deviceId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await bluetoothService.connect(deviceId);

            if (response.success) {
                console.log('✅ Đã kết nối Bluetooth');
                return true;
            }

            return false;
        } catch (err) {
            setError(err.message);
            console.error('Lỗi kết nối Bluetooth:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Ngắt kết nối Bluetooth
    const disconnectBluetooth = async () => {
        try {
            await bluetoothService.disconnect();
            console.log('✅ Đã ngắt kết nối Bluetooth');
        } catch (err) {
            console.error('Lỗi ngắt kết nối Bluetooth:', err);
        }
    };

    // Lấy vị trí hiện tại
    const getCurrentLocation = async () => {
        try {
            setLoading(true);
            setError(null);

            const currentLocation = await locationService.getCurrentLocation();
            setLocation(currentLocation);

            // Cập nhật lên server nếu có user
            if (user) {
                await apiService.updateLocation(
                    user.id,
                    currentLocation.latitude,
                    currentLocation.longitude
                );
            }

            return currentLocation;
        } catch (err) {
            setError(err.message);
            console.error('Lỗi lấy vị trí:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Bắt đầu theo dõi vị trí
    const startLocationTracking = async () => {
        try {
            await locationService.startTracking({
                userId: user?.id,
                onLocationUpdate: (newLocation) => {
                    setLocation(newLocation);
                }
            });

            console.log('✅ Đã bắt đầu theo dõi vị trí');
        } catch (err) {
            console.error('Lỗi bắt đầu theo dõi vị trí:', err);
        }
    };

    // Dừng theo dõi vị trí
    const stopLocationTracking = () => {
        locationService.stopTracking();
        console.log('🛑 Đã dừng theo dõi vị trí');
    };

    // Xử lý khi phát hiện té ngã
    const handleFallDetected = async (data) => {
        console.log('⚠️ Phát hiện té ngã!', data);

        try {
            // Cập nhật trạng thái
            setStatus('fallen');

            // Lấy vị trí hiện tại
            const currentLocation = await getCurrentLocation();

            // Gửi thông báo đến gia đình
            if (user) {
                await notificationService.sendFallAlert(user.id, currentLocation);

                // Ghi nhận sự cố té ngã lên server
                await apiService.detectFall(user.id, {
                    location: currentLocation,
                    timestamp: data.timestamp,
                    ...data
                });
            }
        } catch (err) {
            console.error('Lỗi xử lý sự cố té ngã:', err);
        }
    };

    // Lấy lịch sử đo
    const fetchMeasurementHistory = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!user) return;

            const response = await apiService.getMeasurementHistory(user.id);

            if (response.success) {
                setMeasurementHistory(response.data.history);
            }
        } catch (err) {
            setError(err.message);
            console.error('Lỗi lấy lịch sử:', err);
        } finally {
            setLoading(false);
        }
    };

    // Làm mới dữ liệu
    const refresh = async () => {
        if (!user) return;

        try {
            setLoading(true);

            // Lấy tất cả dữ liệu mới
            const [heartRateRes, statusRes, locationRes, historyRes] = await Promise.all([
                apiService.getHeartRate(user.id),
                apiService.getStatus(user.id),
                apiService.getLocation(user.id),
                apiService.getMeasurementHistory(user.id)
            ]);

            setHeartRate(heartRateRes.data.heartRate);
            setStatus(statusRes.data.status);
            setLocation(locationRes.data.location);
            setMeasurementHistory(historyRes.data.history);

            console.log('✅ Đã làm mới dữ liệu');
        } catch (err) {
            console.error('Lỗi làm mới dữ liệu:', err);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        // Bluetooth
        isBluetoothConnected,
        connectedDevice,
        availableDevices,
        scanBluetoothDevices,
        connectBluetooth,
        disconnectBluetooth,

        // Dữ liệu realtime
        heartRate,
        status,
        location,

        // Lịch sử
        measurementHistory,
        fetchMeasurementHistory,

        // Location tracking
        getCurrentLocation,
        startLocationTracking,
        stopLocationTracking,

        // Actions
        refresh,
        handleFallDetected,

        // State
        loading,
        error,
        clearError: () => setError(null)
    };

    return <IoTContext.Provider value={value}>{children}</IoTContext.Provider>;
};

export default IoTContext;