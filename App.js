import React, { useState, useEffect } from "react";
import { StatusBar, StyleSheet, Text, View, Dimensions } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";

// all map markers are consolidated in ready JSON data structure:
import kioskit from "./markers/kioskit.json";

const HomeScreen = () => {
  const [location, setLocation] = useState({
    latitude: 60.169297,
    longitude: 24.938435,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      // if (status !== 'granted') {
      //  setErrorMsg('Permission to access location was denied');
      // }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <MapView
        style={styles.mapStyle}
        region={location}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {kioskit.map((marker) => (
          <Marker
            key={marker.id}
            title={marker.title}
            description={marker.description}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
          >
            <Callout>
              <Text style={{ fontWeight: "bold" }}>{marker.title}</Text>
              <Text>{marker.description}</Text>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
      /*screenOptions={{
          headerStyle: {
            backgroundColor: "#dddddd",
          },
          headerTintColor: "#222244",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }} */
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "Jäätelökioskit",
            //headerStyle: {
            // backgroundColor: "#281e78",
            //},
            // headerTintColor: "#f2efd9",
            headerTitleStyle: {
              fontWeight: "bold",
              // fontFamily: "Copperplate",
              fontSize: 21,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#281E78",
    alignItems: "center",
    justifyContent: "center",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default App;
