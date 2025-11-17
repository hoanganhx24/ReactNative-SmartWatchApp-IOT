// components/CustomIcons.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const IconBluetooth = ({ size = 28, color = '#0ea5e9' }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: size * 0.8, color, fontWeight: 'bold' }}>B</Text>
  </View>
);

export const IconHeart = ({ size = 28, color = '#ef4444' }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: size * 0.9, color }}>Heart</Text>
  </View>
);

export const IconWater = ({ size = 28, color = '#0ea5e9' }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: size * 0.8, color }}>Water</Text>
  </View>
);

export const IconSteps = ({ size = 28, color = '#8b5cf6' }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: size * 0.8, color }}>Steps</Text>
  </View>
);

export const IconBattery = ({ size = 24, level = 85, charging = false }) => {
  const width = (level / 100) * (size * 0.6);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={[styles.battery, { width: size, height: size * 0.6, borderColor: level > 20 ? '#22c55e' : '#ef4444' }]}>
        <View style={[styles.batteryFill, { width, backgroundColor: level > 20 ? '#22c55e' : '#ef4444' }]} />
      </View>
      {charging && <Text style={{ marginLeft: 4, fontSize: 16, color: '#22c55e' }}>Lightning</Text>}
    </View>
  );
};

export const IconWifi = ({ size = 24, quality = 'excellent' }) => {
  const bars = quality === 'excellent' ? 3 : quality === 'good' ? 2 : 1;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: size }}>
      {[1, 2, 3].map(i => (
        <View key={i} style={{
          width: 4, height: i * (size / 4), backgroundColor: i <= bars ? '#22c55e' : '#94a3b8',
          marginHorizontal: 1, borderRadius: 2,
        }} />
      ))}
    </View>
  );
};

export const IconWarning = ({ size = 24, active = false }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: size * 0.9, color: active ? '#ef4444' : '#94a3b8' }}>Warning</Text>
  </View>
);

export const IconLocation = ({ size = 28, color = '#0ea5e9' }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: size * 0.8, color }}>Location</Text>
  </View>
);

export const IconPerson = ({ size = 28 }) => (
  <View style={[styles.avatar, { width: size, height: size }]}>
    <Text style={{ fontSize: size * 0.6, color: '#fff' }}>Person</Text>
  </View>
);

export const IconAdd = ({ size = 24, color = '#fff' }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: size, color }}>+</Text>
  </View>
);

export const IconSearch = ({ size = 24, color = '#64748b' }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: size * 0.8, color }}>Search</Text>
  </View>
);

export const IconCheck = ({ size = 20, color = '#fff' }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: size, color }}>Check</Text>
  </View>
);

export const IconClose = ({ size = 20, color = '#fff' }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: size, color }}>Close</Text>
  </View>
);

const styles = StyleSheet.create({
  battery: { borderWidth: 2, borderRadius: 4, overflow: 'hidden', justifyContent: 'center' },
  batteryFill: { height: '100%' },
  avatar: { backgroundColor: '#0ea5e9', borderRadius: 999, justifyContent: 'center', alignItems: 'center' },
});