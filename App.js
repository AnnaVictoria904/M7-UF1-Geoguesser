import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AppLoading} from 'expo';
import * as Font from 'expo-font';

// Importa tus pantallas
import HomeScreen from './screens/HomeScreen';
import MapScreen from "./screens/MapScreen";
import ScoreScreen from "./screens/ScoreScreen";

const Stack = createNativeStackNavigator();

function App() {
    const [fontsLoaded, setFontsLoaded] = React.useState(false);
    const loadFonts = async () => {
        await Font.loadAsync({
            'open-sans-regular': require('./assets/fonts/open-sans-regular.ttf'),
            'open-sans-700': require('./assets/fonts/open-sans-700.ttf'),
        });
        setFontsLoaded(true);
    };

    React.useEffect(() => {
        loadFonts();
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home"
                             screenOptions={{
                                 headerShown: false
                             }}>
                <Stack.Screen name="Home" component={HomeScreen}/>
                <Stack.Screen name="MapScreen" component={MapScreen}/>
                <Stack.Screen name="ScoreScreen" component={ScoreScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;