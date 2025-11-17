// BluetoothScreen.js - Không dùng Expo
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const devices = [
  { id: '1', name: 'ESP32-001', mac: '24:6F:28:AB:CD:EF', battery: 85, online: true },
  { id: '2', name: 'ESP32-002', mac: '24:6F:28:12:34:56', battery: 42, online: false },
];

const BluetoothScreen = () => {
  const [scanning, setScanning] = useState(false);
  const rotateAnim = new Animated.Value(0);

  const startScan = () => {
    setScanning(true);
    Animated.loop(Animated.timing(rotateAnim, { toValue: 1, duration: 1500, useNativeDriver: true })).start();
    setTimeout(() => {
      setScanning(false);
      rotateAnim.setValue(0);
      Alert.alert('Hoàn tất', 'Đã quét xong thiết bị');
    }, 3000);
  };

  const spin = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const renderItem = ({ item }) => (
    <View style={styles.deviceCard}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon name="bluetooth" size={28} color="#0ea5e9" />
        <View style={{ marginLeft: 14 }}>
          <Text style={styles.deviceName}>{item.name}</Text>
          <Text style={styles.mac}>{item.mac}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon name={item.battery > 20 ? "battery-charging" : "battery-dead"} size={22} color={item.battery > 20 ? '#22c55e' : '#ef4444'} />
        <Text style={{ marginLeft: 6, fontWeight: '600' }}>{item.battery}%</Text>
        <View style={[styles.dot, { backgroundColor: item.online ? '#22c55e' : '#94a3b8' }]} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Thiết bị Bluetooth</Text>
        <TouchableOpacity onPress={startScan} disabled={scanning}>
          <Animated.View style={{ transform: [{ rotate: scanning ? spin : '0deg' }] }}>
            <Icon name={scanning ? "sync" : "scan"} size={30} color="#0ea5e9" />
          </Animated.View>
        </TouchableOpacity>
      </View>

      <View style={styles.connected}>
        <Icon name="checkmark-circle" size={28} color="#22c55e" />
        <Text style={styles.connectedText}>Đã kết nối: ESP32-001</Text>
      </View>

      <FlatList
        data={devices}
        renderItem={renderItem}
        keyExtractor={i => i.id}
        contentContainerStyle={{ padding: 20 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ecfeff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: '800', color: '#0c4a6e' },
  connected: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, backgroundColor: '#ecfdf5', padding: 16, borderRadius: 16 },
  connectedText: { marginLeft: 12, fontWeight: '600', color: '#166534' },
  deviceCard: { backgroundColor: '#fff', padding: 18, borderRadius: 18, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 8 },
  deviceName: { fontSize: 16, fontWeight: '700' },
  mac: { fontSize: 12, color: '#64748b', marginTop: 2 },
  dot: { width: 12, height: 12, borderRadius: 6, marginLeft: 12 },
});

export default BluetoothScreen;