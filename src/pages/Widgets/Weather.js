import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { AsyncStorage } from "react-native";

export default function WeatherWidget() {
  const [weather, setWeather] = useState({});
  const [currentTemperature, setCurrentTemperature] = useState(null);
  const [maxTemperature, setMaxTemperature] = useState(null);
  const [minTemperature, setMinTemperature] = useState(null);
  const [dailyWeatherCode, setDailyWeatherCode] = useState(0);
  const [hourlyTemperatures, setHourlyTemperatures] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [hourlyWeatherCodes, setHourlyWeatherCodes] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const currentHour = new Date().getHours();

  const [currentLocation, setCurrentLocation] = useState(null);
  const [newLocation, setNewLocation] = useState(null);

  const [city, setCity] = useState(null);

  const weatherCodes = {
    0: "weather-sunny",
    1: "weather-partly-cloudy",
    2: "weather-partly-cloudy",
    3: "weather-cloudy",
    45: "weather-fog",
    48: "weather-fog",
    51: "weather-rainy",
    53: "weather-rainy",
    55: "weather-rainy",
    56: "weather-snowy-rainy",
    57: "weather-snowy-rainy",
    61: "weather-pouring",
    63: "weather-pouring",
    65: "weather-pouring",
    66: "weather-snowy-rainy",
    67: "weather-snowy-rainy",
    71: "weather-snowy",
    73: "weather-snowy",
    75: "weather-snowy",
    77: "weather-hail",
    80: "weather-pouring",
    81: "weather-pouring",
    82: "weather-lightning-rainy",
    85: "weather-snowy",
    86: "weather-snowy",
    95: "weather-lightning",
    96: "weather-lightning-rainy",
    99: "weather-hail",
  };

  const weatherColors = {
    0: "#42A5F5", // Clear sky (Blue)
    1: "#90A4AE", // Mainly clear (Gray)
    2: "#90A4AE", // Partly cloudy (Gray)
    3: "#616161", // Overcast (Dark Gray)
    45: "#B0BEC5", // Fog and depositing rime fog (Silver)
    48: "#B0BEC5", // Fog and depositing rime fog (Silver)
    51: "#64B5F6", // Drizzle: Light intensity (Light Blue)
    53: "#42A5F5", // Drizzle: Moderate intensity (Blue)
    55: "#1976D2", // Drizzle: Dense intensity (Dark Blue)
    56: "#81C784", // Freezing Drizzle: Light intensity (Green)
    57: "#4CAF50", // Freezing Drizzle: Dense intensity (Green)
    61: "#FFD600", // Rain: Slight intensity (Yellow)
    63: "#FFB300", // Rain: Moderate intensity (Amber)
    65: "#FF8F00", // Rain: Heavy intensity (Orange)
    66: "#FFA000", // Freezing Rain: Light intensity (Orange)
    67: "#FF6F00", // Freezing Rain: Heavy intensity (Deep Orange)
    71: "#E57373", // Snow fall: Slight intensity (Light Red)
    73: "#EF5350", // Snow fall: Moderate intensity (Red)
    75: "#D32F2F", // Snow fall: Heavy intensity (Dark Red)
    77: "#90A4AE", // Snow grains (Gray)
    80: "#FFD600", // Rain showers: Slight intensity (Yellow)
    81: "#FFB300", // Rain showers: Moderate intensity (Amber)
    82: "#FF7043", // Rain showers: Violent intensity (Deep Orange)
    85: "#E57373", // Snow showers: Slight intensity (Light Red)
    86: "#EF5350", // Snow showers: Heavy intensity (Red)
    95: "#FFD600", // Thunderstorm: Slight (Yellow)
    96: "#FFA000", // Thunderstorm with slight hail (Orange)
    99: "#FF6F00", // Thunderstorm with heavy hail (Deep Orange)
  };

  const textColors = {
    0: "#FFFFFF", // Clear sky (White)
    1: "#000000", // Mainly clear (Black)
    2: "#000000", // Partly cloudy (Black)
    3: "#FFFFFF", // Overcast (White)
    45: "#000000", // Fog and depositing rime fog (Black)
    48: "#000000", // Fog and depositing rime fog (Black)
    51: "#000000", // Drizzle: Light intensity (Black)
    53: "#FFFFFF", // Drizzle: Moderate intensity (White)
    55: "#FFFFFF", // Drizzle: Dense intensity (White)
    56: "#000000", // Freezing Drizzle: Light intensity (Black)
    57: "#FFFFFF", // Freezing Drizzle: Dense intensity (White)
    61: "#000000", // Rain: Slight intensity (Black)
    63: "#000000", // Rain: Moderate intensity (Black)
    65: "#FFFFFF", // Rain: Heavy intensity (White)
    66: "#000000", // Freezing Rain: Light intensity (Black)
    67: "#FFFFFF", // Freezing Rain: Heavy intensity (White)
    71: "#FFFFFF", // Snow fall: Slight intensity (White)
    73: "#FFFFFF", // Snow fall: Moderate intensity (White)
    75: "#FFFFFF", // Snow fall: Heavy intensity (White)
    77: "#000000", // Snow grains (Black)
    80: "#000000", // Rain showers: Slight intensity (Black)
    81: "#000000", // Rain showers: Moderate intensity (Black)
    82: "#FFFFFF", // Rain showers: Violent intensity (White)
    85: "#FFFFFF", // Snow showers: Slight intensity (White)
    86: "#FFFFFF", // Snow showers: Heavy intensity (White)
    95: "#000000", // Thunderstorm: Slight (Black)
    96: "#000000", // Thunderstorm with slight hail (Black)
    99: "#000000", // Thunderstorm with heavy hail (Black)
  };

  const weatherColor = useMemo(
    () => weatherColors[weather.current_weather?.weathercode] || "#42a5f5",
    [weather.current_weather?.weathercode]
  );

  async function getWeather() {
    try {
      const newLocation = await askLocationPermission();
      const res = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${newLocation.latitude}&longitude=${newLocation.longitude}&current_weather=true&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Europe%2FLondon&forecast_days=1`
      );
      const weatherData = res.data;
      if (!weatherData || !weatherData.current_weather) {
        console.error("Weather data is not available.");
        return;
      }
      setCurrentLocation((currentLocation) => {
        if (!currentLocation) {
          return newLocation;
        }
        return currentLocation;
      });
      setNewLocation(newLocation);
      setCurrentTemperature(weatherData.current_weather.temperature);
      setMaxTemperature(weatherData.daily.temperature_2m_max);
      setMinTemperature(weatherData.daily.temperature_2m_min);
      setDailyWeatherCode(weatherData.daily.weathercode);
      const filteredHourlyTemperatures =
        weatherData.hourly.temperature_2m.slice(currentHour);
      const filteredHourlyWeatherCodes =
        weatherData.hourly.weathercode.slice(currentHour);
      setHourlyTemperatures(filteredHourlyTemperatures);
      setHourlyWeatherCodes(filteredHourlyWeatherCodes);
      setWeather(weatherData);
    } catch (error) {
      console.error(error);
    }
  }

  async function askLocationPermission() {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Geolocation is not supported by this browser.");
      } else {
        const position = await Location.getCurrentPositionAsync({});
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        return { latitude, longitude };
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  useEffect(() => {
    async function initializeLocation() {
      try {
        const currentLocation = await askLocationPermission();
        setCurrentLocation(currentLocation);
      } catch (error) {
        console.error(error);
      }
    }

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
        async (location) => {
          setCurrentLocation(location.coords);

          let address = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });

          setCity(address[0].city);
        }
      );
    };

    getLocation();

    initializeLocation();
  }, []);

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: weatherColor,
        },
      ]}
    >
      <View style={{ paddingTop: "3%" }}>
        {city && (
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              fontFamily: "HammersmithOne-Regular",
              color: textColors[weather.current_weather?.weathercode]
            }}
          >
            {city}
          </Text>
        )}
      </View>
      <View style={styles.currentWeatherContainer}>
        <Text
          style={[
            styles.weather,
            {
              color: textColors[weather.current_weather?.weathercode],
              fontSize: 30,
            },
          ]}
        >
          {currentTemperature != null ? `${currentTemperature}° C` : ""}
        </Text>
        <MaterialCommunityIcons
          name={weatherCodes[weather.current_weather?.weathercode]}
          style={styles.weatherIcons}
          size={40}
          color={textColors[weather.current_weather?.weathercode]}
        />
      </View>
      <View style={styles.temperatureContainer}>
        <MaterialCommunityIcons
          name={weatherCodes[1]}
          color={textColors[weather.current_weather?.weathercode]}
          size={24}
          paddingLeft={5}
        />
        <MaterialCommunityIcons
          name="arrow-down"
          size={24}
          color={textColors[weather.current_weather?.weathercode]}
        />
        <Text
          style={{ color: textColors[weather.current_weather?.weathercode] }}
        >
          {minTemperature != null ? `${minTemperature}°` : ""}
        </Text>
        <MaterialCommunityIcons
          name="arrow-up"
          size={24}
          color={textColors[weather.current_weather?.weathercode]}
        />
        <Text
          style={{ color: textColors[weather.current_weather?.weathercode] }}
        >
          {maxTemperature != null ? `${maxTemperature}°` : ""}
        </Text>
      </View>
      <View style={styles.dailyWeatherContainer}>
        <FlatList
          horizontal
          data={hourlyTemperatures}
          keyExtractor={(item, index) => index.toString()}
          extraData={weather.current_weather?.weathercode}
          renderItem={({ item, index }) => (
            <View style={[styles.hourlyTemperatureContainer]}>
              <Text
                style={{
                  color: textColors[weather.current_weather?.weathercode],
                }}
              >
                {index + currentHour + 1 === 24
                  ? "00:00"
                  : (index + currentHour + 1 < 10 ? "0" : "") +
                    (index + currentHour + 1) +
                    ":00"}
              </Text>
              <MaterialCommunityIcons
                name={weatherCodes[hourlyWeatherCodes[index]]}
                style={styles.hourlyWeatherIcon}
                size={24}
                color={textColors[weather.current_weather?.weathercode]}
              />
              <Text
                style={{
                  color: textColors[weather.current_weather?.weathercode],
                }}
              >
                {item != null ? `${item}°` : ""}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    width: "90%",
  },
  currentWeatherContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 5,
  },
  temperatureContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    paddingBottom: 10,
  },
  dailyWeatherContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginHorizontal: 10,
    paddingBottom: 15,
  },
  weather: {
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 10,
  },
  weatherIcons: {
    marginHorizontal: 10,
  },
  hourlyTemperatureContainer: {
    paddingHorizontal: 8,
    alignItems: "center",
  },
});
