const { google } = require('googleapis');

const GCP_PROJECT = 'rpi-ticker-tape';
const GCP_IOT_CORE_REGION = 'europe-west1';
const GCP_IOT_CORE_REGISTRY = 'raspberry-pies';
const GCP_IOT_CORE_DEVICE = 'raspberry-pi-zero';

function handleCors(req, res) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Max-Age", "3600");

  if (req.method == 'OPTIONS') {
    res.status(204).send('');
  }
}

exports.handleMessage = async (req, res) => {
  handleCors(req, res);
  const message = req.body;

  const auth = await google.auth.getClient({
    scopes: [
      'https://www.googleapis.com/auth/cloud-platform',
      'https://www.googleapis.com/auth/cloudiot',
    ],
  });

  google.options({ auth });

  const client = google.cloudiot('v1');

  const parentName = `projects/${GCP_PROJECT}/locations/${GCP_IOT_CORE_REGION}`;
  const registryName = `${parentName}/registries/${GCP_IOT_CORE_REGISTRY}`;
  const deviceName = `${registryName}/devices/${GCP_IOT_CORE_DEVICE}`;

  const binaryData = Buffer.from(message).toString('base64');

  const request = {
    name: deviceName,
    binaryData,
  };

  client.projects.locations.registries.devices.sendCommandToDevice(
    request,
    (err, data) => {
      if (err) {
        console.log('Could not send command:', request);
        console.log('Error: ', err);
        res.status(200).json({ success: false, error: err.message });
      } else {
        console.log('Success:', data.statusText);
        res.status(200).json({ success: true });
      }
    }
  );
};
