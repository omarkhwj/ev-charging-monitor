const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv/config');

//Allow CORS so device can make requests
app.use(cors());

//JSON Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Import routes
const deviceSessionsRoute = require('./routes/deviceSessions');
const authRoute = require('./routes/auth');
const householdsRoute = require('./routes/households');

//Middlewares (fn that executes when routes are being hit)
app.use('/deviceSessions', deviceSessionsRoute);
app.use('/api/user', authRoute);
app.use('/api/households', householdsRoute);

//ROUTES
app.get('/', (req, res) => {
    res.send('Home')
});

//Connect to DB
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true },
    () =>  {
        console.log('DB status: ' + String(mongoose.connection.readyState));
    }
).catch(error => handleError(error));
mongoose.connection.on('error', err => {
    logError(err);
  });

//Listen to server
app.listen(3015);

