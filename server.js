require('dotenv').config();

const express = require('express');
const PORT = process.env.PORT || 3005;
const app = express();
const mysql = require('mysql2');
const inputCheck = require('./utils/inputCheck');
const myPassword = process.env.DB_PASSWORD;
const db = require('./db/connection');

const apiRoutes = require('./routes/apiRoutes');
app.use('/api', apiRoutes);

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Hello World'
    });
});

/*
db.query(`SELECT * FROM candidates`, (err, rows) => {
    console.log(rows);
});
*/

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});