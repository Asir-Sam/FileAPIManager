const express = require('express');
const cors = require('cors'); // Import the cors package
const db = require('./db');
const fileWatcher = require('./fileWatcher');
const scheduler = require('./scheduler');
const readXlsxFile = require('./readXlsx'); // Import the XLSX reading function

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors()); // Use the cors middleware
app.use(express.json());

app.get('/api/read-xlsx', (req, res) => {
    try {
        const data = readXlsxFile('officeexcelsheet.xlsx');
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read the XLSX file' });
    }
});

app.get('/api/data', (req, res) => {
    db.query('SELECT * FROM your_table', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.post('/api/upload-xlsx', async (req, res) => {
    try {
        const rawData = readXlsxFile('officeexcelsheet.xlsx');
        const normalizedData = normalizeData(rawData);
        const result = await db.insertData('customer', normalizedData);
        res.json({ message: 'Data inserted successfully', result });
    } catch (error) {
        console.error('Error uploading data:', error);
        res.status(500).json({ error: 'Failed to insert data into the database' });
    }
});

app.get('/api/customers', (req, res) => {
    db.query('SELECT * FROM customer', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/api/customers/summary', (req, res) => {
    const query = `
        SELECT 
            fc_detail, 
            customer_name, 
            vehicle_number 
        FROM customer;
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

const requiredFields = [
    'vehicle_number',
    'chasis_number',
    'permit_detail',
    'fc_detail',
    'tax_detail',
    'tax_amount',
    'puc_detail',
    'insurance_detail',
    'customer_name'
];

const keyMap = {
    "VEHICLE NUMBER": "vehicle_number",
    "CHASIS NUMBER": "chasis_number",
    "PERMIT DETAIL": "permit_detail",
    "FC DETAIL": "fc_detail",
    "TAX DETAIL": "tax_detail",
    "TAX AMOUNT": "tax_amount",
    "PUC DETAIL": "puc_detail",
    "INSURANCE DETAIL": "insurance_detail",
    "CUSTOMER": "customer_name"
};

function normalizeData(data) {
    return data.map(row => {
        if (typeof row !== 'object' || row === null) {
            return requiredFields.reduce((acc, field) => ({ ...acc, [field]: null }), {});
        }

        const normalizedRow = {};
        for (const [key, value] of Object.entries(row)) {
            const normalizedKey = keyMap[key.trim().toUpperCase()];
            if (normalizedKey) {
                normalizedRow[normalizedKey] = value !== undefined ? value : null;
            }
        }

        requiredFields.forEach(field => {
            if (!(field in normalizedRow)) {
                normalizedRow[field] = null;
            }
        });

        return normalizedRow;
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
