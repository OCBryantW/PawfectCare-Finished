import React, { useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { PawfectColors } from '../themes/PawfectColors';
// import { useBooking } from '../contexts/BookingContext';
import { useAuth, useBookings } from '../redux/Hooks';
import { BookingCard } from '../components/BookingCard';
import ScrollableLayout from '../styles/ScrollableLayout';
import { useAppDispatch } from '../redux/Hooks';
import { fetchBookings } from '../redux/slices/BookingSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'MyBookings'>;

export default function MyBookingsPage({navigation}: Props){
    const dispatch = useAppDispatch();
    const { user } = useAuth();
    const { bookings, loading, error, getBookingStatus } = useBookings();

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchBookings(user.id));
        }
    }, [user]);

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>{error}</Text>;

    const EmptyState = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name='calendar-outline' size={80} color={PawfectColors.textSecondary}/>
            <Text style={styles.emptyTitle}>No Orders Yet</Text>
            <Text style={styles.emptySubtitle}>
                Please select a service and make your first order!
            </Text>
            <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => navigation.navigate('ServiceList' as never)}
            >
                <Text style={styles.emptyButtonText}>View Services</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <ScrollableLayout backgroundColor={PawfectColors.primary}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Text style={styles.title}>Order History</Text>
                        <Text style={styles.subtitle}>
                            {bookings.length} Total Order
                        </Text>
                    </View>
                </View>
                
                {/* Booking List */}
                {bookings.length === 0 ? (
                    <EmptyState/>
                ) : (
                    <FlatList
                        data={bookings}
                        renderItem={({item, index}) => (
                            <BookingCard booking={item} index={index}/>
                        )}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </ScrollableLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(248, 235, 215, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerContent: {
        flex: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: PawfectColors.secondary,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    subtitle: {
        fontSize: 14,
        color: PawfectColors.secondary,
        marginTop: 4,
        opacity: 0.9,
    },
    listContent: {
        paddingBottom: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: PawfectColors.secondary,
        marginTop: 20,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 16,
        color: PawfectColors.secondary,
        textAlign: 'center',
        opacity: 0.8,
        marginBottom: 24,
        paddingHorizontal: 40,
    },
    emptyButton: {
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
    emptyButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});