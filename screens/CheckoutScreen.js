import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CheckoutScreen = ({ route, navigation }) => {
    const { cart, totalAmount, restaurantId } = route.params;
    const gst = totalAmount * 0.17;
    const totalWithGST = totalAmount + gst;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Order Summary</Text>
            {cart.map((item) => (
                <View key={item.id} style={styles.cartItem}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                    <Text style={styles.itemPrice}>PKR {item.price * item.quantity}</Text>
                </View>
            ))}

            <Text style={styles.gstText}>GST (17%): PKR {gst.toFixed(2)}</Text>
            <Text style={styles.totalText}>Total Amount: PKR {totalWithGST.toFixed(2)}</Text>

            <TouchableOpacity
                style={styles.payButton}
                onPress={() => navigation.navigate('payment', { totalAmount, restaurantId })}
            >
                <Text style={styles.payButtonText}>Proceed to Payment</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemQuantity: {
        fontSize: 16,
        color: '#666',
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    gstText: {
        fontSize: 16,
        marginVertical: 10,
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    payButton: {
        backgroundColor: '#E23744',
        padding: 12,
        borderRadius: 5,
    },
    payButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default CheckoutScreen;