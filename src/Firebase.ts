// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDoc, getFirestore, updateDoc,arrayUnion } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUjkaauhNdGbsnCObbAimhHeRKdZLge7Y",
  authDomain: "trombinux.firebaseapp.com",
  projectId: "trombinux",
  storageBucket: "trombinux.appspot.com",
  messagingSenderId: "121782541221",
  appId: "1:121782541221:web:8a51e1428770009734e64c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const getDb = () => {
  return getFirestore(app);
};

import { setDoc, doc, writeBatch } from "firebase/firestore";

export class Employee {
  "name": string;
  "surname": string;
  "email": string;
  "subordinates": string[];
  "work": string;
  "gender": string;
  "birthdate": string;
  "id": number;
  "tasks": { [key: number]: any }[];
}

export class Task {
  "id": number;
  "description": string;
  "validated": boolean;
}

export const createEmployeeDBSlot = async (employee: Employee, id: string) => {
  try {
    await setDoc(doc(db, "employees", id), {
      name: employee.name,
      surname: employee.surname,
      email: employee.email,
      tasks: employee.tasks,
    });
    console.log("Document written with ID: ", id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const addEmployeeTasks = async (id: string, task: Task) => {
  try {
    await setDoc(
      doc(db, "employees", id),
      {
        tasks: task,
      },
      { merge: true }
    );
    console.log("Document written with ID: ", id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const getEmployeeTasks = async (id: string) => {
  try {
    const docRef = doc(db, "employees", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data().tasks);
      return docSnap.data().tasks;
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

class Message {
  "senderId": number;
  "sender": string;
  "text": string;
  "date": string;
  "time": string;
}

export const sendMessage = async (id: string, message: Message) => {
    console.log(message);
    try {
        await updateDoc(
            doc(db, "communication/messages"),
            {
                messages: arrayUnion(message),
            }
        );
        console.log("Document written with ID: ", id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

export const getMessages = async () => {
  try {
    const docRef = doc(db, "communication/messages");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().messages;
    } else {
      console.log("No such document!");
    }
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
