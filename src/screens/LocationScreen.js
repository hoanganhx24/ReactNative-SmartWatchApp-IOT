// LocationScreen.js - Không react-native-maps
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const LocationScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Vị trí té ngã gần nhất</Text>

      {/* Hình tĩnh thay cho map */}
      <View style={styles.mapPlaceholder}>
        <Image
          source={{ uri: 'https://i.imgur.com/3cB9tZo.png' }} // ảnh map mẫu (hoặc để local asset)
          style={{ width: '100%', height: '100%', borderRadius: 20 }}
          resizeMode="cover"
        />
        <View style={styles.marker}>
          <Icon name="location" size={40} color="#ef4444" />
        </View>
        <View style={styles.pulse} />
      </View>

      <View style={styles.info}>
        <View style={styles.row}>
          <Icon name="time-outline" size={24} color="#64748b" />
          <Text style={styles.text}>17/11/2025 10:45</Text>
        </View>
        <View style={styles.row}>
          <Icon name="alert-circle" size={24} color="#f59e0b" />
          <Text style={styles.text}>Mức độ: Trung bình</Text>
        </View>
        <View style={styles.row}>
          <Icon name="location" size={24} color="#0ea5e9" />
          <Text style={styles.text}>10.762622, 106.660172</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>Mở Google Maps</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ecfeff', padding: 20 },
  title: { fontSize: 24, fontWeight: '800', color: '#0c4a6e', marginBottom: 20 },
  mapPlaceholder: { height: 340, backgroundColor: '#ddd', borderRadius: 20, overflow: 'hidden', position: 'relative', justifyContent: 'center', alignItems: 'center' },
  marker: { position: 'absolute', top: '45%' },
  pulse: { position: 'absolute', width: 40, height: 40, borderRadius: 20, backgroundColor: '#ef444430', top: '43%', left: '48%' },
  info: { backgroundColor: '#fff', padding: 20, borderRadius: 20, marginTop: 20,
    shadowColor: '#000', shadowOpacity: 0.1, elevation: 10 },
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  text: { marginLeft: 14, fontSize: 16, color: '#1e293b', fontWeight: '600' },
  btn: { backgroundColor: '#0ea5e9', padding: 18, borderRadius: 20, alignItems: 'center', marginTop: 20 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});

export default LocationScreen;