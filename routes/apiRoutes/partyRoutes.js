const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.get('/parties', (req,res) => {
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

router.get('/party/:id', (req,res) => {
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

router.delete('/party/:id', (req, res) => {
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


module.exports = router;