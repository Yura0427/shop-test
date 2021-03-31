import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/firebase-storage";

export const firebaseConfig = {
  apiKey: "AIzaSyAGtyPm7E06MD3P_IxKujjMG_6P0o8DkAw",
  authDomain: "shop-65fd6.firebaseapp.com",
  databaseURL: "https://shop-65fd6-default-rtdb.firebaseio.com",
  projectId: "shop-65fd6",
  storageBucket: "shop-65fd6.appspot.com",
  messagingSenderId: "508991104384",
  appId: "1:508991104384:web:df2d9e0332ab0932ab0d65"
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;