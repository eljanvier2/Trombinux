import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Font from "expo-font";
import { retrieveId } from "../Api";
import { TextInput } from "react-native-gesture-handler";
import { addEmployeeTasks, getEmployeeTasks } from "../Firebase";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TaskList({ route }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [taskDescription, setTaskDescription] = useState("");
  const [userId, setUserId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [theme, setTheme] = useState(route.params.theme);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [remainingTasks, setRemainingTasks] = useState(0);

  const handleTaskDescriptionChange = (text) => {
    setTaskDescription(text);
  };

  const handleCheckboxChange = (task) => {
    setTasks((prevTasks) =>
      prevTasks.map((prevTask) =>
        prevTask === task
          ? { ...prevTask, validated: !prevTask.validated }
          : prevTask
      )
    );
    setTimeout(() => {
      console.log("tasks: " + tasks);
      setTasks((prevTasks) =>
        prevTasks.filter(
          (prevTask) => prevTask.description !== task.description
        )
      );
      addEmployeeTasks(
        "74",
        tasks.filter((prevTask) => prevTask.description !== task.description)
      );
    }, 2000);
  };

  const addTask = (task) => {
    const newTask = {
      description: task,
      validated: false,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    addEmployeeTasks(userId, tasks);
  };

  const handleAddTask = () => {
    addTask(taskDescription);
    setTaskDescription("");
    handleCloseModal();
  };

  const handleButtonPress = () => {
    setModalVisible(true);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
  };
  useEffect(() => {
    retrieveId().then((id) => {
      setUserId(id);
      getEmployeeTasks(id).then((tasks) => {
        setTasks(tasks);
        setRemainingTasks(tasks.filter((task) => !task.validated).length);
      });
    });
    const loadFonts = async () => {
      await Font.loadAsync({
        "HammersmithOne-Regular": require("../../assets/fonts/HammersmithOne-Regular.ttf"),
        ...MaterialCommunityIcons.font,
      });
      setFontLoaded(true);
    };
    loadFonts();
  }, []);
  useEffect(() => {
    setRemainingTasks(tasks.filter((task) => !task.validated).length);
  }, [tasks]);
  return (
    <View style={[styles.container, { backgroundColor: theme.primaryColor }]}>
      <View style={styles.title}>
        <Text style={[styles.remainingTasks, { color: theme.fourthColor }]}>
          {remainingTasks === 0
            ? "Bravo, vous avez fini toutes vos tâches !"
            : `Il vous reste ${remainingTasks} tâche${
                remainingTasks !== 1 ? "s" : ""
              } aujourd'hui`}
        </Text>
      </View>
      <View style={styles.taskList}>
        <FlatList
          data={tasks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.taskContainer}>
              <TouchableOpacity onPress={() => handleCheckboxChange(item)}>
                <MaterialCommunityIcons
                  style={[styles.checkbox, { color: theme.fourthColor }]}
                  name={
                    !item.validated
                      ? "checkbox-blank-outline"
                      : "checkbox-marked-outline"
                  }
                />
                <Text
                  style={[styles.taskDescription, { color: theme.fourthColor }]}
                >
                  {item.description}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.fourthColor }]}
        onPress={handleButtonPress}
      >
        <Text style={[styles.addButtonText, { color: theme.primaryColor }]}>
          +
        </Text>
      </TouchableOpacity>
      {modalVisible && (
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <TouchableOpacity
              onPress={handleCloseModal}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Task description"
              value={taskDescription}
              onChangeText={handleTaskDescriptionChange}
            />
            <TouchableOpacity
              style={styles.addTaskButton}
              onPress={handleAddTask}
            >
              <Text style={styles.buttonText}>Add Task</Text>
            </TouchableOpacity>
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
  },
  taskList: {
    width: "80%",
  },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  title: {
    alignItems: "center",
    width: "80%",
  },
  checkbox: {
    fontSize: 24,
    alignSelf: "center",
  },
  remainingTasks: {
    fontSize: 24,
    fontFamily: "HammersmithOne-Regular",
    marginVertical: 10,
    textAlign: "center",
  },
  taskDescription: {
    flex: 1,
    marginRight: 10,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    fontSize: 40,
    textAlign: "center",
  },
  modalContainer: {
    position: "absolute",
    borderRadius: 20,
    width: "80%",
    height: "80%",
    backgroundColor: "#EBEBEB",
    alignItems: "center",
  },
  modal: {
    flex: 1,
    width: "100%",
    alignItems: "flex-start",
  },
  input: {
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 35,
    padding: 8,
    marginVertical: 8,
    width: "80%",
    textAlign: "center",
    marginTop: 20,
    alignSelf: "center",
    fontSize: 16,
    fontFamily: "HammersmithOne-Regular",
  },
  closeButton: {
    alignSelf: "flex-start",
    borderRadius: 5,
    marginTop: 20,
    marginLeft: 20,
  },
  addTaskButton: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 20,
  },
});
