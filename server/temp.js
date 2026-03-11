const ee = require('@google/earthengine');
require('dotenv').config();

const credentials = JSON.parse(process.env.EE_SERVICE_ACCOUNT);
credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');

ee.data.authenticateViaPrivateKey(credentials, () => {
  ee.initialize(null, null, () => {
    console.log("Earth Engine initialized");
  });
});