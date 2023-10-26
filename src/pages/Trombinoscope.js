import React from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import {
  getCurrentUser,
  getEmployees,
  getEmployeePhoto,
  getLeaders,
  getEmployeeDetails,
} from "../Api";
import CurrentDate from "../components/Date";
import { FlatList } from "react-native-gesture-handler";
import * as Font from "expo-font";
import { getCurrentTheme } from "../components/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Trombinoscope({ route }) {
  const [currentUser, setCurrentUser] = useState({});
  const [leaderIds, setLeaderIds] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [photos, setPhotos] = useState({});
  const [lastPhotoIndex, setLastPhotoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);
  const [userToken, setUserToken] = useState(route.params.userToken);
  const [theme, setTheme] = useState(route.params.theme);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEmployee, setModalEmployee] = useState({});
  const [modalEmployeePhoto, setModalEmployeePhoto] = useState("");

  const loadNextPhotos = async (token) => {
    const newEmployees = employees;
    const promises = newEmployees.map((employee) =>
      getEmployeePhoto(token, employee.id).then((res) => {
        const base64Url = `data:image/png;base64,${res}`;
        return { id: employee.id, photo: base64Url };
      })
    );
    promises.forEach((promise) => {
      promise.then((photo) => {
        setPhotos((prevPhotos) => ({
          ...prevPhotos,
          [photo.id]: photo.photo,
        }));
      });
    });
    await Promise.all(promises);
  };

  const loadNextEmployees = async () => {
    console.log("Loading next photos");
    setIsLoading(true);
    setEmployees(allEmployees.slice(0, lastPhotoIndex + 8));
    const newEmployees = employees;
    setLastPhotoIndex(lastPhotoIndex + 8);
    setIsLoading(false);
  };

  const handlePress = async (token) => {
    if (lastPhotoIndex > 0) {
      return;
    }
    const newCurrentUser = await getCurrentUser(token);
    setCurrentUser(newCurrentUser);
    getLeaders(token).then((res) => {
      setLeaderIds(res);
    });
    console.log(leaderIds);
    const newEmployees = await getEmployees(token).then((res) => {
      if (res.length > 0) {
        return res;
      }(res )
    });
    setAllEmployees(newEmployees);
    setEmployees(newEmployees.slice(0, 12));
    const promises = newEmployees.slice(0, 12).map((employee) =>
      getEmployeePhoto(token, employee.id).then((res) => {
        const base64Url = `data:image/png;base64,${res}`;
        return { id: employee.id, photo: base64Url };
      })
    );
    const photos = await Promise.all(promises);
    const newPhotos = {};
    for (const photo of photos) {
      newPhotos[photo.id] = photo.photo;
    }
    setPhotos(newPhotos);
    setLastPhotoIndex(12);
  };

  const handleEndReached = () => {
    console.log("End reached");
    console.log(isLoading);
    if (!isLoading) {
      console.log("Loading next photos");
      loadNextEmployees();
      loadNextPhotos(userToken);
    }
  };

  const handleButtonPress = (index) => {
    if (modalVisible) {
      return;
    }
    getEmployeeDetails(userToken, index).then((res) => {
      setModalEmployee(res);
    });
    setModalEmployeePhoto(photos[index]);
    setModalVisible(true);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
    setModalEmployee({});
  };
console.log("AAAEEEEE")
  const renderEmployee = ({ item }) => {
    return (
      <View style={[styles.employee, { margin: 20, alignContent: "center" }]}>
        <TouchableOpacity onPress={() => handleButtonPress(item.id)}>
          {photos[item.id] !== undefined ? (
            <Image
              source={{ uri: photos[item.id] }}
              style={{ width: 125, height: 125, borderRadius: 20 }}
            />
          ) : (
            <MaterialCommunityIcons
              name="account"
              size={125}
              style={{
                borderRadius: 20,
                backgroundColor: "#EBEBEB",
                textAlign: "center",
                textAlignVertical: "center",
              }}
            />
          )}
          <Text
            style={{
              color: leaderIds.includes(item.id) ? "red" : theme.fourthColor,
              fontSize: 16,
              fontFamily: "HammersmithOne-Regular",
              textAlign: "center",
            }}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "HammersmithOne-Regular": require("../../assets/fonts/HammersmithOne-Regular.ttf"),
      });
      setFontLoaded(true);
    };
    loadFonts();
    handlePress(userToken);
  }, [employees]);
  if (!fontLoaded || !userToken) {
    return null;
  }
  return (
    <View style={[styles.container, { backgroundColor: theme.primaryColor }]}>
      <Text> </Text>
      <FlatList
        data={employees}
        renderItem={renderEmployee}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        scrollEnabled={!modalVisible}
      />
      {modalVisible && (
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <TouchableOpacity
              onPress={handleCloseModal}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Image
              source={{ uri: modalEmployeePhoto }}
              style={{
                width: 200,
                height: 200,
                borderRadius: 10,
                marginTop: 10,
              }}
            />
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>
              {modalEmployee.gender == "Male"
                ? "Mr. "
                : modalEmployee.gender == "Female"
                ? "Mrs. "
                : ""}
              {modalEmployee.name} {modalEmployee.surname}
            </Text>
            <Text style={{ fontSize: 20 }}>{modalEmployee.work}</Text>
            <View style={{ flexDirection: "row" }}>
              <Text>E-mail: </Text>
              <Text style={{ color: "blue", textDecorationLine: "underline" }}>
                {modalEmployee.email}
              </Text>
            </View>

            <Text>Birthdate: {modalEmployee.birth_date}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  employee: {
    margin: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: 135,
    height: 120,
  },
  modal: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  modalContainer: {
    position: "absolute",
    borderRadius: 20,
    width: "80%",
    height: "55%",
    backgroundColor: "#EBEBEB",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    alignSelf: "flex-start",
    borderRadius: 5,
    marginTop: 20,
    marginLeft: 20,
  },
  employeeName: {
    fontSize: 14,
  },
});
