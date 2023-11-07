const express = require('express');
const app = express();
const port = 3001;
const ldapAuth = require('./ldapauth.js'); // Assuming this exports an authentication function

app.use(express.json()); // For parsing application/json

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  ldapAuth.authenticate(username, password, (err, user) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Error authenticating user" });
    } else if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
    } else {
      // You can generate a token or a session here
      res.status(200).json({ message: "Authenticated successfully" });
    }
  });
});

// Other routes can go here

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
