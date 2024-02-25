import React, {useEffect, useRef, useState} from 'react';
import {Button, View, Text, StyleSheet, Image, Alert} from 'react-native';
import MapView, {Marker, Polyline} from "react-native-maps";
import CrosshairImage from "../assets/Crosshair.png";
import {db} from "../firebaseConfig";
import {collection, getDocs} from 'firebase/firestore';

export default function MapScreen({navigation}) {
    const [getDistance, setDistance] = useState("?");
    const mapRef = useRef(null);
    const [markerPosition, setMarkerPosition] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [calculateDistanceAfterUpdate, setCalculateDistanceAfterUpdate] = useState(false);
    const [nextScreenEnabled, setNextScreenEnabled] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [buttonText, setButtonText] = useState("Check");
    const [score, setScore] = useState(0);

    const setMark = async () => {
        if (mapRef.current) {
            const camera = await mapRef.current.getCamera();

            const newMarkerPosition = {
                latitude: camera.center.latitude,
                longitude: camera.center.longitude,
            };
            setMarkerPosition([newMarkerPosition]);
        }
    };
    const check = () => {
        if (markerPosition.length === 0) {
            noPin();
            return;
        }
        if (selectedQuestion) {
            const { lat, lon } = selectedQuestion;
            setMarkerPosition(prevPositions => [...prevPositions, { latitude: lat, longitude: lon }]);
            setCalculateDistanceAfterUpdate(true);
            setButtonText("Pròxima pregunta");
        }
    }

    const calculateDistance = () => {
        if (markerPosition.length === 2) {
            const [marker1, marker2] = markerPosition;
            const distance = distanceCalculator(
                marker1.latitude,
                marker1.longitude,
                marker2.latitude,
                marker2.longitude
            );
            setDistance("Diferència: " + distance.toFixed(2) + " km");
        }
    };

    const resetMap = () => {
        setMarkerPosition([]);
        setDistance("?");
        setButtonText("Check");
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prevQuestion => prevQuestion + 1)
        }
        else {
            setNextScreenEnabled(true)
        }
        if (markerPosition.length === 2 && selectedQuestion) {
            const { lat, lon } = selectedQuestion;
            const [markerLat, markerLon] = [markerPosition[0].latitude, markerPosition[0].longitude];
            const distance = distanceCalculator(markerLat, markerLon, lat, lon);

            let newScore = 0;
            if (distance <= 50) {
                newScore = 100;
            } else if (distance <= 200) {
                newScore = 75;
            } else if (distance <= 500) {
                newScore = 50;
            } else if (distance <= 1000) {
                newScore = 25;
            } else if (distance <= 2000) {
                newScore = 10;
            }
            setScore(prevScore => prevScore + newScore);
        }
    };

    const noPin = () => {
        Alert.alert('Si us plau, posi un pin.')
    }

    useEffect(() => {
        if (calculateDistanceAfterUpdate) {
            calculateDistance();
            setCalculateDistanceAfterUpdate(false);
        }
    }, [calculateDistanceAfterUpdate]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const locationsCol = collection(db, 'Locations');
                const snapshot = await getDocs(locationsCol);

                const questionsList = [];
                snapshot.forEach(doc => {
                    questionsList.push({
                        id: doc.id,
                        title: doc.data().title,
                        lat: doc.data().lat,
                        lon: doc.data().lon,
                    });
                });
                setQuestions(questionsList);
                setSelectedQuestion(questionsList[currentQuestion]);
            } catch (error) {
                console.log(error)
            }
        }
        fetchQuestions();
    }, [currentQuestion])

    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize: 20}}>{getDistance}</Text>
            <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10, gap: 50}}>
                <Button
                    title="Set Mark"
                    onPress={setMark}
                    disabled={nextScreenEnabled || buttonText === "Pròxima pregunta"}
                />
                <Button
                    title={buttonText}
                    onPress={() => {
                        if (buttonText === "Check") {
                            check();
                        } else {
                            resetMap();
                        }
                    }}
                    disabled={nextScreenEnabled}
                />
            </View>
            <View style={styles.map}>
                <MapView ref={mapRef} style={{width: '100%', height: '100%'}} mapType='satellite'>
                    {markerPosition.map((position, index) => (
                        <Marker key={index} coordinate={position} title={`Marcador ${index + 1}`}
                                description={`Este es el centro del mapa ${index + 1}`}/>
                    ))}
                    {markerPosition.length === 2 && (
                        <Polyline
                            coordinates={markerPosition}
                            strokeWidth={2}
                            strokeColor="blue"
                        />
                    )}
                </MapView>
                <View pointerEvents="none" style={styles.mapCenterMarkerView}>
                    <Image
                        style={{width: '10%', height: '10%'}}
                        source={CrosshairImage}
                    />
                </View>
            </View>
            {questions.length > 0 && !nextScreenEnabled && (
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>{questions[currentQuestion].title}</Text>
            )}
            {nextScreenEnabled && (
                <Button
                    title="Next Screen"
                    onPress={() => navigation.navigate('ScoreScreen', {score: score})}
                />
            )}
        </View>
    );

    function distanceCalculator(lat1, lon1, lat2, lon2) {
        // Converteix les coordenades de graus a radians
        const deg2rad = (deg) => deg * (Math.PI / 180);
        const rad2deg = (rad) => rad * (180 / Math.PI);

        const R = 6371; // Radi mitjà de la Terra en quilòmetres
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        // Distància en quilòmetres
        const distance = R * c;
        return distance;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '90%',
        height: '60%',
        backgroundColor: 'red',
        marginBottom: 10,
        marginTop: 20
    },
    mapCenterMarkerView: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
    },
});