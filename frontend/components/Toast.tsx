import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { PawfectColors } from '../themes/PawfectColors';

type ToastProps = {
  visible: boolean;
  message: string;
  type: 'success' | 'error';
  onHide: () => void;
  left?: number | `${number}%`;
};

export function Toast({ visible, message, type, onHide, left }: ToastProps) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animasi masuk
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide setelah 3 detik
      const timer = setTimeout(() => {
        hideToast();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

//   if (!visible && opacity === 0) return null;

  // Hitung posisi left dan transform
  const getLeftStyle = (): number | `${number}%` => {
    if (left !== undefined) {
      // Jika left diberikan, gunakan nilai tersebut
      return typeof left === 'string' ? (left as `${number}%`) : left;
    }
    // Default: centered (50%)
    return '40%';
  };

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          backgroundColor: type === 'success' ? '#4CAF50' : '#F44336',
          transform: [{ translateY }],
          opacity,
          left: getLeftStyle(),
        },
      ]}
    >
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 20,
    transform: [{ translateX: -150 }],
    width: 300,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 9999,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});