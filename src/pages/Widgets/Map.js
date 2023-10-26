import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Modal, Pressable } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const MapDisplay = (props) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { theme } = props;

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      let location = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (location) => {
          setCurrentLocation(location.coords);
          setInitialRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });
        }
      );
    };
    getLocation();
  }, []);

  const handleClose = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.button,
          styles.buttonOpen,
          { backgroundColor: theme.fourthColor },
        ]}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={[styles.textStyle, { color: theme.primaryColor }]}>
          Open Map
        </Text>
      </Pressable>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={handleClose}
      >
        {initialRegion && (
          <View style={styles.container}>
            <MapView style={styles.map} initialRegion={initialRegion}>
              {currentLocation && (
                <Marker coordinate={currentLocation} title="Your Location" />
              )}
            </MapView>
            <Pressable style={styles.buttonClose} onPress={handleClose}>
              <Text style={styles.textStyleClose}>Close Map</Text>
            </Pressable>
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  button: {
    height: 70,
    width: "90%",
    top: "15%",
    marginBottom: "3%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  textStyle: {
    fontFamily: "HammersmithOne-Regular",
    fontSize: 30,
  },
  buttonClose: {
    position: "absolute",
    width: "50%",
    backgroundColor: "#f44336",
    borderRadius: 20,
    alignSelf: "center",
    bottom: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  textStyleClose: {
    fontFamily: "HammersmithOne-Regular",
    fontSize: 30,
    color: "white",
    position: "relative",
  },
});

export default MapDisplay;
