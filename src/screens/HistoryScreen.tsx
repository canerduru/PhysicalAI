import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const HistoryScreen = () => {
    return (
        <View style={styles.container}>
            <Text>History Screen Placeholder</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
