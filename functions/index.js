const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.requestAccessPermission = functions.https.onCall((data, context) => {
  if (!context.auth) {
    // eslint-disable-next-line max-len
    throw new functions.https.HttpsError("unauthenticated", "Only authenticated users can create request");
  }
  console.log(context.auth);
  return admin.firestore().collection("access_permission").add({
    request_at: admin.firestore.FieldValue.serverTimestamp(),
    instance: context.auth.uid,
    requested_data: ["ktp"],
    authorized: false,
  }).then((documentRef) => {
    console.log(documentRef.id);
    return documentRef.id;
  }).catch((err) => console.log(err));
});

exports.authorizeAccessPermission = functions.https.onCall((data, context) => {
  if (!context.auth) {
    // eslint-disable-next-line max-len
    throw new functions.https.HttpsError("unauthenticated", "Only authenticated users can create request");
  }
});

exports.userRequestPermission = functions.https.onRequest((req, res) => {

});

exports.verifyUser = functions.https.onCall((data, context) => {
  return admin.auth().getUserByEmail(data.email).then((user) => {
    return admin.auth().setCustomUserClaims(user.uid, {
      verified: true,
      user: true,
    });
  }).then(() => {
    return {
      message: `${data.email} has been successfully activated as an User!`,
    };
  }).catch((err) => {
    return err;
  });
});

exports.onUserRegistered = functions.auth.user().onCreate((user) => {
  return admin.firestore().collection("users").doc(user.uid).set({
    email: user.email,
    services: [],
  });
});

exports.onUserDeleted = functions.auth.user().onDelete((user) => {
  const doc = admin.firestore().collection("users").doc(user.uid);
  return doc.delete();
});


