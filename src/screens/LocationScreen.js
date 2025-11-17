// LocationScreen.js - Sửa lỗi map và Google Maps
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const LocationScreen = ({ navigation }) => {
  // Dữ liệu mẫu - sau này có thể lấy từ context
  const fallLocation = {
    latitude: 10.762622,
    longitude: 106.660172,
    timestamp: '17/11/2025 10:45',
    severity: 'Trung bình'
  };

  const openGoogleMaps = async () => {
    const { latitude, longitude } = fallLocation;

    // URL khác nhau cho iOS và Android
    const scheme = Platform.select({
      ios: `maps:0,0?q=${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}`
    });

    const url = Platform.select({
      ios: `http://maps.apple.com/?ll=${latitude},${longitude}&q=Vị trí té ngã`,
      android: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    });

    try {
      const supported = await Linking.canOpenURL(scheme);

      if (supported) {
        await Linking.openURL(scheme);
      } else {
        // Fallback to browser
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error('Error opening maps:', error);
      Alert.alert(
          'Lỗi',
          'Không thể mở ứng dụng bản đồ. Vui lòng kiểm tra lại.',
          [{ text: 'OK' }]
      );
    }
  };

  return (
      <SafeAreaView style={styles.container}>
        {/* Header với nút back */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={28} color="#0c4a6e" />
          </TouchableOpacity>
          <Text style={styles.title}>Vị trí té ngã</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Map visualization - Dùng View thay vì Image */}
        <View style={styles.mapPlaceholder}>
          {/* Background gradient */}
          <View style={styles.mapBackground}>
            {/* Grid pattern */}
            <View style={styles.gridLine} />
            <View style={[styles.gridLine, { top: '25%' }]} />
            <View style={[styles.gridLine, { top: '50%' }]} />
            <View style={[styles.gridLine, { top: '75%' }]} />
            <View style={[styles.gridLine, { width: 1, height: '100%', left: '25%' }]} />
            <View style={[styles.gridLine, { width: 1, height: '100%', left: '50%' }]} />
            <View style={[styles.gridLine, { width: 1, height: '100%', left: '75%' }]} />
          </View>

          {/* Pulse animation circles */}
          <View style={[styles.pulse, styles.pulseOuter]} />
          <View style={[styles.pulse, styles.pulseMid]} />
          <View style={styles.pulse} />

          {/* Location marker */}
          <View style={styles.markerContainer}>
            <View style={styles.markerShadow} />
            <Icon name="location" size={50} color="#ef4444" />
          </View>

          {/* Coordinates label */}
          <View style={styles.coordLabel}>
            <Icon name="navigate" size={14} color="#0ea5e9" />
            <Text style={styles.coordText}>
              {fallLocation.latitude.toFixed(4)}°, {fallLocation.longitude.toFixed(4)}°
            </Text>
          </View>
        </View>

        {/* Thông tin chi tiết */}
        <View style={styles.info}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoTitle}>Thông tin té ngã gần nhất</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>MỚI</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.iconContainer}>
              <Icon name="time-outline" size={22} color="#0ea5e9" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.label}>Thời gian</Text>
              <Text style={styles.value}>{fallLocation.timestamp}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.iconContainer}>
              <Icon name="alert-circle" size={22} color="#f59e0b" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.label}>Mức độ</Text>
              <Text style={styles.value}>{fallLocation.severity}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.iconContainer}>
              <Icon name="location" size={22} color="#22c55e" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.label}>Tọa độ GPS</Text>
              <Text style={styles.value}>
                {fallLocation.latitude.toFixed(6)}, {fallLocation.longitude.toFixed(6)}
              </Text>
            </View>
          </View>
        </View>

        {/* Nút mở Google Maps */}
        <TouchableOpacity
            style={styles.btn}
            onPress={openGoogleMaps}
            activeOpacity={0.8}
        >
          <Icon name="map" size={22} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.btnText}>Xem trên Bản đồ</Text>
        </TouchableOpacity>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecfeff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0c4a6e'
  },
  mapPlaceholder: {
    height: 300,
    backgroundColor: '#bae6fd',
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8
  },
  mapBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#e0f2fe'
  },
  gridLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: '#cbd5e1',
    opacity: 0.3
  },
  pulse: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    zIndex: 1
  },
  pulseMid: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(239, 68, 68, 0.15)'
  },
  pulseOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(239, 68, 68, 0.1)'
  },
  markerContainer: {
    zIndex: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  markerShadow: {
    position: 'absolute',
    bottom: -10,
    width: 30,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    zIndex: 2
  },
  coordLabel: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  coordText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '700',
    color: '#0c4a6e'
  },
  info: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 8
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0c4a6e'
  },
  badge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    backgroundColor: '#f8fafc',
    padding: 14,
    borderRadius: 12
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  textContainer: {
    flex: 1
  },
  label: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 2
  },
  value: {
    fontSize: 15,
    color: '#0f172a',
    fontWeight: '700'
  },
  btn: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#0ea5e9',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 8
  },
  btnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700'
  },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    padding: 14,
    marginHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0ea5e9'
  },
  noteText: {
    marginLeft: 10,
    fontSize: 13,
    color: '#0c4a6e',
    flex: 1,
    lineHeight: 18
  }
});

export default LocationScreen;