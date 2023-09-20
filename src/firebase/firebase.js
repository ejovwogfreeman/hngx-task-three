import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD4t9zg311sa3leq8sMfzMbJxC_0JK51OE",
  authDomain: "hngx-img-task.firebaseapp.com",
  projectId: "hngx-img-task",
  storageBucket: "hngx-img-task.appspot.com",
  messagingSenderId: "136362215756",
  appId: "1:136362215756:web:1ab1bb761545fc9c71a7e9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
const db = getFirestore();

export { db };
