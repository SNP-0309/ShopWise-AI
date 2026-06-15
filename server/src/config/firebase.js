const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const path = require('path');
const serviceAccount = require(path.resolve(__dirname, '../../firebaseServiceAccount.json'));

let app;
if (!getApps().length) {
  app = initializeApp({
    credential: cert(serviceAccount)
  });
} else {
  app = getApps()[0];
}

module.exports = { app, auth: getAuth(app) };
