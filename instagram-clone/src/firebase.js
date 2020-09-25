const firebase = require('firebase')

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDPqpMRVty2inbzgi7fEzm-2-DeaqpXG14",
    authDomain: "instagram-clone-react-ed5a4.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-ed5a4.firebaseio.com",
    projectId: "instagram-clone-react-ed5a4",
    storageBucket: "instagram-clone-react-ed5a4.appspot.com",
    messagingSenderId: "13241718406",
    appId: "1:13241718406:web:4857fb6688bd4ce338a307",
    measurementId: "G-JF63P6K5GV"
})

const db = firebaseApp.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

export { db, auth, storage };
