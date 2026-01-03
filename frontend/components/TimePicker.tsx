import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { PawfectColors } from '../themes/PawfectColors';

type TimePickerProps = {
    onTimeChange: (time: string) => void;
    initialTime?: string;
};

export function TimePicker({onTimeChange, initialTime = '09:00'}: TimePickerProps){
    const [hour, minute] = initialTime.split(':').map(Number);
    const [selectedHour, setSelectedHour] = useState(hour);
    const [selectedMinute, setSelectedMinute] = useState(minute);

    const hours = Array.from({length: 24}, (_, i) => i);
    const minutes = Array.from({length: 60}, (_, i) => i);

    const handleHourChange = (h: number) => {
        setSelectedHour(h);
        onTimeChange(`${String(h).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`);
    };

    const handleMinuteChange = (m: number) => {
        setSelectedMinute(m);
        onTimeChange(`${String(selectedHour).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    };

    return (
        <View style={styles.container}>
            <View style={styles.pickerContainer}>
                {/* Hour Picker */}
                <View style={styles.column}>
                    <Text style={styles.label}>Hour</Text>
                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        snapToInterval={50}
                        decelerationRate='fast'
                    >
                        {hours.map((h) => (
                            <TouchableOpacity
                                key = {h}
                                onPress={() => handleHourChange(h)}
                                style={[
                                    styles.timeItem,
                                    selectedHour === h && styles.selectedTimeItem,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.timeText,
                                        selectedHour === h && styles.selectedTimeText,
                                    ]}
                                >
                                    {String(h).padStart(2, '0')}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
                
                {/* Separator */}
                <Text style={styles.separator}>:</Text>

                {/* Minute Picker */}
                <View style={styles.column}>
                    <Text style={styles.label}>Minute</Text>
                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        snapToInterval={50}
                        decelerationRate='fast'
                    >
                        {minutes.map((m) => (
                            <TouchableOpacity
                                key={m}
                                onPress={() => handleMinuteChange(m)}
                                style={[
                                    styles.timeItem,
                                    selectedMinute === m && styles.selectedTimeItem,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.timeText,
                                        selectedMinute === m && styles.selectedTimeText,
                                    ]}
                                >
                                    {String(m).padStart(2, '0')}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: PawfectColors.cardBackground,
        borderRadius: 12,
        padding: 10,
        borderWidth: 1,
        borderColor: PawfectColors.secondary,
    },
    column: {
        alignItems: 'center',
    },
    label: {
        fontSize: 12,
        color: PawfectColors.textSecondary,
        marginBottom: 8,
        fontWeight: '600',
    },
    scrollView: {
        height: 150,
        width: 60,
    },
    timeItem: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
    },
    selectedTimeItem: {
        backgroundColor: PawfectColors.accentPink,
        borderRadius: 8,
    },
    timeText: {
        fontSize: 20,
        color: PawfectColors.textPrimary,
        fontWeight: '500',
    },
    selectedTimeText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    separator: {
        fontSize: 32,
        fontWeight: 'bold',
        color: PawfectColors.textPrimary,
        marginHorizontal: 10,
    },
});
