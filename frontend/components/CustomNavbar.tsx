import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { PawfectColors } from "../themes/PawfectColors";
import Svg, { Text as SvgText } from 'react-native-svg';

export default function CustomNavbar({navigation, route}: NativeStackHeaderProps){
    let title = '';
    let showBack = false;

    const handleLogout = () => {
        navigation.reset({
            index: 0,
            routes: [{name: 'Auth' as never}]
        })
    }

    switch (route.name){
        case 'ServiceList':
            title = 'Service Catalog';
            showBack = false;
            break;
        case 'ServiceDetail':
            title = 'Service Details';
            showBack = false;
            break;
        case 'BookingForm':
            title = 'Booking Form';
            showBack = true;
            break;
        case 'MyBookings':
            title = 'My Bookings';
            showBack = true;
            break;
    }

    return (
        <View style={styles.container}>
            <View style={styles.navbar}>
                <View style={styles.leftSection}>
                    {showBack ? (
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButtonShow}>
                            <Ionicons name="arrow-back" size={24} color={PawfectColors.primary} />
                        </TouchableOpacity>
                    ): (
                        <View style={styles.iconButton}/>
                    )}
                    <Text style={styles.title}>{title}</Text>
                </View>


                <View style={styles.centerSection}>
                    <Image
                        style={styles.logoImage}
                        source={require('../assets/PawfectLogo.png')}
                        // resizeMode="contain"
                    />
                    <Svg height="45" width="200" viewBox="0 0 200 45">
                        <SvgText
                            fill={PawfectColors.secondary}
                            stroke={PawfectColors.primary}
                            strokeWidth="1.5"
                            fontSize="24"
                            fontWeight="bold"
                            x="92"
                            y="38"
                            textAnchor="middle"
                            letterSpacing="0.5"
                            fontFamily="sans-serif"
                        >
                            Pawfect Care
                        </SvgText>
                    </Svg>
                </View>

                <View style={styles.rightSection}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('MyBookings' as never)}
                        style={styles.cartButton}
                    >
                        <Ionicons name="cart-outline" size={34} color={PawfectColors.primary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleLogout}
                        style={styles.logoutButton}
                        >
                        <Ionicons name="log-out-outline" size={34} color={PawfectColors.primary} />
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: PawfectColors.secondary,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(184, 146, 106, 0.2)',
    },
    navbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: PawfectColors.secondary,
        height: 65,
        position: 'relative'
    },

    // Left Section
    leftSection: {
        position: 'absolute',
        left: 0,
        paddingLeft: 26,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        zIndex: 2,
        gap: 10
    },
    iconButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconButtonShow: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 22,
        backgroundColor: 'rgba(184, 146, 106, 0.1)',
    },
    title: {
        fontSize: 21,
        fontWeight: '700',
        color: PawfectColors.primary,
        lineHeight: 21
    },

    // Center Section (Logo + Text)
    centerSection: {
        position: 'absolute',
        left: '50%',
        top: 0,
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
        zIndex: 1,
        transform: [{ translateX: -115 }],
    },
    logoImage: {
        top: 10,
        width: 55,
        height: 105,
        resizeMode: 'cover'
    },
    
    // Right Section
    rightSection: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        paddingRight: 26,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 10,
        zIndex: 2
    },
    logoutButton: {
        width: 104,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 22,
        backgroundColor: 'rgba(184, 146, 106, 0.1)',
        flexDirection: 'row',
        gap: 5,
    },
    logoutText: {
        color: PawfectColors.primary,
        fontSize: 15,
        fontWeight: 600
    },
    cartButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 22,
        backgroundColor: 'rgba(184, 146, 106, 0.1)',
    },
});