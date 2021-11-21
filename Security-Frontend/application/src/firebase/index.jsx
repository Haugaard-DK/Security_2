import firebase from "firebase/app";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBcsSyXtFjfErvZTt9DVx27GwBaE2tpUys",

  authDomain: "matchat-8ffce.firebaseapp.com",

  databaseURL:
    "https://matchat-8ffce-default-rtdb.europe-west1.firebasedatabase.app",

  projectId: "matchat-8ffce",

  storageBucket: "matchat-8ffce.appspot.com",

  messagingSenderId: "942949780202",

  appId: "1:942949780202:web:74053f25513afac8246593",

  measurementId: "G-1EH1B77ZNK",
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };
