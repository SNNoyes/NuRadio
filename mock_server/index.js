const express = require('express');
const app = express();
const PORT = 3456;
const router = require('./router.js');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT, function () {
  console.log(`Local server running on port ${PORT}`);
});