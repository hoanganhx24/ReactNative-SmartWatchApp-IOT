// IoTContext.js - Context quản lý kết nối BLE và dữ liệu IoT

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

// UUID phải khớp với ESP32
const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

const IoTContext = createContext();

export const useIoT = () => {
    const context = useContext(IoTContext);
    if (!context) {
        throw new Error('useIoT must be used within IoTProvider');
    }
    return context;
};

export const IoTProvider = ({ children }) => {
    // BLE Manager
    const [bleManager] = useState(() => new BleManager());

    // Connection states
    const [isBluetoothConnected, setIsBluetoothConnected] = useState(false);
    const [connectedDevice, setConnectedDevice] = useState(null);
    const [availableDevices, setAvailableDevices] = useState([]);

    // Sensor data
    const [sensorData, setSensorData] = useState({
        temperature: null,
        humidity: null,
        light: null,
        sensor: null,
        status: false,
        timestamp: null,
    });

    // Loading states
    const [loading, setLoading] = useState(false);
    const [scanning, setScanning] = useState(false);

    // History data
    const [dataHistory, setDataHistory] = useState([]);

    useEffect(() => {
        // Yêu cầu quyền khi khởi động
        requestBluetoothPermissions();

        // Cleanup khi unmount
        return () => {
            if (connectedDevice) {
                disconnectBluetooth();
            }
            bleManager.destroy();
        };
    }, []);

    // ============================================
    // YÊU CẦU QUYỀN BLUETOOTH
    // ============================================
    const requestBluetoothPermissions = async () => {
        if (Platform.OS === 'android') {
            if (Platform.Version >= 31) {
                // Android 12+
                try {
                    const granted = await PermissionsAndroid.requestMultiple([
                        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    ]);

                    const allGranted = Object.values(granted).every(
                        status => status === PermissionsAndroid.RESULTS.GRANTED
                    );

                    if (!allGranted) {
                        Alert.alert(
                            'Cần cấp quyền',
                            'Ứng dụng cần quyền Bluetooth và Location để hoạt động'
                        );
                        return false;
                    }
                    return true;
                } catch (err) {
                    console.error('Permission error:', err);
                    return false;
                }
            } else {
                // Android 11 trở xuống
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                    );

                    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                        Alert.alert(
                            'Cần cấp quyền',
                            'Ứng dụng cần quyền Location để quét Bluetooth'
                        );
                        return false;
                    }
                    return true;
                } catch (err) {
                    console.error('Permission error:', err);
                    return false;
                }
            }
        }
        return true;
    };

    // ============================================
    // QUÉT THIẾT BỊ BLE
    // ============================================
    const scanBluetoothDevices = async () => {
        const hasPermission = await requestBluetoothPermissions();
        if (!hasPermission) return;

        setScanning(true);
        setAvailableDevices([]);

        try {
            const state = await bleManager.state();
            if (state !== 'PoweredOn') {
                Alert.alert(
                    'Bluetooth tắt',
                    'Vui lòng bật Bluetooth để tiếp tục'
                );
                setScanning(false);
                return;
            }

            // Quét thiết bị trong 10 giây
            bleManager.startDeviceScan(null, null, (error, device) => {
                if (error) {
                    console.error('Scan error:', error);
                    setScanning(false);
                    return;
                }

                if (device && device.name) {
                    setAvailableDevices(prevDevices => {
                        // Kiểm tra device đã tồn tại chưa
                        const exists = prevDevices.find(d => d.id === device.id);
                        if (!exists) {
                            return [...prevDevices, {
                                id: device.id,
                                name: device.name,
                                rssi: device.rssi,
                                isConnectable: device.isConnectable || true,
                            }];
                        }
                        return prevDevices;
                    });
                }
            });

            // Dừng scan sau 10 giây
            setTimeout(() => {
                bleManager.stopDeviceScan();
                setScanning(false);
            }, 10000);
        } catch (error) {
            console.error('Scan error:', error);
            setScanning(false);
            Alert.alert('Lỗi', 'Không thể quét thiết bị Bluetooth');
        }
    };

    // ============================================
    // KẾT NỐI BLUETOOTH
    // ============================================
    const connectBluetooth = async (deviceId) => {
        setLoading(true);

        try {
            // Dừng scan nếu đang chạy
            bleManager.stopDeviceScan();

            console.log('Connecting to device:', deviceId);

            // Kết nối đến thiết bị
            const device = await bleManager.connectToDevice(deviceId);
            console.log('Connected successfully');

            // Discover services và characteristics
            await device.discoverAllServicesAndCharacteristics();
            console.log('Services discovered');

            setConnectedDevice(device);
            setIsBluetoothConnected(true);

            // Bắt đầu monitor dữ liệu
            startMonitoringData(device);

            setLoading(false);
            return true;
        } catch (error) {
            console.error('Connection error:', error);
            setLoading(false);
            Alert.alert('Lỗi kết nối', 'Không thể kết nối đến thiết bị');
            return false;
        }
    };

    // ============================================
    // MONITOR DỮ LIỆU TỪ ESP32
    // ============================================
    const startMonitoringData = (device) => {
        device.monitorCharacteristicForService(
            SERVICE_UUID,
            CHARACTERISTIC_UUID,
            (error, characteristic) => {
                if (error) {
                    console.error('Monitor error:', error);
                    return;
                }

                if (characteristic?.value) {
                    try {
                        // Decode base64 value
                        const rawData = Buffer.from(characteristic.value, 'base64').toString('utf-8');
                        console.log('Received data:', rawData);

                        // Parse JSON
                        const data = JSON.parse(rawData);

                        // Cập nhật sensor data
                        setSensorData({
                            temperature: data.temperature,
                            humidity: data.humidity,
                            light: data.light,
                            sensor: data.sensor,
                            status: data.status,
                            timestamp: new Date().toLocaleTimeString('vi-VN'),
                        });

                        // Lưu vào history
                        setDataHistory(prev => [
                            {
                                ...data,
                                receivedAt: new Date().toISOString(),
                            },
                            ...prev
                        ].slice(0, 100)); // Giữ 100 bản ghi gần nhất

                    } catch (e) {
                        console.error('Parse error:', e);
                    }
                }
            }
        );
    };

    // ============================================
    // NGẮT KẾT NỐI
    // ============================================
    const disconnectBluetooth = async () => {
        if (connectedDevice) {
            try {
                await connectedDevice.cancelConnection();
                setConnectedDevice(null);
                setIsBluetoothConnected(false);
                setSensorData({
                    temperature: null,
                    humidity: null,
                    light: null,
                    sensor: null,
                    status: false,
                    timestamp: null,
                });
                console.log('Disconnected successfully');
            } catch (error) {
                console.error('Disconnect error:', error);
            }
        }
    };

    // ============================================
    // ĐỌC DỮ LIỆU NGAY LẬP TỨC
    // ============================================
    const readSensorData = async () => {
        if (!connectedDevice) {
            Alert.alert('Lỗi', 'Chưa kết nối đến thiết bị');
            return null;
        }

        try {
            const characteristic = await connectedDevice.readCharacteristicForService(
                SERVICE_UUID,
                CHARACTERISTIC_UUID
            );

            if (characteristic?.value) {
                const rawData = Buffer.from(characteristic.value, 'base64').toString('utf-8');
                const data = JSON.parse(rawData);
                return data;
            }
        } catch (error) {
            console.error('Read error:', error);
            Alert.alert('Lỗi', 'Không thể đọc dữ liệu từ thiết bị');
            return null;
        }
    };

    const value = {
        // States
        isBluetoothConnected,
        connectedDevice,
        availableDevices,
        sensorData,
        loading,
        scanning,
        dataHistory,

        // Functions
        scanBluetoothDevices,
        connectBluetooth,
        disconnectBluetooth,
        readSensorData,
    };

    return (
        <IoTContext.Provider value={value}>
            {children}
        </IoTContext.Provider>
    );
};

export default IoTContext;