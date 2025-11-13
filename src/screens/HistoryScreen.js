// History Screen - Lịch sử đo

import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIoT } from '../contexts/IoTContext';

const HistoryScreen = ({ navigation }) => {
    const {
        measurementHistory,
        fetchMeasurementHistory,
        loading
    } = useIoT();

    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        await fetchMeasurementHistory();
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadHistory();
        setRefreshing(false);
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'normal':
                return { text: 'Bình thường', color: '#4CAF50', emoji: '✅' };
            case 'running':
                return { text: 'Đang chạy', color: '#FF9800', emoji: '🏃' };
            case 'fallen':
                return { text: 'Té ngã', color: '#f44336', emoji: '⚠️' };
            default:
                return { text: 'Không rõ', color: '#9E9E9E', emoji: '❓' };
        }
    };

    const formatDateTime = (timestamp) => {
        const date = new Date(timestamp);
        return {
            date: date.toLocaleDateString('vi-VN'),
            time: date.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    };

    const renderItem = ({ item, index }) => {
        const statusInfo = getStatusInfo(item.status);
        const dateTime = formatDateTime(item.timestamp);

        return (
            <View style={[
                styles.historyItem,
                item.status === 'fallen' && styles.historyItemAlert
            ]}>
                <View style={styles.itemHeader}>
                    <View style={styles.itemStatus}>
                        <Text style={styles.itemEmoji}>{statusInfo.emoji}</Text>
                        <Text style={[styles.itemStatusText, { color: statusInfo.color }]}>
                            {statusInfo.text}
                        </Text>
                    </View>
                    <Text style={styles.itemNumber}>#{measurementHistory.length - index}</Text>
                </View>

                {item.heartRate && (
                    <View style={styles.itemDetail}>
                        <Text style={styles.itemLabel}>Nhịp tim:</Text>
                        <Text style={styles.itemValue}>{item.heartRate} BPM</Text>
                    </View>
                )}

                <View style={styles.itemFooter}>
                    <Text style={styles.itemDate}>📅 {dateTime.date}</Text>
                    <Text style={styles.itemTime}>🕐 {dateTime.time}</Text>
                </View>

                {item.fallData && (
                    <View style={styles.fallDataContainer}>
                        <Text style={styles.fallDataTitle}>Chi tiết sự cố:</Text>
                        <Text style={styles.fallDataText}>
                            Gia tốc: {item.fallData.acceleration || 'N/A'} m/s²
                        </Text>
                        <Text style={styles.fallDataText}>
                            Độ tin cậy: {((item.fallData.confidence || 0) * 100).toFixed(0)}%
                        </Text>
                    </View>
                )}
            </View>
        );
    };

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📊</Text>
            <Text style={styles.emptyText}>Chưa có dữ liệu lịch sử</Text>
            <Text style={styles.emptySubtext}>
                Lịch sử các lần đo và sự kiện sẽ hiển thị tại đây
            </Text>
        </View>
    );

    const renderHeader = () => (
        <View style={styles.statsContainer}>
            <View style={styles.statCard}>
                <Text style={styles.statValue}>{measurementHistory.length}</Text>
                <Text style={styles.statLabel}>Tổng số bản ghi</Text>
            </View>

            <View style={styles.statCard}>
                <Text style={styles.statValue}>
                    {measurementHistory.filter(m => m.status === 'fallen').length}
                </Text>
                <Text style={styles.statLabel}>Sự cố té ngã</Text>
            </View>

            <View style={styles.statCard}>
                <Text style={styles.statValue}>
                    {measurementHistory.filter(m => m.status === 'normal').length}
                </Text>
                <Text style={styles.statLabel}>Bình thường</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>← Quay lại</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Lịch sử đo</Text>
                <View style={{ width: 60 }} />
            </View>

            <FlatList
                data={measurementHistory}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
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
    listContent: {
        padding: 16
    },
    statsContainer: {
        flexDirection: 'row',
        marginBottom: 16
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 4,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2196F3',
        marginBottom: 4
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center'
    },
    historyItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2
    },
    historyItemAlert: {
        borderLeftWidth: 4,
        borderLeftColor: '#f44336',
        backgroundColor: '#ffebee'
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },
    itemStatus: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemEmoji: {
        fontSize: 24,
        marginRight: 8
    },
    itemStatusText: {
        fontSize: 16,
        fontWeight: '600'
    },
    itemNumber: {
        fontSize: 12,
        color: '#999',
        fontWeight: '600'
    },
    itemDetail: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        marginBottom: 8
    },
    itemLabel: {
        fontSize: 14,
        color: '#666'
    },
    itemValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600'
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0'
    },
    itemDate: {
        fontSize: 12,
        color: '#666'
    },
    itemTime: {
        fontSize: 12,
        color: '#666'
    },
    fallDataContainer: {
        marginTop: 12,
        padding: 12,
        backgroundColor: '#fff3e0',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ff9800'
    },
    fallDataTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#e65100',
        marginBottom: 6
    },
    fallDataText: {
        fontSize: 12,
        color: '#e65100',
        marginBottom: 2
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: 16
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '600',
        marginBottom: 8
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        paddingHorizontal: 40
    }
});

export default HistoryScreen;