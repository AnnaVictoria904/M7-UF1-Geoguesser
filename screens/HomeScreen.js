import React from 'react';
import {Button, View, Text, StyleSheet, TextInput, Image, TouchableOpacity} from 'react-native';
import Logo from '../assets/logo.png';

function HomeScreen({navigation}) {
    const [text, onChangeText] = React.useState('Useless Text');
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image
                style={{alignSelf: "center", width: '100%', marginBottom: 100}}
                source={Logo}
                resizeMode={'contain'}
            />
            <TouchableOpacity onPress={() => navigation.navigate('MapScreen')} style={styles.input}>
                <Text style={{alignSelf: 'center', color: 'white', fontSize: 30}}>PLAY</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
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

export default HomeScreen;