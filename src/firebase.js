import firebase from "firebase";

// Please input your config
const firebaseConfig = {

};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();
const db = firebaseApp.firestore();

export { auth, provider };
export default db;