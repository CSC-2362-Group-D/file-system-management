const express = require('express');
const app = express();
const port = 3001; // You can choose any port that's free

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
