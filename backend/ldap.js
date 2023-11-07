const express = require('express');
const app = express();
const ldap = require('ldapjs');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors()); // Allows cross-origin requests
app.use(bodyParser.json()); // Parses JSON body data

// LDAP authentication function (assumed to be implemented)
const authenticateLDAP = require('./path-to-ldap-function');

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  authenticateLDAP(username, password, (isAuthenticated, err) => {
    if (isAuthenticated) {
      // Handle successful authentication
      res.json({ success: true, token: 'YourGeneratedToken' });
    } else {
      // Handle failed authentication
      res.status(401).json({ success: false, message: 'Authentication failed', error: err });
    }
  });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
