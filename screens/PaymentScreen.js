import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const PaymentScreen = ({ route, navigation }) => {
    const { totalAmount, restaurantId } = route.params;
    const [paymentMethod, setPaymentMethod] = useState(null);

    const handleCOD = () => {
        setPaymentMethod('Cash on Delivery');
        showSuccessMessage('Cash on Delivery');
    };

    const handleJazzCash = () => {
        Alert.prompt(
            'JazzCash Payment',
            'Enter your JazzCash number:',
            (input) => {
                if (input && input.trim() !== '') {
                    setPaymentMethod('JazzCash');
                    showSuccessMessage('JazzCash');
                } else {
                    Alert.alert('Error', 'Invalid JazzCash number');
                }
            },
            'plain-text',
            '',
            'number-pad'
        );
    };
    const handleDebitCard = () => {
        Alert.prompt(
            'Debit Card Payment',
            'Enter your Debit Card number:',
            (input) => {
                if (input && input.trim().length === 16) {
                    setPaymentMethod('Debit Card');
                    showSuccessMessage('Debit Card');
                } else {
                    Alert.alert('Error', 'Invalid Debit Card number. It must be 16 digits.');
                }
            },
            'plain-text',
            '',
            'number-pad'
        );
    };

    const showSuccessMessage = (method) => {
        Alert.alert(
            'Payment Successful',
            `Your payment via ${method} has been confirmed.`,
            [
                {
                    text: 'OK',
                    onPress: () => navigation.navigate('TrackingScreen', { paymentMethod: method, totalAmount, restaurantId }),
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Select Payment Method</Text>

            <TouchableOpacity style={styles.paymentOption} onPress={handleCOD}>
                <Text style={styles.paymentText}>Cash on Delivery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.paymentOption} onPress={handleJazzCash}>
                <Text style={styles.paymentText}>JazzCash</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.paymentOption} onPress={handleDebitCard}>
                <Text style={styles.paymentText}>Debit Card</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#E23744',
    },
    paymentOption: {
        backgroundColor: '#f8f8f8',
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    paymentText: {
        fontSize: 18,
        color: '#333',
    },
});

export default PaymentScreen;
