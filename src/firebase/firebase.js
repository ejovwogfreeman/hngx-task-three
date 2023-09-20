import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyA8mNmWB55jUMdmcG6qDcvVNbK475dFIx4",
  authDomain: "hngx-image-task.firebaseapp.com",
  projectId: "hngx-image-task",
  storageBucket: "hngx-image-task.appspot.com",
  messagingSenderId: "205650360503",
  appId: "1:205650360503:web:3d9302014fdc7de5007532",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
