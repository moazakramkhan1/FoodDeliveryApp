import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import RestaurantDetailsScreen from '../screens/RestaurantDetailsScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import TrackingScreen from '../screens/TrackingScreen';
import PaymentScreen from '../screens/PaymentScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Details" component={RestaurantDetailsScreen} />
                <Stack.Screen name="Checkout" component={CheckoutScreen} />
                <Stack.Screen name="payment" component={PaymentScreen} />
                <Stack.Screen name="TrackingScreen" component={TrackingScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
