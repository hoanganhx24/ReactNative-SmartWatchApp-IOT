// Home Screen - Màn hình chính hiển thị dữ liệu realtime

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useIoT } from '../contexts/IoTContext';

const HomeScreen = ({ navigation }) => {
    const { user, logout } = useAuth();
    const {
        heartRate,
        status,
        location,
        isBluetoothConnected,
        connectedDevice,
        loading,
        refresh
    } = useIoT();

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refresh();
        setRefreshing(false);
    };

    const getStatusInfo = () => {
        switch (status) {
            case 'normal':
                return { text: 'Bình thường', color: '#4CAF50', emoji: '✅' };
            case 'running':
                return { text: 'Đang chạy', color: '#FF9800', emoji: '🏃' };
            case 'fallen':
                return { text: 'Té ngã!', color: '#f44336', emoji: '⚠️' };
            default:
                return { text: 'Không rõ', color: '#9E9E9E', emoji: '❓' };
        }
    };

    const statusInfo = getStatusInfo();

    const handleLogout = () => {
        Alert.alert(
            'Đăng xuất',
            'Bạn có chắc muốn đăng xuất?',
            [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Đăng xuất', onPress: logout, style: 'destructive' }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Xin chào,</Text>
                    <Text style={styles.userName}>{user?.name || user?.username}</Text>
                </View>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Đăng xuất</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Bluetooth Connection Status */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>🔗 Kết nối Bluetooth</Text>
                    </View>
                    {isBluetoothConnected ? (
                        <View style={styles.connectedInfo}>
                            <Text style={styles.connectedText}>✅ Đã kết nối</Text>
                            <Text style={styles.deviceName}>{connectedDevice?.name}</Text>
                        </View>
                    ) : (
                        <View>
                            <Text style={styles.disconnectedText}>⚠️ Chưa kết nối</Text>
                            <TouchableOpacity
                                style={styles.connectButton}
                                onPress={() => navigation.navigate('Bluetooth')}
                            >
                                <Text style={styles.connectButtonText}>Kết nối thiết bị</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Status Card */}
                <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: statusInfo.color }]}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Trạng thái hiện tại</Text>
                    </View>
                    <View style={styles.statusContainer}>
                        <Text style={styles.statusEmoji}>{statusInfo.emoji}</Text>
                        <Text style={[styles.statusText, { color: statusInfo.color }]}>
                            {statusInfo.text}
                        </Text>
                    </View>
                </View>

                {/* Heart Rate Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>❤️ Nhịp tim</Text>
                    </View>
                    <View style={styles.heartRateContainer}>
                        {heartRate ? (
                            <>
                                <Text style={styles.heartRateValue}>{heartRate}</Text>
                                <Text style={styles.heartRateUnit}>BPM</Text>
                            </>
                        ) : (
                            <Text style={styles.noDataText}>Chưa có dữ liệu</Text>
                        )}
                    </View>
                    <View style={styles.heartRateIndicator}>
                        {heartRate && (
                            <View style={styles.heartRateBar}>
                                <View
                                    style={[
                                        styles.heartRateFill,
                                        {
                                            width: `${Math.min((heartRate / 120) * 100, 100)}%`,
                                            backgroundColor:
                                                heartRate < 60 ? '#2196F3' :
                                                    heartRate < 100 ? '#4CAF50' :
                                                        '#FF9800'
                                        }
                                    ]}
                                />
                            </View>
                        )}
                    </View>
                </View>

                {/* Location Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>📍 Vị trí GPS</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Location')}>
                            <Text style={styles.viewMapText}>Xem bản đồ</Text>
                        </TouchableOpacity>
                    </View>
                    {location ? (
                        <View style={styles.locationInfo}>
                            <Text style={styles.locationText}>
                                Lat: {location.latitude?.toFixed(6)}
                            </Text>
                            <Text style={styles.locationText}>
                                Lng: {location.longitude?.toFixed(6)}
                            </Text>
                            <Text style={styles.locationTime}>
                                {location.timestamp ? new Date(location.timestamp).toLocaleTimeString('vi-VN') : ''}
                            </Text>
                        </View>
                    ) : (
                        <Text style={styles.noDataText}>Chưa có dữ liệu vị trí</Text>
                    )}
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('History')}
                    >
                        <Text style={styles.actionEmoji}>📊</Text>
                        <Text style={styles.actionText}>Lịch sử</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('Bluetooth')}
                    >
                        <Text style={styles.actionEmoji}>🔗</Text>
                        <Text style={styles.actionText}>Bluetooth</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('Location')}
                    >
                        <Text style={styles.actionEmoji}>🗺️</Text>
                        <Text style={styles.actionText}>Bản đồ</Text>
                    </TouchableOpacity>
                </View>

                {/* Emergency Alert for Family Members */}
                {user?.role === 'watcher' && (
                    <View style={styles.emergencyInfo}>
                        <Text style={styles.emergencyTitle}>
                            👨‍👩‍👧‍👦 Bạn đang theo dõi: Người deo A
                        </Text>
                        <Text style={styles.emergencyText}>
                            Bạn sẽ nhận thông báo ngay khi phát hiện té ngã
                        </Text>
                    </View>
                )}
            </ScrollView>
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
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0'
    },
    greeting: {
        fontSize: 14,
        color: '#666'
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333'
    },
    logoutButton: {
        padding: 8
    },
    logoutText: {
        color: '#f44336',
        fontSize: 14,
        fontWeight: '600'
    },
    content: {
        flex: 1,
        padding: 16
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333'
    },
    connectedInfo: {
        alignItems: 'center',
        paddingVertical: 8
    },
    connectedText: {
        fontSize: 16,
        color: '#4CAF50',
        fontWeight: '600',
        marginBottom: 4
    },
    deviceName: {
        fontSize: 14,
        color: '#666'
    },
    disconnectedText: {
        fontSize: 16,
        color: '#FF9800',
        textAlign: 'center',
        marginBottom: 12
    },
    connectButton: {
        backgroundColor: '#2196F3',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center'
    },
    connectButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600'
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12
    },
    statusEmoji: {
        fontSize: 48,
        marginRight: 12
    },
    statusText: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    heartRateContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'center',
        paddingVertical: 12
    },
    heartRateValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#f44336'
    },
    heartRateUnit: {
        fontSize: 16,
        color: '#666',
        marginLeft: 8
    },
    heartRateIndicator: {
        marginTop: 8
    },
    heartRateBar: {
        height: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        overflow: 'hidden'
    },
    heartRateFill: {
        height: '100%',
        borderRadius: 4
    },
    noDataText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        paddingVertical: 20
    },
    locationInfo: {
        paddingVertical: 8
    },
    locationText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4
    },
    locationTime: {
        fontSize: 12,
        color: '#999',
        marginTop: 4
    },
    viewMapText: {
        color: '#2196F3',
        fontSize: 14,
        fontWeight: '600'
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 16
    },
    actionButton: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginHorizontal: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    actionEmoji: {
        fontSize: 32,
        marginBottom: 8
    },
    actionText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600'
    },
    emergencyInfo: {
        backgroundColor: '#e3f2fd',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#2196F3'
    },
    emergencyTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1976D2',
        marginBottom: 8
    },
    emergencyText: {
        fontSize: 13,
        color: '#1976D2'
    }
});

export default HomeScreen;