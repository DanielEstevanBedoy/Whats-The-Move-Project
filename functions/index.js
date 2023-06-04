const functions = require('firebase-functions');
const cors = require('cors');
const admin = require('firebase-admin');
const { Firestore } = require('@google-cloud/firestore');
const express = require('express');

admin.initializeApp();

const firebaseConfig = {
  apiKey: "<YOUR_API_KEY>",
  authDomain: "<YOUR_AUTH_DOMAIN>",
  projectId: "<YOUR_PROJECT_ID>",
  storageBucket: "<YOUR_STORAGE_BUCKET>",
  messagingSenderId: "<YOUR_MESSAGING_SENDER_ID>",
  appId: "<YOUR_APP_ID>",
  measurementId: "<YOUR_MEASUREMENT_ID>"
};

const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

const firestore = new Firestore();

const app = express();

app.use(cors());

app.get('/screams', (req, res) => {
  firestore
    .collection('screams')
    .orderBy('createdAt', 'desc')
    .get()
    .then((data) => {
      let screams = [];
      data.forEach((doc) => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
          fromDate: doc.data().fromDate
        });
      });
      return res.json(screams);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
});

app.post('/scream', (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString(),
    fromDate: req.body.fromDate
  };
  firestore
    .collection('screams')
    .add(newScream)
    .then((doc) => {
      res.json({ message: `Document ${doc.id} created successfully` });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
});

app.post('/signUp', (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };
  // TODO: Validate data

  firebase
    .auth()
    .createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then((data) => {
      return res.status(201).json({ message: `User: ${data.user.uid} signed up successfully` });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
});

exports.api = functions.region('us-central1').https.onRequest(app);
