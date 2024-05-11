const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
