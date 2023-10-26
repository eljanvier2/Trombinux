import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import citationData from "../../../assets/citation.json";

export default function Citations(props) {
  const [citation, setCitation] = useState("");
  const { theme } = props;

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * citationData.length);
    setCitation(citationData[randomIndex]);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.fourthColor }]}>
      <Text
        style={[
          styles.citation,
          { backgroundColor: theme.fourthColor, color: theme.primaryColor },
        ]}
      >
        {citation}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    width: "45%",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EBEBEB",
    marginLeft: "5%",
    marginRight: "5%",
  },
  citation: {
    backgroundColor: "#EBEBEB",
    width: "80%",
    padding: 15,
    textAlign: "center",
    fontFamily: "HammersmithOne-Regular",
  },
});
