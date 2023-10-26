import axios from "axios";
import { Buffer } from "buffer";
import { REACT_APP_X_GROUP_AUTHORIZATION } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import savedEmployees from "../save/employees.json";
import savedEmployeeDetails from "../save/employeeDetails.json";

const API_URL = "https://masurao.fr/api";

/**
 * Effectue une demande de connexion utilisateur à l'API distante.
 * @param email L'adresse e-mail de l'utilisateur.
 * @param password Le mot de passe de l'utilisateur.
 * @returns Une promesse qui se résout aux données de réponse de l'API.
 */
export const userLogin = async (email: string, password: string) => {
  const headers = {
    accept: "application/json",
    "X-Group-Authorization": REACT_APP_X_GROUP_AUTHORIZATION,
    "Content-Type": "application/json",
  };
  const data = {
    email,
    password,
  };
  const response = await axios.post(API_URL + "/employees/login", data, {
    headers,
  });
  console.log("AAAAAAA" + response.data.access_token);
  return { status: response.status, token: response.data.access_token };
};

/**
 * Effectue une demande pour récupérer les informations de l'utilisateur actuellement connecté à l'API distante.
 * @param token Le jeton d'authentification de l'utilisateur.
 * @returns Une promesse qui se résout aux données de réponse de l'API.
 */
export const getCurrentUser = async (token: string) => {
  const headers = {
    accept: "application/json",
    "X-Group-Authorization": REACT_APP_X_GROUP_AUTHORIZATION,
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };
  try {
    const response = await axios.get(API_URL + "/employees/me", {
      headers,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getEmployees = async (token: string) => {
  const headers = {
    accept: "application/json",
    "X-Group-Authorization": REACT_APP_X_GROUP_AUTHORIZATION,
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };
  try {
    const response = await axios.get(API_URL + "/employees", {
      headers,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return savedEmployees;
  }
};

export const getEmployeePhoto = async (token: string, id: number) => {
  const headers = {
    accept: "image/png",
    "X-Group-Authorization": REACT_APP_X_GROUP_AUTHORIZATION,
    Authorization: "Bearer " + token,
  };
  const response = await axios.get(API_URL + `/employees/${id}/image`, {
    headers,
    responseType: "arraybuffer",
  });
  return Buffer.from(response.data, "binary").toString("base64");
};

export const getEmployeeDetails = async (token: string, id: number) => {
  const headers = {
    accept: "application/json",
    "X-Group-Authorization": REACT_APP_X_GROUP_AUTHORIZATION,
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };
  try {
    const response = await axios.get(API_URL + `/employees/${id}`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return savedEmployeeDetails[id - 1];
  }
};

export const getLeaders = async (token: string) => {
  const headers = {
    accept: "application/json",
    "X-Group-Authorization": REACT_APP_X_GROUP_AUTHORIZATION,
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await axios.get(API_URL + "/employees/leaders", {
    headers,
  });
  const leaderIds = response.data.map((leader) => leader.id);
  return leaderIds;
};

// mock api call for login using '../data/login.json' to simulate existing users, returns 200 if credentials are correct, 401 if not

interface User {
  email: string;
  password: string;
}

const users: User[] = [
  { email: "john.doe@example.com", password: "password123" },
  { email: "jane.doe@example.com", password: "password456" },
  { email: "bob.smith@example.com", password: "password789" },
  { email: "admin", password: "admin" },
];

export const apiLogin = (email: string, password: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    for (const user of users) {
      if (user.email === email && user.password === password) {
        resolve(200);
      }
    }
    reject(401);
  });
};

// ASYNC STORAGE

export const storeToken = async (token: string) => {
  try {
    await AsyncStorage.setItem("@MySuperStore:token", token);
  } catch (error) {
    console.log("Error saving token:", error);
  }
};

export const retrieveToken = async () => {
  try {
    const token = await AsyncStorage.getItem("@MySuperStore:token");
    console.log("Token retrieved:", token);
    return token;
  } catch (error) {
    console.log("Error retrieving token:", error);
  }
};

export const storeTheme = async (isDark: boolean) => {
  try {
    await AsyncStorage.setItem(
      "@MySuperStore:theme",
      isDark ? "dark" : "light"
    );
  } catch (error) {
    console.log("Error saving theme:", error);
  }
};

export const retrieveTheme = async () => {
  try {
    const theme = await AsyncStorage.getItem("@MySuperStore:theme");
    console.log("Theme retrieved:", theme);
    return theme === "dark";
  } catch (error) {
    console.log("Error retrieving theme:", error);
  }
};

export const storeId = async (id: number) => {
  try {
    await AsyncStorage.setItem("@MySuperStore:id", id.toString());
  } catch (error) {
    console.log("Error saving id:", error);
  }
};

export const retrieveId = async () => {
  try {
    const id = await AsyncStorage.getItem("@MySuperStore:id");
    console.log("Id retrieved:", id);
    return id;
  } catch (error) {
    console.log("Error retrieving id:", error);
  }
};

export const storeDisplayedWidgets = async (widgets: boolean[]) => {
  try {
    const widgetsString = JSON.stringify(widgets);
    await AsyncStorage.setItem("@MySuperStore:displayedWidgets", widgetsString);
    console.log("Displayed widgets saved:", widgets);
  } catch (error) {
    console.log("Error saving displayed widgets:", error);
  }
};

export const retrieveDisplayedWidgets = async () => {
  try {
    const widgetsString = await AsyncStorage.getItem(
      "@MySuperStore:displayedWidgets"
    );
    const widgets = widgetsString != null ? JSON.parse(widgetsString) : null;
    console.log("Displayed widgets retrieved:", widgets);
    return widgets;
  } catch (error) {
    console.log("Error retrieving displayed widgets:", error);
  }
};
// METEO API CALL
