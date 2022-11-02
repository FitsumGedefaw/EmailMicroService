const express = require('express');
const { mainDriver } = require('./Utils/_mainDriver');
const serviceAccount = require("./Config/fbServiceAccountKey.json");
const port = 3006 || process.env.PORT;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Change this if you want to only allow requests from a specific domain
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"); // Change this to allow/disallow different headers
  next();
});

const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

function verifyIdToken(req, res, next) {
  if (req.headers.authorization) {
    const fbToken = req.headers.authorization.split(" ")[1];
    admin.auth().verifyIdToken(fbToken)
      .then(() => {
        next();
      })
      .catch((err) => {
        res.status(401).send(err.message);
      });
  } else {
    res.status(401).send('Unauthorized: No token-id provided');
  }
}

app.post('/gebeya/api/email/sendEmail', verifyIdToken, async (req, res) => {
  
  await mainDriver(req.body, res)
    .then()
    .catch(err => { });
});


app.listen(port, () => {
  console.log(`Gebeya Email API listening at http://localhost:${port}`)
});

module.exports = app;