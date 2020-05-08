import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";

import kioskit from "./markers/kioskit.json";

const App = () => {
  return (
    <View style={styles.container}>
      <MapView style={styles.mapStyle}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default App;
