importScripts(
    "https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"
);
importScripts(
    "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
    apiKey: "AIzaSyAmLXAhtEK-ibd5Ndx2tOP1g7mc-mx5wAk",
    authDomain: "projet-mean-m1-p11-andi-rova.firebaseapp.com",
    projectId: "projet-mean-m1-p11-andi-rova",
    storageBucket: "projet-mean-m1-p11-andi-rova.appspot.com",
    messagingSenderId: "695821037112",
    appId: "1:695821037112:web:eabc48b4efeb80302380cd",
    measurementId: "G-MY3SWVP6S5",
    vapidKey: "BCOjHpuTFyIF5k-iM2rgBocmKBLTCNUeSjwTZpF5gPWw9mXMvtHlZYWtScBG3rRdL0cee-9Ibdv_Jtx9S05-hFM"
  });

const messaging = firebase.messaging();

/*messaging.onBackgroundMessage(({ notification }) => {
    console.log("[firebase-messaging-sw.js] Received background message ");
    
    const notificationTitle = notification.title;
    const notificationOptions = {
        body: notification.body,
        link: notification.link
    };

    if (notification.icon) {
        notificationOptions.icon = notification.icon;
    }

    self.registration.showNotification(notificationTitle, notificationOptions);
});*/