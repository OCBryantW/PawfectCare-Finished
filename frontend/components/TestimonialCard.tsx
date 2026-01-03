import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { PawfectColors } from '../themes/PawfectColors';
import { Testimonial } from '../contexts/ServiceContext';
import { StarRating } from './StarRating';

type TestimonialCardProps = {
    testimonial: Testimonial;
    index: number;
}

export function TestimonialCard({testimonial, index}: TestimonialCardProps){
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                delay: index * 150,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                delay: index * 150,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <Animated.View
            style={[
                styles.card,
                {
                    opacity: fadeAnim,
                    transform: [{translateY: slideAnim}]
                }
            ]}
        >
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {testimonial.name.charAt(0).toUpperCase()}
                    </Text>
                </View>
                <View style={styles.headerInfo}>
                    <Text style={styles.name}>{testimonial.name}</Text>
                    <Text style={styles.date}>{formatDate(testimonial.date)}</Text>
                </View>
                <StarRating rating={testimonial.rating} size={16} showNumber={false}/>
            </View>

            <Text style={styles.comment}>{testimonial.comment}</Text>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: PawfectColors.cardBackground,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: PawfectColors.secondary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: PawfectColors.accentBlue,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerInfo: {
        flex: 1,
    },
    name: {
        fontSize: 14,
        fontWeight: 'bold',
        color: PawfectColors.textPrimary,
        marginBottom: 2,
    },
    date: {
        fontSize: 12,
        color: PawfectColors.textSecondary,
    },
    comment: {
        fontSize: 14,
        color: PawfectColors.textPrimary,
        lineHeight: 20,
    },
});