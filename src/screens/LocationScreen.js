// Location Screen - Hiển thị vị trí trên bản đồ

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Linking,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIoT } from '../contexts/IoTContext';

const LocationScreen = ({ navigation }) => {
    const {
        location,
        getCurrentLocation,
        startLocationTracking,
        stopLocationTracking,
        loading
    } = useIoT();

    const [isTracking, setIsTracking] = useState(false);
    const [address, setAddress] = useState(null);

    useEffect(() => {
        // Lấy vị trí khi vào màn hình
        loadLocation();

        return () => {
            // Dừng tracking khi rời màn hình
            if (isTracking) {
                stopLocationTracking();
            }
        };
    }, []);

    const loadLocation = async () => {
        await getCurrentLocation();
    };

    const handleToggleTracking = async () => {
        if (isTracking) {
            stopLocationTracking();
            setIsTracking(false);
            Alert.alert('Đã dừng', 'Đã dừng theo dõi vị trí');
        } else {
            await startLocationTracking();
            setIsTracking(true);
            Alert.alert('Đã bắt đầu', 'Đang theo dõi vị trí liên tục');
        }
    };

    const handleOpenMaps = () => {
        if (!location) {
            Alert.alert('Lỗi', 'Chưa có dữ liệu vị trí');
            return;
        }

        const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
        Linking.openURL(url);
    };

    const formatCoordinate = (value, type) => {
        if (!value) return 'N/A';
        const direction = type === 'lat'
            ? (value >= 0 ? 'N' : 'S')
            : (value >= 0 ? 'E' : 'W');
        return `${Math.abs(value).toFixed(6)}° ${direction}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>← Quay lại</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Vị trí GPS</Text>
                <View style={{ width: 60 }} />
            </View>

            <View style={styles.content}>
                {/* Map Placeholder */}
                <View style={styles.mapContainer}>
                    <View style={styles.mapPlaceholder}>
                        <Text style={styles.mapIcon}>🗺️</Text>
                        <Text style={styles.mapText}>Bản đồ</Text>
                        {location && (
                            <Text style={styles.coordinatesText}>
                                {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                            </Text>
                        )}
                    </View>

                    {location && (
                        <TouchableOpacity
                            style={styles.openMapsButton}
                            onPress={handleOpenMaps}
                        >
                            <Text style={styles.openMapsText}>📍 Mở trong Google Maps</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Location Info */}
                {location ? (
                    <View style={styles.locationCard}>
                        <Text style={styles.cardTitle}>📍 Tọa độ hiện tại</Text>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Vĩ độ:</Text>
                            <Text style={styles.infoValue}>
                                {formatCoordinate(location.latitude, 'lat')}
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Kinh độ:</Text>
                            <Text style={styles.infoValue}>
                                {formatCoordinate(location.longitude, 'lng')}
                            </Text>
                        </View>

                        {location.accuracy && (
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Độ chính xác:</Text>
                                <Text style={styles.infoValue}>±{location.accuracy.toFixed(0)}m</Text>
                            </View>
                        )}

                        {location.timestamp && (
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Cập nhật:</Text>
                                <Text style={styles.infoValue}>
                                    {new Date(location.timestamp).toLocaleString('vi-VN')}
                                </Text>
                            </View>
                        )}

                        <View style={styles.addressContainer}>
                            <Text style={styles.addressLabel}>Địa chỉ:</Text>
                            <Text style={styles.addressText}>
                                {address || 'Hà Nội, Việt Nam'}
                            </Text>
                        </View>
                    </View>
                ) : (
                    <View style={styles.noLocationCard}>
                        <Text style={styles.noLocationText}>
                            Chưa có dữ liệu vị trí
                        </Text>
                        <TouchableOpacity
                            style={styles.getLocationButton}
                            onPress={loadLocation}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.getLocationButtonText}>
                                    Lấy vị trí hiện tại
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}

                {/* Tracking Control */}
                <View style={styles.trackingCard}>
                    <View style={styles.trackingHeader}>
                        <Text style={styles.cardTitle}>🔄 Theo dõi liên tục</Text>
                        <View style={[
                            styles.trackingStatus,
                            { backgroundColor: isTracking ? '#4CAF50' : '#9E9E9E' }
                        ]}>
                            <Text style={styles.trackingStatusText}>
                                {isTracking ? 'Đang bật' : 'Đã tắt'}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.trackingDescription}>
                        Bật để tự động cập nhật vị trí liên tục mỗi 5 giây
                    </Text>

                    <TouchableOpacity
                        style={[
                            styles.trackingButton,
                            { backgroundColor: isTracking ? '#f44336' : '#2196F3' }
                        ]}
                        onPress={handleToggleTracking}
                    >
                        <Text style={styles.trackingButtonText}>
                            {isTracking ? '🛑 Dừng theo dõi' : '▶️ Bắt đầu theo dõi'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Info */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoCardTitle}>💡 Thông tin</Text>
                    <Text style={styles.infoCardText}>
                        • Vị trí được cập nhật tự động khi có thay đổi
                    </Text>
                    <Text style={styles.infoCardText}>
                        • Gia đình có thể xem vị trí của bạn trên ứng dụng
                    </Text>
                    <Text style={styles.infoCardText}>
                        • Khi phát hiện té ngã, vị trí sẽ được gửi kèm thông báo
                    </Text>
                </View>
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
    content: {
        flex: 1,
        padding: 16
    },
    mapContainer: {
        marginBottom: 16
    },
    mapPlaceholder: {
        backgroundColor: '#e0e0e0',
        borderRadius: 12,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12
    },
    mapIcon: {
        fontSize: 48,
        marginBottom: 8
    },
    mapText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '600'
    },
    coordinatesText: {
        fontSize: 12,
        color: '#999',
        marginTop: 4
    },
    openMapsButton: {
        backgroundColor: '#4285F4',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center'
    },
    openMapsText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600'
    },
    locationCard: {
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
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    infoLabel: {
        fontSize: 14,
        color: '#666'
    },
    infoValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600'
    },
    addressContainer: {
        marginTop: 12,
        padding: 12,
        backgroundColor: '#f9f9f9',
        borderRadius: 8
    },
    addressLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4
    },
    addressText: {
        fontSize: 14,
        color: '#333'
    },
    noLocationCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    noLocationText: {
        fontSize: 16,
        color: '#999',
        marginBottom: 16
    },
    getLocationButton: {
        backgroundColor: '#2196F3',
        borderRadius: 8,
        paddingHorizontal: 24,
        paddingVertical: 12,
        minWidth: 150,
        alignItems: 'center'
    },
    getLocationButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600'
    },
    trackingCard: {
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
    trackingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
    },
    trackingStatus: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12
    },
    trackingStatusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600'
    },
    trackingDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16
    },
    trackingButton: {
        borderRadius: 8,
        padding: 14,
        alignItems: 'center'
    },
    trackingButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600'
    },
    infoCard: {
        backgroundColor: '#e3f2fd',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#2196F3'
    },
    infoCardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1976D2',
        marginBottom: 8
    },
    infoCardText: {
        fontSize: 13,
        color: '#1976D2',
        marginBottom: 4
    }
});

export default LocationScreen;