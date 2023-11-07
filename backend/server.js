require('dotenv').config();
const express = require('express');
const ldap = require('ldapjs');
const cors = require('cors');

// LDAP client creation
const ldapClient = ldap.createClient({
  url: process.env.LDAP_URL
});

// Admin bind to the LDAP server
ldapClient.bind(process.env.LDAP_BIND_DN, process.env.LDAP_BIND_PASSWORD, function(err) {
  if (err) {
    console.error('Admin bind failed: ', err);
  } else {
    console.log('Admin bind successful');
  }
});

const app = express();
const PORT = process.env.PORT || 3001;

// CORS middleware (if needed)
app.use(cors({
  origin: 'http://localhost:3000'
}));

// JSON body parser middleware
app.use(express.json());

// Authenticate User Function
const authenticateUser = (username, password) => {
  return new Promise((resolve, reject) => {
    // Search for the user in LDAP
    ldapClient.search(process.env.LDAP_BASE, {
      scope: 'sub',
      filter: `(uid=${username})`, // Search for the UID
    }, (err, res) => {
      if (err) {
        return reject(err);
      }
      let userDN;
      res.on('searchEntry', (entry) => {
        userDN = entry.objectName;
      });
      res.on('error', (err) => {
        return reject(err);
      });
      res.on('end', (result) => {
        if (result.status !== 0) {
          return reject(new Error('Non-zero status from LDAP search: ' + result.status));
        }
        if (userDN) {
          ldapClient.bind(userDN, password, (err) => {
            if (err) {
              return reject(err);
            } else {
              return resolve({ username });
            }
          });
        } else {
          return reject(new Error('User DN not found for username: ' + username));
        }
      });
    });
  });
};

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await authenticateUser(username, password);
    // User authenticated
    return res.status(200).json({ success: true, message: "Authenticated successfully", user });
  } catch (error) {
    // Authentication failed
    console.error('Authentication error:', error);
    return res.status(401).json({ success: false, message: 'Authentication failed: ' + error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
