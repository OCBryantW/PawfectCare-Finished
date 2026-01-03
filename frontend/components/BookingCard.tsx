import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PawfectColors } from '../themes/PawfectColors';
// import { BookingItem, useBooking } from '../contexts/BookingContext';
import { BookingItem } from '../redux/Types';
import { useBookings } from '../redux/Hooks';
// const { getBookingStatus } = useBookings();
import { useAppDispatch } from '../redux/Hooks';
import { cancelBooking } from '../redux/slices/BookingSlice';

// const dispatch = useAppDispatch();

import { CircularProgress } from './CircularProgress';

type BookingCardProps = {
    booking: BookingItem;
    index: number;
};

export function BookingCard({booking, index}: BookingCardProps){
    // const {getBookingStatus, cancelBooking} = useBooking();
    const { getBookingStatus } = useBookings();
    const dispatch = useAppDispatch();

    const [isExpanded, setIsExpanded] = useState(false);
    const [cancelState, setCancelState] = useState<'idle' | 'confirming'>('idle');
    const [countdown, setCountdown] = useState(3);

    const heightAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;


    const status = getBookingStatus(booking);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                delay: index * 100,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                delay: index * 100,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    useEffect(() => {
        Animated.timing(heightAnim, {
            toValue: isExpanded ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [isExpanded]);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (cancelState === 'confirming' && countdown > 0){
            timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
        } else if (cancelState === 'confirming' && countdown === 0){

        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [cancelState, countdown]);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const totalPrice = booking.services.reduce((sum, s) => sum + s.price, 0);

    const maxHeight = heightAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 500],
    });

    const handleCancelClick = () => {
        if (cancelState === 'idle'){
            setCancelState('confirming');
            setCountdown(3);
        } else if (cancelState === 'confirming' && countdown === 0){
            dispatch(cancelBooking(booking.id));
        }
    };

    const getCancelButtonText = () => {
        if (cancelState === 'idle'){
            return 'Cancel Booking';
        } else if (countdown > 0){
            return `Are you sure? (${countdown}s)`;
        } else {
            return 'Click to Confirm Cancel';
        }
    }

    const getCancelButtonStyle = () => {
        if (cancelState === 'idle'){
            return styles.cancelButton;
        } else if (countdown > 0){
            return styles.cancelButtonDisabled;
        } else {
            return styles.cancelButtonReady;
        }
    }

    // const handleCancel = () => {
    //     Alert.alert(
    //         'Cancel Booking',
    //         'Are you sure you want to cancel this booking?',
    //         [
    //             {
    //                 text: 'No',
    //                 style: 'cancel',
    //             },
    //             {
    //                 text: 'Yes, Cancel',
    //                 style: 'destructive',
    //                 onPress: () => {
    //                     cancelBooking(booking.id)
    //                 }
    //             }
    //         ]
    //     )
    // }

    return (
        <Animated.View
            style={[
                styles.card,
                {
                    opacity: fadeAnim,
                    transform: [{translateY: slideAnim}]
                },
            ]}
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.iconContainer}>
                        <Ionicons name='paw' size={24} color={PawfectColors.accentPink}/>
                    </View>
                    <View style={styles.headerInfo}>
                        <Text style={styles.petName}>{booking.petName}</Text>
                        <Text style={styles.ownerName}>{booking.ownerName}</Text>
                        <Text style={styles.dateTime}>
                            {formatDate(booking.date)} • {booking.time}
                        </Text>
                    </View>
                </View>

                {/* Progress */}
                <CircularProgress status={status} size={70}/>
            </View>

            {/* Services Summary */}
            <View style={styles.servicesRow}>
                <Text style={styles.servicesLabel}>
                    {booking.services.length} Service
                </Text>
                {booking.services.length > 1 && (
                    <TouchableOpacity
                        onPress={() => setIsExpanded(!isExpanded)}
                        style={styles.expandButton}
                    >
                        <Text style={styles.expandText}>
                            {isExpanded ? 'Close' : 'View Details'}
                        </Text>
                        <Ionicons
                            name={isExpanded ? 'chevron-up' : 'chevron-down'}
                            size={16}
                            color={PawfectColors.accentPink}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {/* Single Service Display */}
            {booking.services.length === 1 && (
                <View style={styles.singleService}>
                    <Text style={styles.serviceName}>{booking.services[0].name}</Text>
                    <Text style={styles.servicePrice}>
                        {formatPrice(booking.services[0].price)}
                    </Text>
                </View>
            )}

            {/* Expanded Services List */}
            {booking.services.length > 1 && (
                <Animated.View style={[styles.expandedContent, {maxHeight}]}>
                    {isExpanded &&
                        booking.services.map((service, idx) => (
                            <View key={`${service.id}-${idx}`} style={styles.serviceItem}>
                                <View style={styles.serviceInfo}>
                                    <Text style={styles.serviceName}>{service.name}</Text>
                                    <Text style={styles.serviceDuration}>
                                        {service.duration}
                                    </Text>
                                </View>
                                <Text style={styles.servicePrice}>
                                    {formatPrice(service.price)}
                                </Text>
                            </View>
                        ))}
                </Animated.View>
            )}

            {/* Total Price */}
            <View style={styles.footer}>
                <Text style={styles.totalLabel}>Total Price:</Text>
                <Text style={styles.totalPrice}>{formatPrice(totalPrice)}</Text>
            </View>

            {/* Notes */}
            {booking.notes && (
                <View style={styles.notesContainer}>
                    <Text style={styles.notesLabel}>Notes:</Text>
                    <Text style={styles.notesText}>{booking.notes}</Text>
                </View>
            )}

            {status === 'not-started' && (
                <TouchableOpacity
                    style={getCancelButtonStyle()}
                    onPress={handleCancelClick}
                    disabled={cancelState === 'confirming' && countdown > 0}
                >
                    <Ionicons name='close-circle' size={20} color='#fff'/>
                    <Text style={styles.cancelButtonText}>
                        {getCancelButtonText()}
                    </Text>
                </TouchableOpacity>
            )}
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: PawfectColors.cardBackground,
        borderRadius: 15,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: PawfectColors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerInfo: {
        flex: 1,
    },
    petName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: PawfectColors.textPrimary,
        marginBottom: 4,
    },
    ownerName: {
        fontSize: 14,
        color: PawfectColors.textSecondary,
        marginBottom: 2,
    },
    dateTime: {
        fontSize: 12,
        color: PawfectColors.textSecondary,
    },
    servicesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: PawfectColors.secondary,
    },
    servicesLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: PawfectColors.textPrimary,
    },
    expandButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    expandText: {
        fontSize: 14,
        color: PawfectColors.accentPink,
        fontWeight: '600',
    },
    singleService: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    expandedContent: {
        overflow: 'hidden',
    },
    serviceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: PawfectColors.secondary,
    },
    serviceInfo: {
        flex: 1,
    },
    serviceName: {
        fontSize: 14,
        fontWeight: '600',
        color: PawfectColors.textPrimary,
        marginBottom: 2,
    },
    serviceDuration: {
        fontSize: 12,
        color: PawfectColors.textSecondary,
    },
    servicePrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: PawfectColors.accentPink,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: PawfectColors.secondary,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: PawfectColors.textPrimary,
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: PawfectColors.accentPink,
    },
    notesContainer: {
        marginTop: 12,
        padding: 12,
        backgroundColor: PawfectColors.secondary,
        borderRadius: 8,
    },
    notesLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: PawfectColors.textSecondary,
        marginBottom: 4,
    },
    notesText: {
        fontSize: 13,
        color: PawfectColors.textPrimary,
        lineHeight: 18,
    },
    cancelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F44336',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 16,
        gap: 8,
        shadowColor: '#F44336',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    cancelButtonDisabled: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#9E9E9E',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 16,
        gap: 8,
        opacity: 0.6,
    },
    cancelButtonReady: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F44336',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 16,
        gap: 8,
        shadowColor: '#F44336',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 6,
    },
    cancelButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
});