import express from 'express';
import FinancialRecordModel from '../schema/financial-record.js';

const router = express.Router();

// GET route to get all records by userId

router.get('/getAllByUserID/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const records = await FinancialRecordModel.find({ userId: userId });
        if (records.length === 0) {
            return res.status(404).send("No records found for the user.");
        }
        res.status(200).json(records);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// POST route to create a new financial record
router.post("/", async (req, res) => {
    try {
        const newRecordBody = req.body;
        const newRecord = new FinancialRecordModel(newRecordBody);
        const savedRecord = await newRecord.save(); // Corrected the method call
        res.status(201).json(savedRecord);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// PUT route to update an existing financial record by id
router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const newRecordBody = req.body;
        const record = await FinancialRecordModel.findByIdAndUpdate(
            id,
            newRecordBody,
            { new: true }
        );
        if (!record) return res.status(404).send("Record not found.");
        res.status(200).json(record); // Changed to 200 for successful updates
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// DELETE route to delete an existing financial record by id
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const record = await FinancialRecordModel.findByIdAndDelete(id);
        if (!record) return res.status(404).send("Record not found.");
        res.status(200).json(record); // Changed to 200 for successful deletions
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export default router;
