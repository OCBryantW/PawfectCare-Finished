import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { PawfectColors } from '../themes/PawfectColors';

type CircularProgressProps = {
    status: 'not-started' | 'on-going' | 'done';
    size?: number;
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function CircularProgress({status, size = 80}: CircularProgressProps){
    const progressAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    const radius = (size - 10) / 2;
    const circumReference = radius * 2 * Math.PI;

    useEffect(() => {
        let targetProgress = 0;
        if (status === 'not-started') targetProgress = 0;
        else if (status === 'on-going') targetProgress = 0.5;
        else if (status === 'done') targetProgress = 1;

        // Animate Progress
        Animated.spring(progressAnim, {
            toValue: targetProgress,
            tension: 40,
            friction: 7,
            useNativeDriver: true
        }).start();

        if (status === 'on-going'){
            Animated.loop(
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                })
            ).start();
        } else {
            rotateAnim.setValue(0);
        }
    }, [status]);

    const strokeDashoffset = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [circumReference, 0]
    });

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const getStatusColor = () => {
        switch (status){
            case 'not-started':
                return PawfectColors.textSecondary;
            case 'on-going':
                return PawfectColors.progress;
            case 'done':
                return PawfectColors.success;
            default:
                return PawfectColors.textSecondary;
        }
    };

    const getStatusText = () => {
        switch(status) {
            case 'not-started':
                return 'Not Started\nYet';
            case 'on-going':
                return 'On Going';
            case 'done':
                return 'Done';
            default:
                return '';
        }
    }

    return(
        <Animated.View style={[styles.container, {transform: [{rotate}]}]}>
            <Svg width={size} height={size}>
                {/* Background Circle */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={PawfectColors.secondary}
                    strokeWidth='8'
                    fill='none'
                />
                {/* Progress Circle */}
                <AnimatedCircle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={getStatusColor()}
                strokeWidth='8'
                fill='none'
                strokeDasharray={circumReference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap='round'
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
            </Svg>

            {/* Status Text */}
            <View style={styles.textContainer}>
                <Text style={[styles.statusText, {color: getStatusColor()}]}>
                    {getStatusText()}
                </Text>
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusText: {
        fontSize: 11,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 14,
    },
});