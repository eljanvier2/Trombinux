import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import * as Font from "expo-font";

function CurrentDate(props) {
  const [date, setDate] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);
  const { theme } = props;

  const celebrations = {
    "01/09": "Gilles",
    "02/09": "Ingrid",
    "03/09": "Grégoire",
    "04/09": "Rosalie",
    "05/09": "Raïssa",
    "06/09": "Bertrand",
    "07/09": "Reine",
    "08/09": "Adrien",
    "09/09": "Alain",
    "10/09": "Inès",
    "11/09": "Adelphe",
    "12/09": "Apolline",
    "13/09": "Aimé",
    "14/09": "Crescent",
    "15/09": "Roland",
    "16/09": "Édith",
    "17/09": "Renaud",
    "18/09": "Nadège",
    "19/09": "Émilie",
    "20/09": "Davy",
    "21/09": "Matthieu",
    "22/09": "Maurice",
    "23/09": "Constant",
    "24/09": "Thècle",
    "25/09": "Hermann",
    "26/09": "Côme",
    "27/09": "Vincent",
    "28/09": "Venceslas",
    "29/09": "Michel",
    "30/09": "Jérôme",
    "01/10": "Thérèse",
    "02/10": "Léger",
    "03/10": "Gérard",
    "04/10": "François",
    "05/10": "Fleur",
    "06/10": "Bruno",
    "07/10": "Serge",
    "08/10": "Pélagie",
    "09/10": "Denis",
    "10/10": "Ghislain",
    "11/10": "Firmin",
    "12/10": "Wilfried",
    "13/10": "Géraud",
    "14/10": "Juste",
    "15/10": "Thérèse",
    "16/10": "Édouard",
    "17/10": "Baudouin",
    "18/10": "Luc",
    "19/10": "René",
    "20/10": "Adeline",
    "21/10": "Céline",
    "22/10": "Elodie",
    "23/10": "Jean",
    "24/10": "Florentin",
    "25/10": "Crépin",
    "26/10": "Dimitri",
    "27/10": "Émeline",
    "28/10": "Simon",
    "29/10": "Narcisse",
    "30/10": "Bienvenue",
    "31/10": "Quentin",
  };

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        HammersmithOne: require("../../assets/fonts/HammersmithOne-Regular.ttf"),
      });
      setFontLoaded(true);
    };
    loadFonts();
  }, []);

  const currentDate =
    (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
    "/" +
    (date.getMonth() + 1 > 9 ? date.getMonth() : "0" + (date.getMonth() + 1));
  return (
    <View
      style={[
        {
          alignContent: "flex-start",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        },
      ]}
    >
      {fontLoaded && (
        <Text
          style={{ color: theme.fourthColor, fontFamily: "HammersmithOne" }}
        >
          Nous sommes le {currentDate}/{date.getFullYear()}
        </Text>
      )}
      {fontLoaded && (
        <Text
          style={{ color: theme.fourthColor, fontFamily: "HammersmithOne" }}
        >
          Et nous fetons les {celebrations[currentDate]}
        </Text>
      )}
    </View>
  );
}

export default CurrentDate;
