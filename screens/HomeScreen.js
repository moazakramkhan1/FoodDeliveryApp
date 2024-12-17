import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import supabase from '../supabaseClient';
import { AntDesign } from '@expo/vector-icons';
import * as Location from 'expo-location';

const HomeScreen = ({ navigation }) => {
    const { user, signOut } = useContext(AuthContext);
    const [restaurants, setRestaurants] = useState([]);
    const [favorites, setFavorites] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState('');

    useEffect(() => {
        if (user) {
            requestLocationPermission();
        }
    }, [user]);

    const requestLocationPermission = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status === 'granted') {
            getCurrentLocation();
        } else {
            Alert.alert(
                'Location Permission Needed',
                'We need access to your location to provide a better experience.',
                [
                    {
                        text: 'Allow',
                        onPress: async () => {
                            const { status } = await Location.requestForegroundPermissionsAsync();
                            if (status === 'granted') {
                                getCurrentLocation();
                            } else {
                                Alert.alert('Permission Denied', 'We need location access to proceed.');
                            }
                        },
                    },
                    {
                        text: 'Deny',
                        onPress: () => {
                            Alert.alert('Permission Denied', 'We need location access to proceed.');
                        },
                        style: 'cancel',
                    },
                ]
            );
        }
    };

    const getCurrentLocation = async () => {
        try {
            const { coords } = await Location.getCurrentPositionAsync({});
            setLocation(coords);
            console.log('Current location:', coords);
            await getAddressFromCoordinates(coords.latitude, coords.longitude);
        } catch (error) {
            console.error('Error getting location:', error);
            Alert.alert('Error', 'Unable to fetch location.');
        }
    };

    const getAddressFromCoordinates = async (latitude, longitude) => {
        try {
            const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (geocode.length > 0) {
                const { city, country } = geocode[0];
                setAddress(`${city}, ${country}`);
            }
        } catch (error) {
            console.error('Error getting address:', error);
        }
    };


    useEffect(() => {
        fetchRestaurants();
        fetchFavorites();
    }, []);

    const fetchRestaurants = async () => {
        const { data, error } = await supabase.from('restaurants').select('*');

        if (error) {
            console.error('Error fetching restaurants:', error.message);
            return;
        }
        setRestaurants(data);
    };

    const fetchFavorites = async () => {
        const { data, error } = await supabase
            .from('favorites')
            .select('restaurant_id')
            .eq('user_id', user.id);

        if (error) {
            console.error('Error fetching favorites:', error.message);
            return;
        }

        const favoriteIds = new Set(data.map((item) => item.restaurant_id));
        setFavorites(favoriteIds);
        console.log('Favorites:', favoriteIds);
    };

    const toggleFavorite = async (restaurantId) => {
        const isFavorited = favorites.has(restaurantId);

        if (isFavorited) {
            const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('user_id', user.id)
                .eq('restaurant_id', restaurantId);

            if (error) {
                console.error('Error removing favorite:', error.message);
                return;
            }
        } else {
            const { error } = await supabase.from('favorites').insert([
                {
                    user_id: user.id,
                    restaurant_id: restaurantId,
                },
            ]);

            if (error) {
                console.error('Error adding favorite:', error.message);
                return;
            }
        }

        setFavorites((prevFavorites) => {
            const updatedFavorites = new Set(prevFavorites);
            if (isFavorited) {
                updatedFavorites.delete(restaurantId);
            } else {
                updatedFavorites.add(restaurantId);
            }
            return updatedFavorites;
        });
    };

    const handleRestaurantPress = (restaurantId) => {
        navigation.navigate('Details', { restaurantId });
    };

    const signingOut = async () => {
        try {
            setLoading(true);
            await signOut();
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error) {
            console.error('Error signing out:', error.message);
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
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Welcome To Zomato</Text>
                {location ? (
                    <Text style={styles.locationText}>Location: {address || 'fetching address'}</Text>
                ) : (
                    <Text style={styles.locationText}>Fetching location...</Text>
                )}
                <TouchableOpacity onPress={signingOut} style={styles.signOutButton}>
                    <Text style={styles.signOutButtonText}>{loading ? 'Signing out...' : 'Sign Out'}</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={restaurants}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <TouchableOpacity
                            onPress={() => toggleFavorite(item.id)}
                            style={styles.heartIcon}
                        >
                            <AntDesign
                                name={favorites.has(item.id) ? 'heart' : 'hearto'}
                                size={24}
                                color={favorites.has(item.id) ? '#E23744' : '#aaa'}
                            />
                        </TouchableOpacity>
                        {item.image_url && (
                            <Image source={{ uri: item.image_url }} style={styles.restaurantImage} />
                        )}
                        <TouchableOpacity
                            onPress={() => handleRestaurantPress(item.id)}
                            style={styles.cardContent}
                        >
                            <Text style={styles.restaurantName}>{item.name}</Text>
                            <Text style={styles.restaurantLocation}>{item.location || 'No location available'}</Text>
                            <Text style={styles.restaurantRating}>
                                ⭐ {item.rating ? item.rating.toFixed(1) : 'N/A'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 20,
        backgroundColor: '#E23744',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 5,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    locationText: {
        paddingTop: 5,
        fontSize: 15,
        fontWeight: 'bold',
        color: '#fff',
    },
    signOutButton: {
        position: 'absolute',
        right: 20,
        bottom: 10,
        backgroundColor: '#fff',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        elevation: 3,
    },
    signOutButtonText: {
        color: '#E23744',
        fontWeight: 'bold',
        fontSize: 14,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 10,
        elevation: 3,
        position: 'relative',
    },
    restaurantImage: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
    },
    heartIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
    },
    cardContent: {
        padding: 10,
    },
    restaurantName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    restaurantLocation: {
        fontSize: 14,
        color: '#666',
    },
    restaurantRating: {
        fontSize: 14,
        color: '#E23744',
        fontWeight: 'bold',
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

export default HomeScreen;
