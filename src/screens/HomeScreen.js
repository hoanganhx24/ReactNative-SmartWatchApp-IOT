// HomeScreen.js - KHÔNG DÙNG EXPO, chỉ RN thuần + vector-icons
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Animated,
    TouchableOpacity,
    RefreshControl,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const sampleData = {
    spo2: 98,
    heartRate: 75,
    heartRateValid: true,
    fallDetected: false,
    severity: 'none',
    batteryLevel: 85,
    isCharging: false,
    signalQuality: 'excellent',
    deviceId: 'ESP32-001',
    step: 24,
};

const HomeScreen = ({ navigation }) => {
    const { user, logout } = useAuth();
    const [data, setData] = useState(sampleData);
    const [refreshing, setRefreshing] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, friction: 8, useNativeDriver: true }),
        ]).start();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setData({ ...sampleData, step: sampleData.step + Math.floor(Math.random() * 20) });
            setRefreshing(false);
        }, 1000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0ea5e9" />}
            >
                {/* Header */}
                <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    <View>
                        <Text style={styles.greeting}>Xin chào,</Text>
                        <Text style={styles.userName}>{user?.name || 'Người dùng'}</Text>
                    </View>
                    <TouchableOpacity onPress={logout}>
                        <Icon name="log-out-outline" size={28} color="#64748b" />
                    </TouchableOpacity>
                </Animated.View>

                {/* Main Card */}
                <Animated.View style={[styles.mainCard, { opacity: fadeAnim }]}>
                    {/* Header xanh đậm thay gradient */}
                    <View style={styles.headerBlue}>
                        <Icon name="bluetooth" size={24} color="#fff" />
                        <Text style={styles.deviceId}>{data.deviceId}</Text>
                        <View style={styles.statusDot} />
                        <Text style={styles.onlineText}>Đang kết nối</Text>
                    </View>

                    <View style={styles.vitalContainer}>
                        <View style={styles.vitalItem}>
                            <View style={styles.vitalIcon}>
                                <Icon name="water" size={28} color="#0ea5e9" />
                            </View>
                            <Text style={styles.vitalValue}>{data.spo2}<Text style={styles.unit}>%</Text></Text>
                            <Text style={styles.vitalLabel}>SpO2</Text>
                        </View>

                        <View style={styles.vitalItem}>
                            <View style={[styles.vitalIcon, { backgroundColor: data.heartRateValid ? '#fee2e2' : '#f1f5f9' }]}>
                                <Icon name="heart" size={28} color={data.heartRateValid ? '#ef4444' : '#94a3b8'} />
                            </View>
                            <Text style={styles.vitalValue}>{data.heartRate}<Text style={styles.unit}> bpm</Text></Text>
                            <Text style={styles.vitalLabel}>Nhịp tim</Text>
                        </View>

                        <View style={styles.vitalItem}>
                            <View style={styles.vitalIcon}>
                                <Icon name="walk" size={28} color="#8b5cf6" />
                            </View>
                            <Text style={styles.vitalValue}>{data.step}</Text>
                            <Text style={styles.vitalLabel}>Bước chân</Text>
                        </View>
                    </View>

                    <View style={styles.extraInfo}>
                        <View style={styles.infoRow}>
                            <Icon name={data.batteryLevel > 20 ? "battery-charging" : "battery-dead"} size={22} color={data.batteryLevel > 20 ? '#22c55e' : '#ef4444'} />
                            <Text style={styles.infoText}>{data.batteryLevel}% {data.isCharging && '(sạc)'}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Icon name="wifi" size={22} color="#22c55e" />
                            <Text style={styles.infoText}>Tín hiệu tốt</Text>
                        </View>
                    </View>

                    <View style={[styles.fallAlert, data.fallDetected && styles.fallActive]}>
                        <Icon name="warning" size={24} color={data.fallDetected ? '#ef4444' : '#94a3b8'} />
                        <Text style={[styles.fallText, data.fallDetected && { color: '#991b1b' }]}>
                            {data.fallDetected ? 'ĐÃ PHÁT HIỆN TÉ NGÃ!' : 'Chưa phát hiện té ngã'}
                        </Text>
                    </View>
                </Animated.View>

                {/* Menu */}
                <View style={styles.menuGrid}>
                    {[
                        { icon: 'bluetooth', label: 'Bluetooth', screen: 'Bluetooth' },
                        { icon: 'time-outline', label: 'Lịch sử', screen: 'History' },
                        { icon: 'location-outline', label: 'Vị trí', screen: 'Location' },
                        { icon: 'people-outline', label: 'Người thân', screen: 'Relations' },
                    ].map((item, i) => (
                        <TouchableOpacity
                            key={i}
                            style={styles.menuItem}
                            onPress={() => navigation.navigate(item.screen)}
                            activeOpacity={0.75}
                        >
                            <View style={styles.menuIconBg}>
                                <Icon name={item.icon} size={32} color="#0ea5e9" />
                            </View>
                            <Text style={styles.menuLabel}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ecfeff' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    greeting: { fontSize: 16, color: '#64748b' },
    userName: { fontSize: 26, fontWeight: '800', color: '#0c4a6e' },
    mainCard: { margin: 20, backgroundColor: '#fff', borderRadius: 24, overflow: 'hidden',
        shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 20 },
    headerBlue: { backgroundColor: '#0ea5e9', padding: 20, flexDirection: 'row', alignItems: 'center' },
    deviceId: { color: '#fff', fontWeight: '700', marginLeft: 12, fontSize: 17 },
    statusDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#22c55e', marginLeft: 12 },
    onlineText: { color: '#fff', marginLeft: 8, fontWeight: '600' },
    vitalContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 32 },
    vitalItem: { alignItems: 'center' },
    vitalIcon: { width: 62, height: 62, borderRadius: 31, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    vitalValue: { fontSize: 28, fontWeight: '800', color: '#1e293b' },
    unit: { fontSize: 15, color: '#64748b' },
    vitalLabel: { fontSize: 13, color: '#64748b', marginTop: 4 },
    extraInfo: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 16, backgroundColor: '#f8fafc' },
    infoRow: { flexDirection: 'row', alignItems: 'center' },
    infoText: { marginLeft: 10, fontWeight: '600', color: '#475569' },
    fallAlert: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, backgroundColor: '#fef3c7' },
    fallActive: { backgroundColor: '#fee2e2' },
    fallText: { marginLeft: 12, fontWeight: '700', color: '#92400e' },
    menuGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 20, justifyContent: 'space-between' },
    menuItem: { width: width / 2 - 30, alignItems: 'center', marginBottom: 24 },
    menuIconBg: { width: 82, height: 82, borderRadius: 24, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 12 },
    menuLabel: { marginTop: 12, fontSize: 14.5, fontWeight: '600', color: '#1e293b' },
});

export default HomeScreen;