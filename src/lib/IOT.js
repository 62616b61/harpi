const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const mqtt = require('mqtt');

const MQTT_BRIDGE_HOSTNAME = 'mqtt.googleapis.com';
const MQTT_BRIDGE_PORT = '8883';

const PROJECT_ID = 'rpi-ticker-tape';
const REGISTRY_ID = 'raspberry-pies';
const DEVICE_ID = 'raspberry-pi-zero';
const CLOUD_REGION = 'europe-west1';
const PRIVATE_KEY_FILE_PATH = path.join(__dirname, '../../keys/rsa_private.pem');

// The mqttClientId is a unique string that identifies this device. For Google
// Cloud IoT Core, it must be in the format below.
const mqttClientId = `projects/${PROJECT_ID}/locations/${CLOUD_REGION}/registries/${REGISTRY_ID}/devices/${DEVICE_ID}`;

const privateKey = fs.readFileSync(PRIVATE_KEY_FILE_PATH);

function createJwt() {
  // Create a JWT to authenticate this device. The device will be disconnected
  // after the token expires, and will have to reconnect with a new token. The
  // audience field should always be set to the GCP project id.
  const token = {
    iat: parseInt(Date.now() / 1000),
    exp: parseInt(Date.now() / 1000) + 20 * 60, // 20 minutes
    aud: PROJECT_ID,
  };

  return jwt.sign(token, privateKey, { algorithm: 'RS256' });
}

class IOT {
  constructor(events) {
    this.events = events;

    this.connect();
    this.subscribe();
  }

  connect() {
    // With Google Cloud IoT Core, the username field is ignored, however it must be
    // non-empty. The password field is used to transmit a JWT to authorize the
    // device. The "mqtts" protocol causes the library to connect using SSL, which
    // is required for Cloud IoT Core.
    const connectionArgs = {
      host: MQTT_BRIDGE_HOSTNAME,
      port: MQTT_BRIDGE_PORT,
      clientId: mqttClientId,
      username: 'unused',
      password: createJwt(),
      protocol: 'mqtts',
      secureProtocol: 'TLSv1_2_method',
    };


    // Create a client, and connect to the Google MQTT bridge.
    this.client = mqtt.connect(connectionArgs);
  }

  subscribe() {
    // Subscribe to the /devices/{device-id}/config topic to receive config updates.
    // Config updates are recommended to use QoS 1 (at least once delivery)
    this.client.subscribe(`/devices/${DEVICE_ID}/config`, {qos: 1});

    // Subscribe to the /devices/{device-id}/commands/# topic to receive all
    // commands or to the /devices/{device-id}/commands/<subfolder> to just receive
    // messages published to a specific commands folder; we recommend you use
    // QoS 0 (at most once delivery)
    this.client.subscribe(`/devices/${DEVICE_ID}/commands/#`, {qos: 0});

    this.client
      .on('connect', success => {
        if (success) {
          console.log('Cloud IoT Core connected');
        } else {
          console.log('Client not connected...');
        }
      })
      .on('close', () => {
        console.log('close');
      })
      .on('error', err => {
        console.log('error', err);
      })
      .on('message', (topic, message) => {
        const text = Buffer.from(message, 'base64').toString('ascii');

        if (topic === `/devices/${DEVICE_ID}/config`) {
          console.log('Config message received:', text);
        } else if (topic === `/devices/${DEVICE_ID}/commands`) {
          console.log('Command message received:', text);

          this.events.emit('text', text);
        }
      });
  }
}

module.exports = IOT;
