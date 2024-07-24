/* eslint-disable no-undef */
debugger;
/* eslint-disable no-undef */
// Give the service worker access to Firebase Messaging.
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAT4b9rZnKXo07MjvWiMDoyfs9WHJMsyA4",
  authDomain: "mimboapp-d1224.firebaseapp.com",
  projectId: "mimboapp-d1224",
  storageBucket: "mimboapp-d1224.appspot.com",
  messagingSenderId: "548742618889",
  appId: "1:548742618889:web:4a0fb22c4e999f3d4ebdd8",
  measurementId: "G-P1XYMYWHNL",
});
const messaging = firebase.messaging();

// onMessage(messaging, (payload) => {
//   console.log("Message received. ", payload);
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: "/firebase-logo.png",
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
