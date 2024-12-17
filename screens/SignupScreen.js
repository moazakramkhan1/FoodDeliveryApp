import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const SignUpScreen = ({ navigation }) => {
    const { signUp } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in both fields');
            return;
        }

        setLoading(true);

        try {
            await signUp(email, password);
            Alert.alert('Success', 'Sign-up successful!');
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#E23744" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Sign Up</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Signing up...' : 'Sign Up'}</Text>
            </TouchableOpacity>
            <Text style={styles.loginText}>
                Already have an account?{' '}
                <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
                    Login
                </Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: '700',
        color: '#E23744',
        textAlign: 'center',
        marginBottom: 40,
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 20,
        paddingLeft: 15,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
        elevation: 1,
        color: '#333',
    },
    button: {
        height: 50,
        backgroundColor: '#E23744',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        elevation: 2,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    loginText: {
        marginTop: 20,
        textAlign: 'center',
        color: '#555',
        fontSize: 14,
    },
    link: {
        color: '#E23744',
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        fontSize: 18,
        marginTop: 10,
        color: '#E23744',
    },
});

export default SignUpScreen;
