const express = require('express');
const ldap = require('ldapjs');
require('dotenv').config();

const app = express();
app.use(express.json());

const client = ldap.createClient({
  url: process.env.LDAP_URL
});

app.post('/api/login', function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const userDN = `cn=${username},${process.env.LDAP_BIND_DN}`; // Adjust the DN as per your LDAP directory structure

  client.bind(userDN, password, (err) => {
    if (err) {
      // Authentication failed
      res.status(401).send('Authentication failed');
    } else {
      // Authentication success
      // Perform further user query if needed and then:
      res.status(200).send({ token: 'your-generated-token' });
    }
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
