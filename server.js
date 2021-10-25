require('dotenv').config();

const express = require('express');
const PORT = process.env.PORT || 3005;
const app = express();
const mysql = require('mysql2');
const inputCheck = require('./utils/inputCheck');
const myPassword = process.env.DB_PASSWORD;

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySQL username,
        user: 'root',
        // Your MySQL password
        password: myPassword,
        database: 'election'
    },
    console.log('Connected to the election database.')
);

app.get('/', (req, res) => {
    res.json({
        message: 'Hello World'
    });
});

app.get('/api/candidates', (req,res) => {
    const query = `SELECT candidates.*, parties.name AS party_name FROM candidates LEFT JOIN parties ON candidates.party_id = parties.id`;
    db.query(query, (err, rows) => {
        if(err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

app.get('/api/candidate/:id', (req,res) => {
    const cID = req.params.id;
    const query = `SELECT candidates.*, parties.name AS party_name FROM candidates LEFT JOIN parties ON candidates.party_id = parties.id WHERE candidates.id = ?`;
    db.query(query,[cID],(err,row) => {
        if(err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

app.delete('/api/candidate/:id', (req,res) => {
    const cID = req.params.id;
    const query = `DELETE * FROM candidates WHERE id = ?`;
    db.query(query,[cID],(err,row) => {
        if(err) {
            res.statusMessage(400).json({ error: res.message });
            return;
        } else if(!row.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json({
                message: 'deleted',
                changes: row.affectedRows,
                id: cID
            });
        }
    });
});

app.post('/api/candidates', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if(errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const query = `INSERT INTO candidates ('first_name','last_name','industry_connected') VALUES (?,?,?)`;
    const params = [body.first_name,body.last_name,body.industry_connected];
    db.query(query,params, (err, row) => {
        if(err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
        message: 'success',
        data: body
        });
    })
});

app.put('/api/candidate/:id', (req, res) => {
    const errors = inputCheck(req.body, 'party_id');

    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `UPDATE candidates SET party_id = ? 
                 WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            // check if a record was found
        } else if (!result.affectedRows) {
            res.json({
            message: 'Candidate not found'
            });
        } else {
            res.json({
                message: 'success',
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
});

app.get('/api/parties', (req,res) => {
    const query = `SELECT * FROM parties`;
    db.query(query, (err, parties) => {
        if(err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: parties
        });
    });
});

app.get('/api/party/:id', (req,res) => {
    const pId = req.params.id;
    const query = `SELECT * FROM parties WHERE id = ?`;
    db.query(query,[pId], (err, party) => {
        if(err) {
            res.status(500).json({ error: err.message });
            return;
        } 
        res.json({
            message: "success",
            data: party
        });
    });
});

app.delete('/api/party/:id', (req, res) => {
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: res.message });
            // checks if anything was deleted
        } else if (!result.affectedRows) {
            res.json({
            message: 'Party not found'
            });
        } else {
            res.json({
            message: 'deleted',
            changes: result.affectedRows,
            id: req.params.id
            });
        }
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