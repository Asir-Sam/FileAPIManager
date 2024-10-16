const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Check for connection
connection.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to the database.');
    }
});

function insertData(table, data) {
    if (!data || data.length === 0) {
        console.error('No data to insert');
        return Promise.reject(new Error('No data to insert'));
    }


    const keys = Object.keys(data[0]).map(key => `${key}`);

    return Promise.all(data.map(row => {
        const values = keys.map(key => {
            const value = row[key] !== undefined ? row[key] : null;
            return value;
        });

        const sql = `INSERT INTO ${table} (${keys.join(',')}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        return new Promise((resolve, reject) => {
            connection.query(sql, values, (error, results) => {
                if (error) {
                    console.error('Error during insert:', error);
                    return reject(error);
                }
                resolve(results);
            });
        });
    }));
}


module.exports = {
    connection,
    insertData,
};