// screens/PeopleScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconPerson, IconSearch, IconAdd, IconCheck, IconClose } from '../components/CustomIcons';
import { RippleButton } from '../components/RippleButton';

const mockUsers = [
  { id: '1', name: 'Nguyễn Văn A', username: 'nguoideoA', role: 'Người đeo', status: 'following' },
  { id: '2', name: 'Trần Thị B', username: 'nguoinhaB', role: 'Người nhà', status: 'follower' },
  { id: '3', name: 'Lê Văn C', username: 'nguoinhaC', role: 'Người nhà', status: 'pending' },
];

const PeopleScreen = () => {
  const [searchId, setSearchId] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const [relations, setRelations] = useState(mockUsers);
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const handleSearch = () => {
    const user = mockUsers.find(u => u.username.toLowerCase() === searchId.toLowerCase());
    setFoundUser(user || null);
  };

  const handleAccept = (id) => {
    setRelations(prev => prev.map(u => u.id === id ? { ...u, status: 'following' } : u));
  };

  const renderItem = ({ item }) => {
    const isPending = item.status === 'pending';
    return (
      <Animated.View style={[styles.card, { opacity: fade }]}>
        <View style={styles.userInfo}>
          <IconPerson size={56} />
          <View style={{ marginLeft: 14 }}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.username}>@{item.username}</Text>
            <Text style={styles.role}>{item.role}</Text>
          </View>
        </View>
        {isPending ? (
          <View style={{ flexDirection: 'row' }}>
            <RippleButton onPress={() => handleAccept(item.id)} style={styles.accept}>
              <IconCheck />
            </RippleButton>
            <RippleButton style={styles.reject}>
              <IconClose />
            </RippleButton>
          </View>
        ) : (
          <Text style={styles.status}>{item.status === 'following' ? 'Đang theo dõi' : 'Theo dõi bạn'}</Text>
        )}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Người thân & Theo dõi</Text>
      <View style={styles.searchBox}>
        <IconSearch />
        <TextInput style={styles.input} placeholder="Tìm bằng ID..." value={searchId} onChangeText={setSearchId} onSubmitEditing={handleSearch} />
        <RippleButton onPress={handleSearch} style={styles.searchBtn}>
          <Text style={styles.searchText}>Tìm</Text>
        </RippleButton>
      </View>

      {foundUser && foundUser.status === 'none' && (
        <View style={styles.foundCard}>
          <View style={styles.userInfo}>
            <IconPerson size={48} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.name}>{foundUser.name}</Text>
              <Text style={styles.username}>@{foundUser.username}</Text>
            </View>
          </View>
          <RippleButton style={styles.addBtn}>
            <IconAdd />
            <Text style={styles.addText}>Gửi lời mời</Text>
          </RippleButton>
        </View>
      )}

      <FlatList data={relations} renderItem={renderItem} keyExtractor={i => i.id} contentContainerStyle={{ padding: 20 }} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ecfeff' },
  title: { fontSize: 24, fontWeight: '800', color: '#0c4a6e', padding: 20, paddingBottom: 10 },
  searchBox: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 16, backgroundColor: '#fff', borderRadius: 20, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 6 },
  input: { flex: 1, paddingVertical: 16, paddingHorizontal: 12, fontSize: 16 },
  searchBtn: { backgroundColor: '#0ea5e9', paddingHorizontal: 20, paddingVertical: 16, borderRadius: 20 },
  searchText: { color: '#fff', fontWeight: '700' },
  card: { backgroundColor: '#fff', padding: 18, borderRadius: 20, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 6 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: 17, fontWeight: '700', color: '#1e293b' },
  username: { fontSize: 14, color: '#64748b' },
  role: { fontSize: 13, color: '#0ea5e9', fontWeight: '600', marginTop: 2 },
  status: { fontWeight: '600', color: '#22c55e' },
  accept: { backgroundColor: '#22c55e', padding: 10, borderRadius: 20, marginLeft: 8 },
  reject: { backgroundColor: '#ef4444', padding: 10, borderRadius: 20, marginLeft: 8 },
  foundCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginBottom: 16, backgroundColor: '#fff', padding: 18, borderRadius: 20,
    shadowColor: '#000', shadowOpacity: 0.1, elevation: 8 },
  addBtn: { flexDirection: 'row', backgroundColor: '#0ea5e9', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 20, alignItems: 'center' },
  addText: { color: '#fff', fontWeight: '700', marginLeft: 8 },
});

export default PeopleScreen;