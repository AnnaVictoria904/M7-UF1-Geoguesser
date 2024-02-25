import React, {useEffect, useRef, useState} from 'react';
import {Button, View, Text, StyleSheet, Image, Alert, TouchableOpacity} from 'react-native';

export default function ScoreScreen({navigation, route}) {
    const { score } = route.params;
    return (
        <View style={styles.container}>
            <Text style={styles.scoreText}>Puntuació: {score}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.input}>
                <Text style={{alignSelf: 'center', color: 'white', fontSize: 30}}>RETURN</Text>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scoreText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    input: {
        height: 90,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 9,
        backgroundColor: "#009688",
        width: '70%',
        alignItems: 'center',
        justifyContent: 'center'
    },
});