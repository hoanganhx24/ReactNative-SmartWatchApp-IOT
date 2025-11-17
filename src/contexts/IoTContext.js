// IoTContext.js - Context quản lý kết nối BLE và dữ liệu IoT

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

// UUID phải khớp với ESP32
const SERVICE_UUID = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E';
const CHARACTERISTIC_UUID = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E';

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
        spo2: null,
        heartRate: null,
        heartRateValid: false,
        fallDetected: false,
        severity: null,
        batteryLevel: null,
        isCharging: false,
        signalQuality: null,
        timestamp: null,
        deviceId: null,
        step: null,
    });

    // Loading states
    const [loading, setLoading] = useState(false);
    const [scanning, setScanning] = useState(false);

    // History data
    const [dataHistory, setDataHistory] = useState([]);

    // Debug logs
    const [debugLogs, setDebugLogs] = useState([]);

    // Buffer để ghép dữ liệu BLE bị chia nhỏ
    const [dataBuffer, setDataBuffer] = useState('');

    const addDebugLog = (message) => {
        const timestamp = new Date().toLocaleTimeString('vi-VN');
        const log = `[${timestamp}] ${message}`;
        console.log(log);
        setDebugLogs(prev => [log, ...prev].slice(0, 50));
    };

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
        addDebugLog('Bắt đầu quét thiết bị...');

        try {
            const state = await bleManager.state();
            addDebugLog(`Bluetooth state: ${state}`);

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
                    addDebugLog(`Lỗi quét: ${error.message}`);
                    setScanning(false);
                    return;
                }

                if (device && device.name) {
                    addDebugLog(`Tìm thấy: ${device.name} (${device.id})`);
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
                addDebugLog('Kết thúc quét thiết bị');
            }, 10000);
        } catch (error) {
            console.error('Scan error:', error);
            addDebugLog(`Lỗi: ${error.message}`);
            setScanning(false);
            Alert.alert('Lỗi', 'Không thể quét thiết bị Bluetooth');
        }
    };

    // ============================================
    // KẾT NỐI BLUETOOTH
    // ============================================
    const connectBluetooth = async (deviceId) => {
        setLoading(true);
        addDebugLog(`Đang kết nối đến: ${deviceId}`);

        try {
            // Dừng scan nếu đang chạy
            bleManager.stopDeviceScan();

            // Kết nối đến thiết bị
            const device = await bleManager.connectToDevice(deviceId, {
                timeout: 10000
            });
            addDebugLog('Đã kết nối thành công!');

            // YÊU CẦU MTU SIZE LỚN HƠN để nhận được JSON dài
            try {
                const mtu = await device.requestMTU(512);
                addDebugLog(`✓ MTU đã tăng lên: ${mtu} bytes`);
            } catch (mtuError) {
                addDebugLog(`⚠ Không thể tăng MTU: ${mtuError.message}`);
            }

            // Discover services và characteristics
            await device.discoverAllServicesAndCharacteristics();
            addDebugLog('Đã discover services');

            // Kiểm tra service và characteristic có tồn tại không
            try {
                const services = await device.services();
                addDebugLog(`Tìm thấy ${services.length} services`);

                services.forEach(service => {
                    addDebugLog(`Service: ${service.uuid}`);
                });

                // Kiểm tra service cụ thể
                const targetService = services.find(s => s.uuid.toLowerCase() === SERVICE_UUID.toLowerCase());
                if (targetService) {
                    addDebugLog('✓ Service target đã tìm thấy');

                    const characteristics = await targetService.characteristics();
                    addDebugLog(`Tìm thấy ${characteristics.length} characteristics`);

                    characteristics.forEach(char => {
                        addDebugLog(`Characteristic: ${char.uuid}, readable: ${char.isReadable}, writable: ${char.isWritableWithResponse || char.isWritableWithoutResponse}, notifiable: ${char.isNotifiable}`);
                    });
                } else {
                    addDebugLog('✗ Không tìm thấy service target');
                }
            } catch (err) {
                addDebugLog(`Lỗi khi kiểm tra services: ${err.message}`);
            }

            setConnectedDevice(device);
            setIsBluetoothConnected(true);

            // Bắt đầu monitor dữ liệu
            startMonitoringData(device);

            setLoading(false);
            return true;
        } catch (error) {
            console.error('Connection error:', error);
            addDebugLog(`Lỗi kết nối: ${error.message}`);
            setLoading(false);
            Alert.alert('Lỗi kết nối', 'Không thể kết nối đến thiết bị');
            return false;
        }
    };

    // ============================================
    // MONITOR DỮ LIỆU TỪ ESP32
    // ============================================
    const startMonitoringData = (device) => {
        addDebugLog('Bắt đầu monitor dữ liệu...');
        let buffer = ''; // Local buffer cho mỗi monitoring session

        device.monitorCharacteristicForService(
            SERVICE_UUID,
            CHARACTERISTIC_UUID,
            (error, characteristic) => {
                if (error) {
                    console.error('Monitor error:', error);
                    addDebugLog(`Lỗi monitor: ${error.message}`);
                    return;
                }

                if (characteristic?.value) {
                    try {
                        // Decode base64 value
                        const chunk = Buffer.from(characteristic.value, 'base64').toString('utf-8');
                        addDebugLog(`Nhận chunk (${chunk.length} bytes): ${chunk.substring(0, 50)}...`);

                        // Ghép vào buffer
                        buffer += chunk;

                        // Kiểm tra xem đã có JSON hoàn chỉnh chưa (kết thúc bằng '}'
                        if (buffer.includes('}')) {
                            // Tìm vị trí dấu '}' cuối cùng
                            const lastBraceIndex = buffer.lastIndexOf('}');
                            const completeJson = buffer.substring(0, lastBraceIndex + 1);

                            // Phần còn lại giữ lại cho lần sau
                            buffer = buffer.substring(lastBraceIndex + 1);

                            addDebugLog(`JSON hoàn chỉnh (${completeJson.length} bytes): ${completeJson}`);

                            try {
                                // Parse JSON
                                const data = JSON.parse(completeJson);
                                addDebugLog(`✓ Parse thành công: SpO2=${data.spo2}, HR=${data.heartRate}, Battery=${data.batteryLevel}%`);

                                // Cập nhật sensor data
                                setSensorData({
                                    spo2: data.spo2,
                                    heartRate: data.heartRate,
                                    heartRateValid: data.heartRateValid,
                                    fallDetected: data.fallDetected,
                                    severity: data.severity,
                                    batteryLevel: data.batteryLevel,
                                    isCharging: data.isCharging,
                                    signalQuality: data.signalQuality,
                                    timestamp: new Date().toLocaleTimeString('vi-VN'),
                                    deviceId: data.deviceId,
                                    step: data.step,
                                });

                                // Lưu vào history
                                setDataHistory(prev => [
                                    {
                                        ...data,
                                        receivedAt: new Date().toISOString(),
                                    },
                                    ...prev
                                ].slice(0, 100)); // Giữ 100 bản ghi gần nhất

                                // Reset buffer sau khi parse thành công
                                buffer = '';

                            } catch (parseError) {
                                addDebugLog(`✗ Lỗi parse JSON: ${parseError.message}`);
                                addDebugLog(`Dữ liệu lỗi: ${completeJson}`);
                                buffer = ''; // Reset buffer nếu parse lỗi
                            }
                        } else {
                            addDebugLog(`Đang chờ thêm dữ liệu... (buffer hiện tại: ${buffer.length} bytes)`);
                        }

                    } catch (e) {
                        console.error('Process error:', e);
                        addDebugLog(`✗ Lỗi xử lý: ${e.message}`);
                        buffer = ''; // Reset buffer khi có lỗi
                    }
                } else {
                    addDebugLog('Nhận characteristic nhưng không có value');
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
                    spo2: null,
                    heartRate: null,
                    heartRateValid: false,
                    fallDetected: false,
                    severity: null,
                    batteryLevel: null,
                    isCharging: false,
                    signalQuality: null,
                    timestamp: null,
                    deviceId: null,
                    step: null,
                });
                addDebugLog('Đã ngắt kết nối');
            } catch (error) {
                console.error('Disconnect error:', error);
                addDebugLog(`Lỗi ngắt kết nối: ${error.message}`);
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
            addDebugLog('Đang đọc dữ liệu...');
            const characteristic = await connectedDevice.readCharacteristicForService(
                SERVICE_UUID,
                CHARACTERISTIC_UUID
            );

            if (characteristic?.value) {
                const rawData = Buffer.from(characteristic.value, 'base64').toString('utf-8');
                addDebugLog(`Đọc được: ${rawData}`);
                const data = JSON.parse(rawData);
                return data;
            }
        } catch (error) {
            console.error('Read error:', error);
            addDebugLog(`Lỗi đọc: ${error.message}`);
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
        debugLogs,

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