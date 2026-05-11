const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

const schoolsRouter = require('./routes/schools');
app.use('/', schoolsRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`School API server listening on port ${port}`);
});
