import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PawfectColors } from '../themes/PawfectColors';
import { useServices } from '../redux/Hooks';
// import { useService } from '../contexts/ServiceContext';

export function BottomButtonBar(){
    const navigation = useNavigation();
    const {selectedServices, getTotalPrice} = useServices();
    const slideAnim = useRef(new Animated.Value(100)).current;

    // ✅ DEBUG: Log untuk melihat selectedServices
    useEffect(() => {
        console.log('BottomButtonBar - Selected Services:', selectedServices);
        console.log('BottomButtonBar - Count:', selectedServices.length);
    }, [selectedServices]);


    useEffect(() => {
        if (selectedServices.length > 0){
            console.log('Showing bottom bar'); // ✅ DEBUG
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }).start();
        } else {
            console.log('Hiding bottom bar'); // ✅ DEBUG
            Animated.timing(slideAnim, {
                toValue: 100,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [selectedServices.length]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    if (selectedServices.length === 0) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{translateY: slideAnim}]
                }
            ]}
        >
            <View style={styles.content}>
                <View style={styles.infoContainer}>
                    <Text style={styles.counText}>
                        {selectedServices.length} Service Selected
                    </Text>
                    <Text style={styles.totalPrize}>
                        {formatPrice(getTotalPrice())}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.bookButton}
                    onPress={() => navigation.navigate('BookingForm' as never)}
                >
                    <Text style={styles.bookButtonText}>Booking Now</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container:{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: PawfectColors.cardBackground,
        borderTopWidth: 1,
        borderTopColor: PawfectColors.secondary,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    infoContainer: {
        flex: 1,
    },
    counText: {
        fontSize: 14,
        color: PawfectColors.textSecondary,
        marginBottom: 4,
    },
    totalPrize: {
        fontSize: 20,
        fontWeight: 'bold',
        color: PawfectColors.textPrimary,
    },
    bookButton: {
        backgroundColor: PawfectColors.accentPink,
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
        shadowColor: PawfectColors.accentPink,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    }
});