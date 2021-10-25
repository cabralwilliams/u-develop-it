const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

router.get('/voters', (req,res) => {
    const query = `SELECT * FROM voters ORDER BY last_name`;
    db.query(query, (err, voters) => {
        if(err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: voters
        });
    });
});

router.get('/voter/:id', (req,res) => {
    const vId = req.params.id;
    const query = `SELECT * FROM voters WHERE id = ?`;
    db.query(query,[vId], (err, voter) => {
        if(err) {
            res.status(500).json({ error: err.message });
            return;
        } 
        res.json({
            message: "success",
            data: voter
        });
    });
});

router.post('/voter', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'email');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `INSERT INTO voters (first_name, last_name, email) VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.email];
  
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});

router.put('/voter/:id', (req, res) => {
    // Data validation
    const errors = inputCheck(req.body, 'email');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
  
    const sql = `UPDATE voters SET email = ? WHERE id = ?`;
    const params = [req.body.email, req.params.id];
  
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
        } else if (!result.affectedRows) {
            res.json({
            message: 'Voter not found'
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

router.delete('/voter/:id', (req, res) => {
    const sql = `DELETE FROM voters WHERE id = ?`;
    
    db.query(sql, req.params.id, (err, result) => {
        if (err) {
            res.status(400).json({ error: res.message });
            // checks if anything was deleted
        } else if (!result.affectedRows) {
            res.json({
            message: 'Voter not found'
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

module.exports = router;