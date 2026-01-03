import React from 'react'
import { ScrollView, View, StyleSheet } from 'react-native';

type ScrollableLayoutProps = {
    children: React.ReactNode;
    backgroundColor?: string;
}

export default function ScrollableLayout({
    children,
    backgroundColor = '#fff' // default color
}: ScrollableLayoutProps) {
  return (
    <ScrollView 
        contentContainerStyle={[
            styles.scrollContainer,
            { backgroundColor: backgroundColor}
        ]}>
        <View style={styles.inner}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        paddingVertical: 40,
    },
    inner: {
        width: '100%'
    }
});