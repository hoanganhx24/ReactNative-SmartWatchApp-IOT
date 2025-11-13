// Bluetooth Screen - Quét và kết nối thiết bị Bluetooth

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIoT } from '../contexts/IoTContext';

const BluetoothScreen = ({ navigation }) => {
    const {
        availableDevices,
        isBluetoothConnected,
        connectedDevice,
        scanBluetoothDevices,
        connectBluetooth,
        disconnectBluetooth,
        loading
    } = useIoT();

    const [scanning, setScanning] = useState(false);

    useEffect(() => {
        // Tự động quét khi vào màn hình
        handleScan();
    }, []);

    const handleScan = async () => {
        setScanning(true);
        await scanBluetoothDevices();
        setScanning(false);
    };

    const handleConnect = async (device) => {
        Alert.alert(
            'Kết nối thiết bị',
            `Bạn muốn kết nối với ${device.name}?`,
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Kết nối',
                    onPress: async () => {
                        const success = await connectBluetooth(device.id);
                        if (success) {
                            Alert.alert('Thành công', 'Đã kết nối với thiết bị!');
                            navigation.goBack();
                        } else {
                            Alert.alert('Lỗi', 'Không thể kết nối với thiết bị');
                        }
                    }
                }
            ]
        );
    };

    const handleDisconnect = () => {
        Alert.alert(
            'Ngắt kết nối',
            'Bạn có chắc muốn ngắt kết nối?',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Ngắt kết nối',
                    onPress: async () => {
                        await disconnectBluetooth();
                        Alert.alert('Đã ngắt kết nối', 'Thiết bị đã được ngắt kết nối');
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    const renderDevice = ({ item }) => {
        const isConnected = isBluetoothConnected && connectedDevice?.id === item.id;

        return (
            <TouchableOpacity
                style={[
                    styles.deviceItem,
                    isConnected && styles.deviceItemConnected
                ]}
                onPress={() => handleConnect(item)}
                disabled={!item.isConnectable || isConnected}
            >
                <View style={styles.deviceInfo}>
                    <Text style={styles.deviceName}>{item.name}</Text>
                    <Text style={styles.deviceId}>{item.id}</Text>
                    <View style={styles.deviceDetails}>
                        <View style={styles.rssiContainer}>
                            <Text style={styles.rssiText}>
                                Tín hiệu: {item.rssi} dBm
                            </Text>
                            <View style={[
                                styles.rssiIndicator,
                                {
                                    backgroundColor:
                                        item.rssi > -60 ? '#4CAF50' :
                                            item.rssi > -75 ? '#FF9800' :
                                                '#f44336'
                                }
                            ]} />
                        </View>
                    </View>
                </View>

                {isConnected ? (
                    <View style={styles.connectedBadge}>
                        <Text style={styles.connectedText}>✓ Đã kết nối</Text>
                    </View>
                ) : item.isConnectable ? (
                    <Text style={styles.connectText}>Kết nối →</Text>
                ) : (
                    <Text style={styles.unavailableText}>Không khả dụng</Text>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>← Quay lại</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Thiết bị Bluetooth</Text>
                <View style={{ width: 60 }} />
            </View>

            {isBluetoothConnected && (
                <View style={styles.currentConnection}>
                    <View style={styles.currentConnectionHeader}>
                        <Text style={styles.currentConnectionTitle}>
                            ✅ Thiết bị hiện tại
                        </Text>
                        <TouchableOpacity onPress={handleDisconnect}>
                            <Text style={styles.disconnectButton}>Ngắt kết nối</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.currentDeviceName}>{connectedDevice?.name}</Text>
                    <Text style={styles.currentDeviceId}>{connectedDevice?.id}</Text>
                </View>
            )}

            <View style={styles.scanSection}>
                <TouchableOpacity
                    style={styles.scanButton}
                    onPress={handleScan}
                    disabled={scanning || loading}
                >
                    {scanning ? (
                        <>
                            <ActivityIndicator color="#fff" size="small" />
                            <Text style={styles.scanButtonText}>  Đang quét...</Text>
                        </>
                    ) : (
                        <Text style={styles.scanButtonText}>🔍 Quét thiết bị</Text>
                    )}
                </TouchableOpacity>
            </View>

            {availableDevices.length > 0 ? (
                <FlatList
                    data={availableDevices}
                    renderItem={renderDevice}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.deviceList}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                        {scanning ? 'Đang tìm kiếm thiết bị...' : 'Chưa tìm thấy thiết bị nào'}
                    </Text>
                    <Text style={styles.emptySubtext}>
                        Nhấn nút "Quét thiết bị" để tìm kiếm
                    </Text>
                </View>
            )}

            <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>💡 Lưu ý:</Text>
                <Text style={styles.infoText}>
                    • Bật Bluetooth trên thiết bị của bạn
                </Text>
                <Text style={styles.infoText}>
                    • Đảm bảo thiết bị IoT đang bật và ở chế độ kết nối
                </Text>
                <Text style={styles.infoText}>
                    • Thiết bị nên ở gần điện thoại để kết nối tốt nhất
                </Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0'
    },
    backButton: {
        fontSize: 16,
        color: '#2196F3',
        fontWeight: '600'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333'
    },
    currentConnection: {
        backgroundColor: '#e8f5e9',
        padding: 16,
        margin: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#4CAF50'
    },
    currentConnectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
    },
    currentConnectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2e7d32'
    },
    disconnectButton: {
        color: '#f44336',
        fontSize: 14,
        fontWeight: '600'
    },
    currentDeviceName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1b5e20',
        marginBottom: 4
    },
    currentDeviceId: {
        fontSize: 12,
        color: '#558b2f'
    },
    scanSection: {
        padding: 16
    },
    scanButton: {
        backgroundColor: '#2196F3',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4
    },
    scanButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    },
    deviceList: {
        padding: 16,
        paddingTop: 0
    },
    deviceItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2
    },
    deviceItemConnected: {
        borderWidth: 2,
        borderColor: '#4CAF50',
        backgroundColor: '#f1f8f4'
    },
    deviceInfo: {
        flex: 1
    },
    deviceName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4
    },
    deviceId: {
        fontSize: 12,
        color: '#999',
        marginBottom: 8
    },
    deviceDetails: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    rssiContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    rssiText: {
        fontSize: 12,
        color: '#666',
        marginRight: 8
    },
    rssiIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4
    },
    connectedBadge: {
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6
    },
    connectedText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600'
    },
    connectText: {
        color: '#2196F3',
        fontSize: 14,
        fontWeight: '600'
    },
    unavailableText: {
        color: '#999',
        fontSize: 12
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 8
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center'
    },
    infoSection: {
        backgroundColor: '#fff3cd',
        padding: 16,
        margin: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ffc107'
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#856404',
        marginBottom: 8
    },
    infoText: {
        fontSize: 13,
        color: '#856404',
        marginBottom: 4
    }
});

export default BluetoothScreen;