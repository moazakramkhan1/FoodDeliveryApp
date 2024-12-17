import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';

const PaymentScreen = ({ route, navigation }) => {
    const { totalAmount, restaurantId } = route.params;
    const [paymentMethod, setPaymentMethod] = useState(null);
    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    const fetchPaymentIntent = async () => {
        try {
            
            const response = await fetch('http://192.168.1.13:3000/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: totalAmount * 100 }), 
            });

            const { paymentIntent } = await response.json();
            return paymentIntent;
        } catch (error) {
            console.error('Error fetching PaymentIntent:', error);
            Alert.alert('Error', 'Unable to fetch payment intent.');
        }
    };

    const handleDebitCard = async () => {
        try {
            const clientSecret = await fetchPaymentIntent();
            if (!clientSecret) return;

            
            const { error } = await initPaymentSheet({
                paymentIntentClientSecret: clientSecret,
                merchantDisplayName: 'Your Business Name',
                returnURL: 'myapp://stripe-redirect',
            });

            if (error) {
                console.error('PaymentSheet init error:', error);
                return;
            }

           
            const { error: paymentError } = await presentPaymentSheet();

            if (paymentError) {
                Alert.alert('Payment Failed', paymentError.message);
            } else {
                setPaymentMethod('Debit Card');
                showSuccessMessage('Stripe Debit Card');
            }
        } catch (error) {
            console.error('Error handling payment:', error);
        }
    };

    const showSuccessMessage = (method) => {
        Alert.alert(
            'Payment Successful',
            `Your payment via ${method} has been confirmed.`,
            [
                {
                    text: 'OK',
                    onPress: () =>
                        navigation.navigate('TrackingScreen', { paymentMethod: method, totalAmount, restaurantId }),
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Select Payment Method</Text>

            <TouchableOpacity style={styles.paymentOption} onPress={() => showSuccessMessage('Cash on Delivery')}>
                <Text style={styles.paymentText}>Cash on Delivery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.paymentOption} onPress={handleDebitCard}>
                <Text style={styles.paymentText}>Debit Card (Stripe)</Text>
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
