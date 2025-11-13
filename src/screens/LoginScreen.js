// Login Screen

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';

const LoginScreen = ({ navigation }) => {
    const { login, loading, error } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
            return;
        }

        const result = await login(username, password);

        if (!result.success) {
            Alert.alert('Đăng nhập thất bại', result.error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>IoT Fall Detection</Text>
                    <Text style={styles.subtitle}>Hệ thống phát hiện té ngã</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tên đăng nhập</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập tên đăng nhập"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Mật khẩu</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </View>

                    {error && (
                        <Text style={styles.errorText}>{error}</Text>
                    )}

                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.loginButtonText}>Đăng nhập</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text style={styles.registerButtonText}>
                            Chưa có tài khoản? Đăng ký ngay
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.demoInfo}>
                    <Text style={styles.demoTitle}>Tài khoản demo:</Text>
                    <Text style={styles.demoText}>• Người deo A: nguoideoA / 123456</Text>
                    <Text style={styles.demoText}>• Người nhà B: nguoinhaB / 123456</Text>
                    <Text style={styles.demoText}>• Người nhà C: nguoinhaC / 123456</Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center'
    },
    header: {
        alignItems: 'center',
        marginBottom: 40
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2196F3',
        marginBottom: 8
    },
    subtitle: {
        fontSize: 16,
        color: '#666'
    },
    form: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    inputGroup: {
        marginBottom: 20
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9'
    },
    errorText: {
        color: '#f44336',
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center'
    },
    loginButton: {
        backgroundColor: '#2196F3',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 10
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    },
    registerButton: {
        marginTop: 16,
        alignItems: 'center'
    },
    registerButtonText: {
        color: '#2196F3',
        fontSize: 14
    },
    demoInfo: {
        marginTop: 30,
        padding: 16,
        backgroundColor: '#fff3cd',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ffc107'
    },
    demoTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#856404',
        marginBottom: 8
    },
    demoText: {
        fontSize: 13,
        color: '#856404',
        marginBottom: 4
    }
});

export default LoginScreen;