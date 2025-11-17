// HistoryScreen.js - Không date-fns
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const records = [
  { id: '1', spo2: 98, hr: 76, time: '10:30', date: '17/11/2025' },
  { id: '2', spo2: 97, hr: 82, time: '09:15', date: '17/11/2025' },
  { id: '3', spo2: 99, hr: 70, time: '22:40', date: '16/11/2025' },
];

const HistoryScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Lịch sử đo</Text>
      <FlatList
        data={records}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.time}>{item.time}</Text>
            <View style={styles.row}>
              <Icon name="water" size={20} color="#0ea5e9" />
              <Text style={styles.text}>SpO2: {item.spo2}%</Text>
            </View>
            <View style={styles.row}>
              <Icon name="heart" size={20} color="#ef4444" />
              <Text style={styles.text}>{item.hr} bpm</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ padding: 20 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ecfeff' },
  title: { fontSize: 24, fontWeight: '800', color: '#0c4a6e', padding: 20 },
  card: { backgroundColor: '#fff', padding: 18, borderRadius: 18, marginBottom: 14,
    shadowColor: '#000', shadowOpacity: 0.08, elevation: 6 },
  time: { fontSize: 20, fontWeight: '700', color: '#0c4a6e', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  text: { marginLeft: 12, fontSize: 16, color: '#1e293b', fontWeight: '600' },
});

export default HistoryScreen;