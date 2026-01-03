import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { PawfectColors } from '../themes/PawfectColors';
import { Ionicons } from '@expo/vector-icons';

export function PawStampAnimation({onComplete}: {onComplete: () => void}){
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1.2,
                    tension: 50,
                    friction: 3,
                    useNativeDriver: true,
                }),
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 100,
                friction: 5,
                useNativeDriver: true,
            }),
            Animated.delay(500),
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]),
        ]).start(() => {
            onComplete();
        });
    }, []);

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '-15deg'],
    });

    return(
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{scale: scaleAnim}, {rotate}],
                    opacity: opacityAnim,
                },
            ]}
        >
            <View style={styles.iconWrapper}>
                <Ionicons name="paw" size={80} color={PawfectColors.accentPink} />
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 130,
        right: 30,
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    iconWrapper: {
        // width: 100,
        // height: 100,
        // borderColor: PawfectColors.accentPink,
        // borderRadius: '100%',
        borderWidth: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 60,
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    }
});