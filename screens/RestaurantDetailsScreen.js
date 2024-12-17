import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import supabase from '../supabaseClient';

const RestaurantDetailsScreen = ({ route, navigation }) => {
    const { restaurantId } = route.params;
    const [restaurant, setRestaurant] = useState(null);
    const [menu, setMenu] = useState([]);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const fetchRestaurantDetails = async () => {
            const { data, error } = await supabase
                .from('restaurants')
                .select('*')
                .eq('id', restaurantId)
                .single();

            if (error) {
                Alert.alert('Error', 'Could not fetch restaurant details');
                return;
            }
            setRestaurant(data);
        };

        const fetchMenuItems = async () => {
            const { data, error } = await supabase
                .from('menu')
                .select('*')
                .eq('restaurant_id', restaurantId);

            if (error) {
                Alert.alert('Error', 'Could not fetch menu items');
                return;
            }
            setMenu(data);
        };

        fetchRestaurantDetails();
        fetchMenuItems();
    }, [restaurantId]);

    const addToCart = (item) => {
        setCart((prevCart) => {
            const itemExists = prevCart.find((cartItem) => cartItem.id === item.id);
            if (itemExists) {
                return prevCart.map((cartItem) =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            } else {
                return [...prevCart, { ...item, quantity: 1 }];
            }
        });
    };

    const increaseQuantity = (id) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const decreaseQuantity = (id) => {
        setCart((prevCart) =>
            prevCart
                .map((item) =>
                    item.id === id ? { ...item, quantity: item.quantity - 1 } : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    if (!restaurant) {
        return (
            <View style={styles.loaderContainer}>
                <Text style={styles.loaderText}>Loading...</Text>
            </View>
        );
    }

    const renderMenuItem = ({ item }) => (
        <View style={styles.menuItem}>
            <Image source={{ uri: item.image_url }} style={styles.menuImage} />
            <View style={styles.menuDetails}>
                <Text style={styles.menuName}>{item.name}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
                <Text style={styles.menuPrice}>PKR {item.price}</Text>
            </View>
            <TouchableOpacity
                onPress={() => addToCart(item)}
                style={styles.addButton}
            >
                <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
        </View>
    );

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <View style={styles.container}>
            <ScrollView>
                <Image source={{ uri: restaurant.image_url }} style={styles.image} />
                <Text style={styles.title}>{restaurant.name}</Text>
                <Text style={styles.address}>{restaurant.location}</Text>
                <Text style={styles.menuHeader}>Menu</Text>
                <FlatList
                    data={menu}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderMenuItem}
                    style={styles.menuList}
                />
                {cart.length > 0 && (
                    <View style={styles.cartContainer}>
                        <Text style={styles.cartHeader}>Your Cart</Text>
                        {cart.map((item) => (
                            <View key={item.id} style={styles.cartItem}>
                                <Text style={styles.cartItemName}>{item.name}</Text>
                                <View style={styles.cartActions}>
                                    <TouchableOpacity
                                        onPress={() => decreaseQuantity(item.id)}
                                        style={styles.cartButton}
                                    >
                                        <Text style={styles.cartButtonText}>-</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.cartQuantity}>{item.quantity}</Text>
                                    <TouchableOpacity
                                        onPress={() => increaseQuantity(item.id)}
                                        style={styles.cartButton}
                                    >
                                        <Text style={styles.cartButtonText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.cartPrice}>PKR {item.price * item.quantity}</Text>
                            </View>
                        ))}
                        <Text style={styles.totalAmount}>Total: PKR {totalAmount}</Text>
                        <TouchableOpacity
                            style={styles.checkoutButton}
                            onPress={() =>
                                navigation.navigate('Checkout', { cart, totalAmount, restaurantId })
                            }
                        >
                            <Text style={styles.checkoutButtonText}>Checkout</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderText: {
        fontSize: 18,
    },
    image: {
        width: '100%',
        height: 200,
        marginBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        paddingHorizontal: 20,
    },
    address: {
        fontSize: 16,
        color: '#666',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    menuHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    menuImage: {
        width: 80,
        height: 80,
        marginRight: 10,
        borderRadius: 5,
    },
    menuDetails: {
        flex: 1,
    },
    menuName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    menuDescription: {
        color: '#666',
        fontSize: 12,
        marginVertical: 4,
    },
    menuPrice: {
        color: '#E23744',
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#E23744',
        padding: 10,
        borderRadius: 5,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cartContainer: {
        padding: 20,
    },
    cartHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    cartActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cartButton: {
        backgroundColor: '#ddd',
        borderRadius: 5,
        padding: 5,
        marginHorizontal: 5,
    },
    cartButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    cartQuantity: {
        fontSize: 16,
    },
    cartPrice: {
        fontWeight: 'bold',
        color: '#E23744',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'right',
        marginVertical: 10,
    },
    checkoutButton: {
        backgroundColor: '#E23744',
        padding: 12,
        borderRadius: 5,
    },
    checkoutButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default RestaurantDetailsScreen;