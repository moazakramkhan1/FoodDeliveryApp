import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import supabase from '../supabaseClient';

const TrackingScreen = ({ route }) => {
    const { paymentMethod, totalAmount, restaurantId } = route.params;
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [riderLocation, setRiderLocation] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    });

    useEffect(() => {
        const fetchRestaurantDetails = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('restaurants')
                    .select('latitude, longitude')
                    .eq('id', restaurantId)
                    .single();

                if (error) {
                    throw new Error(error.message);
                }

                if (data) {
                    setRestaurant(data);
                    setRiderLocation({
                        latitude: data.latitude,
                        longitude: data.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421
                    });
                }
            } catch (err) {
                console.error('Error fetching restaurant:', err.message);
                Alert.alert('Error', 'Could not fetch restaurant details.');
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurantDetails();
    }, [restaurantId]);

    useEffect(() => {
        const interval = setInterval(() => {
            setRiderLocation((prevLocation) => ({
                ...prevLocation,
                latitude: prevLocation.latitude + 0.0001,
                longitude: prevLocation.longitude + 0.0001,
            }));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#E23744" />
                <Text style={styles.loadingText}>Loading Map...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Tracking Rider Location</Text>
            <Text style={styles.info}>Payment Method: {paymentMethod}</Text>
            <Text style={styles.info}>Total Amount: PKR {totalAmount}</Text>

            <MapView
                style={styles.map}
                region={riderLocation}
            >
                <Marker coordinate={riderLocation} title="Rider" />
                {restaurant && (
                    <Marker
                        coordinate={{
                            latitude: restaurant.latitude,
                            longitude: restaurant.longitude,
                        }}
                        pinColor="blue"
                        title="Restaurant"
                    />
                )}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#E23744',
        textAlign: 'center',
    },
    info: {
        fontSize: 18,
        color: '#333',
        marginBottom: 5,
        textAlign: 'center',
    },
    map: {
        flex: 1,
        marginTop: 10,
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

export default TrackingScreen;
