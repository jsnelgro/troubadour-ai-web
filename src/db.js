import firebase from 'firebase'

var config = {
  apiKey: "AIzaSyDzrSdEqxm2Ay7lOcMhLGVSICehRc7Ato4",
  authDomain: "troubadour-2e3fd.firebaseapp.com",
  databaseURL: "https://troubadour-2e3fd.firebaseio.com",
  projectId: "troubadour-2e3fd",
  storageBucket: "",
  messagingSenderId: "819264191904"
}

const ns = 'songs/'
let db = firebase.initializeApp(config)

export let saveSong = (songID, song) => {
  db.database().ref(`${ns}/${songID}`).set(song)
}

export let loadSong = (songID, callback) => {
  return db.database().ref(`${ns}/${songID}`).once('value')
  .then((snapshot) => {
    if (callback) {callback(snapshot.val())}
    return snapshot.val()
  })
}

export let watchSong = (songID, callback) => {
  db.database().ref(`${ns}/${songID}`).on('value', (snapshot) => {
    console.log(snapshot.val())
    callback(snapshot.val())
  })
}

export let deleteSong = (songID) => {
  db.database().ref(`${ns}/${songID}`).remove()
}

export default db
