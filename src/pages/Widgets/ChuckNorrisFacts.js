import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import axios from "axios";
import { theme } from "../../components/Colors";

const ChuckNorrisFacts = (props) => {
  const [fact, setFact] = useState("");
  const { theme } = props;

  useEffect(() => {
    axios
      .get("https://api.chucknorris.io/jokes/random")
      .then((response) => setFact(response.data.value))
      .catch((error) => console.log(error));
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.fourthColor }]}>
      <Text style={[styles.title, { color: theme.primaryColor }]}>
        Chuck Norris Facts
      </Text>
      <Text style={[styles.fact, { color: theme.primaryColor }]}>{fact}</Text>
    </View>
  );
};
console.log("chucknorris")
    console.log(theme)
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    padding: 14,
    width: "90%",
    minWidth: "90%",
    marginTop: 10,
  },
  title: {
    fontFamily: "HammersmithOne-Regular",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  fact: {
    fontSize: 18,
    fontStyle: "italic",
    color: "white",
    textAlign: "center",
    maxWidth: "100%",
  },
});

export default ChuckNorrisFacts;
