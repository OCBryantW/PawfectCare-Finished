import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PawfectColors } from '../themes/PawfectColors';
// ✅ PERBAIKAN: Import dari Redux Types, bukan dari context
import { Service } from '../redux/Types';
import { useAppDispatch } from '../redux/Hooks';
import { addService, removeService } from '../redux/slices/ServiceSlice';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';


type NavigationType = NativeStackNavigationProp<RootStackParamList, 'ServiceList'>;

type ServiceCardProps = {
    service: Service;
    index: number;
};

export function ServiceCard({service, index}: ServiceCardProps){
    const navigation = useNavigation<NavigationType>();
    const dispatch = useAppDispatch();

    const selectedServices = useSelector((state: RootState) => state.services.selectedServices);
    const isSelected = selectedServices.some(s => s.id === service.id);

    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // ✅ DEBUG: Log state
    useEffect(() => {
        console.log('ServiceCard - Service:', service.name);
        console.log('ServiceCard - Is Selected:', isSelected);
        console.log('ServiceCard - All Selected Services:', selectedServices);
    }, [isSelected, selectedServices]);

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                delay: index * 100,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                delay: index * 100,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handlePress = () => {

        console.log('ServiceCard - handlePress called'); // ✅ DEBUG
        console.log('ServiceCard - Current isSelected:', isSelected); // ✅ DEBUG
        console.log('ServiceCard - Service to toggle:', service); // ✅ DEBUG

        if(isSelected){
            console.log('ServiceCard - Removing service:', service.id); // ✅ DEBUG
            dispatch(removeService(service.id));
        }else{
            console.log('ServiceCard - Adding service:', service); // ✅ DEBUG
            dispatch(addService(service));
        }

        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 3,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <Animated.View
            style={[
                styles.cardContainer,
                {
                    transform: [{scale: scaleAnim}],
                    opacity: fadeAnim,
                },
            ]}
        >
            <TouchableOpacity
                onPress={handlePress}
                style={[
                    styles.card,
                    isSelected && styles.cardSelected,
                ]}
                activeOpacity={0.8}
            >
                <Image source={{uri: service.image}} style={styles.cardImage}/>

                {isSelected && (
                    <View style={styles.selectedBadge}>
                        <Text style={styles.selectedBadgeText}>✓</Text>
                    </View>
                )}

                <View style={styles.cardContent}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Text style={styles.serviceName} numberOfLines={2}>
                            {service.name}
                        </Text>
                        <TouchableOpacity
                            style={styles.serviceDetailBtn}
                            onPress={(e) => { e.stopPropagation(); navigation.navigate('ServiceDetail', {id: service.id})}}
                        >
                            <Text style={styles.bookButtonText}>
                                Details
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.serviceDescription} numberOfLines={2}>
                        {service.description}
                    </Text>

                    <View style={styles.infoRow}>
                        <View style={styles.durationContainer}>
                            <Ionicons name='timer-outline' style={styles.durationIcon}/>
                            <Text style={styles.durationText}>{service.duration}</Text>
                        </View>
                        <Text style={styles.priceText}>{formatPrice(service.price)}</Text>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.bookButton,
                            isSelected && styles.bookButtonSelected,
                        ]}
                        onPress={handlePress}
                    >
                        <Text
                            style={[
                                styles.bookButtonText,
                                isSelected && styles.bookButtonTextSelected
                            ]}
                        >
                            {isSelected ? 'Selected' : 'Select'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        width: '31%',
        marginBottom: 20,
    },
    card: {
        backgroundColor: PawfectColors.cardBackground,
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    cardSelected:{
        borderBlockColor: PawfectColors.accentPink,
        shadowColor: PawfectColors.accentPink,
        shadowOpacity: 0.3
    },
    cardImage: {
        width: '100%',
        height: 180,
        resizeMode: 'cover',
    },
    selectedBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: PawfectColors.success,
        width: 35,
        height: 35,
        borderRadius: 17.5,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    selectedBadgeText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardContent: {
        padding: 15,
    },
    serviceName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: PawfectColors.textPrimary,
        marginBottom: 8,
    },
    serviceDetailBtn: {
        backgroundColor: PawfectColors.accentPink,
        borderRadius: 8,
        paddingVertical: 7,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        top: -3
        
    },
    serviceDescription: {
        fontSize: 13,
        color: PawfectColors.textSecondary,
        marginBottom: 12,
        lineHeight: 18,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: PawfectColors.secondary,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
    },
    durationContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: PawfectColors.secondary,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
    },
    durationIcon: {
        fontSize: 20,
        marginRight: 5,
    },
    durationText: {
        fontSize: 12,
        color: PawfectColors.textPrimary,
        fontWeight: '600',
    },
    priceText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: PawfectColors.accentPink,
    },
    bookButton: {
        backgroundColor: PawfectColors.accentBlue,
        marginTop: 8,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    bookButtonSelected: {
        backgroundColor: PawfectColors.accentPink,
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    bookButtonTextSelected: {
        color: '#fff',
    },
});