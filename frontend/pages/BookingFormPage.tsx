    import React, { useState, useRef } from 'react';
    import {
        View,
        Text,
        TextInput,
        TouchableOpacity,
        ScrollView,
        StyleSheet,
        Animated,
    } from 'react-native';
    import { Calendar } from 'react-native-calendars';
    import { NativeStackScreenProps } from '@react-navigation/native-stack';
    import { useFocusEffect } from '@react-navigation/native';
    import { RootStackParamList } from '../App';
    import { PawfectColors } from '../themes/PawfectColors';
    import { useServices } from '../redux/Hooks'; // ✅ Redux hook
    import { useAuth } from '../redux/Hooks'; // ✅ Redux hook for user data
    import { useAppDispatch } from '../redux/Hooks';
    import { createBooking } from '../redux/slices/BookingSlice'; // ✅ Redux action
    import { clearServices } from '../redux/slices/ServiceSlice'; // ✅ Redux action
    import { TimePicker } from '../components/TimePicker';
    import { PawStampAnimation } from '../components/PawStampAnimation';
    import { Toast } from '../components/Toast';
    import ScrollableLayout from '../styles/ScrollableLayout';

    type Props = NativeStackScreenProps<RootStackParamList, 'BookingForm'>;

    export default function BookingFormPage({navigation}: Props){
        const dispatch = useAppDispatch();
        const {selectedServices, getTotalPrice} = useServices();
        const {user} = useAuth();
        // const {registerData} = useRegister();
        // const {addBooking} = useBooking();

        const [ownerName, setOwnerName] = useState(user?.fullName || '');
        const [ownerPhone, setOwnerPhone] = useState(user?.phone || '');
        const [petName, setPetName] = useState('');
        const [selectedDate, setSelectedDate] = useState('');
        const [selectedTime, setSelectedTime] = useState('09:00');
        const [notes, setNotes] = useState('');
        const [showPawStamp, setShowPawStamp] = useState(false);
        const [bookingCompleted, setBookingCompleted] = useState(false);

        const [errors, setErrors] = useState<{[key: string]: string}>({});

        // Toast state
        const [toast, setToast] = useState({
            visible: false,
            message: '',
            type: 'success' as 'success' | 'error',
        });
        
        const fadeAnim = useRef(new Animated.Value(0)).current;
        const slideAnim = useRef(new Animated.Value(0)).current;

        React.useEffect(() => {
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
            ]).start();
        }, []);

        // useFocusEffect(
        //     React.useCallback(() => {
        //         const unsubscribe = navigation.addListener('beforeRemove', (e) => {
        //             if (bookingCompleted) {
        //                 e.preventDefault();
        //                 navigation.navigate('ServiceList');
        //             }
        //         });

        //         return unsubscribe;
        //     }, [navigation, bookingCompleted])
        // )

        const showToast = (message: string, type: 'success' | 'error') => {
            setToast({ visible: true, message, type });
        };

        const hideToast = () => {
            setToast({ ...toast, visible: false });
        };

        const formatPrice = (price: number) => {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
            }).format(price);
        };

        const validateFields = () => {
            const newErrors: {[key: string]: string} = {};

            if (!ownerName.trim()){
                newErrors.ownerName = 'Owner Name is required';
            }

            if (!ownerPhone.trim()){
                newErrors.ownerPhone = 'Phone Number is required';
            } else {
                const phoneRegex = /^[0-9]{10,13}$/;
                if (!phoneRegex.test(ownerPhone.trim())){
                    newErrors.ownerPhone = 'Phone Number must be 10-13 digits'
                }
            }

            if (!petName.trim()){
                newErrors.petName = 'Pet Name is required';
            }

            if (!selectedDate){
                newErrors.selectedDate = 'Please select a date';
            }

            if (selectedServices.length === 0){
                showToast('No services selected yet!', 'error');
                return newErrors;
            }

            return newErrors;
        };

        const handleInputChange = (field: string, value: string) => {
            setErrors((prev) => {
                const updated = {...prev};
                delete updated[field];
                return updated;
            });

            switch (field) {
                case 'ownerName':
                    setOwnerName(value);
                    break;
                case 'ownerPhone':
                    setOwnerPhone(value);
                    break;
                case 'petName':
                    setPetName(value);
                    break;
            }
        }

        const handleBooking = () => {
            const newErrors = validateFields();
            setErrors(newErrors);

            if (Object.keys(newErrors).length > 0){
                showToast('Please complete all required fields correctly!', 'error');
                return;
            }

            setShowPawStamp(true);
        };

        const handlePawStampComplete = async () => {
            // addBooking({
            //     services: selectedServices,
            //     ownerName,
            //     ownerPhone,
            //     petName,
            //     date: new Date(selectedDate),
            //     time: selectedTime,
            //     notes,
            // });

            if (!user) {
                showToast('User not authenticated', 'error');
                return;
            }

            try {
                await dispatch(createBooking({
                    userId: user.id,
                    serviceIds: selectedServices.map(s => s.id),
                    ownerName,
                    ownerPhone,
                    petName,
                    date: selectedDate,
                    time: selectedTime,
                    notes,
                })).unwrap();

                showToast('Successful Order!', 'success');

                dispatch(clearServices());

                setBookingCompleted(true);

                setTimeout(() => {
                    navigation.reset({
                        index: 1,
                        routes: [
                            {name: 'ServiceList'},
                            {name: 'MyBookings'},
                        ]
                    });
                }, 1500);
            } catch (err: any) {
                showToast(err || 'Failed to create booking', 'error');
            }
        };

        const today = new Date().toISOString().split('T')[0];

        return (
            <>
                <View style={styles.toastWrapper}>
                    <Toast
                        visible={toast.visible}
                        message={toast.message}
                        type={toast.type}
                        onHide={hideToast}
                        // left="40%"
                    />
                </View>
                <ScrollableLayout backgroundColor={PawfectColors.primary}>
                    <Animated.View
                        style={[
                            styles.container,
                            {
                                opacity: fadeAnim,
                                transform: [{translateY: slideAnim}],
                            },
                        ]}
                    >
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.title}>Order Form</Text>
                            <Text style={styles.subtitle}>
                                {selectedServices.length} Service Selected
                            </Text>
                        </View>

                        <View style={styles.content}>
                            {/* Left Side */}
                            <View style={styles.leftSection}>
                                <Text style={styles.sectionTitle}>Select the Date</Text>
                                <Calendar
                                    style={[
                                        styles.calendar,
                                        errors.selectedDate && styles.calendarError
                                    ]}
                                    theme={{
                                        backgroundColor: PawfectColors.cardBackground,
                                        calendarBackground: PawfectColors.cardBackground,
                                        selectedDayBackgroundColor: PawfectColors.accentPink,
                                        selectedDayTextColor: '#fff',
                                        todayTextColor: PawfectColors.accentBlue,
                                        dayTextColor: PawfectColors.textPrimary,
                                        textDisabledColor: PawfectColors.textSecondary,
                                        monthTextColor: PawfectColors.textPrimary,
                                        textMonthFontWeight: 'bold',
                                    }}
                                    // minDate={today}
                                    onDayPress={(day) => {
                                        setSelectedDate(day.dateString);

                                        setErrors((prev) => {
                                            const updated = {...prev};
                                            delete updated.selectedDate;
                                            return updated;
                                        });
                                    }}
                                    markedDates={{
                                        [selectedDate]: {
                                            selected: true,
                                            selectedColor: PawfectColors.accentPink,
                                        },
                                    }}
                                />
                                {errors.selectedDate && (
                                    <View style={styles.errorCalendarContainer}>
                                        <Text style={styles.errorCalendarText}>{errors.selectedDate}</Text>
                                    </View>
                                )}

                                {/* Selected Services Summary */}
                                <View style={styles.summaryCard}>
                                    <Text style={styles.summaryTitle}>Selected Services</Text>
                                    {selectedServices.map((service) => (
                                        <View key={service.id} style={styles.serviceItem}>
                                            <Text style={styles.serviceName}>{service.name}</Text>
                                            <Text style={styles.servicePrice}>
                                                {formatPrice(service.price)}
                                            </Text>
                                        </View>
                                    ))}
                                    <View style={styles.divider}/>
                                    <View style={styles.totalRow}>
                                        <Text style={styles.totalLabel}>Total:</Text>
                                        <Text style={styles.totalPrice}>
                                            {formatPrice(getTotalPrice())}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            
                            {/* Right Side */}
                            <View style={styles.rightSection}>
                                <ScrollView showsVerticalScrollIndicator={false}>

                                    {/* Owner Name */}
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Owner Name *</Text>
                                        <TextInput
                                            style={[
                                                styles.input,
                                                errors.ownerName && styles.inputError,
                                            ]}
                                            value={ownerName}
                                            onChangeText={(text) => handleInputChange('ownerName', text)}
                                            placeholder='Enter the Owner Name'
                                            placeholderTextColor={PawfectColors.textSecondary}
                                        />
                                        {errors.ownerName && (
                                            <View style={styles.errorContainer}>
                                                <Text style={[{color: '#fff'}, styles.errorText, ]}>{errors.ownerName}</Text>
                                            </View>
                                        )}
                                    </View>

                                    {/* Owner Phone */}
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Phone Number *</Text>
                                        <TextInput
                                            style={[
                                                styles.input,
                                                errors.ownerPhone && styles.inputError,
                                            ]}
                                            value={ownerPhone}
                                            onChangeText={(text) => handleInputChange('ownerPhone', text)}
                                            placeholder='Enter Phone Number'
                                            keyboardType='phone-pad'
                                            placeholderTextColor={PawfectColors.textSecondary}
                                        />
                                        {errors.ownerPhone && (
                                            <View style={styles.errorContainer}>
                                                <Text style={styles.errorText}>{errors.ownerPhone}</Text>
                                            </View>
                                        )}
                                    </View>

                                    {/* Pet Name */}
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Pet Name *</Text>
                                        <TextInput
                                            style={[
                                                styles.input,
                                                errors.petName && styles.inputError,
                                            ]}
                                            value={petName}
                                            onChangeText={(text) => handleInputChange('petName', text)}
                                            placeholder='Enter Pet Name'
                                            placeholderTextColor={PawfectColors.textSecondary}
                                        />
                                        {errors.petName && (
                                            <View style={styles.errorContainer}>
                                                <Text style={styles.errorText}>{errors.petName}</Text>
                                            </View>
                                        )}
                                    </View>

                                    {/* Time Picker */}
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Service Time *</Text>
                                        <TimePicker
                                            initialTime={selectedTime}
                                            onTimeChange={setSelectedTime}
                                        />
                                    </View>

                                    {/* Notes */}
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Additional Notes *</Text>
                                        <TextInput
                                            style={[styles.input, styles.textArea]}
                                            value={notes}
                                            onChangeText={setNotes}
                                            placeholder='Additional note for spesific service...'
                                            multiline
                                            numberOfLines={4}
                                            textAlignVertical='top'
                                            placeholderTextColor={PawfectColors.textSecondary}
                                        />
                                    </View>

                                    {/* Booking Button */}
                                    <TouchableOpacity
                                        style={styles.bookingButton}
                                        onPress={handleBooking}
                                    >
                                        <Text style={styles.bookingButtonText}>Booking Now</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                            </View>
                        </View>

                        {/* Paw Stamp Animation */}
                        {showPawStamp && (
                            <PawStampAnimation onComplete={handlePawStampComplete}/>
                        )}
                    </Animated.View>
                </ScrollableLayout>
            </>
        )
    }

    const styles = StyleSheet.create({
        toastWrapper: {
            position: 'absolute',
            top: 20, // Atur jarak dari atas, misalnya 20 atau 50
            left: 0,
            right: 0,
            width: '100%', // Agar elemen di dalamnya bisa di-center
            alignItems: 'center', // ⭐ Penting: Center horizontal
            zIndex: 10000,
        },
        container: {
            flex: 1,
            padding: 20,
        },
        header: {
            marginBottom: 20,
        },
        title: {
            fontSize: 32,
            fontWeight: 'bold',
            color: PawfectColors.secondary,
            textShadowColor: 'rgba(0, 0, 0, 0.2)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 3,
        },
        subtitle: {
            fontSize: 16,
            color: PawfectColors.secondary,
            marginTop: 4,
            opacity: 0.9,
        },
        content: {
            flexDirection: 'row',
            gap: 20,
            flex: 1,
        },
        leftSection: {
            flex: 1,
        },
        rightSection: {
            flex: 1,
            backgroundColor: PawfectColors.cardBackground,
            borderRadius: 15,
            padding: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
        },
        sectionTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: PawfectColors.secondary,
            marginBottom: 12,
        },
        calendar: {
            borderRadius: 15,
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            paddingBottom: 10,
        },
        calendarError: {
            borderWidth: 2,
            borderColor: 'red',
        },
        summaryCard: {
            backgroundColor: PawfectColors.cardBackground,
            borderRadius: 12,
            padding: 16,
            marginTop: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        summaryTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: PawfectColors.textPrimary,
            marginBottom: 12,
        },
        serviceItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
        },
        serviceName: {
            fontSize: 14,
            color: PawfectColors.textPrimary,
        },
        servicePrice: {
            fontSize: 14,
            color: PawfectColors.textSecondary,
        },
        divider: {
            height: 1,
            backgroundColor: PawfectColors.secondary,
            marginVertical: 12,
        },
        totalRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
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
        inputGroup: {
            marginBottom: 20,
        },
        inputLabel: {
            fontSize: 14,
            fontWeight: '600',
            color: PawfectColors.textPrimary,
            marginBottom: 8,
        },
        input: {
            backgroundColor: '#F5F5F5',
            borderRadius: 8,
            padding: 12,
            fontSize: 14,
            color: PawfectColors.textPrimary,
            borderWidth: 1,
            borderColor: PawfectColors.secondary,
        },
        inputError: {
            borderColor: 'red',
            borderWidth: 2,
        },
        errorContainer: {
            minHeight: 18,
            marginTop: 4,
        },
        errorText: {
            color: 'red',
            fontSize: 12,
            fontWeight: '500',
        },
        errorCalendarContainer: {
            minHeight: 18,
            marginTop: 4,
            backgroundColor: '#fff',
            borderRadius: 15,
        },
        errorCalendarText: {
            color: 'red',
            fontSize: 15,
            fontWeight: '500',
            paddingVertical: 8,
            textAlign: 'center'
        },
        textArea: {
            height: 100,
            paddingTop: 12,
        },
        bookingButton: {
            backgroundColor: PawfectColors.accentPink,
            borderRadius: 25,
            paddingVertical: 14,
            alignItems: 'center',
            marginTop: 20,
            shadowColor: PawfectColors.accentPink,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 6,
        },
        bookingButtonText: {
            color: '#FFF',
            fontSize: 16,
            fontWeight: 'bold',
        },
    });