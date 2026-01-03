import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../App';
import { PawfectColors } from '../themes/PawfectColors';
import { useServices } from '../redux/Hooks';
import { useAppDispatch } from '../redux/Hooks';
import { addService, fetchTestimonials } from '../redux/slices/ServiceSlice';
import { StarRating } from '../components/StarRating';
import { TestimonialCard } from '../components/TestimonialCard';

type Props = NativeStackScreenProps<RootStackParamList, 'ServiceDetail'>;

const { width } = Dimensions.get('window');

export default function ServiceDetailPage({route, navigation}: Props){
    const { id } = route.params;

    const dispatch = useAppDispatch();
    const {services, isServiceSelected} = useServices();

    const service = services.find((s) => s.id === id);
    const isSelected = isServiceSelected(id);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    // ✅ Fetch testimonials on mount
    useEffect(() => {
        if (id) {
            dispatch(fetchTestimonials(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    if (!service){
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Service not found</Text>
            </View>
        );
    }

    const avarageRating = 
        service.testimonials && service.testimonials.length > 0
            ? service.testimonials.reduce((sum, t) => sum + t.rating, 0) /
                service.testimonials.length
            : 0;
    
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleBookService = () => {
        if (!isSelected){
            dispatch(addService(service));
        }
        navigation.navigate('ServiceList' as never);
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header Image */}
                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        transform: [{scale: scaleAnim}],
                    }}
                >
                    <Image source={{uri: service.image}} style={styles.headerImage}/>

                    {/* Button Back */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name='arrow-back' size={24} color='#fff'/>
                    </TouchableOpacity>
                </Animated.View>

                {/* Content */}
                <Animated.View
                    style={[
                        styles.content,
                        {
                            opacity: fadeAnim,
                            transform: [{translateY: slideAnim}],
                        },
                    ]}
                >
                    {/* Service Name & Rating */}
                    <View style={styles.titleSection}>
                        <Text style={styles.serviceName}>{service.name}</Text>
                        <View style={styles.ratingContainer}>
                            <StarRating rating={avarageRating} size={20}/>
                            <Text style={styles.reviewCount}>
                                ({service.testimonials?.length || 0} reviews)
                            </Text>
                        </View>
                    </View>

                    {/* Info Cards */}
                    <View style={styles.infoCards}>
                        <View style={styles.infoCard}>
                            <Ionicons
                                name='time-outline'
                                size={24}
                                color={PawfectColors.accentBlue}
                            />
                            <Text style={styles.infoLabel}>Duration</Text>
                            <Text style={styles.infoValue}>{service.duration}</Text>
                        </View>

                        <View style={styles.infoCard}>
                            <Ionicons
                                name='cash-outline'
                                size={24}
                                color={PawfectColors.accentPink}
                            />
                            <Text style={styles.infoLabel}>Price</Text>
                            <Text style={styles.infoValue}>{formatPrice(service.price)}</Text>
                        </View>
                    </View>

                    {/* Description */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Service Description</Text>
                        <Text style={styles.description}>
                            {service.longDescription || service.description}
                        </Text>
                    </View>

                    {/* Testimonials */}
                    {service.testimonials && service.testimonials.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                Customer Testimonials ({service.testimonials.length})
                            </Text>
                            {service.testimonials.map((testimonial, index) => (
                                <TestimonialCard
                                    key={testimonial.id}
                                    testimonial={testimonial}
                                    index={index}
                                />
                            ))}
                        </View>
                    )}
                    
                    {/* Bottom Spacing */}
                    <View style={{height: 100}}/>
                </Animated.View>
            </ScrollView>

            {/* Bottom Button */}
            <View style={styles.bottomBar}>
                <View style={styles.priceInfo}>
                    <Text style={styles.priceLabel}>Total Price</Text>
                    <Text style={styles.priceValue}>{formatPrice(service.price)}</Text>
                </View>
                <TouchableOpacity
                    style={[
                        styles.bookButton,
                        isSelected && styles.bookButtonSelected
                    ]}
                    onPress={handleBookService}
                >
                    <Text style={styles.bookButtonText}>
                        {isSelected ? '✓ Sudah Dipilih' : 'Pilih Layanan'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PawfectColors.secondary,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: PawfectColors.secondary,
    },
    errorText: {
        fontSize: 18,
        color: PawfectColors.textSecondary,
    },
    headerImage: {
        width: width,
        height: 300,
        resizeMode: 'cover',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        backgroundColor: PawfectColors.secondary,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    titleSection: {
        marginBottom: 20,
    },
    serviceName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: PawfectColors.textPrimary,
        marginBottom: 12,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    reviewCount: {
        fontSize: 14,
        color: PawfectColors.textSecondary,
    },
    infoCards: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    infoCard: {
        flex: 1,
        backgroundColor: PawfectColors.cardBackground,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    infoLabel: {
        fontSize: 12,
        color: PawfectColors.textSecondary,
        marginTop: 8,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: PawfectColors.textPrimary,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: PawfectColors.textPrimary,
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        color: PawfectColors.textPrimary,
        lineHeight: 24,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: PawfectColors.cardBackground,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: PawfectColors.secondary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    },
    priceInfo: {
        flex: 1,
    },
    priceLabel: {
        fontSize: 12,
        color: PawfectColors.textSecondary,
        marginBottom: 4,
    },
    priceValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: PawfectColors.textPrimary,
    },
    bookButton: {
        backgroundColor: PawfectColors.accentPink,
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 25,
        shadowColor: PawfectColors.accentPink,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },
    bookButtonSelected: {
        backgroundColor: PawfectColors.success,
    },
    bookButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});