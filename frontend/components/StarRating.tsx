import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PawfectColors } from '../themes/PawfectColors';

type StarRatingProps = {
    rating: number;
    size?: number;
    showNumber?: boolean;
};

export function StarRating ({rating, size = 20, showNumber = true}: StarRatingProps){
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStar = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <View>
            {/* Full Stars */}
            {[...Array(fullStars)].map((_, index) => (
                <Ionicons
                    key={`full-${index}`}
                    name='star'
                    size={size}
                    color="#FFD700"
                />
            ))}

            {/* Half Star */}
            {hasHalfStar && (
                <Ionicons name='star-half' size={size} color="#FFD700"/>
            )}

            {/* Empty Stars */}
            {[...Array(emptyStar)].map((_, index) => (
                <Ionicons
                    key={`empty-${index}`}
                    name='star-outline'
                    size={size}
                    color="#FFD700"
                />
            ))}

            {/* Rating Number */}
            {showNumber && (
                <Text style={[styles.ratingText, {fontSize: size * 0.8}]}>
                    {rating.toFixed(1)}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    ratingText: {
        marginLeft: 6,
        fontWeight: '600',
        color: PawfectColors.textPrimary,
    },
});