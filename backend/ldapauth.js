require('dotenv').config();
const express = require('express');
const ldap = require('ldapjs');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// LDAP client setup
const ldapClient = ldap.createClient({
  url: process.env.LDAP_URL
});

// Login API endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const userDN = `cn=${username},ou=users,dc=cyber,dc=local`; // Replace with actual user DN format
  
    try {
      const client = ldap.createClient({
        url: process.env.LDAP_URL
      });
  
      // Attempt to bind using the user credentials
      client.bind(userDN, password, (err) => {
        if (err) {
          // If there's an error, it will typically be because of invalid credentials
          res.status(401).json({ success: false, message: 'Invalid credentials' });
        } else {
          // If bind is successful, send a success response
          res.json({ success: true, token: 'your-generated-token' });
        }
  
        client.unbind((unbindError) => {
          if (unbindError) {
            console.log('Error unbinding:', unbindError);
          }
        });
      });
    } catch (error) {
      // Catch other errors and respond appropriately
      res.status(500).json({ success: false, message: 'An error occurred' });
    }
  });
  

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
