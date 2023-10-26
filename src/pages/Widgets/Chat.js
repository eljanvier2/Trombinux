import React, { useEffect, useState, useMemo } from "react";
import {
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
} from "react-native";
import { getCurrentTheme } from "../../components/Colors";
import { getEmployeePhoto } from "../../Api";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import { getMessages, sendMessage } from "../../Firebase";
import { text } from "@fortawesome/fontawesome-svg-core";

export default function ChatWidget(props) {
  const { username, userId, userToken, theme } = props;
  const [photos, setPhotos] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);

  async function loadPhotos(token) {
    const promises = messages.map((message) =>
      getEmployeePhoto(token, message.senderId).then((res) => {
        const base64Url = `data:image/png;base64,${res}`;
        return { id: message.senderId, photo: base64Url };
      })
    );
    const photos = await Promise.all(promises);
    const newPhotos = {};
    for (const photo of photos) {
      newPhotos[photo.id] = photo.photo;
    }
    return newPhotos;
  }

  const handleButtonPress = () => {
    setModalVisible(true);
  };

  const handleSendMessage = (text) => {
    const newMessage = {
      sender: username,
      senderId: userId,
      text: text,
      time: new Date().toLocaleTimeString(),
      date: new Date(),
    };
    setMessages([...messages, newMessage]);
    sendMessage(userId, newMessage);
  };

  useEffect(() => {
    getMessages().then((resMessages) => {
      if (!Array.isArray(resMessages)) {
        resMessages = [resMessages];
      }
      setMessages(resMessages);
    });
  }, []);

  useEffect(() => {
    loadPhotos(userToken).then((resPhotos) => {
      setPhotos(resPhotos);
    });
  }, [messages]);

  const sortedMessages = useMemo(() => {
    if (messages.length > 0) {
      return messages.sort(function (a, b) {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA.getTime() === dateB.getTime()) {
          return a.time.localeCompare(b.time);
        } else {
          return dateA.getTime() - dateB.getTime();
        }
      });
    } else {
      return [];
    }
  }, [messages]);
  console.log("AAAAAA")
  if (messages.length > 0) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => handleButtonPress()}>
          <FlatList
            scrollEnabled={false}
            data={sortedMessages.slice(-3)}
            keyExtractor={(item, index) => index.toString()}
            backgroundColor={theme.primaryColor}
            renderItem={({ item }) => (
              <View style={styles.message}>
                <View style={styles.profilePic}>
                  {photos[item.semderId] != "" ? (
                    <Image
                      source={{ uri: photos[item.senderId] }}
                      style={styles.profilePicImage}
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
                </View>
                <View
                  style={[
                    styles.messageContainer,
                    { backgroundColor: theme.fourthColor },
                  ]}
                >
                  <Text style={[styles.text, { color: theme.primaryColor }]}>
                    {item.text}
                  </Text>
                  <View style={styles.messageBottom}>
                    <Text
                      style={[styles.sender, { color: theme.primaryColor }]}
                    >
                      {item.sender == username ? "Me" : item.sender}
                    </Text>
                    <Text style={[styles.time, { color: theme.primaryColor }]}>
                      {item.time}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          />
        </TouchableOpacity>
        <Modal
          visible={modalVisible}
          style={{ backgroundColor: theme.primaryColor }}
        >
          <View style={{ padding: "15%", backgroundColor: theme.primaryColor }}>
            <TouchableOpacity
              style={{
                position: "absolute",
                marginTop: "20%",
                left: "2%",
                width: 40,
                height: 40,
              }}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={50}
                color={theme.fourthColor}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            scrollEnabled={true}
            data={sortedMessages}
            style={{ paddingTop: "10%", marginBottom: 50 }}
            keyExtractor={(item, index) => index.toString()}
            backgroundColor={theme.primaryColor}
            renderItem={({ item }) => (
              <View style={styles.message}>
                <View style={styles.profilePic}>
                  <Image
                    source={{ uri: photos[item.senderId] }}
                    style={styles.profilePicImage}
                  />
                </View>
                <View
                  style={[
                    styles.messageContainer,
                    { backgroundColor: theme.fourthColor },
                  ]}
                >
                  <Text style={[styles.text, { color: theme.primaryColor }]}>
                    {item.text}
                  </Text>
                  <View style={styles.messageBottom}>
                    <Text
                      style={[styles.sender, { color: theme.primaryColor }]}
                    >
                      {item.sender}
                    </Text>
                    <Text style={[styles.time, { color: theme.primaryColor }]}>
                      {item.time}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          />
          <View
            style={[
              styles.inputContainer,
              { backgroundColor: theme.primaryColor },
            ]}
          >
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.secondaryColor,
                  color: theme.fourthColor,
                },
              ]}
              placeholder="Type your message here"
              placeholderTextColor={theme.fourthColor}
              onSubmitEditing={(event) => handleSendMessage(messageText)}
              onChangeText={(text) => setMessageText(text)}
            />
            <TouchableOpacity onPress={() => handleSendMessage(messageText)}>
              <MaterialCommunityIcons
                name="send"
                size={24}
                color={theme.fourthColor}
              />
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  } else {
    return (
      <View
        style={{
          width: "90%",
          height: "60%",
          justifyContent: "center",
          marginTop: 20,
          marginRight: 20,
          marginLeft: 20,
          borderRadius: 20,
          backgroundColor: "#EBEBEB",
        }}
      >
        <TouchableOpacity onPress={() => handleButtonPress()}>
          <Text style={{ textAlign: "center", color: theme.primaryColor }}>
            No messages yet
          </Text>
        </TouchableOpacity>
        <Modal
          visible={modalVisible}
          style={{ backgroundColor: theme.primaryColor }}
        >
          <View style={{ padding: "15%", backgroundColor: theme.primaryColor }}>
            <TouchableOpacity
              style={{
                position: "absolute",
                marginTop: "20%",
                left: "2%",
                width: 40,
                height: 40,
              }}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={50}
                color={theme.fourthColor}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            scrollEnabled={true}
            data={sortedMessages}
            style={{ paddingTop: "10%", marginBottom: 50 }}
            keyExtractor={(item, index) => index.toString()}
            backgroundColor={theme.primaryColor}
            renderItem={({ item }) => (
              <View style={styles.message}>
                <View style={styles.profilePic}>
                  <Image
                    source={{ uri: photos[item.senderId] }}
                    style={styles.profilePicImage}
                  />
                </View>
                <View
                  style={[
                    styles.messageContainer,
                    { backgroundColor: theme.fourthColor },
                  ]}
                >
                  <Text style={[styles.text, { color: theme.primaryColor }]}>
                    {item.text}
                  </Text>
                  <View style={styles.messageBottom}>
                    <Text
                      style={[styles.sender, { color: theme.primaryColor }]}
                    >
                      {item.sender}
                    </Text>
                    <Text style={[styles.time, { color: theme.primaryColor }]}>
                      {item.time}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          />
          <View
            style={[
              styles.inputContainer,
              { backgroundColor: theme.primaryColor },
            ]}
          >
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.secondaryColor,
                  color: theme.fourthColor,
                },
              ]}
              placeholder="Type your message here"
              placeholderTextColor={theme.fourthColor}
              onSubmitEditing={(event) => handleSendMessage(messageText)}
              onChangeText={(text) => setMessageText(text)}
            />
            <TouchableOpacity onPress={() => handleSendMessage(messageText)}>
              <MaterialCommunityIcons
                name="send"
                size={24}
                color={theme.fourthColor}
              />
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "flex-end",
    justifyContent: "center",
    flex: 1,
  },
  message: {
    flexDirection: "row",
  },
  profilePic: {
    backgroundColor: "white",
    width: "20%",
    height: 70,
    overflow: "hidden",
    marginLeft: "5%",
    marginRight: "5%",
    marginBottom: 10,
    borderRadius: 100,
  },
  profilePicImage: {
    width: "100%",
    height: "100%",
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    width: "65%",
    marginRight: "5%",
  },
  messageBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sender: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  time: {
    marginBottom: 5,
  },
  text: {
    paddingBottom: 10,
  },
  modal: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  modalContainer: {
    alignSelf: "center",
    marginTop: -100,
    position: "absolute",
    borderRadius: 20,
    width: "80%",
    height: "55%",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    alignSelf: "flex-start",
    borderRadius: 5,
    marginTop: 20,
    marginLeft: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "center",
    padding: 10,
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingBottom: 60,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
});
