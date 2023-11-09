const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors()); // For simplicity, allowing all origins
app.use(express.json()); // To parse JSON request bodies
 

const { authenticate } = require('ldap-authentication');
require('dotenv').config();
const ldapURL = process.env.LDAP_URL;
const envAdminDN = process.env.LDAP_BIND_DN; // e.g., 'cn=admin,dc=example,dc=com'
const envAdminPassword = process.env.LDAP_BIND_PASSWORD; // e.g., 'adminpassword'
const envUserSearchBase = process.env.LDAP_BASE;

async function ldapAuth(username, password) {
  
  let options = {
    ldapOpts: {
      url: ldapURL
    },
    adminDn: envAdminDN,
    adminPassword: envAdminPassword,
    userSearchBase: envUserSearchBase,
    usernameAttribute: 'uid', // The attribute against which the username will be matched
    username, // The actual username
    userPassword: password, // The actual password
  };
  try {
    let user = await authenticate(options);
    console.error('Should work');
    return { success: true, user };
  } catch (error) {
    console.error('LDAP authentication error:', error);
    return { success: false, error };
  }
}
ldapAuth('lmoreau','password');

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password are required." });
  }

  const authResult = await ldapAuth(username, password);

  if (authResult.success) {
    // TODO: Generate a token or session after successful authentication
    res.status(200).json({ success: true, message: "Authenticated successfully", user: authResult.user });
  } else {
    // You may want to avoid sending detailed error messages in a production environment
    res.status(500).json({ success: false, message: 'Authentication failed', error: authResult.error.toString() });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});